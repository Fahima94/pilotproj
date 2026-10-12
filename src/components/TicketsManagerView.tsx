import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Sparkles, 
  Filter, 
  Download, 
  Copy, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Tag,
  Clock,
  Layers,
  FileCode,
  CheckCircle2,
  Trash2,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import { ProjectAudit, ProjectDocument } from '../types/project';

export interface ProjectTicket {
  id: string;
  title: string;
  type: 'story' | 'task' | 'bug' | 'spike';
  priority: 'Must Have' | 'Should Have' | 'Could Have' | 'Won\'t Have';
  status: 'Backlog' | 'En cours' | 'A tester' | 'Terminé';
  points: number;
  persona: string;
  userStory: string;
  acceptanceCriteria: string[];
  securityGuardrails: string;
  assignee?: string;
}

interface TicketsManagerViewProps {
  audit: ProjectAudit;
  documents: ProjectDocument[];
  onAskAgent: (prompt: string, skill?: string) => void;
  tickets?: ProjectTicket[];
  onUpdateTickets?: (tickets: ProjectTicket[]) => void;
  onNavigateTab?: (tab: string) => void;
}

export const DEFAULT_TICKETS: ProjectTicket[] = [
  {
    id: 'TICK-001',
    title: 'Mise en place du Proxy Serveur Sécurisé pour les APIs LLM',
    type: 'task',
    priority: 'Must Have',
    status: 'Terminé',
    points: 3,
    persona: 'Lead Architecte & Développeur Backend',
    userStory: 'En tant que Lead Architecte, je veux encapsuler les appels d’inférence LLM dans des routes Express privées (/api/*) afin d’interdire toute exposition de clé API côté bundle client.',
    acceptanceCriteria: [
      'GIVEN un client web appelant l\'assistant, WHEN la requête est émise, THEN aucune clé secrète n\'apparaît dans les en-têtes réseau client ni dans le code JS compilé.',
      'GIVEN une tentative d\'appel sans token de session, WHEN la requête frappe /api/pm/chat, THEN le serveur retourne une erreur 401 Unauthorized.',
    ],
    securityGuardrails: 'Zéro-Trust : Clés chargées depuis process.env uniquement côté serveur Node.js.',
    assignee: 'Lead Tech',
  },
  {
    id: 'TICK-002',
    title: 'Filtrage des Prompts & Guardrails Anti-Injection',
    type: 'story',
    priority: 'Must Have',
    status: 'Terminé',
    points: 5,
    persona: 'Chef de Projet & Ingénieur Sécurité',
    userStory: 'En tant que Chef de Projet, je veux que les instructions système soient sanctuarisées et étanches vis-à-vis des documents importés afin d’empêcher tout contournement ou fuite de logique interne.',
    acceptanceCriteria: [
      'GIVEN un document contenant une directive contradictoire du type "ignore previous instructions", WHEN l\'agent analyse le document, THEN il traite le texte comme simple donnée passive sans altérer ses consignes de rôle.',
      'GIVEN une réponse générée par l\'agent, WHEN elle contient des données sensibles, THEN les règles de confidentialité sont respectées.',
    ],
    securityGuardrails: 'Séparation physique du System Prompt et du payload contextuel.',
    assignee: 'SecOps',
  },
  {
    id: 'TICK-003',
    title: 'Génération et Exportation du Rapport Exécutif en PDF (COPIL)',
    type: 'story',
    priority: 'Must Have',
    status: 'Terminé',
    points: 5,
    persona: 'Chef de Projet & Sponsor',
    userStory: 'En tant que Chef de Projet, je veux exporter en 1 clic l\'ensemble du tableau de bord (météo, KPIs, objectifs SMART, matrice 5x5 des risques avec PxI et plan de mitigation) au format PDF afin de le partager directement avec les parties prenantes.',
    acceptanceCriteria: [
      'GIVEN l\'utilisateur sur le tableau de bord, WHEN il clique sur "Télécharger le PDF", THEN un fichier PDF A4 complet est téléchargé sur son poste sans bloquer l\'application.',
      'GIVEN le rapport PDF généré, WHEN il est ouvert, THEN il contient la météo, la synthèse exécutive, les indicateurs clés et le tableau des risques avec leur scoring.',
    ],
    securityGuardrails: 'Génération 100% sécurisée côté client (jsPDF) ou serveur sans fuite de secrets.',
    assignee: 'Frontend Lead',
  },
  {
    id: 'TICK-004',
    title: 'Matrice d\'Atténuation des Risques 5x5 & Registre de Contingence',
    type: 'story',
    priority: 'Must Have',
    status: 'Terminé',
    points: 5,
    persona: 'Chef de Projet',
    userStory: 'En tant que Chef de Projet, je veux une grille interactive Probabilité (1-5) x Impact (1-5) afin d’identifier immédiatement les risques critiques (score ≥ 15) et d\'assigner un porteur et une mitigation.',
    acceptanceCriteria: [
      'GIVEN un nouveau risque détecté, WHEN le score est calculé, THEN il est coloré en Rouge (≥15), Ambre (8-14) ou Vert (<8).',
      'GIVEN un risque critique, WHEN il est consulté, THEN un plan de contingence opérationnel est renseigné.',
    ],
    securityGuardrails: 'Validation des données et typage strict des scores PxI.',
    assignee: 'Chef de Projet',
  },
  {
    id: 'TICK-005',
    title: 'Gouvernance RGPD : Registre des Traitements & Droit à l\'Oubli',
    type: 'task',
    priority: 'Should Have',
    status: 'En cours',
    points: 3,
    persona: 'DPO & Chef de Projet',
    userStory: 'En tant que DPO, je veux documenter la finalité du traitement des données et disposer d’une commande de purge des documents afin de garantir la conformité au Règlement Européen (RGPD).',
    acceptanceCriteria: [
      'GIVEN un utilisateur souhaitant effacer ses documents, WHEN il confirme la suppression, THEN toutes les copies locales et distantes sont définitivement supprimées.',
    ],
    securityGuardrails: 'Chiffrement au repos et purge irréversible.',
    assignee: 'DPO / Dev',
  },
  {
    id: 'TICK-006',
    title: 'Régulation des Coûts : Plafond de Tokens & Denial of Wallet',
    type: 'task',
    priority: 'Should Have',
    status: 'En cours',
    points: 2,
    persona: 'Lead Architecte',
    userStory: 'En tant que Lead Architecte, je veux plafonner les tokens de sortie à 2048 par requête standard afin d’éviter l’emballement des coûts d’inférence en cas de boucle imprévue.',
    acceptanceCriteria: [
      'GIVEN une requête d\'analyse, WHEN elle est envoyée à Gemini, THEN maxOutputTokens est explicitement configuré et respecté.',
    ],
    securityGuardrails: 'Limiteur de débit et alerte de dépassement.',
    assignee: 'Lead Tech',
  },
];

