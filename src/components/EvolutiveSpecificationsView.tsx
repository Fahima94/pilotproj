import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Download, 
  Copy, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Save, 
  BookOpen, 
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  History,
  FileDown
} from 'lucide-react';
import { EvolutiveSpec, ChangeRequest, ProjectAudit, ProjectDocument } from '../types/project';
import jsPDF from 'jspdf';

interface EvolutiveSpecificationsViewProps {
  audit: ProjectAudit;
  documents: ProjectDocument[];
  onSaveToDocuments?: (newDoc: ProjectDocument) => void;
  onAskAgent?: (prompt: string, skill?: string) => void;
}

const INITIAL_SPEC: EvolutiveSpec = {
  version: 'v1.3 (Évolutive)',
  lastUpdated: '2026-10-12',
  status: 'Validé COPIL',
  contextVision: 'Moderniser les flux opérationnels et déployer des capacités d\'assistance IA sécurisées, avec contrôle strict du budget de tokens, traçabilité des décisions et zéro-trust sur les données sensibles.',
  inScope: [
    'Console unifiée de pilotage 360° (Sécurité, RGPD, Finance, Planning, QA)',
    'Module de Recette & Plan de tests avec décision de mise en production (GO / NO-GO)',
    'Éditeur dynamique de Cahier des Charges Évolutif avec gestion des Change Requests',
    'Export PDF des rapports COPIL et procès-verbaux de recette',
    'Génération de SKILL.md et tickets INVEST automatisés'
  ],
  outScope: [
    'Refonte intégrale de l\'infrastructure cloud legacy (Phase 2)',
    'Application native iOS/Android pour les testeurs terrain (PWA suffisante en v1)',
    'Entraînement de modèles fondation propriétaires en interne'
  ],
  functionalRequirements: [
    {
      id: 'EX-01',
      module: 'Gouvernance & Sécurité',
      description: 'Isolation totale des clés API serveur et filtrage anti-prompt injection.',
      acceptanceCriteria: 'Given une requête utilisateur, When elle est transmise, Then aucune clé n\'est lisible côté client et le proxy backend valide les entêtes.',
      priority: 'Must Have'
    },
    {
      id: 'EX-02',
      module: 'QA & Recette',
      description: 'Suivi de l\'exécution des cas de tests et génération automatique du PV de recette.',
      acceptanceCriteria: 'Given 1 test bloquant échoué, When le rapport est généré, Then le statut affiche un NO-GO strict.',
      priority: 'Must Have'
    },
    {
      id: 'EX-03',
      module: 'Édition Documentaire',
      description: 'Éditeur de documents en ligne avec support Markdown et création de documents vierges.',
      acceptanceCriteria: 'Given un document existant, When l\'utilisateur le modifie, Then la mise à jour est immédiatement sauvegardée.',
      priority: 'Must Have'
    },
    {
      id: 'EX-04',
      module: 'Gestion des Évolutions',
      description: 'Registre des demandes d\'avenants (Change Requests) avec chiffrage d\'impact délai/coût.',
      acceptanceCriteria: 'Given une demande de sponsor, When la CR est créée, Then son impact j/h est tracé avant validation COPIL.',
      priority: 'Should Have'
    }
  ],
  nonFunctionalRequirements: [
    {
      category: 'Disponibilité & SLA',
      requirement: 'Taux de disponibilité mensuel du service',
      targetMetric: '>= 99.8%'
    },
    {
      category: 'Performance & Latence',
      requirement: 'Temps de génération des rapports et exports PDF',
      targetMetric: '< 2.0 secondes'
    },
    {
      category: 'Conformité RGPD',
      requirement: 'Délai d\'exécution des demandes de droit à l\'oubli et purge des données',
      targetMetric: '< 24 heures'
    },
    {
      category: 'Sécurité Applicative',
      requirement: 'Zéro faille critique au scan SAST/DAST & OWASP Top 10',
      targetMetric: '0 vulnérabilité Bloquante'
    }
  ],
  changeRequests: [
    {
      id: 'cr-01',
      code: 'CR-01',
      title: 'Ajout de la grille de validation GO/NO-GO au PV de recette',
      requester: 'Directeur de Projet & Sponsor Métier',
      date: '2026-10-10',
      description: 'Automatiser le calcul de la décision de release en fonction des tests bloquants.',
      businessImpact: 'Sécurise le déploiement en production et élimine le risque d\'erreur humaine.',
      costImpact: '+1.5 j/h dev',
      status: 'Validé COPIL',
      scopeChange: 'In-Scope'
    },
    {
      id: 'cr-02',
      code: 'CR-02',
      title: 'Mode sombre optimisé et export PDF téléchargeable',
      requester: 'Comité de Direction',
      date: '2026-10-11',
      description: 'Permettre aux parties prenantes de partager un livrable PDF corporate.',
      businessImpact: 'Facilite le reporting auprès des comités d\'engagement.',
      costImpact: '+1 j/h dev',
      status: 'Validé COPIL',
      scopeChange: 'In-Scope'
    }
  ]
};

