import React, { useState } from 'react';
import { 
  Atom, 
  Search, 
  BookOpen, 
  Activity, 
  FlaskConical, 
  Dna, 
  ExternalLink, 
  Plus, 
  Check, 
  RefreshCw,
  Sparkles,
  Info
} from 'lucide-react';
import { ProjectDocument } from '../types/project';

interface ScienceSkillsViewProps {
  onInjectDocument: (doc: ProjectDocument) => void;
  onAskAgentWithContext: (prompt: string, skill: string) => void;
}

export const ScienceSkillsView: React.FC<ScienceSkillsViewProps> = ({
  onInjectDocument,
  onAskAgentWithContext,
}) => {
  const [activeTab, setActiveTab] = useState<'clinical_trials' | 'pubchem' | 'uniprot' | 'literature'>('clinical_trials');
  const [searchQuery, setSearchQuery] = useState('KRAS G12D');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [injectedIds, setInjectedIds] = useState<Record<string, boolean>>({});

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/science/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: activeTab, query: searchQuery.trim() }),
      });
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchTab = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setResults([]);
    // Provide sensible default queries per tab
    if (tab === 'clinical_trials') setSearchQuery('KRAS G12D Phase 1');
    else if (tab === 'pubchem') setSearchQuery('Sotorasib');
    else if (tab === 'uniprot') setSearchQuery('KRAS human');
    else if (tab === 'literature') setSearchQuery('KRAS G12D inhibitor clinical trial');
  };

  const handleInjectStudy = (item: any) => {
    let name = '';
    let content = '';
    const id = `sci-${Date.now()}`;

    if (activeTab === 'clinical_trials') {
      name = `Etude_${item.id || 'NCT'}.md`;
      content = `# FICHE ESSAI CLINIQUE : ${item.id} - ${item.title}
- Statut : ${item.status}
- Phase : ${item.phase}
- Promoteur : ${item.sponsor || 'N/A'}
- Conditions pathologiques : ${item.conditions?.join(', ') || 'N/A'}
- Résumé du protocole :
${item.summary}`;
    } else if (activeTab === 'pubchem') {
      name = `Fiche_Molecule_${item.name}.md`;
      content = `# FICHE CHIMIQUE PUBCHEM : ${item.name} (CID: ${item.cid})
- Formule moléculaire : ${item.formula}
- Masse moléculaire : ${item.weight} g/mol
- Nom IUPAC : ${item.iupac}
- Données de référence : PubChem Compound`;
    } else if (activeTab === 'uniprot') {
      name = `Cible_${item.geneName}_UniProt.md`;
      content = `# FICHE CIBLE BIOLOGIQUE UNIPROT : ${item.proteinName} (${item.geneName})
- Accession UniProt : ${item.primaryAccession}
- Organisme : ${item.organism}
- Modèle 3D AlphaFold : ${item.alphaFoldUrl}`;
    } else {
      name = `Article_${item.id || 'PubMed'}.md`;
      content = `# PUBLICATION SCIENTIFIQUE : ${item.title}
- Auteurs : ${item.authorString}
- Revue : ${item.journalTitle} (${item.pubYear})
- DOI / Lien : ${item.url}`;
    }

    const doc: ProjectDocument = {
      id,
      name,
      type: 'specs',
      fileFormat: 'Markdown',
      size: `${(content.length / 1024).toFixed(1)} Ko`,
      content,
      dateAdded: new Date().toISOString().slice(0, 10),
      active: true,
      tags: ['Science', activeTab.toUpperCase()],
    };

    onInjectDocument(doc);
    setInjectedIds((prev) => ({ ...prev, [item.id || item.cid || item.primaryAccession]: true }));
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <Atom className="w-5 h-5 text-teal-400" />
            <h1 className="text-xl font-bold text-white">
              Science Skills & Données Biomédicales
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              DeepMind Science
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Interrogez en direct les bases de données scientifiques officielles (ClinicalTrials.gov, PubChem, UniProtKB, AlphaFold DB, Europe PMC) et injectez les données dans votre projet.
          </p>
        </div>

        <button
          onClick={() =>
            onAskAgentWithContext(
              "En tant que Directeur R&D Scientifique, analyse les protocoles d'essais cliniques et la validation de cible dans notre dossier.",
              'Science & R&D'
            )
          }
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 text-white flex items-center space-x-1.5 shadow-md shadow-teal-500/20 transition self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
          <span>Consulter le Directeur R&D IA</span>
        </button>
      </div>

      {/* Database Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <button
          onClick={() => handleSwitchTab('clinical_trials')}
          className={`p-3.5 rounded-xl border text-left transition flex items-center space-x-3 ${
            activeTab === 'clinical_trials'
              ? 'bg-teal-950/40 border-teal-500 text-white shadow-sm'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="w-5 h-5 text-teal-400 shrink-0" />
          <div>
            <div className="font-bold">ClinicalTrials.gov</div>
            <div className="text-[10px] text-slate-500">Essais cliniques & protocoles</div>
          </div>
        </button>

        <button
          onClick={() => handleSwitchTab('pubchem')}
          className={`p-3.5 rounded-xl border text-left transition flex items-center space-x-3 ${
            activeTab === 'pubchem'
              ? 'bg-teal-950/40 border-teal-500 text-white shadow-sm'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <FlaskConical className="w-5 h-5 text-cyan-400 shrink-0" />
          <div>
            <div className="font-bold">PubChem (NCBI)</div>
            <div className="text-[10px] text-slate-500">Molécules & pharmacologie</div>
          </div>
        </button>

        <button
          onClick={() => handleSwitchTab('uniprot')}
          className={`p-3.5 rounded-xl border text-left transition flex items-center space-x-3 ${
            activeTab === 'uniprot'
              ? 'bg-teal-950/40 border-teal-500 text-white shadow-sm'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Dna className="w-5 h-5 text-indigo-400 shrink-0" />
          <div>
            <div className="font-bold">UniProt & AlphaFold</div>
            <div className="text-[10px] text-slate-500">Cibles 3D & séquences</div>
          </div>
        </button>

        <button
          onClick={() => handleSwitchTab('literature')}
          className={`p-3.5 rounded-xl border text-left transition flex items-center space-x-3 ${
            activeTab === 'literature'
              ? 'bg-teal-950/40 border-teal-500 text-white shadow-sm'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-5 h-5 text-purple-400 shrink-0" />
          <div>
            <div className="font-bold">Europe PMC / PubMed</div>
            <div className="text-[10px] text-slate-500">Publications & revues</div>
          </div>
        </button>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="flex gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'clinical_trials'
                ? "Ex: KRAS G12D Phase 1, Pancreatic Cancer, NCT04449874..."
                : activeTab === 'pubchem'
                ? "Ex: Sotorasib, Adagrasib, Imatinib, Aspirin..."
                : activeTab === 'uniprot'
                ? "Ex: KRAS human, EGFR, TP53, P01116..."
                : "Ex: KRAS G12D allosteric inhibitor, oncology clinical trial..."
            }
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !searchQuery.trim()}
          className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition disabled:opacity-50"
        >
          {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
          <span>Rechercher</span>
        </button>
      </form>

      {/* Results View */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Résultats scientifiques ({results.length})
          </span>
          <span className="text-[11px] text-slate-500">
            Données certifiées sans hallucination • APIs publiques REST
          </span>
        </div>

        {isLoading ? (
          <div className="py-16 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-teal-400 animate-spin mx-auto" />
            <div className="text-xs text-slate-300">Interrogation en direct des bases scientifiques...</div>
          </div>
        ) : results.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            Lancez une recherche ci-dessus pour explorer les données cliniques ou biomédicales.
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((item, idx) => {
              const itemKey = item.id || item.cid || item.primaryAccession || idx;
              const isInjected = injectedIds[itemKey];

              return (
                <div
                  key={itemKey}
                  className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2 hover:border-slate-600 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="font-bold text-white text-xs sm:text-sm">
                        {item.title || item.name || item.proteinName}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                        {item.id && (
                          <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-teal-300">
                            {item.id}
                          </span>
                        )}
                        {item.phase && (
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                            {item.phase}
                          </span>
                        )}
                        {item.status && (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                            {item.status}
                          </span>
                        )}
                        {item.formula && (
                          <span className="font-mono text-cyan-300">
                            Formule : {item.formula} ({item.weight} g/mol)
                          </span>
                        )}
                        {item.primaryAccession && (
                          <span className="font-mono text-indigo-300">
                            UniProt : {item.primaryAccession} (Gène : {item.geneName})
                          </span>
                        )}
                        {item.journalTitle && (
                          <span>
                            {item.journalTitle} ({item.pubYear}) • {item.authorString}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      {item.alphaFoldUrl && (
                        <a
                          href={item.alphaFoldUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center space-x-1"
                        >
                          <ExternalLink className="w-3 h-3 text-teal-400" />
                          <span>AlphaFold 3D</span>
                        </a>
                      )}

                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center space-x-1"
                        >
                          <ExternalLink className="w-3 h-3 text-purple-400" />
                          <span>Lien</span>
                        </a>
                      )}

                      <button
                        onClick={() => handleInjectStudy(item)}
                        disabled={isInjected}
                        className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center space-x-1 transition ${
                          isInjected
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-teal-600/30 text-teal-200 border border-teal-500/40 hover:bg-teal-600 hover:text-white'
                        }`}
                      >
                        {isInjected ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Plus className="w-3.5 h-3.5" />}
                        <span>{isInjected ? 'Injecté au projet' : 'Injecter au dossier'}</span>
                      </button>
                    </div>
                  </div>

                  {item.summary && (
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed pt-1">
                      {item.summary}
                    </p>
                  )}

                  {item.iupac && (
                    <div className="text-[11px] font-mono text-slate-400 truncate pt-1">
                      IUPAC: {item.iupac}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
