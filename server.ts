import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '25mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Role-based System Instructions
const ROLE_PROMPTS: Record<string, string> = {
  pmp: `Tu es "Chef de Projet Senior" certifié PMP, PRINCE2 et Agile Coach.
Ton expertise : Cadrage stratégique, WBS, chemin critique, arbitrage budgétaire, gouvernance RACI, gestion des parties prenantes et animation de COPIL.
Style : Pragmatique, rigoureux, synthétique, axé sur la prise de décision et la mitigation proactive des risques.`,

  science: `Tu es "Directeur de Projet Scientifique & R&D" (DeepMind Science Skills).
Ton expertise : Bio-informatique, cibles thérapeutiques (UniProt/AlphaFold/PDB), chimie computationnelle (PubChem/ChEMBL), protocoles d'essais cliniques (ClinicalTrials.gov), réglementation santé (FDA/EMA/ANSM) et littérature biomédicale (PubMed/Europe PMC).
Style : Rigueur scientifique d'un reviewer de revue internationale, traçabilité des sources, validation des hypothèses et rigueur méthodologique translationnelle.`,

  architect: `Tu es "Lead Architecte & Expert Risques Techniques".
Ton expertise : Architecture logicielle, scalabilité, cybersécurité, PCA/PRA, intégrations d'API complexes, conformité RGPD/ISO 27001 et dette technique.
Style : Analytique, intransigeant sur la résilience et la sécurité, proposant des patterns d'architecture éprouvés.`,

  po: `Tu es "Product Owner Senior & Scrum Master".
Ton expertise : Découpage en Épopées (Epics), rédaction de User Stories INVEST avec critères d'acceptation (GIVEN/WHEN/THEN), priorisation MoSCoW, Poker Planning, cérémonies agiles et vélocité de sprint.
Style : Centré sur la valeur utilisateur (User Centric), orienté livrables incrémentaux et vélocité.`,
};

// API Health
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// PM & Multi-Role Chat Endpoint with Google Search Grounding
app.post('/api/pm/chat', async (req: Request, res: Response) => {
  try {
    const { 
      messages, 
      documentContext, 
      roleType = 'pmp', 
      model = 'gemini-3.8-flash', 
      enableSearchGrounding = false 
    } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Format de messages invalide.' });
    }

    // Role-specific instruction
    const baseSystemInstruction = ROLE_PROMPTS[roleType] || ROLE_PROMPTS.pmp;
    const systemInstruction = `${baseSystemInstruction}
Tu analyses les documents de projet fournis par l'utilisateur et réponds avec précision en citant les données factuelles. Si la recherche Google est activée, enrichis ta réponse avec les informations d'actualité, les benchmarks ou les études les plus récentes. Réponds en français structuré.`;

    let contextualPrompt = '';
    if (documentContext && documentContext.trim().length > 0) {
      contextualPrompt += `\n--- DOCUMENTS DU PROJET ---\n${documentContext}\n--- FIN DES DOCUMENTS ---\n\n`;
    }

    // Build history for Gemini
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      let text = msg.content;
      if (i === messages.length - 1 && contextualPrompt) {
        text = `${contextualPrompt}\nDemande de l'utilisateur :\n${text}`;
      }
      contents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text }],
      });
    }

    // Configure model tools
    const config: any = {
      systemInstruction,
      temperature: 0.7,
    };

    if (enableSearchGrounding) {
      config.tools = [{ googleSearch: {} }];
    }

    // Validate supported model
    const allowedModels = [
      'gemini-3.8-flash',
      'gemini-3.5-flash',
      'gemini-3.1-pro-preview',
      'gemini-3.1-flash-lite',
    ];
    const selectedModel = allowedModels.includes(model) ? model : 'gemini-3.8-flash';

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config,
    });

    const reply = response.text || "Désolé, je n'ai pas pu générer une réponse.";

    // Extract search grounding metadata if available
    let searchGrounding = null;
    const candidate = response.candidates?.[0];
    if (candidate?.groundingMetadata) {
      const gm = candidate.groundingMetadata as any;
      searchGrounding = {
        webSearchQueries: gm.webSearchQueries || [],
        groundingChunks: gm.groundingChunks?.map((chunk: any) => ({
          web: chunk.web ? { uri: chunk.web.uri, title: chunk.web.title } : undefined,
        })) || [],
      };
    }

    res.json({ reply, searchGrounding, modelUsed: selectedModel });
  } catch (error: any) {
    console.error('Erreur API Chat Gemini:', error);
    res.status(500).json({
      error: error.message || 'Erreur lors de la génération par le Chef de Projet IA.',
    });
  }
});

