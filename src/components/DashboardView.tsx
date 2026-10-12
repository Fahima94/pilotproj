import React from 'react';
import { 
  ProjectAudit, 
  ProjectDocument 
} from '../types/project';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Compass, 
  Clock, 
  Target, 
  ArrowRight, 
  FileText, 
  Sparkles, 
  ShieldAlert, 
  CalendarClock,
  Layers,
  HelpCircle
} from 'lucide-react';

interface DashboardViewProps {
  audit: ProjectAudit;
  documents: ProjectDocument[];
  onNavigateTab: (tab: string) => void;
  onOpenArtifact: (type: 'charter' | 'raci' | 'risks' | 'flash_report' | 'agile_backlog' | 'wbs') => void;
  onAskAgent: (prompt: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  audit,
  documents,
  onNavigateTab,
  onOpenArtifact,
  onAskAgent,
}) => {
  const activeDocs = documents.filter((d) => d.active);

  const getStatusBadge = (status: 'VERT' | 'JAUNE' | 'ROUGE') => {
    switch (status) {
      case 'VERT':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
          dot: 'bg-emerald-400',
          title: 'Météo au Vert (Nominal)',
          desc: 'Les risques sont sous contrôle et les jalons principaux sont alignés.',
        };
      case 'JAUNE':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
          dot: 'bg-amber-400',
          title: 'Météo Vigilance (Attention requise)',
          desc: 'Des dépendances critiques ou incertitudes calendaires nécessitent un arbitrage.',
        };
      case 'ROUGE':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
          dot: 'bg-rose-400',
          title: 'Météo en Alerte (Bloquant)',
          desc: 'Écart budgétaire majeur, retard critique ou blocage nécessitant une intervention COPIL immédiate.',
        };
    }
  };

  const statusConfig = getStatusBadge(audit.projectStatus);

  return (
    <div className="space-y-6">
      {/* Top Banner: Project Status & Executive Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.bg}`}>
                <span className={`w-2 h-2 rounded-full ${statusConfig.dot} animate-pulse`} />
                <span>{statusConfig.title}</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Durée estimée : {audit.estimatedDuration}</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>{activeDocs.length} doc{activeDocs.length > 1 ? 's' : ''} analysé{activeDocs.length > 1 ? 's' : ''}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {audit.projectTitle}
            </h1>

            <p className="text-slate-300 text-sm leading-relaxed max-w-4xl">
              {audit.executiveSummary}
            </p>

            {audit.statusJustification && (
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 flex items-start space-x-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Justification du statut : </span>
                  {audit.statusJustification}
                </div>
              </div>
            )}
          </div>

          {/* Quick Deliverable Shortcuts */}
          <div className="lg:w-80 shrink-0 bg-slate-800/50 border border-slate-700/60 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Livrables Clés</span>
              </span>
              <span className="text-[10px] text-slate-500">1-clic IA</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => onOpenArtifact('charter')}
                className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-left text-slate-200 transition hover:border-indigo-500/50"
              >
                <div className="font-medium text-white flex items-center justify-between">
                  <span>Charte</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </div>
                <div className="text-[10px] text-slate-400">Project Charter</div>
              </button>

              <button
                onClick={() => onOpenArtifact('flash_report')}
                className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-left text-slate-200 transition hover:border-indigo-500/50"
              >
                <div className="font-medium text-white flex items-center justify-between">
                  <span>Flash Report</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </div>
                <div className="text-[10px] text-slate-400">Synthèse Hebdo</div>
              </button>

              <button
                onClick={() => onOpenArtifact('raci')}
                className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-left text-slate-200 transition hover:border-indigo-500/50"
              >
                <div className="font-medium text-white flex items-center justify-between">
                  <span>Matrice RACI</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </div>
                <div className="text-[10px] text-slate-400">Gouvernance</div>
              </button>

              <button
                onClick={() => onOpenArtifact('agile_backlog')}
                className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-left text-slate-200 transition hover:border-indigo-500/50"
              >
                <div className="font-medium text-white flex items-center justify-between">
                  <span>Backlog Agile</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </div>
                <div className="text-[10px] text-slate-400">User Stories</div>
              </button>
            </div>

            <button
              onClick={() => onNavigateTab('slides')}
              className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 text-white shadow-md shadow-indigo-600/20 flex items-center justify-center space-x-1.5 transition"
            >
              <span>Préparer les Slides COPIL (Diaporama)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigateTab('chat')}
              className="w-full py-2 px-3 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center justify-center space-x-1.5 transition"
            >
              <span>Consulter l’Agent Chef de Projet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Objectives & Scope */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SMART Objectives */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
              <Target className="w-4 h-4 text-indigo-400" />
              <span>Objectifs Stratégiques & SMART</span>
            </h2>
            <span className="text-xs text-slate-400">{audit.keyObjectives.length} identifiés</span>
          </div>
          <ul className="space-y-2.5">
            {audit.keyObjectives.map((obj, i) => (
              <li key={i} className="flex items-start space-x-2.5 text-xs text-slate-300 bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/40">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Scope: In vs Out */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Périmètre du Projet (Scope)</span>
            </h2>
            <span className="text-xs text-slate-400">In / Out</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3 space-y-2">
              <div className="font-semibold text-emerald-400 flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>In Scope (Inclus)</span>
              </div>
              <ul className="space-y-1.5 text-slate-300">
                {audit.scope.inScope.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-rose-950/20 border border-rose-500/20 rounded-xl p-3 space-y-2">
              <div className="font-semibold text-rose-400 flex items-center space-x-1.5">
                <XCircle className="w-3.5 h-3.5" />
                <span>Out of Scope (Exclus / Phase 2)</span>
              </div>
              <ul className="space-y-1.5 text-slate-300">
                {audit.scope.outOfScope.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Top Risks & Critical Milestones preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Critical Risks */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Principaux Risques Détectés</span>
            </h2>
            <button
              onClick={() => onNavigateTab('risks')}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
            >
              <span>Matrice 5x5</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {audit.topRisks.slice(0, 3).map((risk) => {
              const score = risk.score || risk.probability * risk.impact;
              const isHigh = score >= 15;
              const isMed = score >= 8 && score < 15;
              return (
                <div
                  key={risk.id}
                  className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white truncate max-w-[200px]">
                      {risk.title}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isHigh
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : isMed
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      Criticité {score}/25 ({risk.category})
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    <span className="text-indigo-300 font-medium">Mitigation : </span>
                    {risk.mitigation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Critical Milestones */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
              <CalendarClock className="w-4 h-4 text-cyan-400" />
              <span>Jalons Clés du Planning</span>
            </h2>
            <button
              onClick={() => onNavigateTab('milestones')}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
            >
              <span>Vue Gantt</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {audit.criticalMilestones.slice(0, 4).map((m) => (
              <div
                key={m.id}
                className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5 max-w-[70%]">
                  <div className="font-semibold text-white truncate">{m.title}</div>
                  <div className="text-[11px] text-slate-400 truncate">{m.deliverables}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[11px] font-semibold text-indigo-300">{m.targetDate}</div>
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-slate-800 text-slate-400 border border-slate-700">
                    {m.phase}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations & Missing info (Gap analysis) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recommendations */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Recommandations Méthodologiques</span>
          </h2>
          <ul className="space-y-2 text-xs">
            {audit.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start space-x-2 text-slate-300">
                <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Missing Info / Points d'ombre */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>Points d'Ombre & Informations Manquantes</span>
          </h2>
          <ul className="space-y-2 text-xs">
            {audit.missingInformation.map((miss, i) => (
              <li key={i} className="flex items-start space-x-2 text-slate-300 bg-amber-950/10 p-2.5 rounded-xl border border-amber-500/20">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{miss}</span>
              </li>
            ))}
          </ul>
          <div className="pt-1">
            <button
              onClick={() => onAskAgent("Comment puis-je clarifier ces points d'ombre avec le sponsor et les parties prenantes ?")}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center space-x-1"
            >
              <span>Demander un plan de clarification à l'agent</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
