import React, { useState, useEffect } from 'react';
import { GidProject, GidResource, GidStageId, GidResourceType } from '../types/gid';
import { INITIAL_GID_RESOURCES } from '../data/gidResourcesData';
import { GID_STAGES, getStageById } from '../data/gidKnowledge';
import { safeGetStorage, safeSetStorage } from '../utils/safeStorage';
import {
  Download,
  Copy,
  Check,
  Search,
  BookOpen,
  Sparkles,
  FileText,
  Eye,
  Plus,
  FolderDown,
  Layers,
  GraduationCap,
  Award,
  BarChart3,
  CheckCircle2,
  Circle,
} from 'lucide-react';

interface GidResourceLibraryProps {
  projects?: GidProject[];
}

interface ResourceUsageEntry {
  adoptedByFaculty: boolean;
  usageCount: number;
  lastUsedDate?: string;
}

const SUB_NINTH_REGEX =
  /\b(k[-–]12|pk[-–]12|pk[-–]5|k[-–]8|6[-–]8|kindergarten|pre-?k|elementary|lower school|middle school|grades?\s*[1-8]\b|[1-8](st|nd|rd|th)\s*grade|book creator)\b/i;

function isStrictlyUpperSchoolResource(res: GidResource): boolean {
  const combined = `${res.title} ${res.gradeRange || ''} ${res.targetAudience} ${res.description}`;
  return !SUB_NINTH_REGEX.test(combined);
}

const INITIAL_RESOURCE_USAGE: Record<string, ResourceUsageEntry> = {
  'res-open-guide-1': { adoptedByFaculty: true, usageCount: 14, lastUsedDate: '2026-11-02' },
  'res-open-prompt-1': { adoptedByFaculty: true, usageCount: 11, lastUsedDate: '2026-11-04' },
  'res-immerse-guide-1': { adoptedByFaculty: true, usageCount: 12, lastUsedDate: '2026-11-03' },
  'res-immerse-prompt-1': { adoptedByFaculty: true, usageCount: 9, lastUsedDate: '2026-11-05' },
  'res-explore-guide-1': { adoptedByFaculty: true, usageCount: 8, lastUsedDate: '2026-11-06' },
  'res-explore-prompt-1': { adoptedByFaculty: false, usageCount: 3, lastUsedDate: '2026-11-06' },
  'res-identify-guide-1': { adoptedByFaculty: true, usageCount: 10, lastUsedDate: '2026-11-07' },
  'res-identify-prompt-1': { adoptedByFaculty: true, usageCount: 7, lastUsedDate: '2026-11-08' },
  'res-gather-guide-1': { adoptedByFaculty: true, usageCount: 6, lastUsedDate: '2026-11-08' },
  'res-gather-prompt-1': { adoptedByFaculty: false, usageCount: 2, lastUsedDate: '2026-11-08' },
  'res-create-guide-1': { adoptedByFaculty: true, usageCount: 4, lastUsedDate: '2026-11-09' },
  'res-create-prompt-1': { adoptedByFaculty: false, usageCount: 1, lastUsedDate: '2026-11-09' },
  'res-share-guide-1': { adoptedByFaculty: false, usageCount: 1, lastUsedDate: '2026-11-01' },
  'res-share-prompt-1': { adoptedByFaculty: false, usageCount: 0 },
  'res-evaluate-guide-1': { adoptedByFaculty: false, usageCount: 0 },
  'res-evaluate-prompt-1': { adoptedByFaculty: false, usageCount: 0 },
};

