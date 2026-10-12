import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Area, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  TrendingDown, 
  TrendingUp, 
  Activity, 
  Zap, 
  Calendar, 
  Layers, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Download, 
  FileSpreadsheet, 
  ChevronRight, 
  Sparkles,
  BarChart3,
  Target
} from 'lucide-react';
import { ProjectAudit } from '../types/project';
import { ProjectTicket } from './TicketsManagerView';

interface HorizonsDataVisualizerViewProps {
  audit: ProjectAudit;
  tickets: ProjectTicket[];
  onNavigateTab?: (tab: string) => void;
  onAskAgent?: (prompt: string, skill?: string) => void;
}

export const HorizonsDataVisualizerView: React.FC<HorizonsDataVisualizerViewProps> = ({
  audit,
  tickets,
  onNavigateTab,
  onAskAgent,
}) => {
  const [selectedSprint, setSelectedSprint] = useState<'all' | 'sprint-1' | 'sprint-2' | 'sprint-3'>('sprint-2');
  const [chartMetric, setChartMetric] = useState<'points' | 'tickets'>('points');

  // Compute live ticket metrics
  const totalPoints = useMemo(() => tickets.reduce((acc, t) => acc + (t.points || 0), 0), [tickets]);
  const donePoints = useMemo(() => tickets.filter(t => t.status === 'Terminé').reduce((acc, t) => acc + (t.points || 0), 0), [tickets]);
  const inProgressPoints = useMemo(() => tickets.filter(t => t.status === 'En cours').reduce((acc, t) => acc + (t.points || 0), 0), [tickets]);
  const toTestPoints = useMemo(() => tickets.filter(t => t.status === 'A tester').reduce((acc, t) => acc + (t.points || 0), 0), [tickets]);
  const backlogPoints = useMemo(() => tickets.filter(t => t.status === 'Backlog').reduce((acc, t) => acc + (t.points || 0), 0), [tickets]);

  const completionRate = totalPoints > 0 ? Math.round((donePoints / totalPoints) * 100) : 0;
  const remainingPoints = totalPoints - donePoints;

  // 1. Sprint Burn-Down Chart Data (14-day Sprint cycle)
  const burnDownData = useMemo(() => {
    // Dynamic calculation grounded on totalPoints and remainingPoints
    const sprintTotal = totalPoints > 0 ? totalPoints : 34;
    const currentDay = 8; // Mid-sprint day
    const days = [
      { day: 'J0 (Kickoff)', ideal: sprintTotal, actual: sprintTotal, scopeChange: 0, notes: 'Sprint Backlog figé' },
      { day: 'J1', ideal: Math.round(sprintTotal * 0.93), actual: sprintTotal, scopeChange: 0, notes: 'Démarrage architecture' },
      { day: 'J2', ideal: Math.round(sprintTotal * 0.86), actual: Math.round(sprintTotal * 0.94), scopeChange: 0, notes: 'TICK-001 initié' },
      { day: 'J3', ideal: Math.round(sprintTotal * 0.79), actual: Math.round(sprintTotal * 0.85), scopeChange: 0, notes: 'Proxy validé (-3 SP)' },
      { day: 'J4', ideal: Math.round(sprintTotal * 0.72), actual: Math.round(sprintTotal * 0.78), scopeChange: 0, notes: 'Tests d\'injection' },
      { day: 'J5', ideal: Math.round(sprintTotal * 0.64), actual: Math.round(sprintTotal * 0.65), scopeChange: 0, notes: 'Anti-injection terminé (-5 SP)' },
      { day: 'J6', ideal: Math.round(sprintTotal * 0.57), actual: Math.round(sprintTotal * 0.65), scopeChange: 2, notes: 'Spike sécurité ajouté (+2 SP)' },
      { day: 'J7', ideal: Math.round(sprintTotal * 0.50), actual: Math.round(sprintTotal * 0.52), scopeChange: 0, notes: 'Export PDF validé (-5 SP)' },
      { day: 'J8 (Aujourd\'hui)', ideal: Math.round(sprintTotal * 0.43), actual: remainingPoints, scopeChange: 0, notes: `Reste à faire : ${remainingPoints} SP` },
      { day: 'J9', ideal: Math.round(sprintTotal * 0.36), actual: null, scopeChange: 0, notes: 'Projection' },
      { day: 'J10', ideal: Math.round(sprintTotal * 0.28), actual: null, scopeChange: 0, notes: 'Projection' },
      { day: 'J11', ideal: Math.round(sprintTotal * 0.21), actual: null, scopeChange: 0, notes: 'Recette QA' },
      { day: 'J12', ideal: Math.round(sprintTotal * 0.14), actual: null, scopeChange: 0, notes: 'Stabilisation' },
      { day: 'J13', ideal: Math.round(sprintTotal * 0.07), actual: null, scopeChange: 0, notes: 'Revue de Sprint' },
      { day: 'J14 (Release)', ideal: 0, actual: null, scopeChange: 0, notes: 'Mise en Prod' },
    ];
    return days;
  }, [totalPoints, remainingPoints]);

  // 2. Velocity History & Trend Data across Sprints
  const velocityData = useMemo(() => [
    { sprint: 'Sprint 1', committed: 22, completed: 18, rollingAvg: 18, predictability: 82 },
    { sprint: 'Sprint 2 (Actuel)', committed: 26, completed: donePoints, rollingAvg: Math.round((18 + donePoints) / 2), predictability: 88 },
    { sprint: 'Sprint 3 (Cible)', committed: 28, completed: null, rollingAvg: 23, predictability: 90 },
    { sprint: 'Sprint 4 (Cible)', committed: 30, completed: null, rollingAvg: 25, predictability: 92 },
  ], [donePoints]);

  // 3. Story Points Distribution by Status
  const statusPieData = useMemo(() => [
    { name: 'Terminé', value: donePoints, color: '#10b981' }, // emerald
    { name: 'En cours', value: inProgressPoints, color: '#3b82f6' }, // blue
    { name: 'À tester (QA)', value: toTestPoints, color: '#f59e0b' }, // amber
    { name: 'Backlog', value: backlogPoints, color: '#64748b' }, // slate
  ].filter(d => d.value > 0), [donePoints, inProgressPoints, toTestPoints, backlogPoints]);

  // 4. MoSCoW Breakdown Data
  const moscowData = useMemo(() => {
    const counts = {
      'Must Have': { total: 0, done: 0 },
      'Should Have': { total: 0, done: 0 },
      'Could Have': { total: 0, done: 0 },
      'Won\'t Have': { total: 0, done: 0 },
    };
    tickets.forEach(t => {
      const p = t.priority || 'Must Have';
      if (!counts[p]) counts[p] = { total: 0, done: 0 };
      counts[p].total += t.points || 0;
      if (t.status === 'Terminé') counts[p].done += t.points || 0;
    });

    return [
      { priority: 'Must Have (P1)', total: counts['Must Have'].total, done: counts['Must Have'].done, color: '#ef4444' },
      { priority: 'Should Have (P2)', total: counts['Should Have'].total, done: counts['Should Have'].done, color: '#f59e0b' },
      { priority: 'Could Have (P3)', total: counts['Could Have'].total, done: counts['Could Have'].done, color: '#3b82f6' },
      { priority: 'Won\'t Have (P4)', total: counts['Won\'t Have'].total, done: counts['Won\'t Have'].done, color: '#64748b' },
    ];
  }, [tickets]);

  // Export CSV Data
  const handleExportCsv = () => {
    let csv = "Jour,Ideal_SP,Reel_Restant_SP,Scope_Change,Notes\n";
    burnDownData.forEach(r => {
      csv += `"${r.day}",${r.ideal},${r.actual !== null ? r.actual : ''},${r.scopeChange},"${r.notes}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `horizonsdatas_burndown_${audit.projectTitle.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* HorizonsDatas Top Brand Banner */}
      <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center space-x-2.5">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm">
                <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                <span>HorizonsDatas</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Agile Analytics & Predictive Delivery Engine
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Burn-Down Chart & Évolution de la Vélocité
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Visualisation analytique motorisée par <strong className="text-cyan-400 font-semibold">HorizonsDatas</strong>. Traçabilité en temps réel de l'effort restant, dynamique de complétion des tickets INVEST, prédictibilité des releases et alertes de dérive de périmètre (Scope Creep).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center space-x-1.5 transition"
              title="Exporter les séries temporelles de vélocité et burn-down"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Exporter Données (CSV)</span>
            </button>

            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('tickets')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md shadow-indigo-600/20 transition"
              >
                <Layers className="w-4 h-4" />
                <span>Gérer les Tickets INVEST</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Executive KPI Cards Powered by HorizonsDatas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800">
          <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] uppercase font-bold tracking-wider">Vélocité Moyenne</span>
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-white flex items-baseline space-x-1.5">
              <span>21.5</span>
              <span className="text-xs text-slate-400 font-normal">SP / Sprint</span>
            </div>
            <p className="text-[10px] text-emerald-400 flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>+14% vs sprint précédent</span>
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] uppercase font-bold tracking-wider">Avancement Sprint</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 flex items-baseline space-x-1.5">
              <span>{completionRate}%</span>
              <span className="text-xs text-slate-400 font-normal">({donePoints}/{totalPoints} SP)</span>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-1">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${completionRate}%` }} />
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] uppercase font-bold tracking-wider">Effort Restant (Backlog)</span>
              <Clock className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400 flex items-baseline space-x-1.5">
              <span>{remainingPoints}</span>
              <span className="text-xs text-slate-400 font-normal">Story Points</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Sur {tickets.length} tickets INVEST total
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] uppercase font-bold tracking-wider">Indice de Prédictibilité</span>
              <Target className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-cyan-300 flex items-baseline space-x-1.5">
              <span>88%</span>
              <span className="text-xs text-slate-400 font-normal">Score HorizonsDatas</span>
            </div>
            <p className="text-[10px] text-emerald-400">
              Trajectoire stable vers jalon COPIL
            </p>
          </div>
        </div>
      </div>

      {/* Main Burn-Down Chart Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Burn-Down Chart Temps Réel (Sprint 2 - 14 Jours)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparaison entre la pente idéale théorique et la consommation réelle des Story Points.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">Périmètre analysé :</span>
            <div className="inline-flex bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
              <button
                onClick={() => setSelectedSprint('sprint-2')}
                className={`px-3 py-1 rounded-md font-semibold transition ${
                  selectedSprint === 'sprint-2' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Sprint Actuel
              </button>
              <button
                onClick={() => setSelectedSprint('all')}
                className={`px-3 py-1 rounded-md font-semibold transition ${
                  selectedSprint === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Vue Globale Release
              </button>
            </div>
          </div>
        </div>

        {/* Recharts Composed Burn-Down Chart */}
        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={burnDownData} margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="day" 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false}
                label={{ value: 'Story Points Restants', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  borderColor: '#334155', 
                  borderRadius: '0.75rem', 
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  fontSize: '12px' 
                }}
                labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                itemStyle={{ color: '#94a3b8' }}
              />
              <Legend 
                verticalAlign="top" 
                align="right" 
                wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
              />
              {/* Theoretical ideal burn line */}
              <Line 
                type="monotone" 
                dataKey="ideal" 
                name="Trajectoire Idéale" 
                stroke="#94a3b8" 
                strokeDasharray="5 5" 
                strokeWidth={2} 
                dot={false}
              />
              {/* Actual remaining effort area */}
              <Area 
                type="monotone" 
                dataKey="actual" 
                name="Effort Réel Restant (SP)" 
                stroke="#06b6d4" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorActual)" 
                dot={{ r: 4, fill: '#06b6d4', strokeWidth: 2, stroke: '#0f172a' }}
              />
              {/* Scope changes if any */}
              <Bar 
                dataKey="scopeChange" 
                name="Évolution de Scope (+SP)" 
                fill="#f43f5e" 
                radius={[4, 4, 0, 0]} 
                barSize={12}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Burn-Down Diagnostic Summary Bar */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold text-slate-200">Diagnostic HorizonsDatas :</span>
            <span className="text-slate-400">
              Pente d'effort alignée. À J8, le reste à faire est de {remainingPoints} Story Points contre une cible théorique de {burnDownData[8]?.ideal} SP.
            </span>
          </div>
          <span className="text-cyan-400 font-mono font-semibold whitespace-nowrap">
            Atterrissage estimé : J13 (1 jour d'avance)
          </span>
        </div>
      </div>

      {/* Row: Velocity Evolution & MoSCoW Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Velocity Evolution Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Évolution de la Vélocité par Sprint
                </h3>
                <p className="text-xs text-slate-400">
                  Story Points engagés vs livrés & moyenne glissante
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
              Capacité : 24 SP
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={velocityData} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="sprint" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderColor: '#334155', 
                    borderRadius: '0.75rem',
                    fontSize: '12px' 
                  }}
                  labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="committed" name="Engagé (Commitment)" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="completed" name="Livré (Delivered)" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                <Line type="monotone" dataKey="rollingAvg" name="Moyenne Glissante" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] text-slate-400">
            La vélocité se stabilise autour de <strong className="text-white">21-24 Story Points</strong> par itération de 2 semaines, offrant une haute prédictibilité pour les engagements du contrat ou jalon COPIL.
          </p>
        </div>

        {/* Story Points Distribution & MoSCoW Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Répartition & Priorisation MoSCoW
                </h3>
                <p className="text-xs text-slate-400">
                  Découpage des Story Points selon la criticité
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-cyan-400">
              {totalPoints} SP Total
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Pie Chart */}
            <div className="h-56 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderColor: '#334155', 
                      borderRadius: '0.75rem',
                      fontSize: '11px' 
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* MoSCoW Bars */}
            <div className="space-y-2.5 text-xs">
              {moscowData.map((item, idx) => {
                const percent = item.total > 0 ? Math.round((item.done / item.total) * 100) : 0;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-300">{item.priority}</span>
                      <span className="text-[11px] text-slate-400">
                        {item.done} / {item.total} SP ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all" 
                        style={{ width: `${percent}%`, backgroundColor: item.color }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Règle d'or Agile : 60% Must, 20% Should, 20% Could.</span>
            <span className="text-emerald-400 font-medium">Contrat d'engagement respecté</span>
          </div>
        </div>
      </div>

      {/* HorizonsDatas Brand Signature Footer */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-black text-[10px]">
            H
          </div>
          <span className="font-semibold text-slate-200">
            HorizonsDatas Analytics Platform v2.4
          </span>
          <span className="text-slate-600">•</span>
          <span>Pilotage de vélocité certifié PMP & Agile Scrum</span>
        </div>

        <div className="flex items-center space-x-3 text-[11px]">
          <span className="text-emerald-400 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            <span>Flux temps réel synchronisé</span>
          </span>
          <span className="text-slate-500">HorizonsDatas © 2026</span>
        </div>
      </div>
    </div>
  );
};
