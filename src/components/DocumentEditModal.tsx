import React, { useState } from 'react';
import { 
  X, 
  Save, 
  FileText, 
  Eye, 
  Edit3, 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  List, 
  CheckSquare, 
  Table, 
  Code, 
  Sparkles,
  Tag,
  Clock,
  Layers,
  Check
} from 'lucide-react';
import { ProjectDocument } from '../types/project';

interface DocumentEditModalProps {
  document: ProjectDocument | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (doc: ProjectDocument) => void;
}

const TEMPLATES = [
  {
    name: 'Cahier des Charges & Cadrage Métier',
    type: 'cahier_des_charges' as const,
    tags: ['Cahier des charges', 'Cadrage', 'Périmètre', 'Objectifs'],
    content: `# CAHIER DES CHARGES : [TITRE DU PROJET]

## 1. Contexte & Objectifs Stratégiques
- **Contexte :** Description des enjeux métiers et de la situation actuelle.
- **Objectif Principal :** Ce que le projet doit accomplir concrètement.
- **Indicateurs de Succès (KPIs) :**
  - KPI 1 : [ex: +30% d'efficacité opérationnelle]
  - KPI 2 : [ex: Temps de traitement réduit sous 5 min]

## 2. Périmètre (Scope)
### In-Scope :
- [x] Livrable 1 : Spécifications et maquettes validées
- [x] Livrable 2 : Déploiement backend sécurisé avec authentification
- [x] Livrable 3 : Documentation et recette fonctionnelle

### Out-of-Scope :
- [ ] Fonctionnalité reportée en phase ultérieure
- [ ] Migration des archives historiques non prioritaires

## 3. Exigences & Contraintes
- **Sécurité & RGPD :** Chiffrement des données sensibles et conformité légale.
- **Performance :** Temps de réponse sous 2 secondes.
- **Budget & Délais :** Mise en production cible le [Date].`
  },
  {
    name: 'Compte-Rendu de Réunion & Relevé de Décisions',
    type: 'cr_reunion' as const,
    tags: ['COPIL', 'Compte-rendu', 'Décisions', 'Plan d\'actions'],
    content: `# COMPTE-RENDU DE RÉUNION / COMITÉ DE PILOTAGE (COPIL)

**Date :** ${new Date().toLocaleDateString('fr-FR')}  
**Participants :** Chef de Projet, Product Owner, Lead Tech, Sponsor Métier  
**Ordre du Jour :** Avancement des jalons, arbitrage budgétaire et recette  

## 1. Faits Marquants & État d'Avancement
- Avancement global conforme à la trajectoire cible.
- Risques résiduels sous contrôle avec plans de mitigation validés.

## 2. Relevé de Décisions Fermes
1. **Décision D-01 :** Validation du passage en phase de recette utilisateur.
2. **Décision D-02 :** Priorisation de l'export PDF corporate pour les parties prenantes.

## 3. Plan d'Actions & Prochaines Échéances
- [ ] **Action 1 :** Finaliser les cas de test bloquants (Assigné : QA Lead - Échéance : J+3)
- [ ] **Action 2 :** Valider l'avenant budgétaire en comité financier (Assigné : CDP - Échéance : J+5)`
  },
  {
    name: 'Spécifications Fonctionnelles Détaillées (SFD)',
    type: 'specs' as const,
    tags: ['Spécifications', 'Règles Métier', 'INVEST', 'User Stories'],
    content: `# SPÉCIFICATIONS FONCTIONNELLES DÉTAILLÉES (SFD)

## Module 1 : Authentification & Sécurité
- **Règle de gestion RG-01 :** Seuls les utilisateurs authentifiés peuvent accéder aux données du projet.
- **User Story :** En tant que Chef de Projet, je veux exporter un rapport consolidé afin d'informer mes parties prenantes.
- **Critères d'Acceptation (Given/When/Then) :**
  - Given un audit projet validé,
  - When je clique sur "Exporter en PDF",
  - Then un document PDF complet est téléchargé sans altération des métriques.`
  }
];

