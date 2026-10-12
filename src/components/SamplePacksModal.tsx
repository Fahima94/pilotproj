import React from 'react';
import { SAMPLE_PROJECT_PACKS, SampleProjectPack } from '../data/sampleProjects';
import { FolderOpen, X, Check, ArrowRight, Layers, FileText } from 'lucide-react';

interface SamplePacksModalProps {
  onClose: () => void;
  onSelectPack: (pack: SampleProjectPack) => void;
  onStartBlankProject?: () => void;
  currentPackId: string;
}

export const SamplePacksModal: React.FC<SamplePacksModalProps> = ({
  onClose,
  onSelectPack,
  onStartBlankProject,
  currentPackId,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <FolderOpen className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-sm sm:text-base">
              Gestionnaire de Projet & Modèles Entreprise
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {onStartBlankProject && (
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-950/60 to-blue-950/60 border border-indigo-500/40 flex items-center justify-between gap-3">
            <div>
              <div className="font-bold text-white text-xs sm:text-sm">
                Démarrer un nouveau projet pour mon travail
              </div>
              <div className="text-[11px] text-slate-300">
                Espace vierge pour importer directement vos propres cahiers des charges et documents réels.
              </div>
            </div>
            <button
              onClick={() => {
                onStartBlankProject();
                onClose();
              }}
              className="shrink-0 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition"
            >
              Nouveau projet vierge
            </button>
          </div>
        )}

        <p className="text-xs text-slate-400 leading-relaxed">
          Ou chargez un modèle de cadrage d'entreprise pré-configuré pour piloter votre initiative :
        </p>

        <div className="space-y-3">
          {SAMPLE_PROJECT_PACKS.map((pack) => {
            const isSelected = currentPackId === pack.id;
            return (
              <div
                key={pack.id}
                onClick={() => {
                  onSelectPack(pack);
                  onClose();
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                  isSelected
                    ? 'bg-indigo-600/10 border-indigo-500 shadow-md shadow-indigo-500/10'
                    : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-500 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">
                      {pack.category}
                    </span>
                    <h4 className="font-bold text-white text-xs sm:text-sm">{pack.name}</h4>
                  </div>
                  {isSelected ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center space-x-1">
                      <Check className="w-3 h-3" />
                      <span>Actif</span>
                    </span>
                  ) : (
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
                  )}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {pack.description}
                </p>

                <div className="flex items-center space-x-3 text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center space-x-1">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>{pack.documents.length} documents inclus</span>
                  </span>
                  <span>•</span>
                  <span>{pack.prebuiltAudit.estimatedDuration}</span>
                  <span>•</span>
                  <span>Météo : {pack.prebuiltAudit.projectStatus}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 text-center text-xs text-slate-500">
          Vous pourrez ensuite ajouter ou remplacer n'importe quel document via le gestionnaire documentaire.
        </div>
      </div>
    </div>
  );
};
