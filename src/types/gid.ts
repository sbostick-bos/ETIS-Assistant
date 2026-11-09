export type GidStageId = 
  | 'open'
  | 'immerse'
  | 'explore'
  | 'identify'
  | 'gather'
  | 'create'
  | 'share'
  | 'evaluate';

export interface GidStageInfo {
  id: GidStageId;
  stageNumber: number;
  name: string;
  tagline: string;
  studentExperience: string;
  educatorRole: string;
  recommendedTools: string[];
  keyInquiryQuestions: string[];
  color: string;
}

export type TaskCategory = 
  | 'gid_scaffold'
  | 'faculty_coaching'
  | 'ai_literacy'
  | 'tech_support'
  | 'admin';

export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';

export interface DailyTask {
  id: string;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  gidStage?: GidStageId;
  relatedProject?: string;
  estimatedMinutes: number;
  completed: boolean;
  roleRelevanceScore: number; // 0-100 (e.g. 95 for Core ETIS, 25 for general admin)
  relevanceLabel: 'Core ETIS' | 'Supporting' | 'Time Leak';
  notes?: string;
  dueDate: string;
}

export interface GidMilestone {
  id: string;
  stage: GidStageId;
  title: string;
  completed: boolean;
  targetDate: string;
  notes?: string;
}

export interface GidProject {
  id: string;
  title: string;
  gradeLevel: string;
  department: string;
  leadTeacher: string;
  teacherEmail: string;
  currentStage: GidStageId;
  progressPercent: number;
  startDate: string;
  targetEndDate: string;
  driveFolderUrl?: string;
  sheetTrackerUrl?: string;
  essentialQuestion: string;
  milestones: GidMilestone[];
  coachingNotes: string;
  recommendedAiTools: string[];
}

export type WorkspaceSource = 'drive' | 'sheets' | 'gmail' | 'calendar';

export interface WorkspaceItem {
  id: string;
  source: WorkspaceSource;
  title: string;
  snippet: string;
  timestamp: string;
  url?: string;
  senderOrOwner: string;
  relevanceToEtis: 'Core ETIS' | 'Supporting' | 'Time Leak';
  associatedGidStage?: GidStageId;
  suggestedAction: string;
  status?: string;
}

export interface EducatorAiTool {
  id: string;
  name: string;
  category: 'Research & Inquiry' | 'Curriculum & Differentiation' | 'Presentation & Media' | 'Assessment & Feedback' | 'General LLM';
  description: string;
  bestGidStages: GidStageId[];
  classroomUseCases: string[];
  privacyCompliance: 'FERPA & COPPA Compliant' | 'Teacher-facing only' | 'Requires Parent Consent';
  learningCurve: 'Quick (5-10m)' | 'Moderate (30m)' | 'Advanced';
  websiteUrl: string;
  facultyPromptExamples: string[];
}

export interface RoleAnalysisResult {
  overallAlignmentScore: number;
  executiveSummary: string;
  categoryBreakdown: {
    name: string;
    percentage: number;
    assessment: 'Core ETIS' | 'Supporting' | 'Time Leak';
  }[];
  timeLeaks: {
    item: string;
    leakType: string;
    suggestion: string;
    delegationTarget: string;
  }[];
  gidRecommendations: {
    stage: string;
    projectTitle: string;
    recommendedAction: string;
    suggestedEdTechTool: string;
  }[];
  facultyAiOpportunities: {
    topic: string;
    targetFaculty: string;
    rationale: string;
    format: string;
  }[];
  streamliningQuickWins: string[];
}

export interface GeneratedReport {
  title: string;
  period: string;
  executiveSummary: string;
  gidProgressHighlights: {
    unitTitle: string;
    stage: string;
    teacher: string;
    impact: string;
    techIntegrated: string;
  }[];
  aiLiteracyMilestones: string[];
  metricsSummary: {
    metric: string;
    value: string;
    trend: string;
  }[];
  nextWeekPriorities: string[];
  leadershipRecommendations: string[];
}

export interface WorkshopOutline {
  workshopTitle: string;
  subtitle: string;
  learningOutcomes: string[];
  slides: {
    slideNumber: number;
    title: string;
    keyPoints: string[];
    speakerScript: string;
    visualPrompt: string;
  }[];
  handsOnActivity: {
    title: string;
    instructions: string;
    duration: string;
    deliverable: string;
  };
  suggestedPromptTemplates: {
    title: string;
    targetTask: string;
    prompt: string;
  }[];
  ethicsAndRubricNotes: string;
}

export type GidResourceType = 'curriculum_guide' | 'prompt_template' | 'rubric' | 'student_log';

export interface GidResource {
  id: string;
  title: string;
  stage: GidStageId;
  type: GidResourceType;
  format: 'PDF' | 'DOCX' | 'PROMPT' | 'SHEET';
  description: string;
  targetAudience: string;
  academicStandard?: string;
  gradeRange?: string;
  downloadFileName: string;
  content: string;
  tags: string[];
}