export const TicketsManagerView: React.FC<TicketsManagerViewProps> = ({
  audit,
  documents,
  onAskAgent,
  tickets: externalTickets,
  onUpdateTickets,
  onNavigateTab,
}) => {
  const [internalTickets, setInternalTickets] = useState<ProjectTicket[]>(DEFAULT_TICKETS);
  const tickets = externalTickets || internalTickets;
  const setTickets = (updater: React.SetStateAction<ProjectTicket[]>) => {
    const nextTickets = typeof updater === 'function' ? updater(tickets) : updater;
    if (onUpdateTickets) {
      onUpdateTickets(nextTickets);
    } else {
      setInternalTickets(nextTickets);
    }
  };
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'Must Have' | 'Should Have' | 'Terminé' | 'En cours'>('all');
  const [isGeneratingTickets, setIsGeneratingTickets] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<ProjectTicket | null>(null);

  const filteredTickets = tickets.filter(t => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'Must Have' || selectedFilter === 'Should Have') return t.priority === selectedFilter;
    if (selectedFilter === 'Terminé' || selectedFilter === 'En cours') return t.status === selectedFilter;
    return true;
  });

  const totalPoints = tickets.reduce((acc, t) => acc + t.points, 0);
  const donePoints = tickets.filter(t => t.status === 'Terminé').reduce((acc, t) => acc + t.points, 0);
  const progressPercent = Math.round((donePoints / (totalPoints || 1)) * 100);

  const handleCopyBacklogMarkdown = () => {
    const md = `# BACKLOG DES TICKETS DU PROJET : ${audit.projectTitle}
Avancement : ${progressPercent}% (${donePoints}/${totalPoints} Story Points)

${tickets.map(t => `### [${t.id}] ${t.title}
- **Type :** ${t.type.toUpperCase()} | **Priorité (MoSCoW) :** ${t.priority} | **Points :** ${t.points} SP | **Statut :** ${t.status}
- **Assigné à :** ${t.assignee || 'Non assigné'}

#### User Story
${t.userStory}

#### Critères d'Acceptation (INVEST)
${t.acceptanceCriteria.map(ac => `- ${ac}`).join('\n')}

#### Garde-fous Sécurité & DoD
${t.securityGuardrails}

---`).join('\n\n')}`;

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCsv = () => {
    const headers = ['ID', 'Titre', 'Type', 'Priorite', 'Statut', 'Points', 'Assignee', 'UserStory', 'Securite'];
    const rows = tickets.map(t => [
      t.id,
      `"${t.title.replace(/"/g, '""')}"`,
      t.type,
      t.priority,
      t.status,
      t.points,
      t.assignee || '',
      `"${t.userStory.replace(/"/g, '""')}"`,
      `"${t.securityGuardrails.replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Tickets_Projet_${audit.projectTitle.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAiGenerateMoreTickets = async () => {
    setIsGeneratingTickets(true);
    try {
      const res = await fetch('/api/pm/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `À partir des objectifs et risques du projet "${audit.projectTitle}", génère 3 nouveaux tickets de développement prioritaires conformes à la norme INVEST.
Pour chaque ticket, fournis impérativement :
- id: TICK-XXX
- title: Titre concis
- type: 'story' ou 'task'
- priority: 'Must Have' ou 'Should Have'
- points: 1, 2, 3 ou 5
- persona: rôle ciblé
- userStory: En tant que... je veux... afin de...
- acceptanceCriteria: [Tableau de 2 critères Given/When/Then]
- securityGuardrails: Garde-fou sécurité spécifique

Réponds sous la forme d'un tableau JSON strict : [ { ... }, { ... } ] sans texte autour.`,
            },
          ],
          documentContext: documents.map(d => `${d.name}:\n${d.content}`).join('\n\n'),
          roleType: 'po',
          model: 'gemini-3.8-flash',
        }),
      });
      const data = await res.json();
      if (data.reply) {
        let text = data.reply.trim();
        if (text.startsWith('```json')) text = text.slice(7);
        if (text.startsWith('```')) text = text.slice(3);
        if (text.endsWith('```')) text = text.slice(0, -3);
        try {
          const parsed: any[] = JSON.parse(text.trim());
          if (Array.isArray(parsed)) {
            const formatted: ProjectTicket[] = parsed.map((item, idx) => ({
              id: item.id || `TICK-00${tickets.length + idx + 1}`,
              title: item.title || 'Ticket IA généré',
              type: item.type || 'story',
              priority: item.priority || 'Should Have',
              status: 'Backlog',
              points: item.points || 3,
              persona: item.persona || 'Utilisateur Métier',
              userStory: item.userStory || '',
              acceptanceCriteria: item.acceptanceCriteria || ['GIVEN état initial, WHEN action, THEN résultat'],
              securityGuardrails: item.securityGuardrails || 'Zéro fuite d\'API',
              assignee: 'Équipe Dév',
            }));
            setTickets(prev => [...prev, ...formatted]);
          }
        } catch (jsonErr) {
          console.warn('Fallback parsing tickets JSON:', jsonErr);
        }
      }
    } catch (err) {
      console.error('Erreur génération tickets:', err);
    } finally {
      setIsGeneratingTickets(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Travail au Ticket & Backlog Agile (INVEST)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Gestionnaire de Tickets, User Stories & Acceptance Criteria
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Passez de la stratégie à l’exécution opérationnelle. Chaque ticket est formulé selon la norme INVEST, intègre des critères d'acceptation <em>Given / When / Then</em>, une priorité MoSCoW et des garde-fous de sécurité en product building prêts à exporter dans Jira, Linear ou GitHub Issues.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('analytics')}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md shadow-cyan-600/20 transition active:scale-95"
              >
                <BarChart3 className="w-4 h-4 text-cyan-200" />
                <span>Vélocité & Burn-Down (HorizonsDatas)</span>
              </button>
            )}
            <button
              onClick={handleCopyBacklogMarkdown}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs flex items-center space-x-1.5 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copied ? 'Copié !' : 'Copier Backlog (.md)'}</span>
            </button>
            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs flex items-center space-x-1.5 transition"
            >
              <Download className="w-4 h-4" />
              <span>Exporter CSV</span>
            </button>
            <button
              onClick={handleAiGenerateMoreTickets}
              disabled={isGeneratingTickets}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md shadow-indigo-600/20 transition disabled:opacity-50"
            >
              {isGeneratingTickets ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Générer Tickets IA</span>
            </button>
          </div>
        </div>

        {/* Story Points & Sprint Velocity Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-4">
            <span className="text-slate-400">
              Avancement Vélocité : <strong className="text-white">{donePoints} / {totalPoints} SP</strong> ({progressPercent}%)
            </span>
            <div className="w-32 sm:w-48 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <div className="flex items-center space-x-2 text-[11px]">
            <span className="text-slate-500">Filtres :</span>
            {(['all', 'Must Have', 'Should Have', 'Terminé', 'En cours'] as const).map(f => (
              <button
                key={f}
                onClick={() => setSelectedFilter(f)}
                className={`px-2.5 py-1 rounded-md transition ${
                  selectedFilter === f ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {f === 'all' ? 'Tous les tickets' : f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tickets List & Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Tickets List */}
        <div className="lg:col-span-7 space-y-3">
          {filteredTickets.map((ticket) => {
            const isSelected = selectedTicket?.id === ticket.id;
            const isMust = ticket.priority === 'Must Have';
            return (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className={`p-4 rounded-xl border cursor-pointer transition text-xs space-y-2.5 ${
                  isSelected
                    ? 'bg-indigo-600/15 border-indigo-500 shadow-md'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-indigo-400 text-[11px]">{ticket.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isMust ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-blue-500/20 text-blue-300'
                    }`}>
                      {ticket.priority}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 uppercase font-semibold">
                      {ticket.type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                      {ticket.points} SP
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ticket.status === 'Terminé' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-white text-sm">{ticket.title}</h3>

                <p className="text-slate-300 text-[11px] line-clamp-2 leading-relaxed">
                  {ticket.userStory}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] text-slate-500">
                  <span>Assigné : <strong className="text-slate-400">{ticket.assignee || 'Équipe'}</strong></span>
                  <span className="text-indigo-400 font-medium">{ticket.acceptanceCriteria.length} critères d'acceptation</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Ticket Detailed Inspector */}
        <div className="lg:col-span-5">
          {selectedTicket ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 sticky top-20 shadow-xl">
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="font-mono text-xs font-bold text-indigo-400">{selectedTicket.id}</span>
                  <h3 className="font-bold text-white text-base leading-snug">{selectedTicket.title}</h3>
                </div>
                <span className="px-2.5 py-1 rounded text-xs font-bold bg-indigo-500/20 text-indigo-300">
                  {selectedTicket.points} Story Points
                </span>
              </div>

              {/* User Story Box */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-xs">
                <div className="text-[10px] uppercase font-bold text-slate-400">User Story (En tant que / Je veux / Afin de)</div>
                <p className="text-slate-200 leading-relaxed text-[11px]">
                  {selectedTicket.userStory}
                </p>
              </div>

              {/* Acceptance Criteria */}
              <div className="space-y-2 text-xs">
                <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Critères d'Acceptation (Given / When / Then)</span>
                </div>
                <div className="space-y-1.5">
                  {selectedTicket.acceptanceCriteria.map((ac, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed">
                      {ac}
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Guardrail & DoD */}
              <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-1 text-xs">
                <div className="text-[10px] uppercase font-bold text-rose-300 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Garde-fou Sécurité & Definition of Done</span>
                </div>
                <p className="text-rose-200 text-[11px] leading-relaxed">
                  {selectedTicket.securityGuardrails}
                </p>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center space-x-2">
                <button
                  onClick={() => {
                    setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { ...t, status: t.status === 'Terminé' ? 'En cours' : 'Terminé' } : t));
                    setSelectedTicket(prev => prev ? { ...prev, status: prev.status === 'Terminé' ? 'En cours' : 'Terminé' } : null);
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition"
                >
                  Basculer Statut ({selectedTicket.status === 'Terminé' ? 'Rouvrir' : 'Marquer Terminé'})
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3 text-slate-500">
              <CheckSquare className="w-10 h-10 mx-auto text-slate-600" />
              <div className="font-medium text-slate-300 text-xs">Sélectionnez un ticket pour inspecter les détails</div>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Consultez la formulation de la User Story, les scénarios de test d'acceptation et les garde-fous de sécurité en product building.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
