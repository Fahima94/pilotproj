import React, { useState } from 'react';
import { 
  FileCode, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  RefreshCw, 
  BookOpen, 
  ShieldCheck, 
  Layers,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Code
} from 'lucide-react';
import { ProjectAudit, ProjectDocument } from '../types/project';

interface SkillMarkdownBuilderViewProps {
  audit: ProjectAudit;
  documents: ProjectDocument[];
  onAskAgent: (prompt: string, skill?: string) => void;
}

interface PredefinedSkillTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  targetNeed: string;
  defaultYaml: {
    name: string;
    description: string;
    version: string;
    author: string;
  };
  content: string;
}

const PREDEFINED_TEMPLATES: PredefinedSkillTemplate[] = [
  {
    id: 'skill-ticket-slicing',
    title: 'Découpage au Ticket & User Stories INVEST',
    category: 'Méthodologie & Delivery',
    description: 'Transforme n’importe quelle exigence métier ou spécification en tickets de backlog prêts pour Jira / Linear avec critères d’acceptation.',
    targetNeed: 'Passer du besoin fonctionnel brut à des tickets découpés, testables et priorisés.',
    defaultYaml: {
      name: 'ticket-slicing-invest',
      description: 'Découpage rigoureux des besoins en tickets User Stories selon la norme INVEST avec critères Given/When/Then et DoD.',
      version: '1.2.0',
      author: 'Chef de Projet IA',
    },
    content: `# Skill: Découpage au Ticket & User Stories (INVEST)

## 1. Contexte & Rôle de l'Agent
Tu agis en tant que Lead Product Owner & Delivery Manager d'élite.
Ta mission est d'analyser les besoins exprimés dans les documents de projet et de les convertir en tickets opérationnels précis pour l'équipe de développement.

## 2. Règle d'Or INVEST
Chaque ticket produit doit impérativement respecter la norme INVEST :
- **I**ndependent : Découplé des autres tickets au maximum.
- **N**egotiable : Laisse une marge de conception sur la mise en œuvre.
- **V**aluable : Apporte une valeur métier directe ou technique vérifiable.
- **E**stimable : Faisable dans une fourchette de 1 à 8 Story Points.
- **S**mall : Réalisable en moins d'un demi-sprint par un binôme ou un développeur.
- **T**estable : Possède des critères d'acceptation univoques.

## 3. Structure Obligatoire de Chaque Ticket
\`\`\`markdown
### [PROJ-XXX] Titre explicite (Action + Objet)
- **Type** : Story | Task | Bug | Spike
- **Priorité** : Must Have | Should Have | Could Have | Won't Have (MoSCoW)
- **Complexité estimée** : [1 | 2 | 3 | 5 | 8] Story Points

#### En tant que...
En tant que [Persona / Rôle utilisateur],
Je souhaite [Action ou interaction souhaitée],
Afin de [Bénéfice métier quantifiable].

#### Critères d'Acceptation (Given / When / Then)
- **Scénario 1 (Cas nominal)** :
  - GIVEN [État initial du système]
  - WHEN [Action effectuée par l'utilisateur]
  - THEN [Résultat attendu et vérifiable]
- **Scénario 2 (Gestion d'erreur & Edge case)** :
  - GIVEN [Donnée invalide ou défaillance réseau]
  - WHEN [L'utilisateur tente l'opération]
  - THEN [Message d'erreur explicite sans fuite de secrets]

#### Definition of Done (DoD) & Sécurité
- [ ] Tests unitaires et d'intégration validés (>80% couverture).
- [ ] Zéro clé API ou secret en dur dans le code client.
- [ ] Validation de sécurité et contrôle des droits RBAC / RLS.
- [ ] Revue de code effectuée et documentation mise à jour.
\`\`\`

## 4. Guardrails de l'Agent
- Ne jamais générer un ticket sans critères d'acceptation formels.
- Si un besoin est trop vaste (>8 points), le scinder obligatoirement en un Epic et sous-tickets.`,
  },
  {
    id: 'skill-security-zerotrust',
    title: 'Audit & Sécurisation Architecture Zéro-Trust',
    category: 'Sécurité & RGPD',
    description: 'Vérifie et applique les garde-fous de sécurité pour le product building, les clés API, les modèles IA et la protection des données.',
    targetNeed: 'Garantir le zéro-leak de données, la protection contre prompt injection et le contrôle des coûts d’inférence.',
    defaultYaml: {
      name: 'security-zerotrust-guardrails',
      description: 'Audit et enforcement des règles de sécurité produit : proxy backend, validation de tokens, protection prompt injection et conformité RGPD.',
      version: '1.0.0',
      author: 'Chef de Projet IA & Lead SecOps',
    },
    content: `# Skill: Audit & Sécurisation Architecture Zéro-Trust

## 1. Contexte & Périmètre
Tu opères en tant qu'Auditeur de Sécurité Applicative et Architecte Cloud Zéro-Trust.
Ta mission est d'auditer systématiquement tout livrable, code ou architecture proposé avant mise en production.

## 2. Les 5 Piliers Zéro-Trust Obligatoires
1. **Zéro Secret Côté Client** :
   - Aucune variable privée, token API (Gemini, Supabase service_role, Stripe, etc.) ne doit être compilée dans le bundle frontend.
   - Toutes les opérations sensibles transitent obligatoirement par des routes serveurs proxy authentifiées (/api/*).

2. **Défense en Profondeur contre l'Injection de Prompt** :
   - Isolation étanche entre les System Instructions (inviolables) et le texte fourni par les utilisateurs.
   - Validation stricte des entrées utilisateurs (taille, caractères suspects, balises de contournement).
   - Guardrails sémantiques sur les sorties pour éviter toute divulgation de règles internes.

3. **Gouvernance RGPD & Données Personnelles (PII)** :
   - Principe de minimisation : Ne collecter que ce qui est strictement nécessaire au traitement.
   - Aucune donnée de santé ou donnée sensible non chiffrée en base.
   - Droit à l'effacement et purge planifiée des journaux.

4. **Prévention du Déni de Portefeuille (Denial of Wallet)** :
   - Plafonnement strict des tokens en sortie (maxOutputTokens paramétré sur chaque appel).
   - Rate limiting par IP et par compte utilisateur.
   - Surveillance des pics de requêtes et coupe-circuit automatique en cas d'emballement.

5. **Contrôle d'Accès par Rôles (RBAC) & Row-Level Security (RLS)** :
   - Vérification systématique que l'utilisateur demandeur est le propriétaire légitime de la ressource.
   - Refus par défaut (Deny by Default) sur toutes les collections de données.

## 3. Matrice de Scoring de Sécurité
Lors de chaque audit, attribuer une note sur 100 et classifier les vulnérabilités :
- **Bloquante (P0)** : Fuite de clé, injection possible, absence d'authentification.
- **Majeure (P1)** : Absence de rate-limiting, absence de RLS.
- **Mineure (P2)** : Manque de logs de traçabilité.`,
  },
  {
    id: 'skill-copil-flash-reporting',
    title: 'Reporting Exécutif COPIL & Pilotage des Risques',
    category: 'Gouvernance & Communication',
    description: 'Produit des synthèses hebdomadaires à fort impact pour le comité de pilotage, arbitrages et parties prenantes.',
    targetNeed: 'Communiquer l’état de santé réel du projet avec météo, faits marquants, alertes et décisions requises.',
    defaultYaml: {
      name: 'copil-executive-reporting',
      description: 'Génération de Flash Reports et relevés de décisions pour les comités de pilotage et sponsors de projets.',
      version: '1.1.0',
      author: 'Chef de Projet IA',
    },
    content: `# Skill: Reporting Exécutif COPIL & Flash Report

## 1. Contexte & Rôle
Tu rédiges pour le compte du Chef de Projet des synthèses exécutives destinées à la Direction Générale, au Sponsor et aux membres du COPIL.
Le ton doit être factuel, orienté décision et dépourvu de jargon technique inutile.

## 2. Structure Standard du Flash Report Hebdomadaire
\`\`\`markdown
# FLASH REPORT PROJET — [TITRE DU PROJET]
**Période :** Semaine [XX] / [Année] | **Chef de Projet :** [Nom] | **Sponsor :** [Nom]

### 1. Météo Globale & Justification
- **Statut :** [VERT | JAUNE | ROUGE]
- **Justification en 2 phrases :** Résumé clair des faits marquants justifiant ce statut.

### 2. Réalisations Clés de la Semaine (Faits Marquants)
- [Jalon ou livrable validé avec date]
- [Avancée majeure sur le développement ou les tests]
- [Décision stratégique arbitrée]

### 3. Principaux Risques & Points d'Attention (Focus 5x5)
| Réf | Risque Majeur | Score (PxI) | Plan de Mitigation | Porteur |
|---|---|---|---|---|
| R1 | [Titre du risque] | [X]/25 | [Action concrète pour réduire l'impact] | [Rôle] |

### 4. Planning & Prochains Jalons (Horizon 2 Semaines)
- **[Date]** : [Jalon attendu et livrable associé]
- **[Date]** : [Point de recette ou validation clé]

### 5. Arbitrages & Décisions Requises du COPIL
1. [Question ou décision urgente à trancher par la direction]
2. [Arbitrage budgétaire ou réallocation de ressources]
\`\`\`

## 3. Règles de Rédaction
- Pas de langue de bois : Si un jalon est en retard, indiquer la cause racine et le plan de rattrapage.
- Chaque alerte doit être accompagnée d'une recommandation d'action chiffrée.`,
  },
  {
    id: 'skill-data-governance',
    title: 'Gouvernance Data, Schémas & Intégrité',
    category: 'Data & Architecture',
    description: 'Définit les contrats d’interface, schémas de données stricts, lignage et règles de monitoring pour des pipelines fiables.',
    targetNeed: 'Assurer la qualité, l’intégrité des bases de données et la traçabilité des transformations.',
    defaultYaml: {
      name: 'data-governance-integrity',
      description: 'Définition des schémas de données, validation relationnelle, typage strict et monitoring de pipeline.',
      version: '1.0.0',
      author: 'Chef de Projet IA & Lead Data',
    },
    content: `# Skill: Gouvernance Data, Schémas & Intégrité

## 1. Contexte & Rôle
Tu es le garant de la qualité des données et de l'intégrité des schémas dans le projet.
Ta mission est d'assurer que toutes les données traitées (par les APIs, formulaires, webhooks ou agents IA) respectent des contrats stricts.

## 2. Principes Directeurs
1. **Schémas Typés & Non-Nuls par Défaut** :
   - Tous les modèles de données doivent comporter un schéma formel (TypeScript interfaces, Drizzle ORM ou JSON Schema).
   - Validation systématique en amont de toute persistance.

2. **Traçabilité & Horodatage (Audit Trail)** :
   - Chaque enregistrement possède \`id\`, \`createdAt\`, \`updatedAt\` et l'identifiant de l'auteur/utilisateur (\`userId\`).

3. **Lignage des Données (Data Lineage)** :
   - Documenter la source de chaque donnée : saisie utilisateur, enrichissement IA, calcul automatisé ou import externe.`,
  },
];

