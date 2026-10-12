import React, { useState } from 'react';
import { RaciItem } from '../types/project';
import { Users, Sparkles, Copy, Check, Info } from 'lucide-react';

interface RaciMatrixViewProps {
  onRequestRaciArtifact: () => void;
}

const DEFAULT_RACI_DATA: RaciItem[] = [
  {
    activity: 'Cadrage des objectifs & Charte de projet (Charter)',
    cdp: 'R',
    sponsor: 'A',
    po: 'C',
    leadTech: 'C',
    equipeDev: 'I',
    metier: 'C',
    qa: 'I',
  },
  {
    activity: 'Rédaction du Cahier des charges & User Stories',
    cdp: 'C',
    sponsor: 'I',
    po: 'R',
    leadTech: 'C',
    equipeDev: 'C',
    metier: 'A',
    qa: 'C',
  },
  {
    activity: 'Architecture technique & Choix de stack',
    cdp: 'I',
    sponsor: 'I',
    po: 'I',
    leadTech: 'R',
    equipeDev: 'C',
    metier: 'I',
    qa: 'I',
  },
  {
    activity: 'Développement des fonctionnalités (Sprints)',
    cdp: 'I',
    sponsor: 'I',
    po: 'C',
    leadTech: 'A',
    equipeDev: 'R',
    metier: 'I',
    qa: 'C',
  },
  {
    activity: 'Stratégie de recette & Cahier de tests QA',
    cdp: 'C',
    sponsor: 'I',
    po: 'C',
    leadTech: 'C',
    equipeDev: 'I',
    metier: 'C',
    qa: 'R',
  },
  {
    activity: 'Recette Métier (UAT) & Validation utilisateur',
    cdp: 'C',
    sponsor: 'I',
    po: 'R',
    leadTech: 'C',
    equipeDev: 'I',
    metier: 'A',
    qa: 'C',
  },
  {
    activity: 'Arbitrage budgétaire & modifications de périmètre',
    cdp: 'R',
    sponsor: 'A',
    po: 'C',
    leadTech: 'C',
    equipeDev: 'I',
    metier: 'C',
    qa: 'I',
  },
  {
    activity: 'Go/No-Go Mise en Production (Bascule)',
    cdp: 'R',
    sponsor: 'A',
    po: 'C',
    leadTech: 'C',
    equipeDev: 'I',
    metier: 'C',
    qa: 'C',
  },
];

export const RaciMatrixView: React.FC<RaciMatrixViewProps> = ({
  onRequestRaciArtifact,
}) => {
  const [copied, setCopied] = useState(false);
  const [data, setData] = useState<RaciItem[]>(DEFAULT_RACI_DATA);

  const getRaciBadge = (val: 'R' | 'A' | 'C' | 'I') => {
    switch (val) {
      case 'R':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40 font-bold';
      case 'A':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-extrabold';
      case 'C':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold';
      case 'I':
        return 'bg-slate-800 text-slate-400 border-slate-700 font-medium';
    }
  };

  const handleCopyMarkdown = () => {
    const md = `| Activité / Livrable | Chef de Projet | Sponsor | Product Owner | Lead Tech | Équipe Dév | Métier | QA |
|---|---|---|---|---|---|---|---|
${data
  .map(
    (row) =>
      `| ${row.activity} | **${row.cdp}** | **${row.sponsor}** | **${row.po}** | **${row.leadTech}** | **${row.equipeDev}** | **${row.metier}** | **${row.qa}** |`
  )
  .join('\n')}`;

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <span>Matrice de Gouvernance RACI</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Définition formelle des rôles et responsabilités pour chaque étape clé du cycle de vie projet.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyMarkdown}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copié !' : 'Copier en Markdown'}</span>
          </button>

          <button
            onClick={onRequestRaciArtifact}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 text-white flex items-center space-x-1.5 shadow-sm transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            <span>Personnaliser avec l'Agent IA</span>
          </button>
        </div>
      </div>

      {/* RACI Definition Legend Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/30 space-y-1">
          <div className="font-bold text-blue-300 flex items-center space-x-1.5">
            <span className="w-5 h-5 rounded-md bg-blue-500/30 text-blue-200 flex items-center justify-center font-extrabold text-xs">
              R
            </span>
            <span>Responsible (Réalisateur)</span>
          </div>
          <p className="text-[11px] text-slate-400">
            La personne ou équipe qui produit concrètement le livrable ou exécute la tâche.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-1">
          <div className="font-bold text-purple-300 flex items-center space-x-1.5">
            <span className="w-5 h-5 rounded-md bg-purple-500/30 text-purple-200 flex items-center justify-center font-extrabold text-xs">
              A
            </span>
            <span>Accountable (Décideur / Valideur)</span>
          </div>
          <p className="text-[11px] text-slate-400">
            L'unique décideur qui porte la responsabilité finale et signe le livrable.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1">
          <div className="font-bold text-amber-300 flex items-center space-x-1.5">
            <span className="w-5 h-5 rounded-md bg-amber-500/30 text-amber-200 flex items-center justify-center font-extrabold text-xs">
              C
            </span>
            <span>Consulted (Consulté)</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Expert ou métier sollicité pour avis technique, juridique ou fonctionnel.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="font-bold text-slate-300 flex items-center space-x-1.5">
            <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-300 flex items-center justify-center font-extrabold text-xs">
              I
            </span>
            <span>Informed (Informé)</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Partie prenante tenue informée des décisions et de l’avancement (comptes-rendus).
          </p>
        </div>
      </div>

      {/* Main RACI Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-800/80 text-slate-300 font-semibold border-b border-slate-700">
                <th className="p-3.5 pl-5 min-w-[240px]">Activité / Livrable Clé</th>
                <th className="p-3.5 text-center min-w-[90px]">Chef de Projet</th>
                <th className="p-3.5 text-center min-w-[90px]">Sponsor</th>
                <th className="p-3.5 text-center min-w-[90px]">Product Owner</th>
                <th className="p-3.5 text-center min-w-[90px]">Lead Tech</th>
                <th className="p-3.5 text-center min-w-[90px]">Équipe Dév</th>
                <th className="p-3.5 text-center min-w-[90px]">Métier</th>
                <th className="p-3.5 text-center min-w-[90px]">QA / Test</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {data.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition">
                  <td className="p-3.5 pl-5 font-medium text-slate-200">
                    {row.activity}
                  </td>
                  <td className="p-3.5 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-md text-xs border ${getRaciBadge(row.cdp)}`}>
                      {row.cdp}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-md text-xs border ${getRaciBadge(row.sponsor)}`}>
                      {row.sponsor}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-md text-xs border ${getRaciBadge(row.po)}`}>
                      {row.po}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-md text-xs border ${getRaciBadge(row.leadTech)}`}>
                      {row.leadTech}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-md text-xs border ${getRaciBadge(row.equipeDev)}`}>
                      {row.equipeDev}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-md text-xs border ${getRaciBadge(row.metier)}`}>
                      {row.metier}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-md text-xs border ${getRaciBadge(row.qa)}`}>
                      {row.qa}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
