import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { 
  initAuth, 
  googleSignIn, 
  googleLogout 
} from './services/googleAuth';
import { 
  fetchLiveDriveFiles, 
  fetchLiveCalendarEvents, 
  fetchLiveGmailMessages 
} from './services/googleWorkspace';
import { 
  GidProject, 
  DailyTask, 
  WorkspaceItem 
} from './types/gid';
import { 
  INITIAL_GID_PROJECTS, 
  INITIAL_DAILY_TASKS, 
  INITIAL_WORKSPACE_ITEMS 
} from './data/mockData';
import { HeaderNav } from './components/HeaderNav';
import { KpiSummaryRow } from './components/KpiSummaryRow';
import { GidMilestoneTracker } from './components/GidMilestoneTracker';
import { DailyTaskBoard } from './components/DailyTaskBoard';
import { WorkspaceIntegrationsPanel } from './components/WorkspaceIntegrationsPanel';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { RoleRelevancyView } from './components/RoleRelevancyView';
import { FacultyAiHub } from './components/FacultyAiHub';
import { ReportGeneratorModal } from './components/ReportGeneratorModal';
import { ExternalLink, AlertCircle, X } from 'lucide-react';
import { safeGetStorage, safeSetStorage, safeRemoveStorage } from './utils/safeStorage';

// Strictly block any legacy or sub-9th-grade entries from appearing in GID / tasks / workspace state
const SUB_NINTH_REGEX = /\b(k[-–]12|pk[-–]12|pk[-–]5|k[-–]8|6[-–]8|kindergarten|pre-?k|elementary|lower school|middle school|grades?\s*[1-8]\b|[1-8](st|nd|rd|th)\s*grade|book creator)\b/i;

function isStrictlyUpperSchoolProject(p: GidProject): boolean {
  const combined = `${p.title} ${p.gradeLevel} ${p.department}`;
  if (SUB_NINTH_REGEX.test(combined)) return false;
  return /\b(grades?\s*(9|10|11|12)|(9|10|11|12)th|grades\s*9[-–]12|grades\s*11[-–]12|upper school|ap\s|honors)\b/i.test(combined);
}