export const GidResourceLibrary: React.FC<GidResourceLibraryProps> = ({ projects = [] }) => {
  const [resources, setResources] = useState<GidResource[]>(() => {
    const saved = safeGetStorage('gid_resource_library_v2');
    if (saved) {
      try {
        const parsed: GidResource[] = JSON.parse(saved);
        const sanitized = parsed.filter(isStrictlyUpperSchoolResource);
        if (sanitized.length > 0) return sanitized;
      } catch {
        return INITIAL_GID_RESOURCES;
      }
    }
    return INITIAL_GID_RESOURCES;
  });

  const [resourceUsage, setResourceUsage] = useState<Record<string, ResourceUsageEntry>>(() => {
    const saved = safeGetStorage('gid_resource_usage_us912_v1');
    if (saved) {
      try {
        return { ...INITIAL_RESOURCE_USAGE, ...JSON.parse(saved) };
      } catch {
        return INITIAL_RESOURCE_USAGE;
      }
    }
    return INITIAL_RESOURCE_USAGE;
  });

  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStandard, setSelectedStandard] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewResource, setPreviewResource] = useState<GidResource | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAddingResource, setIsAddingResource] = useState(false);

  // New resource form fields (Upper School 9-12 Only)
  const [newTitle, setNewTitle] = useState('');
  const [newStage, setNewStage] = useState<GidStageId>('open');
  const [newType, setNewType] = useState<GidResourceType>('curriculum_guide');
  const [newFormat, setNewFormat] = useState<'PDF' | 'DOCX' | 'PROMPT' | 'SHEET'>('PDF');
  const [newDescription, setNewDescription] = useState('');
  const [newAudience, setNewAudience] = useState('Upper School (Grades 9-12) Faculty');
  const [newGradeRange, setNewGradeRange] = useState('Grades 9-12');
  const [newStandard, setNewStandard] = useState('AP Capstone & College Board Research');
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    safeSetStorage('gid_resource_library_v2', JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    safeSetStorage('gid_resource_usage_us912_v1', JSON.stringify(resourceUsage));
  }, [resourceUsage]);

  // Guard projects passed in to ensure exclusively Grades 9-12 units count toward stage completion
  const upperSchoolProjects = projects.filter((p) => {
    const combined = `${p.gradeLevel} ${p.title} ${p.department}`;
    if (SUB_NINTH_REGEX.test(combined)) return false;
    return /\b(9|10|11|12)\b/.test(p.gradeLevel) || /upper|ap\s|honors/i.test(p.gradeLevel);
  });

  const getUsage = (resId: string): ResourceUsageEntry =>
    resourceUsage[resId] || { adoptedByFaculty: false, usageCount: 0 };

  const recordResourceUse = (resId: string) => {
    const today = new Date().toISOString().split('T')[0];
    setResourceUsage((prev) => {
      const current = prev[resId] || { adoptedByFaculty: false, usageCount: 0 };
      return {
        ...prev,
        [resId]: {
          adoptedByFaculty: true,
          usageCount: current.usageCount + 1,
          lastUsedDate: today,
        },
      };
    });
  };

  const toggleResourceAdopted = (resId: string) => {
    const today = new Date().toISOString().split('T')[0];
    setResourceUsage((prev) => {
      const current = prev[resId] || { adoptedByFaculty: false, usageCount: 0 };
      const nextAdopted = !current.adoptedByFaculty;
      return {
        ...prev,
        [resId]: {
          adoptedByFaculty: nextAdopted,
          usageCount: nextAdopted && current.usageCount === 0 ? 1 : current.usageCount,
          lastUsedDate: nextAdopted ? today : current.lastUsedDate,
        },
      };
    });
  };

  // Filtered resources
  const filteredResources = resources.filter((res) => {
    if (selectedStage !== 'all' && res.stage !== selectedStage) return false;
    if (selectedType !== 'all' && res.type !== selectedType) return false;

    if (selectedStandard !== 'all') {
      const std = (res.academicStandard || '').toLowerCase();
      const tags = res.tags.join(' ').toLowerCase();
      if (selectedStandard === 'ap_capstone' && !std.includes('ap') && !tags.includes('ap')) return false;
      if (selectedStandard === 'ccss' && !std.includes('ccss') && !tags.includes('ccss')) return false;
      if (selectedStandard === 'ngss' && !std.includes('ngss') && !tags.includes('ngss')) return false;
      if (selectedStandard === 'c3' && !std.includes('c3') && !tags.includes('c3')) return false;
      if (selectedStandard === 'iste' && !std.includes('iste') && !tags.includes('iste')) return false;
    }

    if (selectedGrade !== 'all') {
      const gr = (res.gradeRange || '').toLowerCase();
      const audience = (res.targetAudience || '').toLowerCase();
      const tags = res.tags.join(' ').toLowerCase();
      const title = res.title.toLowerCase();
      const q = selectedGrade.toLowerCase();
      if (!gr.includes(q) && !audience.includes(q) && !tags.includes(q) && !title.includes(q)) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inTitle = res.title.toLowerCase().includes(q);
      const inDesc = res.description.toLowerCase().includes(q);
      const inTags = res.tags.some((t) => t.toLowerCase().includes(q));
      const inStd = (res.academicStandard || '').toLowerCase().includes(q);
      if (!inTitle && !inDesc && !inTags && !inStd) return false;
    }
    return true;
  });

  // Real download handler (+ records usage)
  const handleDownload = (res: GidResource) => {
    const blob = new Blob([res.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = res.downloadFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    recordResourceUse(res.id);
  };

  // Copy content handler (+ records usage)
  const handleCopy = (text: string, resId: string, uiKey?: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(uiKey || resId);
    recordResourceUse(resId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Create resource submit
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newId = `custom-res-${Date.now()}`;
    const newRes: GidResource = {
      id: newId,
      title: newTitle.trim(),
      stage: newStage,
      type: newType,
      format: newFormat,
      description:
        newDescription.trim() ||
        'Upper School (Grades 9–12) curriculum resource contributed by Gulliver Prep ETIS team.',
      targetAudience: newAudience.trim() || 'Upper School Faculty (Grades 9–12)',
      academicStandard: newStandard.trim() || 'US Upper School Standards',
      gradeRange: newGradeRange,
      downloadFileName: `${newTitle.replace(/[^a-zA-Z0-9]/g, '_')}.md`,
      content: newContent.trim(),
      tags: ['Custom Upper School Resource', getStageById(newStage).name],
    };

    if (!isStrictlyUpperSchoolResource(newRes)) return;

    setResources((prev) => [newRes, ...prev]);
    setResourceUsage((prev) => ({
      ...prev,
      [newId]: { adoptedByFaculty: false, usageCount: 0 },
    }));
    setIsAddingResource(false);
    setNewTitle('');
    setNewDescription('');
    setNewContent('');
  };

  // Aggregate library & stage metrics
  const guideCount = resources.filter((r) => r.type === 'curriculum_guide').length;
  const promptCount = resources.filter((r) => r.type === 'prompt_template').length;
  const rubricCount = resources.filter((r) => r.type === 'rubric' || r.type === 'student_log').length;

  const totalAdoptedCount = resources.filter((r) => getUsage(r.id).adoptedByFaculty).length;
  const totalUsageRuns = resources.reduce((sum, r) => sum + getUsage(r.id).usageCount, 0);
  const overallAdoptionPercent =
    resources.length > 0 ? Math.round((totalAdoptedCount / resources.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Library Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <FolderDown className="w-5 h-5 text-indigo-600 shrink-0" />
              <h2 className="text-base font-bold text-slate-900">
                GID Curriculum Guides & AI Prompt Resource Library
              </h2>
              <span className="text-[11px] font-mono text-slate-500">
                · US Upper School Only (Grades 9–12)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl">
              Classroom-tested curriculum guides, inquiry rubrics, and copyable AI prompt templates mapped to all 8 Guided Inquiry Design stages—aligned with AP Capstone, Common Core 9–12, NGSS High School, C3 Framework, and ISTE standards.
            </p>
          </div>

          <button
            onClick={() => setIsAddingResource(!isAddingResource)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-xs whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Guide / Prompt</span>
          </button>
        </div>

        {/* Quick Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 mt-4 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2.5">
            <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <div className="text-slate-400 text-[10px] uppercase font-mono tracking-wider">Catalog Scope</div>
              <div className="font-bold text-slate-900">Grades 9–12 High School</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <div className="text-slate-400 text-[10px] uppercase font-mono tracking-wider">Available Catalog</div>
              <div className="font-bold text-slate-900 font-mono tabular-nums">
                {resources.length} Items{' '}
                <span className="text-[11px] font-normal text-slate-500">
                  ({guideCount}G / {promptCount}P / {rubricCount}R)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <BarChart3 className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <div className="text-slate-400 text-[10px] uppercase font-mono tracking-wider">Faculty Adoption</div>
              <div className="font-bold text-slate-900 font-mono tabular-nums">
                {totalAdoptedCount}/{resources.length} Used ({overallAdoptionPercent}%)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <div className="text-slate-400 text-[10px] uppercase font-mono tracking-wider">Classroom Usage</div>
              <div className="font-bold text-slate-900 font-mono tabular-nums">
                {totalUsageRuns} Downloads & Copies
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 8-Stage Visual Progress & Interactive Stage Filter Matrix */}
      <section className="space-y-3" aria-label="8-Stage GID Resource Coverage and Progress">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
              8-Stage GID Resource Coverage & Faculty Usage Progress
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any stage tile to filter resources below. Progress tracks available templates against active Upper School (9–12) faculty usage and unit milestone completion.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono text-slate-500 tabular-nums">
              {filteredResources.length} matching
            </span>
            <button
              onClick={() => setSelectedStage('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 border ${
                selectedStage === 'all'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
              }`}
            >
              All 8 Stages ({resources.length})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {GID_STAGES.map((stage) => {
            const stageResources = resources.filter((r) => r.stage === stage.id);
            const availableCount = stageResources.length;
            const adoptedCount = stageResources.filter((r) => getUsage(r.id).adoptedByFaculty).length;
            const stageUsageRuns = stageResources.reduce((sum, r) => sum + getUsage(r.id).usageCount, 0);
            const adoptionPercent =
              availableCount > 0 ? Math.round((adoptedCount / availableCount) * 100) : 0;

            const totalUnits = upperSchoolProjects.length;
            const completedUnits = upperSchoolProjects.filter((proj) =>
              proj.milestones.some((m) => m.stage === stage.id && m.completed)
            ).length;
            const unitCompletionPercent =
              totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;

            const isSelected = selectedStage === stage.id;

            let statusLabel = 'Planned';
            let statusColorClass = 'text-slate-500';
            let barFillClass = 'bg-slate-300';

            if (adoptionPercent === 100 && availableCount > 0) {
              statusLabel = 'Active';
              statusColorClass = 'text-emerald-700';
              barFillClass = 'bg-emerald-600';
            } else if (adoptionPercent > 0) {
              statusLabel = 'In Rollout';
              statusColorClass = 'text-amber-700';
              barFillClass = 'bg-indigo-600';
            }

            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setSelectedStage(isSelected ? 'all' : stage.id)}
                aria-pressed={isSelected}
                className={`text-left bg-white rounded-lg p-3.5 border transition-all flex flex-col justify-between gap-2.5 ${
                  isSelected
                    ? 'border-indigo-600 ring-1 ring-indigo-600 bg-indigo-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header row: Stage number + name vs explicit status label */}
                <div className="flex items-center justify-between gap-2 w-full">
                  <span className="text-xs font-bold text-slate-900 truncate">
                    <span className="font-mono text-slate-500 mr-1">0{stage.stageNumber}.</span>
                    {stage.name}
                  </span>
                  <span className={`text-[11px] font-mono font-semibold tabular-nums shrink-0 ${statusColorClass}`}>
                    {statusLabel} · {adoptionPercent}%
                  </span>
                </div>

                {/* Progress 1: Resources Available vs Faculty Usage */}
                <div className="w-full space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Faculty Usage</span>
                    <span className="font-mono tabular-nums font-medium text-slate-800">
                      {adoptedCount}/{availableCount} used · {stageUsageRuns} runs
                    </span>
                  </div>
                  <div
                    className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"
                    role="progressbar"
                    aria-valuenow={adoptionPercent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${stage.name} resource usage progress`}
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${barFillClass}`}
                      style={{ width: `${adoptionPercent}%` }}
                    />
                  </div>
                </div>

                {/* Progress 2: 9-12 Unit Completion Status */}
                <div className="w-full space-y-1 pt-1 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">9–12 Unit Progress</span>
                    <span className="font-mono tabular-nums text-slate-700">
                      {totalUnits > 0 ? `${completedUnits}/${totalUnits} units (${unitCompletionPercent}%)` : 'No units'}
                    </span>
                  </div>
                  <div
                    className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"
                    role="progressbar"
                    aria-valuenow={unitCompletionPercent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${stage.name} 9-12 unit completion`}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${unitCompletionPercent}%`,
                        backgroundColor: stage.color,
                      }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Secondary Filter & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3 text-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Resource Type segmented filter */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-md">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1 font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                selectedType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setSelectedType('curriculum_guide')}
              className={`px-3 py-1 font-medium rounded transition-colors flex items-center gap-1 whitespace-nowrap shrink-0 ${
                selectedType === 'curriculum_guide' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3 h-3 text-emerald-600" />
              <span>Curriculum Guides</span>
            </button>
            <button
              onClick={() => setSelectedType('prompt_template')}
              className={`px-3 py-1 font-medium rounded transition-colors flex items-center gap-1 whitespace-nowrap shrink-0 ${
                selectedType === 'prompt_template' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>AI Prompt Templates</span>
            </button>
            <button
              onClick={() => setSelectedType('rubric')}
              className={`px-3 py-1 font-medium rounded transition-colors flex items-center gap-1 whitespace-nowrap shrink-0 ${
                selectedType === 'rubric' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3 h-3 text-indigo-600" />
              <span>Evaluation Rubrics</span>
            </button>
          </div>

          {/* Search input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search guides, prompts, standards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:w-64"
            />
          </div>
        </div>

        {/* US Academic Standard Filter Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-slate-500 font-medium">US Academic Standard:</span>

          <button
            onClick={() => setSelectedStandard('all')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 ${
              selectedStandard === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Standards
          </button>

          <button
            onClick={() => setSelectedStandard('ap_capstone')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 ${
              selectedStandard === 'ap_capstone'
                ? 'bg-indigo-600 text-white'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            AP Capstone & College Board
          </button>

          <button
            onClick={() => setSelectedStandard('ccss')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 ${
              selectedStandard === 'ccss'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            CCSS ELA (Grades 9–12)
          </button>

          <button
            onClick={() => setSelectedStandard('ngss')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 ${
              selectedStandard === 'ngss'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            NGSS High School
          </button>

          <button
            onClick={() => setSelectedStandard('c3')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 ${
              selectedStandard === 'c3'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            C3 Social Studies Inquiry
          </button>

          <button
            onClick={() => setSelectedStandard('iste')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 ${
              selectedStandard === 'iste'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
            }`}
          >
            ISTE Standards
          </button>
        </div>

        {/* 9th-12th Grade Specific Filter Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-slate-500 font-medium">Upper School Grade (9–12 Only):</span>

          <button
            onClick={() => setSelectedGrade('all')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 ${
              selectedGrade === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Upper School (9–12)
          </button>

          <button
            onClick={() => setSelectedGrade('Grade 9')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 ${
              selectedGrade === 'Grade 9'
                ? 'bg-indigo-600 text-white'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            9th Grade
          </button>

          <button
            onClick={() => setSelectedGrade('Grade 10')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 ${
              selectedGrade === 'Grade 10'
                ? 'bg-indigo-600 text-white'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            10th Grade
          </button>

          <button
            onClick={() => setSelectedGrade('Grade 11')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 ${
              selectedGrade === 'Grade 11'
                ? 'bg-indigo-600 text-white'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            11th Grade
          </button>

          <button
            onClick={() => setSelectedGrade('Grade 12')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 ${
              selectedGrade === 'Grade 12'
                ? 'bg-indigo-600 text-white'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            12th Grade
          </button>

          <button
            onClick={() => setSelectedGrade('AP')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 ${
              selectedGrade === 'AP'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
            }`}
          >
            AP Capstone / Honors
          </button>
        </div>
      </div>

      {/* Add Custom Resource Form */}
      {isAddingResource && (
        <form onSubmit={handleAddSubmit} className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-sm animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Contribute Upper School Curriculum Guide or AI Prompt Template
              </h4>
              <p className="text-xs text-slate-500">
                Author new scaffolding resources to share with Gulliver Prep Upper School departments (Grades 9–12).
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddingResource(false)}
              className="text-slate-400 hover:text-slate-600 text-xs p-1"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Stage 3 (Explore): Lateral Scholarly Search Guide"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">GID Stage</label>
              <select
                value={newStage}
                onChange={(e) => setNewStage(e.target.value as GidStageId)}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded focus:outline-none bg-white"
              >
                {GID_STAGES.map((s) => (
                  <option key={s.id} value={s.id}>
                    Stage {s.stageNumber}: {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">Resource Type</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as GidResourceType)}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded focus:outline-none bg-white"
              >
                <option value="curriculum_guide">Curriculum Guide</option>
                <option value="prompt_template">AI Prompt Template</option>
                <option value="rubric">Evaluation Rubric</option>
                <option value="student_log">Student Inquiry Log</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">US Academic Standard</label>
              <input
                type="text"
                placeholder="e.g. AP Capstone QUEST / CCSS.ELA.11-12"
                value={newStandard}
                onChange={(e) => setNewStandard(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">
                Upper School Grade (9–12 Only)
              </label>
              <select
                value={newGradeRange}
                onChange={(e) => setNewGradeRange(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded focus:outline-none bg-white"
              >
                <option value="Grades 9-12">Grades 9–12 (All Upper School)</option>
                <option value="Grade 9">Grade 9 (Freshmen)</option>
                <option value="Grade 10">Grade 10 (Sophomores)</option>
                <option value="Grade 11">Grade 11 (Juniors)</option>
                <option value="Grade 12">Grade 12 (Seniors)</option>
                <option value="Grades 11-12 AP Capstone">Grades 11–12 (AP Capstone)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">Format</label>
              <select
                value={newFormat}
                onChange={(e) => setNewFormat(e.target.value as 'PDF' | 'DOCX' | 'PROMPT' | 'SHEET')}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded focus:outline-none bg-white"
              >
                <option value="PDF">PDF Guide</option>
                <option value="PROMPT">AI Prompt</option>
                <option value="DOCX">DOCX Rubric</option>
                <option value="SHEET">Google Sheet Log</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">Target Audience</label>
              <input
                type="text"
                placeholder="e.g. Upper School Science Faculty (Grades 9-12)"
                value={newAudience}
                onChange={(e) => setNewAudience(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">Short Description</label>
            <input
              type="text"
              placeholder="1-2 sentences describing the pedagogical purpose for Upper School"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">
              Resource Content (Markdown or Prompt Text)
            </label>
            <textarea
              required
              rows={8}
              placeholder="Paste Markdown document or prompt text here..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full text-xs font-mono p-2.5 border border-slate-300 rounded focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddingResource(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded shadow-xs"
            >
              Save to Resource Library
            </button>
          </div>
        </form>
      )}

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredResources.length > 0 ? (
          filteredResources.map((res) => {
            const stageInfo = getStageById(res.stage);
            const isPrompt = res.type === 'prompt_template';
            const usage = getUsage(res.id);

            return (
              <div
                key={res.id}
                className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between hover:border-slate-300 transition-all space-y-3"
              >
                <div className="space-y-2.5">
                  {/* Top Bar: Clean unboxed metadata + Interactive Faculty Adoption Toggle */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] text-slate-500">
                      <span className="font-mono font-bold text-indigo-700">
                        Stage 0{stageInfo.stageNumber}: {stageInfo.name}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-medium text-slate-700">{res.gradeRange || 'Grades 9–12'}</span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">{res.type.replace('_', ' ')}</span>
                      <span className="font-mono text-slate-400">[{res.format}]</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleResourceAdopted(res.id)}
                      title={
                        usage.adoptedByFaculty
                          ? 'Faculty adopted — click to mark as unused'
                          : 'Click to mark as adopted by Upper School faculty'
                      }
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono tabular-nums font-medium border transition-colors whitespace-nowrap shrink-0 ${
                        usage.adoptedByFaculty
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-700'
                      }`}
                    >
                      {usage.adoptedByFaculty ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      ) : (
                        <Circle className="w-3 h-3 text-slate-400 shrink-0" />
                      )}
                      <span>
                        {usage.adoptedByFaculty ? 'Used' : 'Unused'} · {usage.usageCount}x
                      </span>
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {res.title}
                  </h3>

                  {/* Academic Standard inline indicator */}
                  {res.academicStandard && (
                    <div className="flex items-center gap-1.5 text-[11px] text-indigo-700">
                      <Award className="w-3.5 h-3.5 shrink-0 text-indigo-600" />
                      <span className="font-medium truncate">{res.academicStandard}</span>
                    </div>
                  )}

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {res.description}
                  </p>

                  {/* Unboxed Target & File Metadata */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500 pt-1">
                    <span>{res.targetAudience}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{res.downloadFileName}</span>
                    {usage.lastUsedDate && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-slate-400">Last: {usage.lastUsedDate}</span>
                      </>
                    )}
                  </div>

                  {/* Clean typographic tags */}
                  <div className="text-[11px] text-slate-400 font-mono truncate">
                    {res.tags.map((t) => `#${t.replace(/\s+/g, '')}`).join('  ')}
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setPreviewResource(res)}
                    className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-medium"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Quick Preview</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {isPrompt ? (
                      <button
                        onClick={() => handleCopy(res.content, res.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                      >
                        {copiedId === res.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Prompt</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleCopy(res.content, res.id)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-600 hover:text-slate-900"
                        title="Copy text to clipboard"
                      >
                        {copiedId === res.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => handleDownload(res)}
                      className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 bg-white border border-slate-200 rounded-lg p-10 text-center space-y-3">
            <Layers className="w-8 h-8 text-slate-400 mx-auto" />
            <div className="text-sm font-semibold text-slate-700">No matching Upper School resources found</div>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try adjusting your GID stage, grade level (9–12), or academic standard filter, or clear your search query to view all available Upper School guides and templates.
            </p>
            <button
              onClick={() => {
                setSelectedStage('all');
                setSelectedType('all');
                setSelectedStandard('all');
                setSelectedGrade('all');
                setSearchQuery('');
              }}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Quick Preview Modal */}
      {previewResource && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono font-bold text-indigo-600">
                    GID Stage 0{getStageById(previewResource.stage).stageNumber}:{' '}
                    {getStageById(previewResource.stage).name}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-600 font-medium">Upper School (Grades 9–12)</span>
                  <span className="text-slate-400">·</span>
                  <span className="font-mono text-[11px] text-slate-500">{previewResource.format}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">{previewResource.title}</h3>
                {previewResource.academicStandard && (
                  <div className="text-xs text-indigo-700 font-medium mt-0.5">
                    US Standard: {previewResource.academicStandard}
                  </div>
                )}
              </div>
              <button
                onClick={() => setPreviewResource(null)}
                className="text-slate-400 hover:text-slate-600 p-1 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            {/* Document Content Box */}
            <div className="flex-1 overflow-y-auto bg-slate-50 p-4 rounded border border-slate-200 text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed select-text">
              {previewResource.content}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono text-[11px]">
                {previewResource.downloadFileName}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(previewResource.content, previewResource.id, 'modal')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-medium transition-colors"
                >
                  {copiedId === 'modal' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Full Content</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDownload(previewResource)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
