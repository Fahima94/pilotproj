# Chef de Projet IA — Agent Skill & R&D Workspace

Plateforme intelligente de pilotage de projet, de gouvernance méthodologique (PMP / PRINCE2 / Agile) et de recherche translationnelle (DeepMind Science Skills). L'application ingère vos documents, réunions et médias pour structurer vos tableaux de bord, piloter les risques et préparer vos présentations de direction.

---

## 🚀 Fonctionnalités Majeures

### 1. 📁 Gestionnaire Documentaire & Ingestion Multi-Source
- **Import universel** : Glisser-déposer de fichiers (`.md`, `.txt`, `.json`, `.csv`, `.pdf`...) ou saisie directe de notes.
- **Connecteur Liens Médias & Réunions** :
  - **Loom** : Détection automatique des enregistrements vidéo et transcription des bonnes pratiques (ex: sécurisation des agents IA en production).
  - **Leexi.ai** : Ingestion des comptes-rendus de réunion et plans d'actions d'équipe.
  - **Google Drive** : Intégration des supports de formation et de cours (ex: *PBNC CDP Paris — Supabase & Vibe Coding*).
- **Gestion fine de la mémoire de travail** : Cochez/décochez les documents actifs injectés dans le contexte de l'Agent IA.

### 2. 🎙️ Enregistrement & Transcription de Réunions (Meets)
- **Capture audio directe** : Enregistrement micro en direct dans le navigateur avec chronomètre et visualiseur d'onde.
- **Modèle spécialisé `gemini-3.5-transcribe`** :
  - Transcription fidèle mot à mot.
  - Extraction automatique des **Décisions Clés**, des **Actions à mener (Action Items)** avec responsables et échéances, et des **Points d'Alerte**.
- **Alimentation instantanée** : Bouton d'injection en 1 clic pour intégrer le compte-rendu dans le dossier de projet.

### 3. 📊 Studio de Préparation de Slides (Slide Deck Studio)
- **Générateur de présentations assisté par IA** :
  - **Comité de Pilotage (COPIL)** : Synthèse exécutive, météo du projet, arbitrages requis.
  - **Réunion de Lancement (Kick-off)** : Alignement des équipes, matrice RACI, jalons clés.
  - **Revue de Sprint & Démo Agile** : Vélocité, User Stories livrées, retours utilisateurs.
  - **Comité des Risques** : Matrice 5x5, scénarios d'impact et plans de contingence.
  - **Soutenance & Clôture de Projet** : Bilan budgétaire, KPIs atteints et retour d'expérience (REX).
- **Argumentaires Orateur (Speaker Notes)** : Chaque slide contient les notes orales rédigées pour aider le chef de projet à convaincre en séance.
- **Diaporama interactif** avec 3 thèmes visuels (*Sombre Exécutif*, *Corporate Bleu*, *Deep Teal*) et export en **HTML projetable**, **Markdown** ou **PDF**.

### 4. 🤖 Chatbot Multi-Turn Gemini & Rôles Spécialisés
- **4 Personas experts** configurables à la volée :
  1. 👑 **Chef de Projet Senior (PMP / Agile)** : Cadrage, WBS, chemin critique, arbitrage COPIL.
  2. 🔬 **Directeur R&D (DeepMind Science Skills)** : Bio-informatique, cibles thérapeutiques, protocoles d'essais.
  3. 🛡️ **Lead Architecte & Sécurité** : Résilience, zéro-trust, PCA/PRA, RLS.
  4. ⚡ **Product Owner & Scrum Master** : Epics, User stories INVEST, cérémonies agiles.
- **Google Search Grounding en temps réel 🌐** : Interrogation en direct du web pour sourcer les benchmarks, la veille concurrentielle et les réglementations récentes avec citations de liens vérifiés.
- **Sélecteur de modèles Gemini** : `gemini-3.8-flash` (défaut), `gemini-3.5-flash`, `gemini-3.1-pro-preview` et `gemini-3.1-flash-lite`.

