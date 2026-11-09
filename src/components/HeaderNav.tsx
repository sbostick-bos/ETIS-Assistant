import React from 'react';
import { User } from 'firebase/auth';
import { 
  FileText, 
  Layers, 
  CheckSquare, 
  FolderSync, 
  Sparkles, 
  BarChart3, 
  Lightbulb, 
  LogOut, 
  ExternalLink 
} from 'lucide-react';

interface HeaderNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  isAuthenticating: boolean;
  onOpenReportModal: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentTab,
  onSelectTab,
  user,
  onSignIn,
  onSignOut,
  isAuthenticating,
  onOpenReportModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              E
            </div>
            <a 
              href="#overview" 
              onClick={(e) => { e.preventDefault(); onSelectTab('overview'); }}
              className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap"
            >
              ETIS Command
            </a>
          </div>

          {/* Zone 2: 4-5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => onSelectTab('overview')}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 text-sm ${
                currentTab === 'overview' 
                  ? 'border-indigo-600 text-indigo-600 font-semibold' 
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Overview & Tasks
            </button>
            <button
              onClick={() => onSelectTab('gid')}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 text-sm ${
                currentTab === 'gid' 
                  ? 'border-indigo-600 text-indigo-600 font-semibold' 
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              GID Project Matrix
            </button>
            <button
              onClick={() => onSelectTab('workspace')}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 text-sm ${
                currentTab === 'workspace' 
                  ? 'border-indigo-600 text-indigo-600 font-semibold' 
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Workspace Hub
            </button>
            <button
              onClick={() => onSelectTab('role')}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 text-sm ${
                currentTab === 'role' 
                  ? 'border-indigo-600 text-indigo-600 font-semibold' 
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Role Relevancy
            </button>
            <button
              onClick={() => onSelectTab('ai_hub')}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 text-sm ${
                currentTab === 'ai_hub' 
                  ? 'border-indigo-600 text-indigo-600 font-semibold' 
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Faculty AI Studio
            </button>
          </nav>

          {/* Zone 3: 1 primary action & auth lockup */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenReportModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Generate Report</span>
            </button>

            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <span className="text-xs text-slate-600 hidden lg:inline truncate max-w-[140px]">
                  {user.email}
                </span>
                <button
                  onClick={onSignOut}
                  title="Sign out of Google"
                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onSignIn}
                disabled={isAuthenticating}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-md transition-colors shadow-sm whitespace-nowrap"
              >
                <FolderSync className="w-3.5 h-3.5" />
                <span>{isAuthenticating ? 'Connecting...' : 'Sign in with Google'}</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
