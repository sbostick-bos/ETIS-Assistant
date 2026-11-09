import React, { useState } from 'react';
import { WorkspaceItem, WorkspaceSource } from '../types/gid';
import { 
  FolderSync, 
  FileText, 
  Table, 
  Mail, 
  Calendar, 
  ExternalLink, 
  Check, 
  RefreshCw, 
  Sparkles, 
  ShieldAlert, 
  ShieldCheck,
  Search
} from 'lucide-react';

interface WorkspaceIntegrationsPanelProps {
  items: WorkspaceItem[];
  isSignedIn: boolean;
  onRefreshLive: () => void;
  isRefreshing: boolean;
  onSignIn: () => void;
}

export const WorkspaceIntegrationsPanel: React.FC<WorkspaceIntegrationsPanelProps> = ({
  items,
  isSignedIn,
  onRefreshLive,
  isRefreshing,
  onSignIn,
}) => {
  const [activeSource, setActiveSource] = useState<'all' | WorkspaceSource>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRelevance, setFilterRelevance] = useState<'all' | 'Core ETIS' | 'Supporting' | 'Time Leak'>('all');

  const filteredItems = items.filter((item) => {
    if (activeSource !== 'all' && item.source !== activeSource) return false;
    if (filterRelevance !== 'all' && item.relevanceToEtis !== filterRelevance) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.snippet.toLowerCase().includes(q) ||
        item.senderOrOwner.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getSourceIcon = (source: WorkspaceSource) => {
    switch (source) {
      case 'drive':
        return <FileText className="w-4 h-4 text-amber-600" />;
      case 'sheets':
        return <Table className="w-4 h-4 text-emerald-600" />;
      case 'gmail':
        return <Mail className="w-4 h-4 text-rose-600" />;
      case 'calendar':
        return <Calendar className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-5">
      
      {/* Top Banner: Connection Status & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900">
              Google Workspace Intelligence Feed
            </h3>
            <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-medium ${
              isSignedIn ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-700'
            }`}>
              {isSignedIn ? 'Live OAuth Active' : 'Gulliver Prep Demo Environment'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Aggregated Drive curriculum files, tracking Sheets, Gmail faculty threads, and coaching Calendar events
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSignedIn ? (
            <button
              onClick={onRefreshLive}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync with Google'}</span>
            </button>
          ) : (
            <button
              onClick={onSignIn}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors shadow-xs"
            >
              <FolderSync className="w-3.5 h-3.5" />
              <span>Connect Live Google Workspace</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Source tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-md text-xs">
          <button
            onClick={() => setActiveSource('all')}
            className={`px-3 py-1 font-medium rounded transition-colors ${
              activeSource === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Sources ({items.length})
          </button>
          <button
            onClick={() => setActiveSource('drive')}
            className={`px-3 py-1 font-medium rounded transition-colors flex items-center gap-1.5 ${
              activeSource === 'drive' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-600" />
            <span>Drive</span>
          </button>
          <button
            onClick={() => setActiveSource('sheets')}
            className={`px-3 py-1 font-medium rounded transition-colors flex items-center gap-1.5 ${
              activeSource === 'sheets' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Table className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sheets</span>
          </button>
          <button
            onClick={() => setActiveSource('gmail')}
            className={`px-3 py-1 font-medium rounded transition-colors flex items-center gap-1.5 ${
              activeSource === 'gmail' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-rose-600" />
            <span>Gmail</span>
          </button>
          <button
            onClick={() => setActiveSource('calendar')}
            className={`px-3 py-1 font-medium rounded transition-colors flex items-center gap-1.5 ${
              activeSource === 'calendar' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Calendar</span>
          </button>
        </div>

        {/* Search input and relevance filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-44"
            />
          </div>

          <select
            value={filterRelevance}
            onChange={(e) => setFilterRelevance(e.target.value as any)}
            className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-700 focus:outline-none"
          >
            <option value="all">All Relevancy</option>
            <option value="Core ETIS">Core ETIS</option>
            <option value="Supporting">Supporting</option>
            <option value="Time Leak">Time Leak</option>
          </select>
        </div>
      </div>

      {/* Feed Items Table */}
      <div className="divide-y divide-slate-100 border border-slate-200 rounded-md overflow-hidden">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const isLeak = item.relevanceToEtis === 'Time Leak';
            const isCore = item.relevanceToEtis === 'Core ETIS';

            return (
              <div
                key={item.id}
                className={`p-4 transition-colors ${
                  isLeak ? 'bg-rose-50/20 hover:bg-rose-50/40' : 'hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2 bg-slate-100 rounded-md shrink-0 mt-0.5">
                      {getSourceIcon(item.source)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-baseline gap-2">
                        <h4 className="text-sm font-semibold text-slate-900 truncate">
                          {item.title}
                        </h4>
                      </div>

                      <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                        {item.snippet}
                      </p>

                      {/* Clean unboxed metadata with dot separators */}
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500 mt-2">
                        <span>{item.senderOrOwner}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">{item.timestamp}</span>
                        <span aria-hidden="true">·</span>
                        <span className={`font-medium ${
                          isCore ? 'text-emerald-700' :
                          isLeak ? 'text-rose-600 font-semibold' : 'text-slate-600'
                        }`}>
                          {item.relevanceToEtis}
                        </span>
                        {item.associatedGidStage && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-indigo-600 font-mono font-medium">
                              Stage: {item.associatedGidStage.toUpperCase()}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Recommended action note */}
                      <div className="mt-2 text-[11px] bg-slate-50 p-2 rounded border border-slate-100 text-slate-700 flex items-start gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-slate-900">Suggested Action:</strong> {item.suggestedAction}
                        </span>
                      </div>
                    </div>
                  </div>

                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 text-slate-400 hover:text-indigo-600 shrink-0"
                      title="Open in Google"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-xs text-slate-500">
            No workspace items match your current filter.
          </div>
        )}
      </div>

    </div>
  );
};