export const EvolutiveSpecificationsView: React.FC<EvolutiveSpecificationsViewProps> = ({
  audit,
  documents,
  onSaveToDocuments,
  onAskAgent
}) => {
  const [spec, setSpec] = useState<EvolutiveSpec>(INITIAL_SPEC);
  const [activeTab, setActiveTab] = useState<'overview' | 'requirements' | 'scope' | 'cr' | 'history'>('overview');
  const [isEditingVision, setIsEditingVision] = useState(false);
  const [visionText, setVisionText] = useState(spec.contextVision);
  const [newInScopeText, setNewInScopeText] = useState('');
  const [newOutScopeText, setNewOutScopeText] = useState('');
  const [showAddCrModal, setShowAddCrModal] = useState(false);
  const [showAddReqModal, setShowAddReqModal] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New CR state
  const [crTitle, setCrTitle] = useState('');
  const [crRequester, setCrRequester] = useState('');
  const [crDesc, setCrDesc] = useState('');
  const [crBusinessImpact, setCrBusinessImpact] = useState('');
  const [crCostImpact, setCrCostImpact] = useState('');
  const [crStatus, setCrStatus] = useState<ChangeRequest['status']>('Proposé');

  // New Req state
  const [reqModule, setReqModule] = useState('Général');
  const [reqDesc, setReqDesc] = useState('');
  const [reqCriteria, setReqCriteria] = useState('');
  const [reqPriority, setReqPriority] = useState<EvolutiveSpec['functionalRequirements'][0]['priority']>('Must Have');

  const handleSaveVision = () => {
    setSpec(prev => ({
      ...prev,
      contextVision: visionText,
      lastUpdated: new Date().toISOString().slice(0, 10)
    }));
    setIsEditingVision(false);
  };

  const handleAddInScope = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInScopeText.trim()) return;
    setSpec(prev => ({
      ...prev,
      inScope: [...prev.inScope, newInScopeText.trim()],
      lastUpdated: new Date().toISOString().slice(0, 10)
    }));
    setNewInScopeText('');
  };

  const handleRemoveInScope = (index: number) => {
    setSpec(prev => ({
      ...prev,
      inScope: prev.inScope.filter((_, i) => i !== index),
      lastUpdated: new Date().toISOString().slice(0, 10)
    }));
  };

  const handleAddOutScope = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOutScopeText.trim()) return;
    setSpec(prev => ({
      ...prev,
      outScope: [...prev.outScope, newOutScopeText.trim()],
      lastUpdated: new Date().toISOString().slice(0, 10)
    }));
    setNewOutScopeText('');
  };

  const handleRemoveOutScope = (index: number) => {
    setSpec(prev => ({
      ...prev,
      outScope: prev.outScope.filter((_, i) => i !== index),
      lastUpdated: new Date().toISOString().slice(0, 10)
    }));
  };

  const handleAddChangeRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crTitle.trim()) return;

    const newCr: ChangeRequest = {
      id: `cr-${Date.now()}`,
      code: `CR-0${spec.changeRequests.length + 1}`,
      title: crTitle.trim(),
      requester: crRequester.trim() || 'Partie Prenante Métier',
      date: new Date().toISOString().slice(0, 10),
      description: crDesc.trim(),
      businessImpact: crBusinessImpact.trim() || 'Amélioration opérationnelle.',
      costImpact: crCostImpact.trim() || '+0 j/h (iso-périmètre)',
      status: crStatus,
      scopeChange: 'In-Scope'
    };

    setSpec(prev => ({
      ...prev,
      changeRequests: [newCr, ...prev.changeRequests],
      lastUpdated: new Date().toISOString().slice(0, 10)
    }));

    setShowAddCrModal(false);
    setCrTitle('');
    setCrRequester('');
    setCrDesc('');
    setCrBusinessImpact('');
    setCrCostImpact('');
  };

  const handleAddRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqDesc.trim()) return;

    const newReq = {
      id: `EX-0${spec.functionalRequirements.length + 1}`,
      module: reqModule.trim() || 'Module Métier',
      description: reqDesc.trim(),
      acceptanceCriteria: reqCriteria.trim() || 'Comportement validé en recette.',
      priority: reqPriority
    };

    setSpec(prev => ({
      ...prev,
      functionalRequirements: [...prev.functionalRequirements, newReq],
      lastUpdated: new Date().toISOString().slice(0, 10)
    }));

    setShowAddReqModal(false);
    setReqDesc('');
    setReqCriteria('');
  };

  const generateMarkdownSpecs = () => {
    let md = `# CAHIER DES CHARGES ÉVOLUTIF (LIVING SPECIFICATIONS)\n`;
    md += `**Projet :** ${audit.projectTitle}\n`;
    md += `**Version :** ${spec.version}  |  **Statut :** ${spec.status}  |  **Dernière mise à jour :** ${spec.lastUpdated}\n\n`;
    md += `## 1. Vision & Contexte Stratégique\n${spec.contextVision}\n\n`;
    md += `## 2. Périmètre (Scope)\n### In-Scope :\n`;
    spec.inScope.forEach(item => { md += `- [x] ${item}\n`; });
    md += `\n### Out-of-Scope (Exclusions) :\n`;
    spec.outScope.forEach(item => { md += `- [ ] ${item}\n`; });
    md += `\n## 3. Exigences Fonctionnelles & Règles Métier\n`;
    spec.functionalRequirements.forEach(req => {
      md += `### ${req.id} - ${req.module} [${req.priority}]\n`;
      md += `**Exigence :** ${req.description}\n`;
      md += `**Critères d'Acceptation :** ${req.acceptanceCriteria}\n\n`;
    });
    md += `## 4. Exigences Non-Fonctionnelles & Sécurité\n`;
    spec.nonFunctionalRequirements.forEach(nf => {
      md += `- **${nf.category} :** ${nf.requirement} *(Cible : ${nf.targetMetric})*\n`;
    });
    md += `\n## 5. Registre des Demandes de Changement (Change Requests / Avenants)\n`;
    spec.changeRequests.forEach(cr => {
      md += `### ${cr.code} : ${cr.title} (${cr.status})\n`;
      md += `- Demandeur : ${cr.requester} (${cr.date})\n`;
      md += `- Description : ${cr.description}\n`;
      md += `- Impact Métier & Coût : ${cr.businessImpact} | ${cr.costImpact}\n\n`;
    });
    return md;
  };

  const handleCopyMarkdown = () => {
    const md = generateMarkdownSpecs();
    navigator.clipboard.writeText(md);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleSaveToProjectDocuments = () => {
    if (!onSaveToDocuments) return;
    const md = generateMarkdownSpecs();
    const newDoc: ProjectDocument = {
      id: `doc-spec-evolutive-${Date.now()}`,
      name: `Cahier_des_Charges_Evolutif_${spec.version.replace(/[^a-zA-Z0-9]/g, '_')}.md`,
      type: 'cahier_des_charges',
      fileFormat: 'Markdown',
      size: `${(md.length / 1024).toFixed(1)} Ko`,
      content: md,
      dateAdded: new Date().toISOString().slice(0, 10),
      active: true,
      tags: ['Cahier des charges', 'Évolutif', 'Specs', 'Validé']
    };
    onSaveToDocuments(newDoc);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportPdf = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 16;
    let y = 18;

    // Header
    doc.setFillColor(30, 41, 59);
    doc.rect(0, 0, pageWidth, 28, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(255, 255, 255);
    doc.text('CAHIER DES CHARGES ÉVOLUTIF & REGISTRE DES AVENANTS', margin, 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Projet : ${audit.projectTitle}  |  Version : ${spec.version}  |  Statut : ${spec.status}`, margin, 20);

    y = 36;

    // Vision
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('1. VISION ET OBJECTIFS STRATÉGIQUES DU PROJET', margin, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    const visionLines = doc.splitTextToSize(spec.contextVision, pageWidth - 2 * margin);
    doc.text(visionLines, margin, y);
    y += visionLines.length * 4 + 6;

    // Scope
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('2. PÉRIMÈTRE VALIDE (IN-SCOPE & EXCLUSIONS)', margin, y);
    y += 5;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(5, 150, 105);
    doc.text('In-Scope :', margin, y);
    y += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    spec.inScope.forEach(item => {
      doc.text(`• ${item}`, margin + 3, y);
      y += 4;
    });
    y += 2;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(225, 29, 72);
    doc.text('Exclusions formelles (Out-of-Scope) :', margin, y);
    y += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    spec.outScope.forEach(item => {
      doc.text(`• ${item}`, margin + 3, y);
      y += 4;
    });
    y += 6;

    // Change Requests
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('3. REGISTRE DES DEMANDES DE CHANGEMENT (CHANGE REQUESTS / AVENANTS)', margin, y);
    y += 6;

    spec.changeRequests.forEach(cr => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }

      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, pageWidth - 2 * margin, 18, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`${cr.code} : ${cr.title} [${cr.status}]`, margin + 3, y + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text(`Demandeur : ${cr.requester} (${cr.date})  |  Impact Coût/Délai : ${cr.costImpact}`, margin + 3, y + 10);
      doc.text(`Impact Métier : ${cr.businessImpact.slice(0, 100)}`, margin + 3, y + 14);

      y += 22;
    });

    const filename = `Cahier_des_Charges_Evolutif_${audit.projectTitle.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20)}.pdf`;
    doc.save(filename);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Cahier des Charges Évolutif (Living Specs)</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                {spec.status}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {spec.version}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Spécifications Évolutives & Registre des Avenants
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Dans un projet réel, le besoin et les contraintes s'ajustent au fil des sprints. Ce module permet de maintenir le cahier des charges vivant, d'arbitrer les demandes de changement (Change Requests) et de tracer les impacts budgétaires et techniques avant validation COPIL.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportPdf}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center space-x-1.5 transition"
            >
              <FileDown className="w-4 h-4 text-indigo-400" />
              <span>Exporter PDF</span>
            </button>

            <button
              onClick={handleCopyMarkdown}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center space-x-1.5 transition"
            >
              {copiedMd ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copiedMd ? 'Copié !' : 'Copier Markdown'}</span>
            </button>

            {onSaveToDocuments && (
              <button
                onClick={handleSaveToProjectDocuments}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md shadow-indigo-600/20 transition"
              >
                {savedSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
                <span>{savedSuccess ? 'Enregistré dans Documents !' : 'Enregistrer dans Projet'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="flex space-x-2 overflow-x-auto pt-5 border-t border-slate-800 mt-5 scrollbar-none text-xs font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'overview' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Vision & Objectifs
          </button>
          <button
            onClick={() => setActiveTab('scope')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'scope' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Périmètre In/Out Scope ({spec.inScope.length + spec.outScope.length})
          </button>
          <button
            onClick={() => setActiveTab('requirements')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'requirements' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Exigences Fonctionnelles ({spec.functionalRequirements.length})
          </button>
          <button
            onClick={() => setActiveTab('cr')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
              activeTab === 'cr' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            <span>Demandes d'Avenants / CR ({spec.changeRequests.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
              activeTab === 'history' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span>Historique & Non-Fonctionnel</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Vision & Objectifs */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Vision Stratégique & Contexte du Projet</span>
              </h2>

              {!isEditingVision ? (
                <button
                  onClick={() => setIsEditingVision(true)}
                  className="px-2.5 py-1 rounded text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1"
                >
                  <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Modifier la vision</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsEditingVision(false)}
                    className="px-2.5 py-1 rounded text-xs font-medium bg-slate-800 text-slate-400 hover:text-white"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSaveVision}
                    className="px-2.5 py-1 rounded text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center space-x-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Sauvegarder</span>
                  </button>
                </div>
              )}
            </div>

            {!isEditingVision ? (
              <p className="text-slate-300 text-sm leading-relaxed p-4 bg-slate-950/60 rounded-xl border border-slate-800/80">
                {spec.contextVision}
              </p>
            ) : (
              <textarea
                rows={4}
                value={visionText}
                onChange={(e) => setVisionText(e.target.value)}
                className="w-full bg-slate-950 border border-indigo-500/50 rounded-xl p-3 text-sm text-white focus:outline-none"
              />
            )}
          </div>

          {/* Quick Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Périmètre In-Scope</span>
              <div className="text-xl font-bold text-emerald-400">{spec.inScope.length} livrables validés</div>
              <p className="text-xs text-slate-400">Garantit la clarté des engagements contractuels et techniques.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Exigences Métier (MoSCoW)</span>
              <div className="text-xl font-bold text-indigo-400">{spec.functionalRequirements.length} exigences tracées</div>
              <p className="text-xs text-slate-400">Critères d'acceptation alignés avec la recette et la QA.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Change Requests (Avenants)</span>
              <div className="text-xl font-bold text-amber-400">{spec.changeRequests.length} demandes arbitrées</div>
              <p className="text-xs text-slate-400">Traçabilité complète des évolutions validées en COPIL.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Scope In/Out */}
      {activeTab === 'scope' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* In-Scope Box */}
          <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-emerald-400 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Périmètre Inclus (In-Scope)</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {spec.inScope.length} éléments
              </span>
            </div>

            <form onSubmit={handleAddInScope} className="flex gap-2">
              <input
                type="text"
                value={newInScopeText}
                onChange={(e) => setNewInScopeText(e.target.value)}
                placeholder="Ajouter un livrable in-scope..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
              >
                Ajouter
              </button>
            </form>

            <div className="space-y-2">
              {spec.inScope.map((item, idx) => (
                <div key={idx} className="flex items-start justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-200">
                  <div className="flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{item}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveInScope(idx)}
                    className="text-slate-500 hover:text-rose-400 ml-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Out-of-Scope Box */}
          <div className="bg-slate-900 border border-rose-500/30 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-rose-400 flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Exclusions Formelles (Out-of-Scope)</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {spec.outScope.length} exclusions
              </span>
            </div>

            <form onSubmit={handleAddOutScope} className="flex gap-2">
              <input
                type="text"
                value={newOutScopeText}
                onChange={(e) => setNewOutScopeText(e.target.value)}
                placeholder="Ajouter une exclusion formelle..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
              >
                Ajouter
              </button>
            </form>

            <div className="space-y-2">
              {spec.outScope.map((item, idx) => (
                <div key={idx} className="flex items-start justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300">
                  <div className="flex items-start space-x-2">
                    <span className="text-rose-400 font-bold">✕</span>
                    <span>{item}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveOutScope(idx)}
                    className="text-slate-500 hover:text-rose-400 ml-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Requirements */}
      {activeTab === 'requirements' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Matrice des Exigences Fonctionnelles & Critères d'Acceptation</span>
            </h2>

            <button
              onClick={() => setShowAddReqModal(true)}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nouvelle Exigence</span>
            </button>
          </div>

          <div className="space-y-3">
            {spec.functionalRequirements.map((req) => (
              <div key={req.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-xs text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30">
                      {req.id}
                    </span>
                    <span className="text-xs font-semibold text-slate-300">
                      {req.module}
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    req.priority === 'Must Have' 
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : req.priority === 'Should Have'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {req.priority}
                  </span>
                </div>

                <p className="text-sm font-medium text-white">
                  {req.description}
                </p>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <span className="font-semibold text-slate-400 text-[10px] uppercase">Critères d'Acceptation (Given / When / Then) :</span>
                  <p>{req.acceptanceCriteria}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Change Requests */}
      {activeTab === 'cr' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <span>Registre des Demandes de Changement (Change Requests / Avenants)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Arbitrage des demandes d'évolutions, impacts budgétaires et modifications de calendrier.
              </p>
            </div>

            <button
              onClick={() => setShowAddCrModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Proposer un Avenant (CR)</span>
            </button>
          </div>

          <div className="space-y-3">
            {spec.changeRequests.map((cr) => (
              <div key={cr.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-xs text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                      {cr.code}
                    </span>
                    <h3 className="text-sm font-bold text-white">{cr.title}</h3>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    cr.status === 'Validé COPIL'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : cr.status === 'Rejeté'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}>
                    {cr.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300">
                  {cr.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[11px]">
                  <div>
                    <span className="text-slate-400">Demandeur :</span>{' '}
                    <strong className="text-slate-200">{cr.requester} ({cr.date})</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Impact Métier :</span>{' '}
                    <strong className="text-slate-200">{cr.businessImpact}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Impact Coût/Délai :</span>{' '}
                    <strong className="text-amber-400">{cr.costImpact}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: History & Non-Functional */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Exigences Non-Fonctionnelles & Critères de Qualité</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {spec.nonFunctionalRequirements.map((nf, idx) => (
                <div key={idx} className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-400">{nf.category}</span>
                    <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                      {nf.targetMetric}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{nf.requirement}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Add CR */}
      {showAddCrModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <span>Proposer une Demande de Changement (Change Request)</span>
            </h2>

            <form onSubmit={handleAddChangeRequest} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Titre de l'Avenant / Évolution</label>
                <input
                  type="text"
                  required
                  value={crTitle}
                  onChange={(e) => setCrTitle(e.target.value)}
                  placeholder="Ex: Intégration d'un module de signature électronique"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Demandeur</label>
                  <input
                    type="text"
                    value={crRequester}
                    onChange={(e) => setCrRequester(e.target.value)}
                    placeholder="Ex: Direction Juridique / Sponsor"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Statut Initial</label>
                  <select
                    value={crStatus}
                    onChange={(e: any) => setCrStatus(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="Proposé">Proposé</option>
                    <option value="Validé COPIL">Validé COPIL</option>
                    <option value="En cours d'implémentation">En cours d'implémentation</option>
                    <option value="Rejeté">Rejeté</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description & Justification</label>
                <textarea
                  rows={3}
                  value={crDesc}
                  onChange={(e) => setCrDesc(e.target.value)}
                  placeholder="Expliquer la raison de la modification et le besoin opérationnel..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Impact Métier</label>
                  <input
                    type="text"
                    value={crBusinessImpact}
                    onChange={(e) => setCrBusinessImpact(e.target.value)}
                    placeholder="Ex: Accélère le closing client de 20%"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Impact Coût / Délais</label>
                  <input
                    type="text"
                    value={crCostImpact}
                    onChange={(e) => setCrCostImpact(e.target.value)}
                    placeholder="Ex: +2 j/h dev ou Décalage de 4 jours"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddCrModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold"
                >
                  Enregistrer la CR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Requirement */}
      {showAddReqModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Plus className="w-5 h-5 text-indigo-400" />
              <span>Ajouter une Exigence au Cahier des Charges</span>
            </h2>

            <form onSubmit={handleAddRequirement} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Module / Domaine</label>
                  <input
                    type="text"
                    value={reqModule}
                    onChange={(e) => setReqModule(e.target.value)}
                    placeholder="Ex: Sécurité, Facturation, IHM"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Priorité MoSCoW</label>
                  <select
                    value={reqPriority}
                    onChange={(e: any) => setReqPriority(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="Must Have">Must Have (Indispensable)</option>
                    <option value="Should Have">Should Have (Fortement souhaité)</option>
                    <option value="Could Have">Could Have (Optionnel)</option>
                    <option value="Won't Have">Won't Have (Reporté)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description de l'Exigence</label>
                <textarea
                  rows={3}
                  required
                  value={reqDesc}
                  onChange={(e) => setReqDesc(e.target.value)}
                  placeholder="Ex: Le système doit chiffrer les tokens en transit et au repos..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Critères d'Acceptation (Given / When / Then)</label>
                <textarea
                  rows={2}
                  value={reqCriteria}
                  onChange={(e) => setReqCriteria(e.target.value)}
                  placeholder="Given..., When..., Then..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddReqModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                >
                  Ajouter l'Exigence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
