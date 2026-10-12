import React, { useState } from 'react';
import { 
  Presentation, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Download, 
  Copy, 
  Check, 
  FileText, 
  Layers, 
  Tv, 
  RefreshCw,
  Sliders,
  Palette,
  CheckCircle2,
  Clock,
  Target
} from 'lucide-react';

interface Slide {
  slideNumber: number;
  title: string;
  subtitle: string;
  layout: string;
  bullets: string[];
  metrics?: Array<{ label: string; value: string }>;
  speakerNotes: string;
  visualDescription?: string;
}

interface SlideDeck {
  presentationTitle: string;
  presentationSubtitle: string;
  audience: string;
  slides: Slide[];
}

interface SlideDeckStudioViewProps {
  documentContext: string;
  onAskAgent: (prompt: string) => void;
}

export const SlideDeckStudioView: React.FC<SlideDeckStudioViewProps> = ({
  documentContext,
  onAskAgent,
}) => {
  const [presentationType, setPresentationType] = useState('copil');
  const [slideCount, setSlideCount] = useState(5);
  const [customInstructions, setCustomInstructions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'corporate' | 'teal'>('dark');

  // Pre-loaded initial deck to ensure an immediate rich interactive experience
  const [deck, setDeck] = useState<SlideDeck>({
    presentationTitle: 'Comité de Pilotage (COPIL) — Statut & Arbitrages Projet',
    presentationSubtitle: 'Instance Mensuelle de Direction • Synthèse Stratégique',
    audience: 'Direction Générale, Sponsors Métiers, COPIL',
    slides: [
      {
        slideNumber: 1,
        title: 'Comité de Pilotage (COPIL)',
        subtitle: 'Bilan d’Étape & Décisions Stratégiques',
        layout: 'title',
        bullets: [
          'Synthèse de l’avancement et météo globale du projet',
          'Revue des jalons clés et arbitrages calendaires',
          'Matrice des risques majeurs et plan de mitigation',
        ],
        metrics: [
          { label: 'Météo Globale', value: '🟢 Nominale' },
          { label: 'Jalons Validés', value: '3 / 4' },
          { label: 'Budget Consommé', value: '62%' },
        ],
        speakerNotes:
          'Bonjour à tous. Merci pour votre présence à ce COPIL. L’objectif aujourd’hui est de valider le franchissement du jalon de conception et d’arbitrer sur les dépendances techniques avant la phase de build.',
        visualDescription: 'Grand titre épuré avec cartouches d’indicateurs de performance clés.',
      },
      {
        slideNumber: 2,
        title: 'Avancement des Chantiers & Réalisations Clés',
        subtitle: 'Ce qui a été accompli sur la période écoulée',
        layout: 'bullets',
        bullets: [
          'Validation à 100% du cahier des charges fonctionnel et des parcours utilisateurs',
          'Spécifications techniques d’interfaçage d’API stabilisées avec les équipes d’architecture',
          'Validation de la gouvernance et de la matrice RACI par l’ensemble des parties prenantes',
          'Préparation de l’environnement de recette et contractualisation des partenaires',
        ],
        speakerNotes:
          'Sur ce slide, nous constatons une excellente dynamique : la conception est verrouillée et aucun retard n’est à déplorer sur la production des livrables documentaires.',
        visualDescription: 'Liste des succès clés avec indicateurs visuels de conformité.',
      },
      {
        slideNumber: 3,
        title: 'Top 3 Risques & Plans de Continuité',
        subtitle: 'Vigilances prioritaires pour les prochaines semaines',
        layout: 'bullets',
        bullets: [
          'Risque 1 : Dépendance sur la livraison des endpoints API partenaires (Criticité : 15/25) — Action : Mocks immédiats en sprint 2',
          'Risque 2 : Charge critique sur les équipes de recette en période estivale — Action : Renfort d’un expert QA externe',
          'Risque 3 : Dérive du périmètre initial (Scope Creep) — Action : Processus formel de Change Request validé par le sponsor',
        ],
        metrics: [
          { label: 'Risques Ouverts', value: '3' },
          { label: 'Plans Validés', value: '100%' },
        ],
        speakerNotes:
          'Je souhaite attirer votre attention sur les dépendances externes. Nous avons anticipé en mockant les interfaces, ce qui évite tout blocage des développements front-end.',
        visualDescription: 'Matrice de criticité avec code couleur d’alerte.',
      },
      {
        slideNumber: 4,
        title: 'Feuille de Route & Prochains Jalons',
        subtitle: 'Chronologie et chemin critique jusqu’à la mise en production',
        layout: 'timeline',
        bullets: [
          'Jalon T+30 : Finalisation des développements du socle technique',
          'Jalon T+60 : Début de la recette métier (UAT) sur environnement ISO-production',
          'Jalon T+75 : Audit de sécurité et tests de charge avec validation du plan de reprise (PRA)',
          'Jalon T+90 : Comité Go / No-Go pour la bascule en production',
        ],
        speakerNotes:
          'Voici notre trajectoire. Le chemin critique se concentre sur les 3 semaines de recette métier. Votre soutien sera essentiel pour mobiliser les utilisateurs finaux.',
        visualDescription: 'Chronologie visuelle étape par étape.',
      },
      {
        slideNumber: 5,
        title: 'Décisions & Arbitrages Attendus du COPIL',
        subtitle: 'Actes de gouvernance à valider en séance',
        layout: 'conclusion',
        bullets: [
          'Validation formelle du passage en Phase de Développement',
          'Accord sur l’enveloppe de renfort pour la prestation de test QA (8 j/h)',
          'Sanctuarisation de la date cible de mise en ligne au calendrier prévisionnel',
        ],
        speakerNotes:
          'Pour conclure, je soumets ces 3 arbitrages à votre vote. Avec votre accord, nous lançons les développements dès lundi matin.',
        visualDescription: 'Cadre de décision solennel pour le vote de la direction.',
      },
    ],
  });

  const handleGenerateDeck = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/pm/generate-slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          presentationType,
          documentContext,
          slideCount,
          customInstructions,
        }),
      });

      const data = await res.json();
      if (data && data.slides && data.slides.length > 0) {
        setDeck(data);
        setActiveSlideIndex(0);
      }
    } catch (err) {
      console.error('Erreur génération slides:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const currentSlide = deck.slides[activeSlideIndex] || deck.slides[0];

  const handleCopyMarkdown = () => {
    const md = `# ${deck.presentationTitle}\n${deck.presentationSubtitle}\n*Public cible : ${deck.audience}*\n\n---\n\n` +
      deck.slides
        .map(
          (s) =>
            `## Slide ${s.slideNumber}: ${s.title}\n*${s.subtitle}*\n\n` +
            s.bullets.map((b) => `- ${b}`).join('\n') +
            (s.metrics ? `\n\n**Indicateurs :**\n` + s.metrics.map((m) => `- ${m.label}: **${m.value}**`).join('\n') : '') +
            `\n\n> **Notes Orateur :**\n> ${s.speakerNotes}\n\n---`
        )
        .join('\n\n');

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>${deck.presentationTitle}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 40px; }
    .slide { max-width: 900px; margin: 0 auto 60px auto; background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 40px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    h1 { color: #60a5fa; margin-top: 0; }
    h2 { color: #93c5fd; }
    h3 { color: #cbd5e1; font-weight: normal; margin-top: -10px; margin-bottom: 25px; }
    ul { font-size: 18px; line-height: 1.8; color: #e2e8f0; }
    .metrics { display: flex; gap: 20px; margin-top: 25px; }
    .metric-card { background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 15px 20px; }
    .metric-val { font-size: 24px; font-weight: bold; color: #38bdf8; }
    .metric-lbl { font-size: 12px; color: #94a3b8; text-transform: uppercase; }
    .notes { margin-top: 30px; padding: 15px; background: rgba(30,58,138,0.2); border-left: 4px solid #3b82f6; font-size: 14px; color: #93c5fd; }
  </style>
</head>
<body>
  <div style="text-align: center; margin-bottom: 40px;">
    <h1>${deck.presentationTitle}</h1>
    <h3>${deck.presentationSubtitle} • Public : ${deck.audience}</h3>
  </div>
  ${deck.slides
    .map(
      (s) => `
    <div class="slide">
      <h2>Slide ${s.slideNumber} : ${s.title}</h2>
      <h3>${s.subtitle}</h3>
      <ul>
        ${s.bullets.map((b) => `<li>${b}</li>`).join('')}
      </ul>
      ${
        s.metrics
          ? `<div class="metrics">
        ${s.metrics.map((m) => `<div class="metric-card"><div class="metric-val">${m.value}</div><div class="metric-lbl">${m.label}</div></div>`).join('')}
      </div>`
          : ''
      }
      <div class="notes"><strong>Notes Orateur :</strong> ${s.speakerNotes}</div>
    </div>`
    )
    .join('')}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Presentation_${presentationType}_${new Date().toISOString().slice(0, 10)}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getThemeClass = () => {
    switch (theme) {
      case 'corporate':
        return 'bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 border-blue-600/40';
      case 'teal':
        return 'bg-gradient-to-br from-teal-950 via-slate-900 to-slate-950 border-teal-600/40';
      default:
        return 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <Presentation className="w-5 h-5 text-indigo-400" />
            <h1 className="text-xl font-bold text-white">
              Studio de Préparation de Slides de Projet
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Deck Designer
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Générez des diapositives percutantes pour vos COPIL, kick-offs, revues de sprint ou soutenances, avec argumentaires orateurs (Speaker Notes).
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyMarkdown}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copié' : 'Copier Markdown'}</span>
          </button>

          <button
            onClick={handleDownloadHtml}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exporter HTML / PDF</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 border border-indigo-500/40 flex items-center space-x-1.5 transition"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Diaporama</span>
          </button>
        </div>
      </div>

      {/* Generation Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-300 mb-1 font-medium">Type d'instance / Réunion</label>
            <select
              value={presentationType}
              onChange={(e) => setPresentationType(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="copil">Comité de Pilotage (COPIL Stratégique)</option>
              <option value="kickoff">Réunion de Lancement (Kick-Off)</option>
              <option value="sprint_review">Revue de Sprint & Démo Agile</option>
              <option value="risks_review">Comité de Gestion des Risques</option>
              <option value="closing">Soutenance & Clôture de Projet</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Nombre de diapositives</label>
            <select
              value={slideCount}
              onChange={(e) => setSlideCount(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value={4}>4 slides (Flash Synthétique)</option>
              <option value={5}>5 slides (Standard Direction)</option>
              <option value={6}>6 slides (Détaillé avec Risques & RACI)</option>
              <option value={8}>8 slides (Présentation Complète)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Thème Visuel</label>
            <select
              value={theme}
              onChange={(e: any) => setTheme(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="dark">Sombre Exécutif (Dark Elegance)</option>
              <option value="corporate">Corporate Bleu (Business Blue)</option>
              <option value="teal">Scientifique / Biotech (Deep Teal)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <input
            type="text"
            placeholder="Consigne particulière (ex : insister sur l'arbitrage budgétaire, mettre l'accent sur les tests de charge...)"
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            className="flex-1 bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />

          <button
            onClick={handleGenerateDeck}
            disabled={isGenerating}
            className="w-full sm:w-auto px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-indigo-600/20 transition disabled:opacity-50"
          >
            {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-cyan-200" />}
            <span>{isGenerating ? 'Conception des slides...' : 'Générer les slides via l’Agent IA'}</span>
          </button>
        </div>
      </div>

      {/* Slide Viewer Canvas */}
      <div className="space-y-4">
        {/* Main Slide Card */}
        <div
          className={`rounded-2xl border p-6 sm:p-10 shadow-2xl relative transition-all min-h-[380px] sm:min-h-[460px] flex flex-col justify-between ${getThemeClass()}`}
        >
          {/* Slide Header */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/10 pb-2">
              <span className="font-semibold text-indigo-400 uppercase tracking-wider text-[11px]">
                {deck.presentationTitle}
              </span>
              <span>
                Slide {activeSlideIndex + 1} / {deck.slides.length}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white pt-2">
              {currentSlide.title}
            </h2>
            <h3 className="text-xs sm:text-sm text-slate-400 font-medium">
              {currentSlide.subtitle}
            </h3>
          </div>

          {/* Slide Body */}
          <div className="my-6 space-y-4">
            <ul className="space-y-3">
              {currentSlide.bullets.map((b, i) => (
                <li key={i} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-200 leading-relaxed">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0 mt-1.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            {/* Metrics cards if present */}
            {currentSlide.metrics && currentSlide.metrics.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4">
                {currentSlide.metrics.map((m, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-white/10 space-y-0.5">
                    <div className="text-lg sm:text-xl font-bold text-cyan-300">{m.value}</div>
                    <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Slide Footer */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>Public cible : {deck.audience}</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveSlideIndex((prev) => Math.max(0, prev - 1))}
                disabled={activeSlideIndex === 0}
                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-white disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono text-[11px]">
                {activeSlideIndex + 1} / {deck.slides.length}
              </span>
              <button
                onClick={() => setActiveSlideIndex((prev) => Math.min(deck.slides.length - 1, prev + 1))}
                disabled={activeSlideIndex === deck.slides.length - 1}
                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-white disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Thumbnail Navigation Strip */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {deck.slides.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlideIndex(idx)}
              className={`p-3 rounded-xl border text-left shrink-0 w-44 transition-all space-y-1 ${
                activeSlideIndex === idx
                  ? 'bg-indigo-600/20 border-indigo-500 shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="text-[10px] font-bold text-indigo-400">SLIDE {s.slideNumber}</div>
              <div className="text-xs font-semibold text-white truncate">{s.title}</div>
            </button>
          ))}
        </div>

        {/* Speaker Notes Drawer */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <FileText className="w-4 h-4" />
            <span>Argumentaire & Notes pour l'Orateur (Ce que vous devez dire à l'oral) :</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800 select-text">
            {currentSlide.speakerNotes}
          </p>
        </div>
      </div>
    </div>
  );
};