export const DocumentEditModal: React.FC<DocumentEditModalProps> = ({
  document,
  isOpen,
  onClose,
  onSave
}) => {
  if (!isOpen) return null;

  const isNew = !document;

  const [name, setName] = useState(document ? document.name : 'Nouveau_Document_Projet.md');
  const [type, setType] = useState<ProjectDocument['type']>(document ? document.type : 'cahier_des_charges');
  const [fileFormat, setFileFormat] = useState(document ? document.fileFormat : 'Markdown');
  const [tagsInput, setTagsInput] = useState(document ? document.tags.join(', ') : 'Cadrage, Métier');
  const [content, setContent] = useState(document ? document.content : TEMPLATES[0].content);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [justSaved, setJustSaved] = useState(false);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const charCount = content.length;

  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = window.document.getElementById('doc-editor-textarea') as HTMLTextAreaElement | null;
    if (!textarea) {
      setContent(prev => prev + '\n' + prefix + suffix);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const replacement = prefix + (selectedText || 'Texte') + suffix;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selectedText ? selectedText.length : 5));
    }, 50);
  };

  const handleApplyTemplate = (tmpl: typeof TEMPLATES[0]) => {
    setContent(tmpl.content);
    setType(tmpl.type);
    setTagsInput(tmpl.tags.join(', '));
    if (isNew) {
      setName(`${tmpl.name.replace(/[^a-zA-Z0-9]/g, '_')}.md`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const docSize = `${(content.length / 1024).toFixed(1)} Ko`;

    const updatedDoc: ProjectDocument = {
      id: document ? document.id : `doc-${Date.now()}`,
      name: name.trim(),
      type,
      fileFormat: fileFormat.trim() || 'Markdown',
      size: docSize,
      content,
      dateAdded: document ? document.dateAdded : new Date().toISOString().slice(0, 10),
      active: document ? document.active : true,
      tags: tags.length > 0 ? tags : ['Général']
    };

    onSave(updatedDoc);
    setJustSaved(true);
    setTimeout(() => {
      setJustSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <span>{isNew ? 'Créer un Nouveau Document Projet' : `Édition : ${name}`}</span>
              </h2>
              <p className="text-xs text-slate-400">
                {wordCount} mots • {charCount} caractères • Format {fileFormat}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Templates Banner if creating new doc */}
        {isNew && (
          <div className="px-6 py-3 bg-slate-950 border-b border-slate-800 flex items-center space-x-3 overflow-x-auto text-xs">
            <span className="text-slate-400 font-semibold whitespace-nowrap flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Modèles types :</span>
            </span>
            {TEMPLATES.map((tmpl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyTemplate(tmpl)}
                className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 whitespace-nowrap font-medium transition"
              >
                {tmpl.name}
              </button>
            ))}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          {/* Metadata Controls */}
          <div className="p-5 border-b border-slate-800 bg-slate-900/40 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nom du Document</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-indigo-500 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Type de Document</label>
              <select
                value={type}
                onChange={(e: any) => setType(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none"
              >
                <option value="cahier_des_charges">Cahier des charges / Cadrage</option>
                <option value="cr_reunion">Compte-rendu de réunion (CR)</option>
                <option value="specs">Spécifications techniques / SFD</option>
                <option value="note_cadrage">Note de cadrage</option>
                <option value="contrat">Contrat / Convention</option>
                <option value="autre">Autre document</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Tags (séparés par des virgules)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Ex: Cadrage, Specs, Validé"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Editor / Preview Toolbar */}
          <div className="px-5 py-2 border-b border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-1 text-slate-400">
              <button
                type="button"
                onClick={() => insertFormatting('**', '**')}
                className="p-1.5 hover:text-white hover:bg-slate-800 rounded transition"
                title="Gras (**texte**)"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('*', '*')}
                className="p-1.5 hover:text-white hover:bg-slate-800 rounded transition"
                title="Italique (*texte*)"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <span className="w-px h-4 bg-slate-800 mx-1" />
              <button
                type="button"
                onClick={() => insertFormatting('# ')}
                className="p-1.5 hover:text-white hover:bg-slate-800 rounded transition"
                title="Titre 1 (# )"
              >
                <Heading1 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('## ')}
                className="p-1.5 hover:text-white hover:bg-slate-800 rounded transition"
                title="Titre 2 (## )"
              >
                <Heading2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('- ')}
                className="p-1.5 hover:text-white hover:bg-slate-800 rounded transition"
                title="Liste à puces"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('- [ ] ')}
                className="p-1.5 hover:text-white hover:bg-slate-800 rounded transition"
                title="Case à cocher"
              >
                <CheckSquare className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('| Colonne 1 | Colonne 2 |\n|---|---|\n| Valeur 1 | Valeur 2 |')}
                className="p-1.5 hover:text-white hover:bg-slate-800 rounded transition"
                title="Tableau Markdown"
              >
                <Table className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('```\n', '\n```')}
                className="p-1.5 hover:text-white hover:bg-slate-800 rounded transition"
                title="Bloc de code"
              >
                <Code className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className={`px-2.5 py-1 rounded-md transition font-medium ${
                  activeTab === 'editor' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Mode Édition
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-2.5 py-1 rounded-md transition font-medium ${
                  activeTab === 'preview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Aperçu
              </button>
            </div>
          </div>

          {/* Editor & Preview Area */}
          <div className="flex-1 min-h-[360px] p-4 bg-slate-950 overflow-y-auto font-mono text-xs text-slate-200">
            {activeTab === 'editor' ? (
              <textarea
                id="doc-editor-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Rédigez ou collez le contenu du document ici..."
                className="w-full h-full min-h-[340px] bg-transparent text-slate-200 leading-relaxed resize-none focus:outline-none"
              />
            ) : (
              <div className="prose prose-invert max-w-none text-slate-200 font-sans space-y-3 whitespace-pre-wrap">
                {content || <span className="text-slate-500 italic">Aucun contenu à afficher.</span>}
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Les modifications seront directement prises en compte dans le diagnostic de l'Agent IA.
            </span>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition"
              >
                Annuler
              </button>

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md shadow-indigo-600/20 transition active:scale-95"
              >
                {justSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
                <span>{justSaved ? 'Enregistré !' : 'Enregistrer le Document'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
