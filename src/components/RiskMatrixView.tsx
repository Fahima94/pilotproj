import React, { useState } from 'react';
import { RiskItem } from '../types/project';
import { 
  ShieldAlert, 
  Plus, 
  Sparkles, 
  Filter, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  User,
  RefreshCw
} from 'lucide-react';

interface RiskMatrixViewProps {
  risks: RiskItem[];
  onAddRisk: (risk: RiskItem) => void;
  onRequestAiRisks: () => void;
  isAiGenerating?: boolean;
}

export const RiskMatrixView: React.FC<RiskMatrixViewProps> = ({
  risks,
  onAddRisk,
  onRequestAiRisks,
  isAiGenerating = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [selectedCell, setSelectedCell] = useState<{ prob: number; impact: number } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for manual risk
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Technique' | 'Humain' | 'Calendrier' | 'Budget' | 'Gouvernance'>('Technique');
  const [newProb, setNewProb] = useState(3);
  const [newImpact, setNewImpact] = useState(3);
  const [newMitigation, setNewMitigation] = useState('');
  const [newOwner, setNewOwner] = useState('');

  const categories = ['Tous', 'Technique', 'Calendrier', 'Budget', 'Humain', 'Gouvernance'];

  const filteredRisks = risks.filter((r) => {
    const matchCat = selectedCategory === 'Tous' || r.category === selectedCategory;
    const matchCell = !selectedCell || (r.probability === selectedCell.prob && r.impact === selectedCell.impact);
    return matchCat && matchCell;
  });

  const getCellColor = (prob: number, impact: number) => {
    const score = prob * impact;
    if (score >= 16) return 'bg-rose-500/20 border-rose-500/40 text-rose-300 hover:bg-rose-500/30';
    if (score >= 10) return 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30';
    if (score >= 5) return 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300 hover:bg-yellow-500/30';
    return 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 16) return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    if (score >= 10) return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    if (score >= 5) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
    return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
  };

  const handleCreateRisk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    const item: RiskItem = {
      id: `R-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      probability: newProb,
      impact: newImpact,
      score: newProb * newImpact,
      mitigation: newMitigation || 'En cours de définition',
      owner: newOwner || 'Chef de Projet',
      status: 'Ouvert',
    };
    onAddRisk(item);
    setShowAddModal(false);
    setNewTitle('');
    setNewMitigation('');
    setNewOwner('');
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <span>Matrice & Registre des Risques 5x5</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Visualisation Probabilité x Gravité selon la norme méthodologique PMI / PMP.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onRequestAiRisks}
            disabled={isAiGenerating}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 text-white flex items-center space-x-1.5 shadow-sm transition disabled:opacity-50"
          >
            {isAiGenerating ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            )}
            <span>Réévaluer via l'Agent IA</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-400" />
            <span>Ajouter un risque</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Heatmap 5x5 + Risk List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Heatmap Card (5 columns) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Grille d’Impact vs Probabilité
            </h2>
            {selectedCell && (
              <button
                onClick={() => setSelectedCell(null)}
                className="text-[11px] text-indigo-400 hover:underline"
              >
                Réinitialiser filtre ({selectedCell.prob}x{selectedCell.impact})
              </button>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center text-[10px] font-semibold text-slate-400 uppercase tracking-wider pl-12 pb-1">
              <span className="text-center w-full">Impact (Gravité) →</span>
            </div>

            {/* Matrix 5 rows (Probability 5 down to 1) */}
            {[5, 4, 3, 2, 1].map((prob) => (
              <div key={prob} className="flex items-center space-x-1.5">
                <span className="w-10 text-[11px] font-medium text-slate-400 text-right pr-1">
                  P{prob}
                </span>

                {[1, 2, 3, 4, 5].map((impact) => {
                  const count = risks.filter(
                    (r) => r.probability === prob && r.impact === impact
                  ).length;
                  const isSelected = selectedCell?.prob === prob && selectedCell?.impact === impact;

                  return (
                    <button
                      key={impact}
                      onClick={() =>
                        setSelectedCell(isSelected ? null : { prob, impact })
                      }
                      className={`flex-1 h-12 rounded-lg border text-xs font-bold transition flex flex-col items-center justify-center relative ${getCellColor(
                        prob,
                        impact
                      )} ${isSelected ? 'ring-2 ring-white scale-105 z-10' : ''}`}
                    >
                      <span className="text-[10px] opacity-60">{prob * impact}</span>
                      {count > 0 && (
                        <span className="w-5 h-5 rounded-full bg-slate-900/90 text-white text-[11px] font-extrabold flex items-center justify-center shadow-sm">
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}

            <div className="flex items-center space-x-1.5 pt-1 pl-12">
              {[1, 2, 3, 4, 5].map((imp) => (
                <span key={imp} className="flex-1 text-center text-[11px] font-medium text-slate-400">
                  I{imp}
                </span>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center space-x-2 text-slate-400">
              <span className="w-3 h-3 rounded bg-rose-500/40 border border-rose-500/60" />
              <span>Critique (Score 16-25)</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-400">
              <span className="w-3 h-3 rounded bg-amber-500/40 border border-amber-500/60" />
              <span>Majeur (Score 10-15)</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-400">
              <span className="w-3 h-3 rounded bg-yellow-500/40 border border-yellow-500/60" />
              <span>Modéré (Score 5-9)</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-400">
              <span className="w-3 h-3 rounded bg-emerald-500/40 border border-emerald-500/60" />
              <span>Faible (Score 1-4)</span>
            </div>
          </div>
        </div>

        {/* Risk Registry Table (7 columns) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Registre des Risques ({filteredRisks.length})
              </span>
            </div>

            {/* Category filters */}
            <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filteredRisks.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              Aucun risque ne correspond aux critères sélectionnés.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRisks.map((risk) => {
                const score = risk.score || risk.probability * risk.impact;
                return (
                  <div
                    key={risk.id}
                    className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2 hover:border-slate-600 transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-white">
                            {risk.id} : {risk.title}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                          <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                            {risk.category}
                          </span>
                          {risk.owner && (
                            <span className="flex items-center space-x-1 text-slate-400">
                              <User className="w-3 h-3 text-slate-500" />
                              <span>{risk.owner}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-extrabold border ${getScoreBadge(
                            score
                          )}`}
                        >
                          Criticité {score}/25 (P{risk.probability} x I{risk.impact})
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-1">
                      <div className="font-medium text-indigo-300 text-[11px]">Plan d’Atténuation (Mitigation) :</div>
                      <p className="leading-relaxed text-slate-300">{risk.mitigation}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Risk Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-semibold text-white text-sm flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Ajouter un risque au registre</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Fermer
              </button>
            </div>

            <form onSubmit={handleCreateRisk} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Intitulé du risque</label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Indisponibilité ressource clé en recette"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Catégorie</label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Technique">Technique</option>
                    <option value="Calendrier">Calendrier</option>
                    <option value="Budget">Budget</option>
                    <option value="Humain">Humain</option>
                    <option value="Gouvernance">Gouvernance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Probabilité (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={newProb}
                    onChange={(e) => setNewProb(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Impact (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={newImpact}
                    onChange={(e) => setNewImpact(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Plan d’atténuation préventif</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Action concrète pour réduire l’impact ou la probabilité..."
                  value={newMitigation}
                  onChange={(e) => setNewMitigation(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Responsable (Owner)</label>
                <input
                  type="text"
                  placeholder="Ex : Lead Tech / Chef de Projet"
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500"
                >
                  Ajouter au registre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