### 5. 🔬 DeepMind Science Skills & Données Biomédicales
- Interrogation en direct sans clé des bases scientifiques officielles :
  - **ClinicalTrials.gov** : Protocoles d'essais cliniques, phases (Phase I/II/III), statuts et investigateurs.
  - **PubChem (NCBI)** : Molécules, structures chimiques, formules, masse molaire et conformité Lipinski.
  - **UniProtKB & AlphaFold DB** : Cibles biologiques, identifiants UniProt (ex: `P01116`), gènes et prédictions structurales 3D.
  - **Europe PMC / PubMed** : Publications biomédicales et revues scientifiques par les pairs.
- Injection directe des fiches scientifiques dans les documents du projet pour audit par l'agent.

### 6. 🛠️ Outils Méthodologiques PMP / PMI
- **Tableau de Bord & Météo Projet** : Statut global 🟢 **VERT**, 🟡 **JAUNE** ou 🔴 **ROUGE**, objectifs SMART et cadrage *In Scope / Out of Scope*.
- **Matrice des Risques 5x5 interactive** : Heatmap Probabilité (1-5) x Gravité (1-5), criticité PxG et registre de mitigation.
- **Planning & Jalons WBS** : Chronologie des phases (Cadrage, Conception, Build, Recette, Déploiement) et suivi d'avancement.
- **Matrice de Gouvernance RACI** : Répartition formelle des rôles (Responsible, Accountable, Consulted, Informed).
- **Générateur de Livrables en 1 Clic** : Charte de Projet (Project Charter), Flash Report COPIL, Registre des risques, Matrice RACI, Découpage WBS et Backlog Agile.

### 7. 🔐 Authentification Google & Persistance Firebase Firestore
- Connexion sécurisée Google Auth (`signInWithPopup`).
- Persistance complète dans Firestore : `/users/{userId}`, `/projects/{projectId}`, `/documents/{documentId}`, `/messages/{messageId}`.
- Règles de sécurité `firestore.rules` durcies (Architecture Zero-Trust, protection RBAC et anti-update gap).

---

## 📦 Dossiers de Projets Types Inclus

1. **PBNC CDP Paris : Supabase, Vibe Coding & Sécurisation des Agents IA** :
   - Basé sur l'enregistrement Loom du 28/07/2026, la réunion Leexi et le support Drive de la promotion CDP Paris.
2. **Refonte Plateforme E-Commerce Omnicanale** :
   - Migration Headless, connecteur ERP SAP, tunnel d'achat 1-page et contraintes Black Friday (Budget 240k€).
3. **Application Mobile Collaborateurs RH** :
   - Dématérialisation congés/notes de frais avec OCR, mode hors-ligne et conformité CSE/RGPD.
4. **Projet R&D Biotech : Inhibiteur Allostérique KRAS G12D** :
   - Cible biologique UniProt P01116 / AlphaFold, chimie PubChem, protocole d'essai clinique Phase I ANSM.

---

## 💻 Stack Technique

- **Frontend** : React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion.
- **Backend** : Node.js, Express, TSX, Vite middleware mode.
- **Intelligence Artificielle** : SDK `@google/genai` (Gemini 3.8 Flash, Gemini 3.5 Flash, Gemini 3.5 Transcribe).
- **Base de données & Auth** : Firebase SDK (Authentication & Cloud Firestore).
- **APIs Scientifiques Publiques** : ClinicalTrials.gov REST v2, PubChem PUG REST, UniProt REST, Europe PMC REST.

---

## 🛠️ Installation & Démarrage

### Prérequis
- Node.js (version 20+ ou 22+)
- Clé d'API Gemini injectée dans la variable d'environnement `GEMINI_API_KEY`

### Commandes
```bash
# Installation des dépendances
npm install

# Démarrage en mode développement (Express + Vite sur le port 3000)
npm run dev

# Vérification du typage TypeScript
npm run lint

# Build de production
npm run build

# Démarrage du serveur en production
npm start
```

---

## 📄 Licence
Sous licence Apache-2.0. Développé pour le pilotage de projets innovants avec Google AI Studio.