// Science Skills Live Search Endpoint (PubMed, ClinicalTrials, PubChem, UniProt)
app.post('/api/science/search', async (req: Request, res: Response) => {
  try {
    const { category, query } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Requête manquante.' });
    }

    const trimmedQuery = encodeURIComponent(query.trim());

    if (category === 'clinical_trials') {
      // ClinicalTrials.gov API v2
      const url = `https://clinicaltrials.gov/api/v2/studies?query.term=${trimmedQuery}&pageSize=5`;
      const apiRes = await fetch(url, { headers: { Accept: 'application/json' } });
      if (apiRes.ok) {
        const data = await apiRes.json();
        const studies = (data.studies || []).map((s: any) => {
          const p = s.protocolSection || {};
          return {
            id: p.identificationModule?.nctId,
            title: p.identificationModule?.briefTitle,
            status: p.statusModule?.overallStatus,
            phase: p.designModule?.phases?.join(', ') || 'N/A',
            conditions: p.conditionsModule?.conditions || [],
            sponsor: p.sponsorCollaboratorsModule?.leadSponsor?.name,
            summary: p.descriptionModule?.briefSummary || '',
          };
        });
        return res.json({ category, results: studies });
      }
    } else if (category === 'pubchem') {
      // PubChem PUG REST
      const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${trimmedQuery}/JSON`;
      const apiRes = await fetch(url);
      if (apiRes.ok) {
        const data = await apiRes.json();
        const compound = data.PC_Compounds?.[0];
        if (compound) {
          const cid = compound.id?.id?.cid;
          // Extract molecular formula & weight from props
          let formula = '';
          let weight = '';
          let iupac = '';
          compound.props?.forEach((prop: any) => {
            if (prop.urn?.label === 'Molecular Formula') formula = prop.value?.sval;
            if (prop.urn?.label === 'Molecular Weight') weight = prop.value?.sval;
            if (prop.urn?.label === 'IUPAC Name' && prop.urn?.name === 'Preferred') iupac = prop.value?.sval;
          });
          return res.json({
            category,
            results: [
              {
                cid,
                name: query,
                formula,
                weight,
                iupac,
                imageUrl: `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG`,
              },
            ],
          });
        }
      }
    } else if (category === 'uniprot') {
      // UniProtKB Search
      const url = `https://rest.uniprot.org/uniprotkb/search?query=${trimmedQuery}&size=5&format=json`;
      const apiRes = await fetch(url);
      if (apiRes.ok) {
        const data = await apiRes.json();
        const proteins = (data.results || []).map((r: any) => ({
          primaryAccession: r.primaryAccession,
          uniProtkbId: r.uniProtkbId,
          proteinName: r.proteinDescription?.recommendedName?.fullName?.value || 'N/A',
          geneName: r.genes?.[0]?.geneName?.value || 'N/A',
          organism: r.organism?.scientificName,
          alphaFoldUrl: `https://alphafold.ebi.ac.uk/entry/${r.primaryAccession}`,
        }));
        return res.json({ category, results: proteins });
      }
    } else {
      // Default: Europe PMC Biomedical Literature
      const url = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${trimmedQuery}&format=json&pageSize=5`;
      const apiRes = await fetch(url);
      if (apiRes.ok) {
        const data = await apiRes.json();
        const articles = (data.resultList?.result || []).map((a: any) => ({
          id: a.id || a.pmid,
          title: a.title,
          authorString: a.authorString,
          journalTitle: a.journalTitle,
          pubYear: a.pubYear,
          doi: a.doi,
          url: a.doi ? `https://doi.org/${a.doi}` : `https://europepmc.org/article/MED/${a.pmid}`,
        }));
        return res.json({ category: 'literature', results: articles });
      }
    }

    res.json({ category, results: [], message: 'Aucun résultat trouvé ou service indisponible.' });
  } catch (err: any) {
    console.error('Erreur Science Search:', err);
    res.status(500).json({ error: err.message || 'Erreur recherche scientifique.' });
  }
});

