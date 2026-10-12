import React from 'react';
import { 
  FolderGit2, 
  FileText, 
  LayoutDashboard, 
  CalendarClock, 
  ShieldAlert, 
  Users, 
  BotMessageSquare, 
  Sparkles,
  Plus,
  RefreshCw,
  FolderOpen,
  Atom,
  LogIn,
  LogOut,
  User,
  Cloud,
  Mic,
  Presentation
} from 'lucide-react';
import { ProjectAudit } from '../types/project';
import { User as FirebaseUser } from 'firebase/auth';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  documentCount: number;
  activeDocCount: number;
  audit: ProjectAudit | null;
  onOpenUpload: () => void;
  onRunAudit: () => void;
  isAuditing: boolean;
  onOpenSampleModal: () => void;
  onOpenMeetingRecorder: () => void;
  currentUser: FirebaseUser | null;
  onLogin: () => void;
  onLogout: () => void;
  isLoggingIn: boolean;
  isSavingFirestore?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  documentCount,
  activeDocCount,
  audit,
  onOpenUpload,
  onRunAudit,
  isAuditing,
  onOpenSampleModal,
  onOpenMeetingRecorder,
  currentUser,
  onLogin,
  onLogout,
  isLoggingIn,
  isSavingFirestore = false,
}) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'VERT':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'JAUNE':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'ROUGE':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Vue d’ensemble', icon: LayoutDashboard },
    { id: 'slides', label: 'Studio Slides', icon: Presentation, badge: 'COPIL' },
    { id: 'chat', label: 'Chatbot Gemini', icon: BotMessageSquare, badge: 'Multi-turn' },
    { id: 'science', label: 'Science Skills', icon: Atom, badge: 'R&D' },
    { id: 'documents', label: 'Documents Projet', icon: FileText, count: activeDocCount },
    { id: 'milestones', label: 'Planning & Jalons', icon: CalendarClock },
    { id: 'risks', label: 'Matrice des Risques', icon: ShieldAlert },
    { id: 'raci', label: 'Gouvernance RACI', icon: Users },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/95 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Project Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-white tracking-tight text-base sm:text-lg">
                  Chef de Projet IA
                </span>
                <span className="px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">
                  Agent Skills
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-xs sm:max-w-md">
                {audit?.projectTitle || 'Workspace de pilotage documentaire & R&D'}
              </p>
            </div>
          </div>

          {/* Quick Stats, Auth & Primary Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Firestore Cloud Sync Status */}
            {currentUser && (
              <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700" title="Synchronisé avec Firebase Firestore">
                <Cloud className={`w-3.5 h-3.5 ${isSavingFirestore ? 'text-amber-400 animate-spin' : 'text-emerald-400'}`} />
                <span>{isSavingFirestore ? 'Sauvegarde...' : 'Firestore'}</span>
              </div>
            )}

            {/* Google Auth Status / Login Button */}
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-200">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="Avatar"
                      className="w-4 h-4 rounded-full"
                    />
                  ) : (
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                  )}
                  <span className="truncate max-w-[100px] hidden sm:inline">
                    {currentUser.displayName || currentUser.email}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition"
                  title="Se déconnecter"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                disabled={isLoggingIn}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                title="Se connecter avec Google pour sauvegarder dans Firestore"
              >
                {isLoggingIn ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.1-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                    />
                  </svg>
                )}
                <span>{isLoggingIn ? 'Connexion...' : 'Google Auth'}</span>
              </button>
            )}

            <button
              onClick={onOpenMeetingRecorder}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 shadow-sm transition"
              title="Enregistrer et transcrire un Meet en direct avec Gemini 3.5 Transcribe"
            >
              <Mic className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>Enregistrer Meet</span>
            </button>

            <button
              onClick={onOpenSampleModal}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Charger un dossier exemple (E-Commerce, RH, Biotech R&D)"
            >
              <FolderOpen className="w-3.5 h-3.5 text-slate-400" />
              <span>Dossiers types</span>
            </button>

            <button
              onClick={onRunAudit}
              disabled={isAuditing || activeDocCount === 0}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-md shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isAuditing ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
              )}
              <span>{isAuditing ? 'Audit...' : 'Auditer'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.count !== undefined && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-semibold ${
                      isActive ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
                {item.badge && (
                  <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
