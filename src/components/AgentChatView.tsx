import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ProjectDocument } from '../types/project';
import { 
  BotMessageSquare, 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  Trash2, 
  FileText, 
  ShieldAlert, 
  Users, 
  CalendarClock, 
  FileCheck,
  Compass,
  AlertTriangle,
  Lightbulb,
  Globe,
  ExternalLink,
  Cpu,
  UserCheck
} from 'lucide-react';

interface AgentChatViewProps {
  messages: ChatMessage[];
  onSendMessage: (content: string, options?: { skillBadge?: string; roleType?: string; model?: string; searchGrounding?: boolean }) => void;
  isLoading: boolean;
  onClearChat: () => void;
  activeDocuments: ProjectDocument[];
}

export const AgentChatView: React.FC<AgentChatViewProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onClearChat,
  activeDocuments,
}) => {
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<'pmp' | 'science' | 'architect' | 'po'>('pmp');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.8-flash');
  const [searchGrounding, setSearchGrounding] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim(), {
      roleType: selectedRole,
      model: selectedModel,
      searchGrounding,
    });
    setInput('');
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const roles = [
    { id: 'pmp', label: 'Chef de Projet Senior (PMP)', icon: '👑' },
    { id: 'science', label: 'Directeur R&D (Science Skills)', icon: '🔬' },
    { id: 'architect', label: 'Lead Architecte & Sécurité', icon: '🛡️' },
    { id: 'po', label: 'Product Owner & Agile', icon: '⚡' },
  ];

  const models = [
    { id: 'gemini-3.8-flash', label: 'Gemini 3.8 Flash (Équilibré)' },
    { id: 'gemini-3.5-flash', label: 'Gemini 3.5 Flash (Search Grounding)' },
    { id: 'gemini-3.1-pro-preview', label: 'Gemini 3.1 Pro (Raisonnement Complexe)' },
    { id: 'gemini-3.1-flash-lite', label: 'Gemini 3.1 Flash Lite (Rapide)' },
  ];

  const quickSkills = [
    {
      id: 'audit',
      label: 'Audit & Diagnostic',
      icon: Compass,
      prompt: "Fais une analyse critique des documents de ce projet : points forts, angles morts et recommandations.",
    },
    {
      id: 'risks',
      label: 'Matrice des Risques 5x5',
      icon: ShieldAlert,
      prompt: "Identifie les 5 risques majeurs avec leur scoring PxG (1-5), déclencheur et plan de contingence.",
    },
    {
      id: 'flash',
      label: 'Flash Report COPIL',
      icon: FileCheck,
      prompt: "Rédige le Flash Report hebdomadaire pour le COPIL avec météo 🟢/🟡/🔴, réalisations, alertes et arbitrages.",
    },
    {
      id: 'science_review',
      label: 'Audit Scientifique & Cibles',
      icon: Sparkles,
      prompt: "Analyse la rationalité scientifique, la validation de cible (UniProt/AlphaFold) et les contraintes réglementaires (ANSM/FDA/EMA).",
    },
    {
      id: 'raci',
      label: 'Gouvernance RACI',
      icon: Users,
      prompt: "Propose une matrice RACI pour les activités majeures du projet en clarifiant les rôles.",
    },
    {
      id: 'gantt',
      label: 'Planning & Jalons',
      icon: CalendarClock,
      prompt: "Découpe le projet en phases méthodologiques avec jalons critiques et dépendances.",
    },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[550px] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Bar with Role & Model Configuration */}
      <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-teal-500 flex items-center justify-center text-white shadow-md">
            <BotMessageSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-white text-xs sm:text-sm">
                Chatbot Multi-Turn Gemini
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Actif
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center space-x-1.5">
              <FileText className="w-3 h-3 text-indigo-400" />
              <span>{activeDocuments.length} document{activeDocuments.length > 1 ? 's' : ''} en mémoire</span>
            </div>
          </div>
        </div>

        {/* Controls: Role, Model, Search Grounding */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Role selector */}
          <div className="flex items-center space-x-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
            <UserCheck className="w-3.5 h-3.5 text-indigo-400 ml-1.5" />
            <select
              value={selectedRole}
              onChange={(e: any) => setSelectedRole(e.target.value)}
              className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none pr-2 cursor-pointer"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id} className="bg-slate-900 text-slate-200">
                  {r.icon} {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Model selector */}
          <div className="flex items-center space-x-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
            <Cpu className="w-3.5 h-3.5 text-cyan-400 ml-1.5" />
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none pr-2 cursor-pointer"
            >
              {models.map((m) => (
                <option key={m.id} value={m.id} className="bg-slate-900 text-slate-200">
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search Grounding toggle */}
          <button
            onClick={() => setSearchGrounding(!searchGrounding)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition border ${
              searchGrounding
                ? 'bg-blue-600/20 text-blue-300 border-blue-500/50 shadow-sm'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="Activer Google Search Grounding pour interroger le web en temps réel"
          >
            <Globe className={`w-3.5 h-3.5 ${searchGrounding ? 'text-blue-400 animate-pulse' : 'text-slate-500'}`} />
            <span>Search Grounding</span>
          </button>

          <button
            onClick={onClearChat}
            className="text-xs text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition"
            title="Réinitialiser l'historique"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Skill Chips Bar */}
      <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-950/40 flex items-center space-x-2 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 flex items-center space-x-1 shrink-0 pl-1">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span>Skills rapides :</span>
        </span>
        {quickSkills.map((skill) => {
          const Icon = skill.icon;
          return (
            <button
              key={skill.id}
              onClick={() => onSendMessage(skill.prompt, { skillBadge: skill.label, roleType: selectedRole, model: selectedModel, searchGrounding })}
              disabled={isLoading}
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-800/70 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 hover:border-indigo-500/50 whitespace-nowrap transition disabled:opacity-50"
            >
              <Icon className="w-3 h-3 text-indigo-400" />
              <span>{skill.label}</span>
            </button>
          );
        })}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 select-text">
        {messages.length === 0 && (
          <div className="py-12 text-center max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Conversation multi-turn avec le Chef de Projet IA
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Choisissez un rôle spécialisé (Chef de Projet, R&D Scientifique, Architecte, Product Owner) et dialoguez en vous appuyant sur vos documents de projet et la recherche Google.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() =>
                  onSendMessage(
                    'Bonjour, analyse les documents de ce projet et formule tes 3 recommandations majeures selon ton rôle.',
                    { roleType: selectedRole, model: selectedModel, searchGrounding }
                  )
                }
                className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Lancer le diagnostic initial</span>
              </button>
            </div>
          </div>
        )}

        {messages.map((msg: any) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-blue-600 to-teal-500 flex items-center justify-center text-white shrink-0 shadow-md">
                  <BotMessageSquare className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-[13px] leading-relaxed relative group ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-800/80 text-slate-200 border border-slate-700/60 rounded-tl-none'
                }`}
              >
                {msg.skillBadge && (
                  <div className="mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Skill : {msg.skillBadge}
                    </span>
                  </div>
                )}

                <div className="whitespace-pre-wrap font-sans space-y-2">
                  {msg.content}
                </div>

                {/* Grounding Source Citations if present */}
                {msg.searchGrounding?.groundingChunks && msg.searchGrounding.groundingChunks.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-700/60 space-y-1.5">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                      <Globe className="w-3 h-3 text-blue-400" />
                      <span>Sources Google Search :</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.searchGrounding.groundingChunks.map((c: any, i: number) => {
                        if (!c.web) return null;
                        return (
                          <a
                            key={i}
                            href={c.web.uri}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] bg-slate-900 hover:bg-slate-700 text-blue-300 border border-slate-700 truncate max-w-xs transition"
                          >
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                            <span className="truncate">{c.web.title || c.web.uri}</span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/10 text-[10px] opacity-70">
                  <div className="flex items-center space-x-2">
                    <span>{msg.timestamp}</span>
                    {msg.modelUsed && <span>• {msg.modelUsed}</span>}
                  </div>
                  {!isUser && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="p-1 rounded hover:bg-slate-700 transition flex items-center space-x-1"
                      title="Copier la réponse"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedId === msg.id ? 'Copié' : 'Copier'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-blue-600 to-teal-500 flex items-center justify-center text-white shrink-0 shadow-md">
              <BotMessageSquare className="w-4 h-4" />
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl rounded-tl-none p-4 text-xs text-slate-300 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                <span className="font-medium text-teal-300">
                  L'Agent {roles.find((r) => r.id === selectedRole)?.label} réfléchit...
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {searchGrounding
                  ? 'Recherche Google en direct & recoupement avec vos documents...'
                  : 'Analyse méthodique des documents et élaboration de la réponse...'}
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900/90">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder={`Poser une question en mode "${roles.find((r) => r.id === selectedRole)?.label}"...`}
            className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 text-white font-medium text-xs flex items-center space-x-1.5 shadow-md shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <span>Envoyer</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