// PM Document Deep Analysis Endpoint
app.post('/api/pm/analyze', async (req: Request, res: Response) => {
  try {
    const { documents } = req.body;

    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      return res.status(400).json({ error: 'Aucun document fourni pour analyse.' });
    }

    const docsText = documents
      .map((d: any, idx: number) => `### DOCUMENT ${idx + 1}: ${d.name} (${d.type || 'Fichier'})\n${d.content}`)
      .join('\n\n---\n\n');

    const prompt = `Voici les documents du projet à auditer :\n\n${docsText}\n\nEffectue un audit méthodologique exhaustif de chef de projet senior. Rends ton rapport au format JSON structuré avec la structure suivante :
{
  "projectTitle": "Titre synthétique du projet",
  "executiveSummary": "Résumé exécutif du projet en 3-4 phrases",
  "projectStatus": "VERT" | "JAUNE" | "ROUGE",
  "statusJustification": "Explication de la météo du projet",
  "estimatedDuration": "Ex: 6 mois",
  "keyObjectives": ["Objectif 1", "Objectif 2"],
  "scope": {
    "inScope": ["Périmètre inclus 1", "Périmètre inclus 2"],
    "outOfScope": ["Exclus 1", "Exclus 2"]
  },
  "topRisks": [
    {
      "id": "R1",
      "title": "Nom du risque",
      "category": "Technique" | "Humain" | "Calendrier" | "Budget" | "Gouvernance",
      "probability": 1,
      "impact": 1,
      "mitigation": "Action préventive concrète"
    }
  ],
  "criticalMilestones": [
    {
      "id": "M1",
      "title": "Nom du jalon",
      "phase": "Cadrage" | "Conception" | "Développement" | "Recette" | "Déploiement",
      "targetDate": "Estimation ou date identifiée",
      "deliverables": "Livrables attendus"
    }
  ],
  "recommendations": [
    "Recommandation stratégique ou méthodologique 1",
    "Recommandation 2"
  ],
  "missingInformation": [
    "Information critique manquante dans les documents 1",
    "Point d'ombre à clarifier avec le sponsor"
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: ROLE_PROMPTS.pmp,
        responseMimeType: 'application/json',
      },
    });

    const parsedData = JSON.parse(response.text || '{}');
    res.json(parsedData);
  } catch (error: any) {
    console.error('Erreur API Analyze Gemini:', error);
    res.status(500).json({
      error: error.message || "Erreur lors de l'analyse documentaire.",
    });
  }
});

// PM Generate Specialized Artifacts
app.post('/api/pm/generate-artifact', async (req: Request, res: Response) => {
  try {
    const { artifactType, documentContext, customInstructions } = req.body;

    const artifactPrompts: Record<string, string> = {
      charter: `Rédige une Charte de Projet complète (Project Charter) formelle et professionnelle prête à être soumise au comité de direction. Inclus : Contexte, Objectifs SMART, Périmètre (In/Out), Hypothèses, Contraintes, Facteurs clés de succès, Gouvernance et Budget prévisionnel.`,
      raci: `Génère une matrice RACI (Responsible, Accountable, Consulted, Informed) détaillée pour les grandes activités et livrables du projet. Présente-la sous forme de tableau clair avec les rôles clés et un rappel des définitions RACI.`,
      risks: `Génère un Registre des Risques exhaustif avec scoring (Probabilité 1-5, Gravité 1-5, Criticité PxG), catégorisation, plan d'atténuation préventif et plan de contingence curatif.`,
      flash_report: `Rédige le Flash Report hebdomadaire de pilotage (Météo du projet 🟢/🟡/🔴, Avancement global %, Faits marquants de la période écoulée, Prochaines étapes de la semaine suivante, Points bloquants / Alertes, Arbitrages attendus du COPIL).`,
      agile_backlog: `Découpe le projet en méthodologie Agile : Définis 4 à 6 grandes Épopées (Epics), et pour chaque épopée au moins 2 User Stories rédigées au standard 'En tant que... je veux... afin de...', avec leurs critères d'acceptation (GIVEN/WHEN/THEN) et estimation en Story Points.`,
      wbs: `Structure le découpage WBS (Work Breakdown Structure) hiérarchique du projet niveau 1 à 3 avec dictionnaire des livrables et estimation des charges j/h.`,
    };

    const requestedTask = artifactPrompts[artifactType] || `Génère le livrable de gestion de projet suivant : ${artifactType}`;

    const prompt = `Voici le contexte documentaire du projet :\n\n${documentContext || 'Projet standard'}\n\n${customInstructions ? `Consignes additionnelles : ${customInstructions}\n\n` : ''}Mission : ${requestedTask}\n\nAdopte une structure ultra professionnelle en Markdown soigné avec titres clairs, tableaux et listes à puces.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: ROLE_PROMPTS.pmp,
        temperature: 0.6,
      },
    });

    res.json({ content: response.text });
  } catch (error: any) {
    console.error('Erreur Artifact Gemini:', error);
    res.status(500).json({
      error: error.message || 'Erreur lors de la génération du livrable.',
    });
  }
});

// Audio Transcription Endpoint using gemini-3.5-transcribe
app.post('/api/audio/transcribe', async (req: Request, res: Response) => {
  try {
    const { audioBase64, mimeType = 'audio/webm' } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ error: 'Données audio manquantes.' });
    }

    const audioPart = {
      inlineData: {
        mimeType: mimeType.split(';')[0] || 'audio/webm',
        data: audioBase64,
      },
    };

    const promptText = `Transcris intégralement et fidèlement cet enregistrement audio de réunion en français.
Ensuite, ajoute une section distincte :
### SYNTHÈSE DU POINT DE RÉUNION
- **Décisions Clés** : (liste à puces)
- **Actions à Mener (Action Items)** : [ ] Action (Responsable - Échéance)
- **Points d'Alerte** : (liste à puces si présents)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [audioPart, { text: promptText }],
      },
    });

    const transcript = response.text || 'Transcription vide.';
    res.json({ transcript });
  } catch (err: any) {
    console.error('Erreur Transcription Gemini:', err);
    res.status(500).json({
      error: err.message || "Erreur lors de la transcription de l'enregistrement audio.",
    });
  }
});

