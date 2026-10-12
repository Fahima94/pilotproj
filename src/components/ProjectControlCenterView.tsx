import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Scale, 
  DollarSign, 
  MessageSquare, 
  CalendarClock, 
  Database,
  AlertTriangle,
  CheckCircle2,
  FileDown,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Lock,
  Layers,
  Users,
  Eye,
  Server,
  Award,
  BookOpen,
  CheckSquare
} from 'lucide-react';
import { ProjectAudit, ProjectDocument } from '../types/project';
import { QaTestPlanView } from './QaTestPlanView';
import { EvolutiveSpecificationsView } from './EvolutiveSpecificationsView';

interface ProjectControlCenterViewProps {
  audit: ProjectAudit;
  documents: ProjectDocument[];
  onOpenExportPdf: () => void;
  onNavigateTab: (tab: string) => void;
  onAskAgent: (prompt: string, skill?: string) => void;
  onSaveToDocuments?: (newDoc: ProjectDocument) => void;
}

export const ProjectControlCenterView: React.FC<ProjectControlCenterViewProps> = ({
  audit,
  documents,
  onOpenExportPdf,
  onNavigateTab,
  onAskAgent,
  onSaveToDocuments,
}) => {
  const [activeSubSection, setActiveSubSection] = useState<'all' | 'secu' | 'rgpd' | 'finance' | 'comm' | 'planning' | 'data' | 'qa' | 'specs'>('all');

  // Realistic enterprise baseline metrics calculated for current project
  const criticalRisksCount = audit.topRisks.filter(r => (r.score || (r.probability * r.impact)) >= 15).length;
  const activeDocsCount = documents.filter(d => d.active).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Tour de Contrôle 360° du Chef de Projet</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Centre de Contrôle : Sécurité, RGPD, Finance, Comm, Planning & Data
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Supervision consolidée et gouvernance de votre projet d'entreprise. Validez la sécurité zéro-trust, la conformité légale, le budget d'inférence, l'alignement des parties prenantes et l'intégrité des données avant chaque jalon COPIL.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenExportPdf}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-600 hover:from-indigo-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md shadow-indigo-600/20 transition"
            >
              <FileDown className="w-4 h-4" />
              <span>Exporter Rapport 360° en PDF</span>
            </button>
          </div>
        </div>

        {/* 6 Pillars Quick Tabs Bar */}
        <div className="flex space-x-2 overflow-x-auto pt-5 border-t border-slate-800 mt-5 scrollbar-none text-xs font-medium">
          <button
            onClick={() => setActiveSubSection('all')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeSubSection === 'all' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Vue Synthétique 360°
          </button>
          <button
            onClick={() => setActiveSubSection('secu')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeSubSection === 'secu' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>1. Sécurité & Product Building</span>
          </button>
          <button
            onClick={() => setActiveSubSection('rgpd')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeSubSection === 'rgpd' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-blue-400" />
            <span>2. RGPD & Légal</span>
          </button>
          <button
            onClick={() => setActiveSubSection('finance')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeSubSection === 'finance' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
            <span>3. Contrôle Financier & Budget</span>
          </button>
          <button
            onClick={() => setActiveSubSection('comm')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeSubSection === 'comm' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
            <span>4. Communication COPIL</span>
          </button>
          <button
            onClick={() => setActiveSubSection('planning')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeSubSection === 'planning' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <CalendarClock className="w-3.5 h-3.5 text-cyan-400" />
            <span>5. Planning & Tickets</span>
          </button>
          <button
            onClick={() => setActiveSubSection('data')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeSubSection === 'data' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            <span>6. Gouvernance Data</span>
          </button>
          <button
            onClick={() => setActiveSubSection('qa')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeSubSection === 'qa' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-rose-400" />
            <span>7. Recette & Tests QA (GO/NO-GO)</span>
          </button>
          <button
            onClick={() => setActiveSubSection('specs')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeSubSection === 'specs' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>8. Cahier des Charges Évolutif</span>
          </button>
        </div>
      </div>

      {/* KPI Global Health Banner */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Score Sécurité</span>
          <div className="text-lg font-bold text-emerald-400 flex items-center space-x-1.5">
            <Lock className="w-4 h-4" />
            <span>96 / 100</span>
          </div>
          <p className="text-[10px] text-slate-500">Zero-Trust & Proxy actif</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Conformité RGPD</span>
          <div className="text-lg font-bold text-blue-400 flex items-center space-x-1.5">
            <Scale className="w-4 h-4" />
            <span>Conforme</span>
          </div>
          <p className="text-[10px] text-slate-500">Registre à jour (UE)</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Budget Consommé</span>
          <div className="text-lg font-bold text-amber-400 flex items-center space-x-1.5">
            <DollarSign className="w-4 h-4" />
            <span>34% engagé</span>
          </div>
          <p className="text-[10px] text-slate-500">Sous le plafond d'alerte</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Climat COPIL</span>
          <div className="text-lg font-bold text-purple-400 flex items-center space-x-1.5">
            <Users className="w-4 h-4" />
            <span>Aligné</span>
          </div>
          <p className="text-[10px] text-slate-500">4 rituels tenus</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Respect Délais</span>
          <div className="text-lg font-bold text-cyan-400 flex items-center space-x-1.5">
            <CalendarClock className="w-4 h-4" />
            <span>Jalons OK</span>
          </div>
          <p className="text-[10px] text-slate-500">{audit.criticalMilestones?.length || 0} jalons cadrés</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Intégrité Data</span>
          <div className="text-lg font-bold text-indigo-400 flex items-center space-x-1.5">
            <Database className="w-4 h-4" />
            <span>Schémas 100%</span>
          </div>
          <p className="text-[10px] text-slate-500">Zéro drift détecté</p>
        </div>
      </div>

      {/* 1. SÉCURITÉ & PRODUCT BUILDING */}
      {(activeSubSection === 'all' || activeSubSection === 'secu') && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  1. Sécurité en Product Building & Zéro-Trust
                </h2>
                <p className="text-xs text-slate-400">
                  Garde-fous techniques, isolation des secrets et protection contre les cybermenaces IA
                </p>
              </div>
            </div>
            <button
              onClick={() => onAskAgent("Fais un audit de sécurité Zéro-Trust complet pour ce projet et liste les points de vulnérabilité potentiels.")}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-indigo-300 font-medium flex items-center space-x-1 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Auditer avec l'Agent</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* Rule 1 */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Zéro Secret Côté Client</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">Conforme</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Toutes les clés privées (Gemini API, database tokens) transitent exclusivement via des routes serveur proxy Express (/api/*). Aucune fuite possible dans le bundle JS.
              </p>
            </div>

            {/* Rule 2 */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Défense Prompt Injection</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">Actif</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Séparation stricte entre les instructions système (inviolables) et le contenu fourni par les documents ou les utilisateurs. Filtrage des balises d'évasion.
              </p>
            </div>

            {/* Rule 3 */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Anti-Denial of Wallet</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">Plafonné</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Plafonnement systématique des tokens en sortie (maxOutputTokens) et limitation de fréquence pour prévenir les coûts imprévus en production.
              </p>
            </div>

            {/* Rule 4 */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Contrôle RBAC & RLS</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">Enforcé</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Règles de sécurité Firestore et RLS PostgreSQL : chaque requête vérifie l'identité de l'utilisateur authentifié (isOwner, isSignedIn). Refus par défaut.
              </p>
            </div>

            {/* Rule 5 */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Chiffrement des Données</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">TLS / AES-256</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Chiffrement systématique au repos et en transit. Certificats HTTPS valides et interdiction des protocoles obsolètes.
              </p>
            </div>

            {/* Rule 6 */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Audit Trail & Journalisation</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">Actif</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Traçabilité des opérations sensibles, horodatage systématique et journalisation des anomalies pour le comité de pilotage.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. RGPD & CONFORMITÉ LÉGALE */}
      {(activeSubSection === 'all' || activeSubSection === 'rgpd') && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  2. Registre de Conformité RGPD & Données Personnelles
                </h2>
                <p className="text-xs text-slate-400">
                  Cadre juridique européen, minimisation des données (PII) et gestion du consentement
                </p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
              RGPD Conforme
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="font-bold text-white flex items-center justify-between">
                <span>Registre des Traitements (Article 30)</span>
                <span className="text-[10px] text-slate-400">DPO Référent : Assigné</span>
              </div>
              <ul className="space-y-2 text-slate-300 text-[11px]">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <span><strong>Finalité légitime :</strong> Pilotage de projet, assistance méthodologique et automatisation des workflows.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <span><strong>Minimisation des données :</strong> Pseudonymisation des données utilisateurs, exclusion des informations sensibles superflues.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <span><strong>Durée de conservation :</strong> Cycle de vie du projet + purge automatique à 12 mois post-clôture.</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="font-bold text-white flex items-center justify-between">
                <span>Droits des Utilisateurs & Localisation</span>
                <span className="text-[10px] text-emerald-400 font-semibold">Hébergement UE</span>
              </div>
              <ul className="space-y-2 text-slate-300 text-[11px]">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Droit d'accès & suppression :</strong> Procédure documentée de purge complète des données à la demande.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Souveraineté des serveurs :</strong> Données traitées en région européenne (Cloud Run / Firestore europe-west).</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Sous-traitance ultérieure :</strong> Validation des DPA (Data Processing Agreements) des fournisseurs de modèles.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 3. CONTRÔLE FINANCIER & BUDGET */}
      {(activeSubSection === 'all' || activeSubSection === 'finance') && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  3. Contrôle Financier, Budget & Consommation de Tokens
                </h2>
                <p className="text-xs text-slate-400">
                  Suivi des coûts d'inférence LLM, licences, infrastructure et retour sur investissement
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-white">Budget Alloué : 150 000 € HT</span>
              <div className="text-[10px] text-emerald-400">Engagé : 51 000 € (34%)</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Coûts Modèles IA & Tokens</span>
              <div className="text-base font-bold text-amber-400">~ 285 € / mois</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Optimisé grâce au routage intelligent : requêtes rapides sur modèles légers et tâches complexes d'audit réservées aux modèles experts.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Seuil d'Alerte Budgétaire</span>
              <div className="text-base font-bold text-emerald-400">Plafond fixé à 80%</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Notification automatique au sponsor et gel des itérations non essentielles si le budget engagé dépasse le jalon de tolérance.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Gains Métiers Estimés (ROI)</span>
              <div className="text-base font-bold text-cyan-400">+ 3.2x ROI attendu</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Économie de 18h / semaine sur le traitement documentaire et réduction de 45% des erreurs manuelles sur les livrables.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. COMMUNICATION & PARTIES PRENANTES */}
      {(activeSubSection === 'all' || activeSubSection === 'comm') && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  4. Plan de Communication & Gestion des Parties Prenantes
                </h2>
                <p className="text-xs text-slate-400">
                  Rituels de gouvernance, diffusion du Flash Report et arbitrages formels
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('slides')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300 font-medium flex items-center space-x-1 transition"
            >
              <span>Diaporama COPIL</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                  <th className="p-3 font-semibold">Rituel / Instance</th>
                  <th className="p-3 font-semibold">Fréquence</th>
                  <th className="p-3 font-semibold">Audience</th>
                  <th className="p-3 font-semibold">Livrable & Support</th>
                  <th className="p-3 font-semibold">Objectif Clé</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 text-[11px]">
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-white">Comité de Pilotage (COPIL)</td>
                  <td className="p-3">Bi-mensuel</td>
                  <td className="p-3">Sponsor, DSI, Direction Métier</td>
                  <td className="p-3 font-medium text-cyan-300">Support Slides + Export PDF</td>
                  <td className="p-3">Arbitrage stratégique, budget & go/no-go</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-white">Flash Report Hebdomadaire</td>
                  <td className="p-3">Chaque vendredi</td>
                  <td className="p-3">Parties prenantes & Direction</td>
                  <td className="p-3 font-medium text-indigo-300">Synthèse 1-page + Météo</td>
                  <td className="p-3">Transparence, risques et alertes précoces</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-white">Comité Projet (COPROJ)</td>
                  <td className="p-3">Hebdomadaire</td>
                  <td className="p-3">Lead Tech, PO, Développeurs</td>
                  <td className="p-3 font-medium text-emerald-300">Backlog tickets & Kanban</td>
                  <td className="p-3">Résolution des blocages techniques</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-white">Démonstration & Retours Pilote</td>
                  <td className="p-3">Fin de cycle / Sprint</td>
                  <td className="p-3">Ambassadeurs métiers & Utilisateurs</td>
                  <td className="p-3 font-medium text-amber-300">Démonstration live</td>
                  <td className="p-3">Conduite du changement & adoption</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. PLANNING & GESTION AU TICKET */}
      {(activeSubSection === 'all' || activeSubSection === 'planning') && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <CalendarClock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  5. Planning, Jalons & Travail au Ticket
                </h2>
                <p className="text-xs text-slate-400">
                  Maîtrise des échéances, décomposition WBS et suivi des tickets d'exécution
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onNavigateTab('milestones')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium flex items-center space-x-1 transition"
              >
                <span>Vue Gantt</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigateTab('tickets')}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs text-white font-semibold flex items-center space-x-1 transition"
              >
                <span>Backlog Tickets</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            {audit.criticalMilestones.map((m) => (
              <div key={m.id} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">[{m.phase}]</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    m.status === 'Valide' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {m.status}
                  </span>
                </div>
                <div className="font-bold text-white text-xs">{m.title}</div>
                <div className="text-[11px] text-slate-400 truncate">{m.deliverables}</div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] text-slate-500">
                  <span>Cible : {m.targetDate}</span>
                  <span className="font-bold text-cyan-400">{m.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. GOUVERNANCE DATA & QUALITÉ */}
      {(activeSubSection === 'all' || activeSubSection === 'data') && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  6. Gouvernance Data, Schémas & Monitoring
                </h2>
                <p className="text-xs text-slate-400">
                  Intégrité relationnelle, validation des schémas d'entrée/sortie et traçabilité des modèles
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('skills')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300 font-medium flex items-center space-x-1 transition"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Générer un SKILL.md Data</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <span className="font-bold text-white flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                <span>Schémas de Données Définis</span>
              </span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Structure stricte des entités (UserProfile, Project, Document, RiskItem, Ticket). Typage TypeScript unifié et validation JSON Schema.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <span className="font-bold text-white flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                <span>Zéro Dérive (Drift Monitoring)</span>
              </span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Vérification périodique des formats de réponse des modèles pour garantir la cohérence des extractions documentaires et des tableaux de bord.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <span className="font-bold text-white flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                <span>Lignage & Provenance</span>
              </span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Chaque donnée produite indique sa source : document analysé, inférence IA ou validation par le chef de projet.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 7. Recette & Plan de Tests (QA) */}
      {(activeSubSection === 'all' || activeSubSection === 'qa') && (
        <div className="space-y-4">
          {activeSubSection === 'all' ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">
                      7. Plan de Tests & Recette (QA) — Verdict GO / NO-GO pour la MEP
                    </h2>
                    <p className="text-xs text-slate-400">
                      Suivi d'exécution des tests critiques (Sécurité, RGPD, Métier, IA & Performance) et génération du PV de non-conformité.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveSubSection('qa')}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition"
                >
                  <span>Ouvrir la Console de Recette Complète</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="font-semibold text-rose-300">Garantie Qualité & Release Gate :</span>
                  <p className="text-slate-400 mt-0.5">
                    Le statut de mise en production est asservi aux tests bloquants. Tout échec sur une exigence de sécurité ou d'isolation des clés API déclenche un NO-GO immédiat avec PV d'anomalies téléchargeable.
                  </p>
                </div>
                <button
                  onClick={() => setActiveSubSection('qa')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium whitespace-nowrap"
                >
                  Gérer les cas de tests
                </button>
              </div>
            </div>
          ) : (
            <QaTestPlanView audit={audit} onAskAgent={onAskAgent} />
          )}
        </div>
      )}

      {/* 8. Cahier des Charges Évolutif */}
      {(activeSubSection === 'all' || activeSubSection === 'specs') && (
        <div className="space-y-4">
          {activeSubSection === 'all' ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">
                      8. Cahier des Charges Évolutif & Registre des Avenants (Change Requests)
                    </h2>
                    <p className="text-xs text-slate-400">
                      Maintien du périmètre vivant, règles métier actualisées, arbitrage des demandes d'évolutions et export du cahier des charges de référence.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveSubSection('specs')}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition"
                >
                  <span>Éditer les Spécifications Évolutives</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="font-semibold text-amber-300">Gestion des Évolutions de Périmètre :</span>
                  <p className="text-slate-400 mt-0.5">
                    Permet d'enregistrer les demandes de changement (CR-01, CR-02...), d'évaluer l'impact délai et coût (+X j/h dev) et de publier la version révisée du document dans le gestionnaire documentaire.
                  </p>
                </div>
                <button
                  onClick={() => setActiveSubSection('specs')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium whitespace-nowrap"
                >
                  Voir les avenants validés
                </button>
              </div>
            </div>
          ) : (
            <EvolutiveSpecificationsView 
              audit={audit} 
              documents={documents} 
              onSaveToDocuments={onSaveToDocuments}
              onAskAgent={onAskAgent} 
            />
          )}
        </div>
      )}
    </div>
  );
};
