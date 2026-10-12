import { ProjectDocument, ProjectAudit } from '../types/project';

export interface SampleProjectPack {
  id: string;
  name: string;
  category: string;
  description: string;
  documents: ProjectDocument[];
  prebuiltAudit: ProjectAudit;
}

export const SAMPLE_PROJECT_PACKS: SampleProjectPack[] = [
  {
    id: 'pack-ecommerce',
    name: 'Refonte Plateforme E-Commerce Omnicanale',
    category: 'Digital & SI',
    description: 'Migration vers architecture Headless avec intégration ERP SAP, catalogue 45 000 références et paiement sécurisé.',
    documents: [
      {
        id: 'doc-eco-1',
        name: 'Cahier_des_Charges_Ecommerce_v2.md',
        type: 'cahier_des_charges',
        fileFormat: 'Markdown',
        size: '14.2 Ko',
        dateAdded: '2026-10-01',
        active: true,
        tags: ['Scope', 'Specs', 'Priorités'],
        content: `# CAHIER DES CHARGES : Refonte Plateforme E-Commerce Omnicanale

## 1. Contexte & Enjeux
L'actuel CMS e-commerce monolithique date de 2018 et souffre de lenteurs en période de soldes, d'un taux de conversion mobile plafonné à 1.4% et d'une synchronisation défaillante avec l'ERP SAP pour les stocks en magasin.
Objectif : Remplacer la solution par une architecture composable (Next.js frontend + Commercetools / Shopify Plus backend) avec connecteur ERP temps réel.

## 2. Objectifs Chiffrés (SMART)
- Augmenter le taux de conversion mobile de +40% en 6 mois post-lancement.
- Réduire le temps de chargement des pages produits sous les 1.2 seconde (LCP).
- Synchronisation des stocks omnicanaux (web + 85 magasins) en moins de 30 secondes.
- Mise en production ferme avant le 15 Octobre 2026 pour sécuriser le Black Friday.

## 3. Périmètre (Scope)
### In Scope :
- Tunnel d'achat optimisé 1-page checkout avec Apple Pay, Google Pay et Alma 3x sans frais.
- Espace client unifié : historique d'achats web et magasins, retours simplifiés, carte fidélité numérique.
- Module Click & Collect 2h et Ship-from-Store.
- Bilingue (Français / Anglais) et multidevise (EUR / CHF).

### Out of Scope (Phase 2) :
- Vente B2B spécifique (portail devis grands comptes).
- Application mobile native iOS/Android (on privilégie une PWA responsive en phase 1).
- Marketplace multi-vendeurs tiers.

## 4. Contraintes & Dépendances
- Dépendance critique : L'équipe IT interne doit fournir les API REST de l'ERP SAP avant le 15 Mai 2026. Tout retard décalera la phase d'intégration.
- Budget alloué validé : 240 000 € HT incluant prestation externe, licences et accompagnement au changement.
- Conformité stricte RGPD et directive européenne Omnibus sur l'affichage des réductions de prix.`,
      },
      {
        id: 'doc-eco-2',
        name: 'CR_COPIL_Lancement_Arbitrages.md',
        type: 'cr_reunion',
        fileFormat: 'Markdown',
        size: '7.8 Ko',
        dateAdded: '2026-10-04',
        active: true,
        tags: ['Gouvernance', 'Décisions', 'COPIL'],
        content: `# COMPTE-RENDU DU COMITÉ DE PILOTAGE (COPIL) #01
Date : 04 Octobre 2026
Participants :
- Marc Duval (Directeur Général / Sponsor)
- Sophie Martin (Directrice E-Commerce / PO Métier)
- Alexandre Nguyen (Lead Architecte SI)
- Julien Caron (Chef de Projet Senior)
- Sarah Benali (Lead QA & Recette)

## Décisions Clés Validées :
1. Choix technologique : Validation unanime de la stack Headless Next.js + Stripe Payments.
2. Gouvernance projet :
   - COPIL mensuel (Sponsor, Métier, CDP)
   - Comité Projet (COPROJ) hebdomadaire le mardi à 9h30
   - Daily stand-up 15 min avec l'équipe technique
3. Validation du calendrier prévisionnel en 5 phases :
   - Phase 1 : Spécifications détaillées & UX/UI (S1 à S4)
   - Phase 2 : Développement des briques e-commerce (S5 à S14)
   - Phase 3 : Intégration API SAP & Paiements (S11 à S16)
   - Phase 4 : Recette fonctionnelle & tests de charge (S17 à S20)
   - Phase 5 : Bascule & stabilisation (S21 à S22)

## Points d'Alerte Soulevés :
- Alerte Charge SAP : L'intégrateur SAP annonce une indisponibilité de leur expert pendant 2 semaines en Mai. Mesure d'urgence : planifier des sessions de spécification d'API dès Avril.
- Ressource UX/UI : Le designer freelance partira fin Mai, les maquettes Figma devront être 100% validées avant son départ.`,
      },
      {
        id: 'doc-eco-3',
        name: 'Matrice_Risques_Initiale.txt',
        type: 'note_cadrage',
        fileFormat: 'Texte',
        size: '5.1 Ko',
        dateAdded: '2026-10-08',
        active: true,
        tags: ['Risques', 'Sécurité', 'Mitigation'],
        content: `REGISTRE DES RISQUES PROJET E-COMMERCE - REVUE INITIALE

R01 - Retard connecteur ERP SAP
Catégorie : Technique & Dépendance
Probabilité : 4/5 | Impact : 5/5 | Criticité : 20/25 (MAJEUR)
Description : Risque de retard sur la livraison des endpoints API SAP pour l'interfaçage des stocks et commandes.
Mitigation : Mocker les API SAP dès le sprint 2 pour ne pas bloquer les développements front-end. Mettre en place un contrat d'interface (Swagger OpenAPI) validé par les deux parties.

R02 - Performance et tenue à la charge pendant le Black Friday
Catégorie : Technique
Probabilité : 3/5 | Impact : 5/5 | Criticité : 15/25 (ÉLEVÉ)
Description : Crash ou ralentissement lors du pic d'audience de novembre.
Mitigation : Planifier 2 campagnes de tests de charge avec Gatling simulant 50 000 visiteurs simultanés. Architecture serverless auto-scalée avec CDN Cloudflare.

R03 - Perte de référencement naturel (SEO) lors de la bascule
Catégorie : Métier & Business
Probabilité : 3/5 | Impact : 4/5 | Criticité : 12/25 (MOYEN)
Description : Mauvaise redirection des anciennes URLs entraînant une baisse de trafic Google.
Mitigation : Plan de redirection 301 strict URL par URL. Audit SEO pré et post-bascule par une agence spécialisée.

R04 - Débordement budgétaire lié aux demandes de modifications métier
Catégorie : Gouvernance
Probabilité : 3/5 | Impact : 3/5 | Criticité : 9/25 (MODÉRÉ)
Description : Scope creep (ajout continu de fonctionnalités non prévues).
Mitigation : Processus formel de Change Request (CR) avec estimation des coûts et impacts délais soumis à validation COPIL.`,
      },
    ],
    prebuiltAudit: {
      projectTitle: 'Refonte Plateforme E-Commerce Omnicanale',
      executiveSummary: 'Projet stratégique de modernisation e-commerce visant à remplacer un socle vieillissant par une architecture Headless connectée à SAP, avec un délai impératif calé sur le Black Friday et un budget de 240 000 € HT.',
      projectStatus: 'JAUNE',
      statusJustification: 'Projet bien cadré mais sous forte tension calendaire due à la dépendance des API SAP et à la date butoir stricte d’octobre pour le Black Friday.',
      estimatedDuration: '6 mois (22 semaines)',
      keyObjectives: [
        '+40% de conversion mobile sur 6 mois',
        'Temps de chargement LCP < 1.2s',
        'Synchro des stocks en < 30 secondes avec 85 boutiques',
        'Mise en ligne garantie avant le 15 octobre 2026',
      ],
      scope: {
        inScope: [
          'Tunnel d’achat 1-page avec Apple Pay & Google Pay',
          'Espace client unifié Web + Magasins',
          'Click & Collect 2h et Ship-from-Store',
          'Multidevise et bilingue FR/EN',
        ],
        outOfScope: [
          'Portail B2B devis grands comptes',
          'Application mobile native iOS/Android (remplacée par PWA)',
          'Marketplace multi-vendeurs',
        ],
      },
      topRisks: [
        {
          id: 'R01',
          title: 'Retard connecteur ERP SAP',
          category: 'Technique',
          probability: 4,
          impact: 5,
          score: 20,
          mitigation: 'Création immédiate de mocks d’API et contractualisation d’une spécification OpenAPI dès le sprint 2.',
          owner: 'Alexandre Nguyen (Lead Arch)',
          status: 'Ouvert',
        },
        {
          id: 'R02',
          title: 'Tenue de charge Black Friday',
          category: 'Technique',
          probability: 3,
          impact: 5,
          score: 15,
          mitigation: 'Tests de charge avec Gatling sur 50k users simultanés et CDN Cloudflare auto-scalé.',
          owner: 'Sarah Benali (Lead QA)',
          status: 'Sous contrôle',
        },
        {
          id: 'R03',
          title: 'Perte de trafic SEO à la bascule',
          category: 'Gouvernance',
          probability: 3,
          impact: 4,
          score: 12,
          mitigation: 'Plan de redirections 301 exhaustif et audit SEO indépendant.',
          owner: 'Sophie Martin (PO Métier)',
          status: 'Sous contrôle',
        },
      ],
      criticalMilestones: [
        {
          id: 'M1',
          title: 'Validation Maquettes Figma & Spécifications',
          phase: 'Conception',
          targetDate: '15 Mai 2026',
          deliverables: 'Design System & specs API validées',
          status: 'En cours',
          progress: 75,
        },
        {
          id: 'M2',
          title: 'Livraison Connecteur API SAP Recette',
          phase: 'Développement',
          targetDate: '15 Juin 2026',
          deliverables: 'API SAP fonctionnelle en environnement test',
          status: 'A venir',
          progress: 30,
        },
        {
          id: 'M3',
          title: 'Début Recette Métier & Tests de Charge',
          phase: 'Recette',
          targetDate: '01 Septembre 2026',
          deliverables: 'Cahier de recette validé à 100%',
          status: 'A venir',
          progress: 0,
        },
        {
          id: 'M4',
          title: 'Go-Live & Bascule Finale',
          phase: 'Déploiement',
          targetDate: '15 Octobre 2026',
          deliverables: 'Mise en production sécurisée avant Black Friday',
          status: 'A venir',
          progress: 0,
        },
      ],
      recommendations: [
        'Organiser un atelier technique d’alignement avec l’intégrateur SAP sous 7 jours pour verrouiller les schémas JSON.',
        'Mettre en place un burndown chart hebdomadaire partagé avec le sponsor pour détecter toute dérive du scope.',
        'Considérer un freeze des évolutions mineures à J-30 du go-live pour sanctuariser la recette.',
      ],
      missingInformation: [
        'Détail des volumétries de catalogue de produits lors des imports initiaux',
        'Contrat SLA de support de l’hébergeur pour le week-end du Black Friday',
      ],
    },
  },
  {
    id: 'pack-mobile-rh',
    name: 'Déploiement Application Mobile RH & Portail Collaborateur',
    category: 'Ressources Humaines & IT',
    description: 'Digitalisation des demandes de congés, notes de frais avec OCR, badgeage virtuel et conformité RGPD pour 1 200 salariés.',
    documents: [
      {
        id: 'doc-rh-1',
        name: 'Note_de_Cadrage_App_Mobile_RH.md',
        type: 'note_cadrage',
        fileFormat: 'Markdown',
        size: '11.5 Ko',
        dateAdded: '2026-09-15',
        active: true,
        tags: ['RH', 'Cadrage', 'RGPD'],
        content: `# NOTE DE CADRAGE : Application Mobile Collaborateurs RH

## Contexte
La société compte 1 200 collaborateurs dont 60% sur le terrain (techniciens itinérants, personnel en agence).
La gestion actuelle sur feuilles Excel et formulaires papier engendre 15 jours de délai moyen de traitement des notes de frais et un taux d'erreur de 12% sur les soldes de congés.

## Périmètre
1. Déclaration et validation des congés et RTT en 3 clics avec synchro Outlook Calendar.
2. Scan intelligent des notes de frais avec extraction OCR automatique du montant et TVA.
3. Consultation des bulletins de salaire dématérialisés dans un coffre-fort numérique sécurisé.
4. Annuaire d'entreprise sécurisé avec appel direct et trombinoscope.

## Contraintes Légales & Sociales
- Consultation préalable et avis du CSE obligatoire avant tout déploiement de géolocalisation.
- Hébergement certifié HDS / ISO 27001 au sein de l'Union Européenne.
- Accessibilité numérique RGAA niveau AA pour les collaborateurs en situation de handicap.`,
      },
      {
        id: 'doc-rh-2',
        name: 'Synthese_Ateliers_Utilisateurs_Terrain.md',
        type: 'specs',
        fileFormat: 'Markdown',
        size: '6.4 Ko',
        dateAdded: '2026-09-22',
        active: true,
        tags: ['UX', 'Terrain', 'Besoins'],
        content: `# COMPTE-RENDU DES ATELIERS TERRAIN RH

3 sessions d'écoute utilisateurs menées auprès de 24 managers et techniciens :
- Exigence majeure : Fonctionnement en mode hors-ligne (Offline-first) car les techniciens interviennent souvent en sous-sol sans réseau 4G/5G.
- Rejet d'un mot de passe complexe supplémentaire : Obligation de connexion par biométrie (FaceID / Empreinte) adossée au SSO Microsoft Entra ID.
- Notification push discrète lors de la validation par le manager.`,
      },
    ],
    prebuiltAudit: {
      projectTitle: 'Application Mobile RH & Collaborateur',
      executiveSummary: 'Projet d’outillage mobile pour 1 200 salariés visant à dématérialiser les congés et notes de frais avec mode hors-ligne, biométrie et conformité sociale CSE.',
      projectStatus: 'VERT',
      statusJustification: 'Besoins bien identifiés, consensus fort du métier et des utilisateurs terrain, calendrier réaliste de 4 mois.',
      estimatedDuration: '4 mois',
      keyObjectives: [
        'Diviser par 3 le temps de traitement des notes de frais',
        'Zéro papier pour la saisie des congés',
        'Taux d’adoption > 85% à 3 mois post-déploiement',
      ],
      scope: {
        inScope: [
          'Gestion des congés & RTT avec synchro calendrier',
          'Scan des justificatifs de frais par OCR',
          'Coffre-fort numérique fiches de paie',
          'Mode hors-ligne pour techniciens',
        ],
        outOfScope: [
          'Pointeuse horaire géolocalisée (reporté suite avis CSE)',
          'Entretien annuel d’évaluation (module prévu en année 2)',
        ],
      },
      topRisks: [
        {
          id: 'RH-R1',
          title: 'Blocage du CSE sur le respect de la vie privée',
          category: 'Gouvernance',
          probability: 2,
          impact: 4,
          score: 8,
          mitigation: 'Présentation anticipée du prototype sans géolocalisation et charte d’usage rédigée avec les délégués.',
          owner: 'DRH & Juridique',
          status: 'Sous contrôle',
        },
        {
          id: 'RH-R2',
          title: 'Précision de l’OCR sur tickets froissés ou thermiques',
          category: 'Technique',
          probability: 3,
          impact: 3,
          score: 9,
          mitigation: 'Fallback systématique vers saisie manuelle avec contrôle de cohérence visuel.',
          owner: 'Lead Tech Mobile',
          status: 'Ouvert',
        },
      ],
      criticalMilestones: [
        {
          id: 'RH-M1',
          title: 'Validation Charte Vie Privée & Accord CSE',
          phase: 'Cadrage',
          targetDate: '15 Novembre 2026',
          deliverables: 'Avis favorable du CSE',
          status: 'Valide',
          progress: 100,
        },
        {
          id: 'RH-M2',
          title: 'Version Bêta Pilote sur 50 techniciens',
          phase: 'Recette',
          targetDate: '10 Janvier 2027',
          deliverables: 'Rapport de retour d’expérience pilote',
          status: 'En cours',
          progress: 40,
        },
        {
          id: 'RH-M3',
          title: 'Généralisation aux 1 200 collaborateurs',
          phase: 'Déploiement',
          targetDate: '01 Mars 2027',
          deliverables: 'Disponibilité App Store & Google Play privé',
          status: 'A venir',
          progress: 0,
        },
      ],
      recommendations: [
        'Créer un kit d’onboarding vidéo court (60 sec) pour booster l’adoption dès le premier jour.',
        'Assurer un support utilisateur renforcé (Helpdesk dédié) les 2 premières semaines post-lancement.',
      ],
      missingInformation: [
        'Format exact des exports comptables requis par le logiciel de paie Cegid',
      ],
    },
  },
  {
    id: 'pack-biotech-science',
    name: 'Projet R&D Biotech : Inhibiteur Allostérique KRAS G12D',
    category: 'Sciences & Santé',
    description: 'Programme de recherche translationnelle oncologique : validation de cible (UniProt/AlphaFold), optimisation de touche (PubChem/ChEMBL) et protocole d’essai clinique Phase I (ClinicalTrials.gov).',
    documents: [
      {
        id: 'doc-bio-1',
        name: 'Note_Cadrage_Cible_KRAS_G12D.md',
        type: 'note_cadrage',
        fileFormat: 'Markdown',
        size: '12.8 Ko',
        dateAdded: '2026-10-05',
        active: true,
        tags: ['Biologie', 'Oncologie', 'UniProt', 'AlphaFold'],
        content: `# PROGRAMME R&D : Inhibiteur Allostérique KRAS G12D (Candidat ORG-542)

## 1. Cible Biologique & Rationalité Médicale
- Protéine Cible : GTPase KRAS humaine (UniProt : P01116)
- Mutation d'intérêt : Substitution ponctuelle Gly12Asp (G12D), prévalente dans 35% des adénocarcinomes pancréatiques et 12% des cancers colorectaux.
- Structure 3D : Modèle de prédiction AlphaFold DB (AF-P01116-F1) et structure cristallographique PDB 4OBE.
- Mécanisme d'action : Blocage allostérique de la poche Switch-II en conformation inactive liée au GDP.

## 2. Objectifs Précliniques (SMART)
- Affinité de liaison Kd < 5 nM déterminée par SPR (Biacore).
- Sélectivité > 100x vis-à-vis du KRAS sauvage (WT) et des isoformes NRAS/HRAS.
- Biodisponibilité orale chez le rongeur > 45% avec demi-vie terminale > 6h.
- Dépôt du dossier IND (Investigational New Drug) auprès de l'ANSM et de la FDA d'ici T1 2027.

## 3. Données Chémo-informatiques (PubChem / ChEMBL)
- Série chimique : Dérivés quinazolines bicycliques fonctionnalisés.
- Solubilité aqueuse cLogP < 3.2, TPSA < 90 Å² (Conformité aux règles de Lipinski).
- Profil de métabolisation hépatique CYP450 3A4 sans induction majeure.`,
      },
      {
        id: 'doc-bio-2',
        name: 'Protocole_Essai_Clinique_Phase1.md',
        type: 'specs',
        fileFormat: 'Markdown',
        size: '10.2 Ko',
        dateAdded: '2026-10-07',
        active: true,
        tags: ['Clinique', 'Protocole', 'ClinicalTrials', 'ANSM'],
        content: `# PROTOCOLE CLINIQUE : Phase I Escalade de Dose First-in-Human (FIH)
Référence projet : ORG-KRAS-101 | Enregistrement prévisionnel : ClinicalTrials.gov (NCT en cours)

## 1. Schéma de l'Étude
- Population cible : Patients adultes atteints de tumeurs solides avancées ou métastatiques avec mutation KRAS G12D confirmée par biopsie liquide (ADNtc).
- Design : Escalade de dose en 3+3 (5 paliers de dose : 50mg, 100mg, 200mg, 400mg, 800mg/jour) suivie d'une cohorte d'extension de 20 patients à la dose recommandée (RP2D).
- Critères de jugement principaux : Tolérance, toxicité limitant la dose (DLT) selon CTCAE v5.0 et pharmacocinétique (Cmax, AUC).
- Critères secondaires : Taux de réponse objective (ORR) selon les critères RECIST 1.1 et survie sans progression (PFS).

## 2. Calendrier & Jalons Réglementaires
- Accord CPP (Comité de Protection des Personnes) : 15 Décembre 2026.
- Autorisation ANSM d'ouverture de centre : 01 Février 2027.
- Premier patient inclus (First Patient In) : 15 Mars 2027.
- Budget alloué validé : 1 850 000 € HT.`,
      },
    ],
    prebuiltAudit: {
      projectTitle: 'Programme R&D Biotech : Inhibiteur KRAS G12D & Essai Clinique',
      executiveSummary: 'Projet de recherche biomédicale visant la transition préclinique-clinique d’une molécule innovante ciblant la mutation KRAS G12D dans le cancer pancréatique et colorectal, avec dépôt IND et inclusion du premier patient en mars 2027.',
      projectStatus: 'VERT',
      statusJustification: 'Données de pharmacocinétique préclinique robustes, cible solidement validée dans la littérature PubMed, calendrier d’autorisation CPP/ANSM en bonne voie.',
      estimatedDuration: '18 mois',
      keyObjectives: [
        'Dépôt dossier IND auprès de la FDA et ANSM',
        'Fabrication du lot clinique GMP 5 kg',
        'Inclusion du premier patient (FPI) à Jalon T1 2027',
        'Démontrer un profil d’innocuité sans toxicité limitante (DLT)',
      ],
      scope: {
        inScope: [
          'Synthèse chimique et formulation orale gélules GMP',
          'Essai clinique Phase I escalade 3+3 sur 3 centres hospitaliers universitaires',
          'Analyses pharmacocinétiques et biomarqueurs ADNtc',
        ],
        outOfScope: [
          'Essai de Phase II d’efficacité comparative (Phase 2)',
          'Combinaison avec immunothérapie anti-PD-1 (prévue en extension)',
        ],
      },
      topRisks: [
        {
          id: 'BIO-R1',
          title: 'Toxicité hépatique imprévue chez l’homme (DILI)',
          category: 'Technique',
          probability: 2,
          impact: 5,
          score: 10,
          mitigation: 'Dosages transaminases hebdomadaires et paliers d’escalade prudents avec règles d’arrêt strictes.',
          owner: 'Investigateur Coordonnateur & Médecin Promoteur',
          status: 'Sous contrôle',
        },
        {
          id: 'BIO-R2',
          title: 'Délai d’approbation du lot clinique GMP par le façonnier (CDMO)',
          category: 'Calendrier',
          probability: 3,
          impact: 4,
          score: 12,
          mitigation: 'Audit qualité sur site à J-60 et double sourcing des excipients critiques.',
          owner: 'Responsable CMC / Galénique',
          status: 'Ouvert',
        },
      ],
      criticalMilestones: [
        {
          id: 'BIO-M1',
          title: 'Validation Lot Clinique GMP & Stabilité',
          phase: 'Conception',
          targetDate: '15 Novembre 2026',
          deliverables: 'Certificat d’analyse libératoire QP',
          status: 'En cours',
          progress: 80,
        },
        {
          id: 'BIO-M2',
          title: 'Autorisation ANSM & Avis Favorable CPP',
          phase: 'Cadrage',
          targetDate: '01 Février 2027',
          deliverables: 'Autorisation réglementaire d’essai clinique',
          status: 'A venir',
          progress: 45,
        },
        {
          id: 'BIO-M3',
          title: 'Premier Patient Inclus (FPI)',
          phase: 'Déploiement',
          targetDate: '15 Mars 2027',
          deliverables: 'Rapport d’inclusion centre investigateur #1',
          status: 'A venir',
          progress: 0,
        },
      ],
      recommendations: [
        'Interroger PubMed et ClinicalTrials.gov pour surveiller les molécules concurrentes de Mirati/Amgen ciblant KRAS G12D.',
        'Anticiper les commandes de kits de biopsie liquide pour ne pas ralentir le screening des patients.',
      ],
      missingInformation: [
        'Données de stabilité en zone climatique ICH IVb pour les sites internationaux',
      ],
    },
  },
  {
    id: 'pack-cdp-paris-vibe',
    name: 'PBNC CDP Paris : Supabase, Vibe Coding & Sécurisation Agent IA',
    category: 'Formation CDP & IA Prod',
    description: 'Dossier de projet basé sur les sessions de formation (Loom 28/07/2026, Leexi meeting share et enregistrement Drive Supabase & Vibe Coding).',
    documents: [
      {
        id: 'doc-loom-sec',
        name: 'Loom_Securiser_Agent_IA_Production.md',
        type: 'specs',
        fileFormat: 'Loom Vidéo',
        size: '11.4 Ko',
        dateAdded: '2026-07-28',
        active: true,
        tags: ['Loom', 'Sécurité', 'Agents IA', 'Production'],
        content: `# TRANSCRIPTION & SYNTHÈSE LOOM : Sécuriser ton Agent IA en Production
Date : 28 Juillet 2026
Lien source : https://www.loom.com/share/101fda9877b64135ad5a3c276e4e4e4b

## 1. Contexte & Enjeux
La mise en production d'agents autonomes et de LLM en entreprise pose des défis de sécurité critiques : fuite de clés API, injection de prompts malveillants, coûts non plafonnés et accès non autorisés aux bases de données.

## 2. Piliers d'Architecture Sécurisée
1. **Zéro Clé Côté Client (Server-Side Proxy)** :
   - Les clés API (Gemini, Supabase service_role, etc.) ne doivent JAMAIS apparaître dans le code frontend ou le bundle Vite.
   - Toutes les requêtes vers les LLM transitent par des routes backend dédiées (/api/*).

2. **Défense en Profondeur contre le Prompt Injection** :
   - Séparation stricte entre les System Instructions (inviolables) et le contenu fourni par les utilisateurs.
   - Validation des entrées et guardrails sur les sorties générées.

3. **Gouvernance des Données & Contrôle d'Accès (RBAC / RLS)** :
   - Isolation des données sensibles (PII).
   - Règles d'autorisation au niveau ligne (Row-Level Security sur PostgreSQL/Supabase ou Firestore rules).

4. **Gestion des Risques Budgétaires (Denial of Wallet)** :
   - Plafonnement des tokens en sortie (maxOutputTokens).
   - Rate limiting par adresse IP et par utilisateur authentifié.`,
      },
      {
        id: 'doc-drive-vibe',
        name: 'Drive_PBNC_Supabase_Vibe_Coding_Theorie.md',
        type: 'note_cadrage',
        fileFormat: 'Google Drive',
        size: '14.8 Ko',
        dateAdded: '2026-08-18',
        active: true,
        tags: ['Google Drive', 'Supabase', 'Vibe Coding', 'CDP Paris'],
        content: `# SUPPORT GOOGLE DRIVE : PBNC.26-06.CDP.Paris — Supabase & Vibe Coding (Théorie)
Date de la session : 18 Août 2026
Lien source : https://drive.usercontent.google.com/download?id=1XlEPXrfaWg_DuP6WmMnS1dkqUlHNe2qo&export=download

## 1. Qu'est-ce que le "Vibe Coding" pour un Chef de Projet ?
Le Vibe Coding désigne l'art de concevoir, prototyper et itérer sur des applications logicielles complètes en guidant des agents d'intelligence artificielle par le langage naturel.
Le rôle du Chef de Projet devient encore plus central :
- Rédiger des spécifications et des personas sans ambiguïté.
- Piloter l'architecture globale pour éviter la dette technique et le code spaghetti.
- Vérifier la conformité réglementaire (RGPD, audit de sécurité).

## 2. Socle Backend : Supabase & PostgreSQL
- Supabase fournit une base PostgreSQL managée avec authentification, temps réel et Row Level Security (RLS).
- Avantage pour le chef de projet : Schémas relationnels stricts (Drizzle ORM / SQL), migrations versionnées et typage TypeScript bout en bout.

## 3. Plan d'Action & Livrables Attendus
- Cadrer l'application avec un WBS et des critères d'acceptation précis.
- Structurer les composants front-end et back-end de manière modulaire.
- Intégrer les tests et la vérification automatisée (lint, compilation).`,
      },
      {
        id: 'doc-leexi-cr',
        name: 'Leexi_Synthese_Reunion_Decisions_CDP.md',
        type: 'cr_reunion',
        fileFormat: 'Leexi Meeting',
        size: '8.6 Ko',
        dateAdded: '2026-08-20',
        active: true,
        tags: ['Leexi', 'Compte-rendu', 'Plan d’actions', 'COPIL'],
        content: `# COMPTE-RENDU LEEXI AI : Synchronisation Équipe & Évaluation CDP
Lien source : https://app.leexi.ai/fr/share/df80da18-294b-4856-bff0-9b6db3f2d6fb

## 1. Objectifs de la Réunion
Revue d'avancement des projets d'agents IA développés par la promotion PBNC.26-06.CDP.Paris.

## 2. Relevé de Décisions
1. Les projets doivent intégrer une interface de pilotage complète : Tableau de bord, matrice des risques, planning jalons et matrice RACI.
2. Tout déploiement doit respecter les consignes de sécurité présentées dans le Loom du 28/07 (clés cachées côté serveur, authentification vérifiée).
3. L'intégration de données documentaires (Drive, transcriptions, briefs) doit être native dans l'agent.

## 3. Calendrier & Échéances :
- Jalon 1 : Finalisation de la matrice des risques et du WBS.
- Jalon 2 : Intégration de l'agent chatbot multi-rôles avec Search Grounding.
- Jalon 3 : Démonstration finale et mise en production.`,
      },
    ],
    prebuiltAudit: {
      projectTitle: 'CDP Paris : Supabase, Vibe Coding & Sécurisation des Agents IA',
      executiveSummary: 'Projet de déploiement et de formation Chef de Projet alliant la méthodologie Vibe Coding (prototypage assisté par IA), un socle de données sécurisé et les bonnes pratiques de mise en production (Loom 28/07 & Leexi).',
      projectStatus: 'VERT',
      statusJustification: 'Documents et enregistrements pédagogiques clairs, architecture cible bien délimitée, règles de sécurité zéro-trust définies.',
      estimatedDuration: '4 semaines',
      keyObjectives: [
        'Maîtrise du cycle Vibe Coding pour les Chefs de Projet',
        'Sécurisation à 100% des clés API et de l’authentification',
        'Gouvernance des données avec RLS / Firestore security rules',
        'Création d’un Agent Skill opérationnel en production',
      ],
      scope: {
        inScope: [
          'Agent Skill Chef de Projet avec matrice des risques 5x5',
          'Intégration des transcriptions et enregistrements Loom / Drive / Leexi',
          'Chatbot multi-rôles avec Google Search Grounding',
          'Persistance sécurisée des dossiers et des documents',
        ],
        outOfScope: [
          'Hébergement on-premise sur serveurs physiques internes',
          'Développement d’une application mobile native iOS',
        ],
      },
      topRisks: [
        {
          id: 'CDP-R1',
          title: 'Fuite accidentelle de clés d’API dans le bundle client',
          category: 'Technique',
          probability: 2,
          impact: 5,
          score: 10,
          mitigation: 'Audit strict du code : interdiction de variables privées dans le frontend, utilisation exclusive de routes Express /api/*',
          owner: 'Lead Architecte',
          status: 'Sous contrôle',
        },
        {
          id: 'CDP-R2',
          title: 'Dérive de périmètre (Scope Creep) lors des sessions Vibe Coding',
          category: 'Gouvernance',
          probability: 3,
          impact: 4,
          score: 12,
          mitigation: 'Cadrage amont avec cahier des charges figé et validation systématique de chaque itération.',
          owner: 'Chef de Projet',
          status: 'Sous contrôle',
        },
      ],
      criticalMilestones: [
        {
          id: 'CDP-M1',
          title: 'Cadrage & Synthèse des Enregistrements (Loom/Drive/Leexi)',
          phase: 'Cadrage',
          targetDate: '25 Août 2026',
          deliverables: 'Notes de cadrage & transcription des 3 sources',
          status: 'Valide',
          progress: 100,
        },
        {
          id: 'CDP-M2',
          title: 'Intégration du Chatbot Multi-Rôles & Search Grounding',
          phase: 'Développement',
          targetDate: '10 Septembre 2026',
          deliverables: 'Chatbot multi-turn avec rôles PMP, R&D et Architecte',
          status: 'Valide',
          progress: 100,
        },
        {
          id: 'CDP-M3',
          title: 'Validation de Sécurité & Mise en Production',
          phase: 'Déploiement',
          targetDate: '30 Septembre 2026',
          deliverables: 'Audit de sécurité validé et démo COPIL',
          status: 'En cours',
          progress: 90,
        },
      ],
      recommendations: [
        'Utiliser le Flash Report hebdomadaire pour suivre l’avancement des projets d’agents IA.',
        'Activer Google Search Grounding pour vérifier les dernières failles ou correctifs de sécurité des modèles Gemini.',
      ],
      missingInformation: [
        'Barème d’évaluation final de la certification CDP Paris',
      ],
    },
  },
];