// Slide Deck Presentation Preparation Endpoint
app.post('/api/pm/generate-slides', async (req: Request, res: Response) => {
  try {
    const { 
      presentationType = 'copil', 
      documentContext = '', 
      slideCount = 6, 
      customInstructions = '' 
    } = req.body;

    const presentationTypesMap: Record<string, string> = {
      copil: 'Comité de Pilotage (COPIL) Stratégique avec Direction & Sponsor',
      kickoff: 'Réunion de Lancement de Projet (Kick-off Meeting) avec toutes les équipes',
      sprint_review: 'Revue de Sprint / Démo Agile avec Product Owner et Utilisateurs',
      risks_review: 'Comité des Risques & Plan de Continuité d’Activité',
      closing: 'Soutenance de Clôture & Bilan de Projet (Post-Mortem & REX)',
    };

    const presentationLabel = presentationTypesMap[presentationType] || presentationType;

    const prompt = `Tu es un Directeur de Projet d'élite.
Génère une présentation de diapositives professionnelle (Slide Deck) de ${slideCount} slides pour : ${presentationLabel}.

Voici le contexte documentaire du projet :
${documentContext}

${customInstructions ? `Consignes particulières : ${customInstructions}` : ''}

Réponds STRICTEMENT sous la forme d'un objet JSON valide structuré comme suit :
{
  "presentationTitle": "Titre percutant de la présentation",
  "presentationSubtitle": "Sous-titre ou date / instance",
  "audience": "Sponsor, COPIL, Métiers",
  "slides": [
    {
      "slideNumber": 1,
      "title": "Titre du slide",
      "subtitle": "Sous-titre ou angle clé",
      "layout": "title" | "bullets" | "kpis" | "timeline" | "conclusion",
      "bullets": ["Point clé 1", "Point clé 2", "Point clé 3"],
      "metrics": [
        { "label": "Indicateur", "value": "Valeur" }
      ],
      "speakerNotes": "Ce que le chef de projet doit dire à l'oral pour convaincre l'audience...",
      "visualDescription": "Description du schéma ou visuel recommandé pour ce slide"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: ROLE_PROMPTS.pmp,
        responseMimeType: 'application/json',
      },
    });

    const parsedDeck = JSON.parse(response.text || '{}');
    res.json(parsedDeck);
  } catch (err: any) {
    console.error('Erreur Génération Slides:', err);
    res.status(500).json({
      error: err.message || 'Erreur lors de la préparation des diapositives.',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Chef de Projet AI server démarré sur http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Erreur démarrage serveur:', err);
});
