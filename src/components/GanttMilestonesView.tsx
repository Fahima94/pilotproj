import React, { useState } from 'react';
import { Milestone } from '../types/project';
import { 
  CalendarClock, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  Plus, 
  ChevronRight,
  Flag,
  ArrowRight
} from 'lucide-react';

interface GanttMilestonesViewProps {
  milestones: Milestone[];
  onAskAgent: (prompt: string) => void;
  onRequestWbsArtifact: () => void;
}

export const GanttMilestonesView: React.FC<GanttMilestonesViewProps> = ({
  milestones,
  onAskAgent,
  onRequestWbsArtifact,
}) => {
  const [selectedPhase, setSelectedPhase] = useState<string>('Tous');

  const phases = ['Tous', 'Cadrage', 'Conception', 'Développement', 'Recette', 'Déploiement'];

  const filtered = milestones.filter(
    (m) => selectedPhase === 'Tous' || m.phase === selectedPhase
  );

  const getStatusBadge = (status: Milestone['status']) => {
    switch (status) {
      case 'Valide':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'En cours':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'En retard':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <CalendarClock className="w-5 h-5 text-cyan-400" />
            <span>Planning, Jalons & Découpage WBS</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Chronologie des phases de projet, livrables attendus et suivi de l'avancement.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onRequestWbsArtifact}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 text-white flex items-center space-x-1.5 shadow-sm transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            <span>Générer WBS détaillé (IA)</span>
          </button>
        </div>
      </div>

      {/* Phase filters */}
      <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none bg-slate-900/60 border border-slate-800 p-2 rounded-xl">
        <span className="text-xs text-slate-400 font-medium px-2">Phases :</span>
        {phases.map((ph) => (
          <button
            key={ph}
            onClick={() => setSelectedPhase(ph)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
              selectedPhase === ph
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {ph}
          </button>
        ))}
      </div>

      {/* Timeline view */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Jalons Clés & Livrables ({filtered.length})
          </h2>
          <span className="text-xs text-slate-400">Ordre chronologique</span>
        </div>

        <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
          {filtered.map((m, idx) => (
            <div key={m.id} className="relative group">
              {/* Dot icon on timeline */}
              <div
                className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                  m.status === 'Valide'
                    ? 'bg-emerald-500 border-emerald-400 text-white'
                    : m.status === 'En cours'
                    ? 'bg-indigo-600 border-indigo-400 text-white'
                    : 'bg-slate-900 border-slate-700 text-slate-500'
                }`}
              >
                {m.status === 'Valide' ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : (
                  <Flag className="w-2.5 h-2.5" />
                )}
              </div>

              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4.5 space-y-3 hover:border-slate-600 transition">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-white">{m.title}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                        Phase : {m.phase}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-indigo-300 flex items-center space-x-1">
                      <CalendarClock className="w-3.5 h-3.5" />
                      <span>{m.targetDate}</span>
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadge(
                        m.status
                      )}`}
                    >
                      {m.status}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-start space-x-2">
                  <span className="text-indigo-400 font-semibold shrink-0">Livrables attendus :</span>
                  <span className="leading-relaxed">{m.deliverables}</span>
                </div>

                {/* Progress bar */}
                {m.progress !== undefined && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Progression estimée</span>
                      <span className="font-semibold text-white">{m.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          m.progress === 100
                            ? 'bg-emerald-400'
                            : m.progress > 50
                            ? 'bg-indigo-500'
                            : 'bg-blue-400'
                        }`}
                        style={{ width: `${m.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
