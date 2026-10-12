import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  RefreshCw, 
  X, 
  FileText,
  Sliders
} from 'lucide-react';

interface ArtifactModalProps {
  artifactType: 'charter' | 'raci' | 'risks' | 'flash_report' | 'agile_backlog' | 'wbs' | null;
  onClose: () => void;
  documentContext: string;
}

export const ArtifactModal: React.FC<ArtifactModalProps> = ({
  artifactType,
  onClose,
  documentContext,
}) => {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [customInstructions, setCustomInstructions] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const artifactNames: Record<string, { title: string; subtitle: string }> = {
    charter: {
      title: 'Charte de Projet (Project Charter)',
      subtitle: 'Document de référence officiel pour le cadrage stratégique et la gouvernance.',
    },
    raci: {
      title: 'Matrice de Gouvernance RACI',
      subtitle: 'Tableau des responsabilités : Réalisateur, Décideur, Consulté, Informé.',
    },
    risks: {
      title: 'Registre Exhaustif des Risques & Contingences',
      subtitle: 'Analyse PxG, plans de mitigation préventifs et plans de contingence curatifs.',
    },
    flash_report: {
      title: 'Flash Report Hebdomadaire (COPIL)',
      subtitle: 'Météo du projet 🟢/🟡/🔴, réalisations clés, alertes et arbitrages requis.',
    },
    agile_backlog: {
      title: 'Backlog Agile & User Stories INVEST',
      subtitle: 'Découpage en Épopées (Epics) et User Stories avec critères d’acceptation.',
    },
    wbs: {
      title: 'Organigramme des Tâches (WBS) & Livrables',
      subtitle: 'Décomposition arborescente des activités et estimation des charges.',
    },
  };

  const currentInfo = artifactType ? artifactNames[artifactType] : null;

  const generateArtifact = async () => {
    if (!artifactType) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/pm/generate-artifact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artifactType,
          documentContext,
          customInstructions: customInstructions.trim(),
        }),
      });
      const data = await res.json();
      if (data.content) {
        setContent(data.content);
      } else {
        setContent("Impossible de générer le livrable. Veuillez réessayer.");
      }
    } catch (err: any) {
      console.error(err);
      setContent("Erreur lors de la communication avec l'Agent Chef de Projet.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (artifactType) {
      setContent('');
      generateArtifact();
    }
  }, [artifactType]);

  if (!artifactType || !currentInfo) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${artifactType}_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">{currentInfo.title}</h3>
              <p className="text-xs text-slate-400">{currentInfo.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              disabled={isLoading || !content}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center space-x-1.5 transition disabled:opacity-50"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copié' : 'Copier'}</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={isLoading || !content}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center space-x-1.5 transition disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger (.md)</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Custom Instructions Bar */}
        <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-950/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center space-x-2 flex-1">
            <Sliders className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Consigne additionnelle (ex : insister sur l'arbitrage budgétaire, ton percutant...)"
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={generateArtifact}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center space-x-1.5 transition shrink-0 disabled:opacity-50"
          >
            {isLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            <span>Régénérer</span>
          </button>
        </div>

        {/* Content Preview */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950/60 select-text">
          {isLoading ? (
            <div className="py-20 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
              <div className="text-sm font-semibold text-white">
                Rédaction en cours par l'Agent Chef de Projet...
              </div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Structuration méthodologique selon les meilleures pratiques PMI / Agile.
              </p>
            </div>
          ) : (
            <div className="prose prose-invert prose-xs sm:prose-sm max-w-none font-sans whitespace-pre-wrap leading-relaxed text-slate-300">
              {content}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/90 text-right text-xs text-slate-500">
          Document généré par l'Agent Chef de Projet IA • Format standardisé Markdown
        </div>
      </div>
    </div>
  );
};
