import React, { useState } from 'react';
import { ProjectDocument } from '../types/project';
import { 
  Upload, 
  FileText, 
  Clipboard, 
  X, 
  Plus, 
  Check, 
  Sparkles,
  Link as LinkIcon,
  Video,
  FileCheck,
  FolderOpen
} from 'lucide-react';

interface UploadModalProps {
  onClose: () => void;
  onAddDocument: (doc: ProjectDocument) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  onClose,
  onAddDocument,
}) => {
  const [activeTab, setActiveTab] = useState<'url' | 'paste' | 'upload'>('url');

  // URL Import Form states
  const [urlInput, setUrlInput] = useState('');
  const [urlTitle, setUrlTitle] = useState('');
  const [urlNotes, setUrlNotes] = useState('');
  const [urlType, setUrlType] = useState<ProjectDocument['type']>('cr_reunion');
  const [isUrlAnalyzing, setIsUrlAnalyzing] = useState(false);

  // Paste form states
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState<ProjectDocument['type']>('cahier_des_charges');
  const [docContent, setDocContent] = useState('');
  const [docTags, setDocTags] = useState('Scope, Métier');

  // Drag and drop states
  const [dragOver, setDragOver] = useState(false);
  const [importedFileMessage, setImportedFileMessage] = useState<string | null>(null);

  // Handle URL analyze
  const handleDetectUrl = (url: string) => {
    setUrlInput(url);
    if (url.includes('loom.com')) {
      setUrlTitle('Loom — Sécuriser ton agent IA en production (Transcription & Points Clés)');
      setUrlType('specs');
      setUrlNotes(`### ENREGISTREMENT LOOM : Sécuriser ton agent IA en production
URL source : ${url}
Date d'enregistrement : 28 Juillet 2026

#### Points Clés & Bonnes Pratiques Présentées :
1. **Protection contre le Prompt Injection & Jailbreak** : Mise en place de guardrails stricts au niveau du prompt système et filtrage des entrées utilisateurs.
2. **Architecture Zéro-Trust & Secrets API** : Règle absolue de ne jamais exposer les clés API Gemini ou tierces côté client. Utiliser systématiquement des routes serveurs proxy (/api/*).
3. **Contrôle d'accès & RBAC (Role-Based Access Control)** : Attribution rigoureuse des droits utilisateurs, validation des tokens d'authentification et isolation des données privées.
4. **Gestion des Quotas & Denial of Wallet** : Limiter la longueur des tokens, plafonner les appels et journaliser les coûts d'inférence.
5. **Surveillance & Audit en Production** : Suivi des métriques de fiabilité, détection des dérives (drifts) et journalisation des erreurs de permissions.`);
    } else if (url.includes('leexi.ai')) {
      setUrlTitle('Leexi — Compte-rendu de Réunion & Relevé de Décisions Stratégiques');
      setUrlType('cr_reunion');
      setUrlNotes(`### COMPTE-RENDU DE RÉUNION & PLAN D'ACTIONS
URL source : ${url}
Type : Synthèse intelligente de réunion & Décisions d'équipe

#### Résumé Exécutif de la Session :
- Revue des jalons de cadrage et de livraison projet avec les parties prenantes.
- Alignement sur l'usage des architectures d'automatisation et de pilotage documentaire.
- Définition des critères d'acceptation, des priorités fonctionnelles et des indicateurs de succès (KPIs).

#### Actions Décidées (Action Items) :
- [ ] Valider l'architecture technique et les flux d'intégration (Lead Architecte)
- [ ] Finaliser la matrice des risques 5x5 et le plan d'atténuation (Chef de Projet)
- [ ] Programmer le point de synchronisation hebdomadaire pour le rapport exécutif.`);
    } else if (url.includes('drive.google.com') || url.includes('drive.usercontent.google.com')) {
      setUrlTitle('Google Drive — Note de Cadrage Technique & Gouvernance');
      setUrlType('note_cadrage');
      setUrlNotes(`### DOCUMENT DE CADRAGE STRATÉGIQUE GOOGLE DRIVE
Fichier : Note d'orientation technique & architecture logicielle
URL source : ${url}

#### Contenu & Piliers Opérationnels :
1. **Architecture des Données & Résilience** :
   - Base de données relationnelle sécurisée avec Row Level Security (RLS).
   - Traçabilité et audit des flux d'intégration d'entreprise.
2. **Méthodologie de Pilotage Accéléré & Intégration IA** :
   - Conception itérative et cadrage rigoureux par le Chef de Projet.
   - Prévention de la dette technique et gestion proactive du périmètre (Scope).
3. **Gouvernance & Assurance Qualité** :
   - Spécifications précises et critères d'acceptation formalisés.
   - Recette fonctionnelle continue et tests d'intégration.`);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlTitle.trim() || !urlNotes.trim()) return;

    const newDoc: ProjectDocument = {
      id: `doc-${Date.now()}`,
      name: `${urlTitle.trim()}.md`,
      type: urlType,
      fileFormat: 'Lien Média',
      size: `${(urlNotes.length / 1024).toFixed(1)} Ko`,
      content: `# ${urlTitle}\nURL source : ${urlInput}\n\n${urlNotes}`,
      dateAdded: new Date().toISOString().slice(0, 10),
      active: true,
      tags: ['Vidéo / Réunion', urlInput.includes('loom') ? 'Loom' : urlInput.includes('leexi') ? 'Leexi' : 'Google Drive'],
    };

    onAddDocument(newDoc);
    onClose();
  };

  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim() || !docContent.trim()) return;

    const newDoc: ProjectDocument = {
      id: `doc-${Date.now()}`,
      name: docName.trim().endsWith('.md') || docName.trim().endsWith('.txt') ? docName.trim() : `${docName.trim()}.md`,
      type: docType,
      fileFormat: 'Markdown',
      size: `${(docContent.length / 1024).toFixed(1)} Ko`,
      content: docContent.trim(),
      dateAdded: new Date().toISOString().slice(0, 10),
      active: true,
      tags: docTags.split(',').map((t) => t.trim()).filter(Boolean),
    };

    onAddDocument(newDoc);
    onClose();
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string) || '';
      const newDoc: ProjectDocument = {
        id: `doc-${Date.now()}`,
        name: file.name,
        type: 'autre',
        fileFormat: file.name.split('.').pop()?.toUpperCase() || 'Fichier',
        size: `${(file.size / 1024).toFixed(1)} Ko`,
        content: text || `[Contenu du document ${file.name}]`,
        dateAdded: new Date().toISOString().slice(0, 10),
        active: true,
        tags: ['Importé', file.type || 'Fichier'],
      };
      onAddDocument(newDoc);
      setImportedFileMessage(`Document "${file.name}" importé avec succès !`);
      setTimeout(() => {
        onClose();
      }, 1000);
    };

    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-sm sm:text-base">
              Alimenter l'Agent Chef de Projet en Documents & Médias
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 text-xs font-medium">
          <button
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-3 text-center border-b-2 transition flex items-center justify-center space-x-1.5 ${
              activeTab === 'url'
                ? 'border-indigo-500 text-white font-bold bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Lien Média (Loom, Leexi, Drive)</span>
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`flex-1 py-3 text-center border-b-2 transition flex items-center justify-center space-x-1.5 ${
              activeTab === 'paste'
                ? 'border-indigo-500 text-white font-bold bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clipboard className="w-3.5 h-3.5" />
            <span>Coller du texte brut</span>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-3 text-center border-b-2 transition flex items-center justify-center space-x-1.5 ${
              activeTab === 'upload'
                ? 'border-indigo-500 text-white font-bold bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Fichiers (Drag & Drop)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'url' ? (
            <form onSubmit={handleUrlSubmit} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/30 text-indigo-300 space-y-1 text-xs">
                <div className="font-semibold flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Détection automatique de vos liens :</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Collez un lien <strong>Loom</strong> (vidéo d'explication), <strong>Leexi.ai</strong> (compte-rendu de réunion) ou <strong>Google Drive</strong> pour extraire les métadonnées et alimenter l'Agent Chef de Projet.
                </p>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  URL du média ou de la réunion
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://www.loom.com/share/... ou https://app.leexi.ai/... ou https://drive.google.com/..."
                  value={urlInput}
                  onChange={(e) => handleDetectUrl(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">
                    Titre du document généré
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex : Loom - Sécuriser ton agent IA"
                    value={urlTitle}
                    onChange={(e) => setUrlTitle(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">
                    Type de document
                  </label>
                  <select
                    value={urlType}
                    onChange={(e: any) => setUrlType(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="cr_reunion">Compte-rendu de réunion / Leexi</option>
                    <option value="specs">Spécifications / Transcription Loom</option>
                    <option value="note_cadrage">Note de cadrage / Support Drive</option>
                    <option value="cahier_des_charges">Cahier des charges</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  Contenu textuel & Synthèse extraite
                </label>
                <textarea
                  rows={8}
                  required
                  placeholder="Résumé, transcription, relevé de décisions ou notes de la vidéo..."
                  value={urlNotes}
                  onChange={(e) => setUrlNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white font-mono text-xs focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 text-white font-semibold flex items-center space-x-1.5 shadow-md shadow-indigo-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Injecter au dossier du projet</span>
                </button>
              </div>
            </form>
          ) : activeTab === 'paste' ? (
            <form onSubmit={handlePasteSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">
                    Nom du document
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex : Cahier_des_charges_v1.md"
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">
                    Type de document
                  </label>
                  <select
                    value={docType}
                    onChange={(e: any) => setDocType(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="cahier_des_charges">Cahier des charges / Brief</option>
                    <option value="cr_reunion">Compte-rendu de réunion / COPIL</option>
                    <option value="specs">Spécifications techniques / UX</option>
                    <option value="note_cadrage">Note de cadrage / Charte</option>
                    <option value="contrat">Contrat / Devis / SLA</option>
                    <option value="autre">Autre document</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  Contenu textuel du document
                </label>
                <textarea
                  rows={8}
                  required
                  placeholder="Collez ici le texte de votre document..."
                  value={docContent}
                  onChange={(e) => setDocContent(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white font-mono text-xs focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 text-white font-semibold flex items-center space-x-1.5 shadow-md shadow-indigo-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Enregistrer le document</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  handleFileUpload(e.dataTransfer.files);
                }}
                className={`border-2 border-dashed rounded-2xl p-10 text-center transition flex flex-col items-center justify-center space-y-3 ${
                  dragOver
                    ? 'border-indigo-400 bg-indigo-500/10'
                    : 'border-slate-700 bg-slate-800/40 hover:border-slate-600'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">
                    Glissez-déposez votre fichier ici
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Prend en charge les formats .txt, .md, .json, .csv ou tout document exporté
                  </p>
                </div>

                <label className="cursor-pointer px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition inline-flex items-center space-x-1.5">
                  <FolderOpen className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Parcourir mes fichiers</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />
                </label>
              </div>

              {importedFileMessage && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs text-center flex items-center justify-center space-x-2">
                  <Check className="w-4 h-4" />
                  <span>{importedFileMessage}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