function isStrictlyUpperSchoolText(text: string): boolean {
  return !SUB_NINTH_REGEX.test(text);
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isRefreshingWorkspace, setIsRefreshingWorkspace] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Purge stale legacy localStorage keys that previously held sub-9th-grade seed units
  useEffect(() => {
    safeRemoveStorage('etis_projects');
    safeRemoveStorage('etis_tasks');
    safeRemoveStorage('etis_workspace_items');
    safeRemoveStorage('gid_resource_library');
    safeRemoveStorage('compliance_checklist_state');
  }, []);

  // Core Data State (versioned to Upper School Grades 9-12 & sanitized on load)
  const [projects, setProjects] = useState<GidProject[]>(() => {
    try {
      const saved = safeGetStorage('etis_projects_us912_v3');
      if (saved) {
        const parsed: GidProject[] = JSON.parse(saved);
        const valid = parsed.filter(isStrictlyUpperSchoolProject);
        if (valid.length > 0) return valid;
      }
    } catch {
      // fallback to clean seed data
    }
    return INITIAL_GID_PROJECTS;
  });

  const [tasks, setTasks] = useState<DailyTask[]>(() => {
    try {
      const saved = safeGetStorage('etis_tasks_us912_v3');
      if (saved) {
        const parsed: DailyTask[] = JSON.parse(saved);
        const valid = parsed.filter((t) =>
          isStrictlyUpperSchoolText(`${t.title} ${t.relatedProject || ''} ${t.notes || ''}`)
        );
        if (valid.length > 0) return valid;
      }
    } catch {
      // fallback to clean seed data
    }
    return INITIAL_DAILY_TASKS;
  });

  const [workspaceItems, setWorkspaceItems] = useState<WorkspaceItem[]>(() => {
    try {
      const saved = safeGetStorage('etis_workspace_items_us912_v3');
      if (saved) {
        const parsed: WorkspaceItem[] = JSON.parse(saved);
        const valid = parsed.filter((w) =>
          isStrictlyUpperSchoolText(`${w.title} ${w.snippet} ${w.senderOrOwner}`)
        );
        if (valid.length > 0) return valid;
      }
    } catch {
      // fallback to clean seed data
    }
    return INITIAL_WORKSPACE_ITEMS;
  });

  // Save to versioned localStorage on change
  useEffect(() => {
    safeSetStorage('etis_projects_us912_v3', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    safeSetStorage('etis_tasks_us912_v3', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    safeSetStorage('etis_workspace_items_us912_v3', JSON.stringify(workspaceItems));
  }, [workspaceItems]);

  // Initialize Firebase Auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (authenticatedUser) => {
        setUser(authenticatedUser);
      },
      () => {
        setUser(null);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Handle Google Sign-in
  const handleGoogleSignIn = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        await handleRefreshLiveWorkspace();
      }
    } catch (err: any) {
      console.error('Sign-in error:', err);
      const code = err?.code || '';
      if (code === 'auth/popup-blocked' || code === 'auth/operation-not-supported-in-this-environment') {
        setAuthError(
          'Your browser or embedded Google Site blocked the Google Sign-In popup. Open the app in a dedicated tab to connect your Workspace account.'
        );
      } else if (code === 'auth/unauthorized-domain') {
        setAuthError(
          'This domain is not yet authorized in Firebase Authentication. Add it under Firebase Console → Authentication → Settings → Authorized domains, or open the hosted app URL directly.'
        );
      } else if (code !== 'auth/popup-closed-by-user') {
        setAuthError(
          'Unable to complete Google Sign-In inside this view. Try opening the app in a full browser tab.'
        );
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Handle Sign-out
  const handleGoogleSignOut = async () => {
    try {
      await googleLogout();
      setUser(null);
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  // Fetch live Google Workspace data
  const handleRefreshLiveWorkspace = async () => {
    setIsRefreshingWorkspace(true);
    try {
      const [driveFiles, calendarEvents, gmailMessages] = await Promise.all([
        fetchLiveDriveFiles(),
        fetchLiveCalendarEvents(),
        fetchLiveGmailMessages(),
      ]);

      const liveItems = [...driveFiles, ...calendarEvents, ...gmailMessages];

      if (liveItems.length > 0) {
        setWorkspaceItems((prev) => {
          const existingSheets = prev.filter((i) => i.source === 'sheets');
          return [...liveItems, ...existingSheets];
        });
      }
    } catch (err) {
      console.error('Failed to sync live Google data:', err);
    } finally {
      setIsRefreshingWorkspace(false);
    }
  };

  // Project handlers
  const handleUpdateProject = (updated: GidProject) => {
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleAddProject = (newProj: GidProject) => {
    setProjects((prev) => [newProj, ...prev]);
  };

  // Task handlers
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (newTask: DailyTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Calculate dynamic metrics for KPI Row
  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const coreTasksCount = tasks.filter((t) => t.relevanceLabel === 'Core ETIS').length;
  const roleAlignmentPercent = Math.round((coreTasksCount / (tasks.length || 1)) * 100);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      
      {/* Top Bar Contract Navigation */}
      <HeaderNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        user={user}
        onSignIn={handleGoogleSignIn}
        onSignOut={handleGoogleSignOut}
        isAuthenticating={isAuthenticating}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* Main Workspace Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Helpful notice when embedded iframe blocks Google Sign-In popup or domain is unauthorized */}
        {authError && (
          <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={typeof window !== 'undefined' ? window.location.href : '#'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-amber-300 rounded font-semibold text-amber-900 hover:bg-amber-100 transition-colors whitespace-nowrap"
              >
                <span>Open in New Tab</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                type="button"
                onClick={() => setAuthError(null)}
                aria-label="Dismiss notice"
                className="p-1 text-amber-700 hover:text-amber-900"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
        
        {/* User Google Site Resource Banner */}
        <div className="mb-6 bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-lg p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded border border-indigo-400/20">
                Upper School (Grades 9–12)
              </span>
              <h1 className="text-sm font-bold tracking-tight">
                Susan's ETIS Portal & Upper School GID Curriculum Framework
              </h1>
            </div>
            <p className="text-xs text-slate-300">
              Connected to your personal Guided Inquiry site, Upper School Google Drive curricula, and Grades 9–12 faculty coaching workflows.
            </p>
          </div>

          <a
            href="https://sites.google.com/d/1E0pxks5HEv_EE2AWzIGRPnyhXLPpmz1v/p/180jlufwrMEveIzIpCjLTHVLO40QU1zd0/edit"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-md transition-colors shrink-0 shadow-xs"
          >
            <span>Open Connected Google Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-700" />
          </a>
        </div>

        {/* Top 4 KPI Metrics */}
        <KpiSummaryRow
          activeProjectsCount={projects.length}
          completedTasksCount={completedTasksCount}
          totalTasksCount={tasks.length}
          roleAlignmentPercent={roleAlignmentPercent}
          coachingHoursThisWeek={33}
        />

        {/* Tab Routing */}
        {currentTab === 'overview' && (
          <div className="space-y-6">
            {/* Daily Task List with Time Boxing */}
            <DailyTaskBoard
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
            />

            {/* GID Milestone Tracker & Active Inquiries */}
            <GidMilestoneTracker
              projects={projects}
              onUpdateProject={handleUpdateProject}
              onAddProject={handleAddProject}
            />

            {/* Visual Analytics Preview */}
            <AnalyticsCharts projects={projects} />
          </div>
        )}

        {currentTab === 'gid' && (
          <GidMilestoneTracker
            projects={projects}
            onUpdateProject={handleUpdateProject}
            onAddProject={handleAddProject}
          />
        )}

        {currentTab === 'workspace' && (
          <WorkspaceIntegrationsPanel
            items={workspaceItems}
            isSignedIn={!!user}
            onRefreshLive={handleRefreshLiveWorkspace}
            isRefreshing={isRefreshingWorkspace}
            onSignIn={handleGoogleSignIn}
          />
        )}

        {currentTab === 'role' && (
          <RoleRelevancyView
            tasks={tasks}
            workspaceItems={workspaceItems}
            projects={projects}
            onNavigateToAiHub={() => setCurrentTab('ai_hub')}
          />
        )}

        {currentTab === 'ai_hub' && (
          <FacultyAiHub projects={projects} />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            <span>ETIS Command & Upper School GID Workstation (Grades 9–12)</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span>Gulliver Prep Upper School</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentTab('role')}
              className="hover:text-indigo-600 transition-colors"
            >
              Role Boundaries
            </button>
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="hover:text-indigo-600 transition-colors"
            >
              Weekly Executive Report
            </button>
          </div>
        </div>
      </footer>

      {/* Automated Report Modal */}
      <ReportGeneratorModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        projects={projects}
        tasks={tasks}
      />

    </div>
  );
}