export const SkillMarkdownBuilderView: React.FC<SkillMarkdownBuilderViewProps> = ({
  audit,
  documents,
  onAskAgent,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<PredefinedSkillTemplate>(PREDEFINED_TEMPLATES[0]);
  const [skillName, setSkillName] = useState(PREDEFINED_TEMPLATES[0].defaultYaml.name);
  const [skillDescription, setSkillDescription] = useState(PREDEFINED_TEMPLATES[0].defaultYaml.description);
  const [skillVersion, setSkillVersion] = useState(PREDEFINED_TEMPLATES[0].defaultYaml.version);
  const [skillAuthor, setSkillAuthor] = useState('Chef de Projet IA');
  const [skillContent, setSkillContent] = useState(PREDEFINED_TEMPLATES[0].content);
  const [copied, setCopied] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [customNeedPrompt, setCustomNeedPrompt] = useState('');

  const fullMarkdown = `---
name: ${skillName}
description: "${skillDescription.replace(/"/g, '\\"')}"
version: "${skillVersion}"
author: "${skillAuthor}"
project: "${audit.projectTitle}"
created_at: "${new Date().toISOString().slice(0, 10)}"
---

${skillContent}`;

  const handleSelectTemplate = (tmpl: PredefinedSkillTemplate) => {
    setSelectedTemplate(tmpl);
    setSkillName(tmpl.defaultYaml.name);
    setSkillDescription(tmpl.defaultYaml.description);
    setSkillVersion(tmpl.defaultYaml.version);
    setSkillContent(tmpl.content);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fullMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([fullMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SKILL-${skillName}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleGenerateAiSkill = async () => {
    if (!customNeedPrompt.trim()) return;
    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/pm/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Rédige un fichier de spécification de compétence Agent IA au format SKILL.md complet et prêt à l'emploi pour le projet "${audit.projectTitle}".
Le besoin spécifique identifié est le suivant :
"${customNeedPrompt}"

Le fichier SKILL.md doit comporter :
1. Un rôle expert très précis.
2. Des instructions procédurales étape par étape.
3. Des règles strictes de sécurité en product building (Zéro-Trust, secrets protégés, conformité).
4. Un format d'entrées et de sorties structurées (templates Markdown ou JSON).
5. Des exemples concrets et des guardrails inviolables.

Réponds DIRECTEMENT avec le contenu Markdown complet (sans balises de bloc englobantes superflues).`,
            },
          ],
          documentContext: documents.map(d => `${d.name}:\n${d.content}`).join('\n\n'),
          roleType: 'pmp',
          model: 'gemini-3.8-flash',
        }),
      });
      const data = await res.json();
      if (data.reply) {
        // Strip out triple backticks if model wrapped whole reply
        let text = data.reply.trim();
        if (text.startsWith('```markdown')) text = text.slice(11);
        if (text.startsWith('```')) text = text.slice(3);
        if (text.endsWith('```')) text = text.slice(0, -3);
        
        // Extract yaml name if present or set clean name
        const cleanSlug = customNeedPrompt.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
        setSkillName(`skill-${cleanSlug}`);
        setSkillDescription(`Compétence spécialisée pour : ${customNeedPrompt.slice(0, 80)}`);
        setSkillContent(text.trim());
      }
    } catch (err) {
      console.error('Erreur génération SKILL.md:', err);
    } finally {
      setIsAiGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              <FileCode className="w-3.5 h-3.5" />
              <span>Atelier de Conception de Skills IA (SKILL.md)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Rédacteur & Générateur de SKILL.md
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Concevez, personnalisez et exportez des spécifications de compétences normalisées pour vos agents IA (Claude, Cursor, Windsurf, LangChain, AutoGen). Chaque skill formalise la méthodologie, les règles de sécurité en product building et le travail au ticket pour votre projet actuel.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs flex items-center space-x-1.5 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copied ? 'Copié !' : 'Copier le SKILL.md'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md shadow-indigo-600/20 transition"
            >
              <Download className="w-4 h-4" />
              <span>Télécharger (.md)</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Skill Generator Prompt Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm font-semibold text-white">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Générer un SKILL.md sur mesure à partir d'un besoin du projet</span>
          </div>
          <span className="text-[10px] text-slate-500">Moteur IA Gemini 3.8</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={customNeedPrompt}
            onChange={(e) => setCustomNeedPrompt(e.target.value)}
            placeholder="Ex : Skill pour auditer le code contre les failles d'injection SQL et vérifier le rate-limiting sur nos endpoints..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            onKeyDown={(e) => e.key === 'Enter' && handleGenerateAiSkill()}
          />
          <button
            onClick={handleGenerateAiSkill}
            disabled={isAiGenerating || !customNeedPrompt.trim()}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition disabled:opacity-50 shrink-0"
          >
            {isAiGenerating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>{isAiGenerating ? 'Rédaction IA en cours...' : 'Rédiger le Skill'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Template Library & Live Markdown Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Skill Patterns Library */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>Bibliothèque de Patterns SKILL</span>
              </h2>
              <span className="text-[10px] text-slate-500">{PREDEFINED_TEMPLATES.length} modèles</span>
            </div>

            <div className="space-y-2.5">
              {PREDEFINED_TEMPLATES.map((tmpl) => {
                const isSelected = selectedTemplate.id === tmpl.id;
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => handleSelectTemplate(tmpl)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition text-xs space-y-1.5 ${
                      isSelected
                        ? 'bg-indigo-600/15 border-indigo-500 shadow-sm'
                        : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{tmpl.title}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">
                      {tmpl.description}
                    </p>
                    <div className="flex items-center justify-between pt-1 text-[10px]">
                      <span className="text-cyan-400 font-medium">{tmpl.category}</span>
                      <span className="text-slate-500">v{tmpl.defaultYaml.version}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Context Tip */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 space-y-2">
            <div className="font-semibold text-slate-200 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Standard SKILL.md en Production</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Ce format structure la pensée des agents autonomes. En fixant des entrées, des sorties types (ex: JSON ou tables INVEST) et des règles d'exclusion de secrets, vous éliminez les dérives et hallucinations.
            </p>
          </div>
        </div>

        {/* Right Column: Skill Metadata & Live Code Editor */}
        <div className="lg:col-span-8 space-y-4">
          {/* Metadata Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>En-tête YAML Frontmatter du Skill</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Nom du Skill (slug)</label>
                <input
                  type="text"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Version</label>
                <input
                  type="text"
                  value={skillVersion}
                  onChange={(e) => setSkillVersion(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Auteur / Rôle</label>
                <input
                  type="text"
                  value={skillAuthor}
                  onChange={(e) => setSkillAuthor(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Description du Skill</label>
              <input
                type="text"
                value={skillDescription}
                onChange={(e) => setSkillDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Full Markdown Editor */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
            <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs">
              <span className="font-mono text-cyan-400 flex items-center space-x-1.5">
                <Code className="w-3.5 h-3.5" />
                <span>SKILL-{skillName}.md</span>
              </span>
              <span className="text-[11px] text-slate-500">
                {skillContent.split('\n').length} lignes • Markdown éditable en temps réel
              </span>
            </div>

            <textarea
              value={skillContent}
              onChange={(e) => setSkillContent(e.target.value)}
              rows={22}
              className="w-full bg-slate-950 text-slate-200 font-mono text-xs p-4 focus:outline-none resize-y leading-relaxed border-none"
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
