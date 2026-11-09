import React, { useState } from 'react';
import { GidProject, GidStageId, GidMilestone } from '../types/gid';
import { GID_STAGES, getStageById } from '../data/gidKnowledge';
import { 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  Folder, 
  Sheet, 
  ExternalLink, 
  Plus, 
  BookOpen, 
  Info,
  Calendar,
  Sparkles
} from 'lucide-react';

interface GidMilestoneTrackerProps {
  projects: GidProject[];
  onUpdateProject: (updated: GidProject) => void;
  onAddProject: (newProj: GidProject) => void;
}

export const GidMilestoneTracker: React.FC<GidMilestoneTrackerProps> = ({
  projects,
  onUpdateProject,
  onAddProject,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [showStageInfoModal, setShowStageInfoModal] = useState<GidStageId | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [gradeFilter, setGradeFilter] = useState<string>('all');

  // New project form state (Strictly Upper School 9-12)
  const [newTitle, setNewTitle] = useState('');
  const [newGrade, setNewGrade] = useState('Grade 10');
  const [newDept, setNewDept] = useState('Upper School Social Studies & AP');
  const [newTeacher, setNewTeacher] = useState('');
  const [newQuestion, setNewQuestion] = useState('');

  // Strict runtime guard: GID is exclusively Grades 9-12
  const upperSchoolOnlyProjects = projects.filter((p) => {
    const info = `${p.gradeLevel} ${p.title} ${p.department}`;
    if (/\b(k[-–]12|pk[-–]12|pk[-–]5|k[-–]8|6[-–]8|grades?\s*[1-8]\b|[1-8](st|nd|rd|th)\s*grade|lower|middle|elementary|kindergarten|pre-?k|book creator)\b/i.test(info)) {
      return false;
    }
    return /\b(9|10|11|12)\b/.test(p.gradeLevel) || /upper|ap\s|honors/i.test(p.gradeLevel);
  });

  const filteredProjects = upperSchoolOnlyProjects.filter((p) => {
    if (gradeFilter === 'all') return true;
    const numMatch = gradeFilter.match(/\d+/);
    if (!numMatch) return true;
    return new RegExp(`\\b${numMatch[0]}\\b`).test(p.gradeLevel);
  });

  const activeProject =
    filteredProjects.find((p) => p.id === selectedProjectId) ||
    filteredProjects[0] ||
    upperSchoolOnlyProjects[0];

  const handleToggleMilestone = (milestoneId: string) => {
    if (!activeProject) return;
    const updatedMilestones = activeProject.milestones.map((m) =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );

    const completedCount = updatedMilestones.filter((m) => m.completed).length;
    const progressPercent = Math.round((completedCount / updatedMilestones.length) * 100);

    onUpdateProject({
      ...activeProject,
      milestones: updatedMilestones,
      progressPercent,
    });
  };

  const handleSetCurrentStage = (stageId: GidStageId) => {
    if (!activeProject) return;
    onUpdateProject({
      ...activeProject,
      currentStage: stageId,
    });
  };

  const handleCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newProj: GidProject = {
      id: `gid-proj-${Date.now()}`,
      title: newTitle.trim(),
      gradeLevel: newGrade,
      department: newDept,
      leadTeacher: newTeacher.trim() || 'Faculty Team',
      teacherEmail: 'faculty@gulliverprep.org',
      currentStage: 'open',
      progressPercent: 12,
      startDate: new Date().toISOString().split('T')[0],
      targetEndDate: '2026-12-18',
      essentialQuestion: newQuestion.trim() || 'How does our inquiry address real-world community impact?',
      coachingNotes: 'Initial GID launch co-planning scheduled.',
      recommendedAiTools: ['Curipod', 'NotebookLM', 'Canva for Education'],
      milestones: GID_STAGES.map((s, idx) => ({
        id: `m-${Date.now()}-${idx}`,
        stage: s.id,
        title: `Stage ${s.stageNumber} (${s.name}): Launch & Scaffold`,
        completed: idx === 0,
        targetDate: '2026-11-30',
      })),
    };

    onAddProject(newProj);
    setSelectedProjectId(newProj.id);
    setIsCreatingProject(false);
    setNewTitle('');
    setNewTeacher('');
    setNewQuestion('');
  };

  return (
    <div className="space-y-6">
      
      {/* 8-Stage Interactive Process Ribbon */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-slate-900">
                Guided Inquiry Design (GID) 8-Stage Architecture
              </h2>
              <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                Upper School (Grades 9–12 Only)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any stage to view high school pedagogical objectives, 9th–12th student inquiry mindset, and vetted classroom AI tools
            </p>
          </div>
          <div className="text-xs text-slate-500 font-mono tabular-nums">
            Carol Kuhlthau & Leslie Maniotes Framework
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {GID_STAGES.map((stage) => {
            const isCurrentForActiveProj = activeProject?.currentStage === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => setShowStageInfoModal(stage.id)}
                className={`relative flex flex-col items-start p-3 rounded-md text-left transition-all border ${
                  isCurrentForActiveProj
                    ? 'border-indigo-500 bg-indigo-50/70 shadow-xs'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-[11px] font-mono font-medium text-slate-400">
                    0{stage.stageNumber}
                  </span>
                  {isCurrentForActiveProj && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600" title="Active Stage in Selected Project" />
                  )}
                </div>
                <div className="text-sm font-semibold text-slate-900">
                  {stage.name}
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  {stage.tagline}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Project Selector & Detailed Management */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Projects List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Active Inquiry Units ({filteredProjects.length})
              </h3>
              <div className="text-[10px] text-slate-400 font-mono">Upper School 9th–12th</div>
            </div>
            <button
              onClick={() => setIsCreatingProject(!isCreatingProject)}
              className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-100"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Unit</span>
            </button>
          </div>

          {/* Upper School Grade Filter Buttons */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded text-[11px]">
            <button
              onClick={() => setGradeFilter('all')}
              className={`flex-1 py-1 px-1.5 rounded font-medium transition-colors text-center ${
                gradeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All (9–12)
            </button>
            <button
              onClick={() => setGradeFilter('Grade 9')}
              className={`py-1 px-2 rounded font-medium transition-colors ${
                gradeFilter === 'Grade 9' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              9th
            </button>
            <button
              onClick={() => setGradeFilter('Grade 10')}
              className={`py-1 px-2 rounded font-medium transition-colors ${
                gradeFilter === 'Grade 10' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              10th
            </button>
            <button
              onClick={() => setGradeFilter('Grade 11')}
              className={`py-1 px-2 rounded font-medium transition-colors ${
                gradeFilter === 'Grade 11' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              11th
            </button>
            <button
              onClick={() => setGradeFilter('Grade 12')}
              className={`py-1 px-2 rounded font-medium transition-colors ${
                gradeFilter === 'Grade 12' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              12th
            </button>
          </div>

          {/* Project Cards */}
          <div className="space-y-2">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((proj) => {
                const isSelected = proj.id === activeProject?.id;
                const stageInfo = getStageById(proj.currentStage);

                return (
                  <div
                    key={proj.id}
                    onClick={() => setSelectedProjectId(proj.id)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-slate-900 line-clamp-1">
                        {proj.title}
                      </h4>
                      <span className="text-xs font-mono font-medium text-indigo-600 shrink-0 tabular-nums">
                        {proj.progressPercent}%
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 flex items-center gap-1.5 mb-2">
                      <span>{proj.gradeLevel}</span>
                      <span aria-hidden="true">·</span>
                      <span>{proj.leadTeacher}</span>
                    </div>

                    {/* Stage Progress Bar */}
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${proj.progressPercent}%` }}
                      />
                    </div>

                    <div className="mt-2 text-[11px] text-slate-600 flex items-center justify-between">
                      <span>Stage {stageInfo.stageNumber}: {stageInfo.name}</span>
                      <span className="text-slate-400 font-mono tabular-nums">{proj.targetEndDate}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-6 rounded-lg border border-slate-200 bg-white text-center space-y-2">
                <div className="text-xs font-semibold text-slate-700">
                  No inquiry units tracked for {gradeFilter} yet
                </div>
                <button
                  onClick={() => setGradeFilter('all')}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                >
                  Show all Grades 9–12 units
                </button>
              </div>
            )}
          </div>

          {/* Add Project Form (Modal or Inline) */}
          {isCreatingProject && (
            <form onSubmit={handleCreateProjectSubmit} className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Add Guided Inquiry Unit</h4>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Unit Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 10th Grade Everglades Water Quality & Policy Inquiry"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">
                    Grade Level (9–12 Only)
                  </label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  >
                    <option value="Grade 9">Grade 9 (Freshmen)</option>
                    <option value="Grade 10">Grade 10 (Sophomores)</option>
                    <option value="Grade 11">Grade 11 (Juniors)</option>
                    <option value="Grade 12">Grade 12 (Seniors)</option>
                    <option value="Grades 11-12 AP Capstone">Grades 11–12 (AP Capstone)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">Lead Teacher</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Miller"
                    value={newTeacher}
                    onChange={(e) => setNewTeacher(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Essential Inquiry Question</label>
                <textarea
                  rows={2}
                  placeholder="What is the driving inquiry question for students?"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsCreatingProject(false)}
                  className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-xs font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
                >
                  Create Unit
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Right Column: Detailed Project Workspace & Milestone Checklists (8 cols) */}
        {activeProject ? (
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-lg p-5 space-y-6">
            
            {/* Project Header */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                <h3 className="text-lg font-bold text-slate-900">
                  {activeProject.title}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium">
                    Current: Stage {getStageById(activeProject.currentStage).stageNumber} ({getStageById(activeProject.currentStage).name})
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>{activeProject.gradeLevel}</span>
                <span aria-hidden="true">·</span>
                <span>{activeProject.department}</span>
                <span aria-hidden="true">·</span>
                <span>Co-Teacher: {activeProject.leadTeacher}</span>
                <span aria-hidden="true">·</span>
                <span>Target: {activeProject.targetEndDate}</span>
              </div>
            </div>

            {/* Essential Question Callout */}
            <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5">
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">
                Driving Inquiry Question
              </div>
              <p className="text-sm font-medium text-slate-800 italic">
                "{activeProject.essentialQuestion}"
              </p>
            </div>

            {/* Stage Transition Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2">
                Update Active GID Stage:
              </label>
              <div className="flex flex-wrap items-center gap-1.5">
                {GID_STAGES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSetCurrentStage(s.id)}
                    className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                      activeProject.currentStage === s.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {s.stageNumber}. {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Milestone Checklist */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-slate-900">
                  Unit Milestones & GID Scaffolding Checks
                </h4>
                <span className="text-xs text-slate-500 font-mono tabular-nums">
                  {activeProject.milestones.filter((m) => m.completed).length} / {activeProject.milestones.length} completed
                </span>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-md">
                {activeProject.milestones.map((milestone) => {
                  const stageMeta = getStageById(milestone.stage);
                  return (
                    <div
                      key={milestone.id}
                      onClick={() => handleToggleMilestone(milestone.id)}
                      className={`flex items-start gap-3 p-3 cursor-pointer transition-colors ${
                        milestone.completed ? 'bg-slate-50/70' : 'hover:bg-slate-50/50'
                      }`}
                    >
                      <button className="mt-0.5 text-indigo-600 focus:outline-none">
                        {milestone.completed ? (
                          <CheckCircle2 className="w-4 h-4 fill-indigo-600 text-white" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-300 hover:text-slate-400" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-medium ${milestone.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {milestone.title}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span>Stage {stageMeta.stageNumber}: {stageMeta.name}</span>
                          <span aria-hidden="true">·</span>
                          <span>Target: {milestone.targetDate}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Coaching Notes & Tech Integration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <h5 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  ETIS Coaching Notes
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200">
                  {activeProject.coachingNotes}
                </p>
              </div>

              <div>
                <h5 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Recommended Educational AI Tools
                </h5>
                <div className="space-y-1.5">
                  {activeProject.recommendedAiTools.map((tool, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 bg-indigo-50/50 px-2.5 py-1.5 rounded border border-indigo-100">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="font-medium">{tool}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-lg p-8 text-center text-slate-500">
            No inquiry units available. Click "New Unit" to begin tracking.
          </div>
        )}

      </div>

      {/* Stage Detail Modal (Pedagogical reference) */}
      {showStageInfoModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-xl w-full p-6 shadow-xl border border-slate-200 space-y-4">
            {(() => {
              const info = getStageById(showStageInfoModal);
              return (
                <>
                  <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-xs font-mono font-medium text-indigo-600">
                        GID Stage 0{info.stageNumber}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900">
                        {info.name} — {info.tagline}
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowStageInfoModal(null)}
                      className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="font-semibold text-slate-900 mb-0.5">Learner Experience:</div>
                      <p className="text-slate-600 leading-relaxed">{info.studentExperience}</p>
                    </div>

                    <div>
                      <div className="font-semibold text-slate-900 mb-0.5">Educator & ETIS Role:</div>
                      <p className="text-slate-600 leading-relaxed">{info.educatorRole}</p>
                    </div>

                    <div>
                      <div className="font-semibold text-slate-900 mb-1">Recommended Tech & AI Tools:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {info.recommendedTools.map((tool, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="font-semibold text-slate-900 mb-1">Key Guiding Questions:</div>
                      <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                        {info.keyInquiryQuestions.map((q, idx) => (
                          <li key={idx}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => setShowStageInfoModal(null)}
                      className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded"
                    >
                      Close Reference
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

    </div>
  );
};
