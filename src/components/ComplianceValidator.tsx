import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  FileText, 
  Printer, 
  Copy, 
  Check, 
  Info, 
  Sparkles, 
  Search,
  Lock,
  ExternalLink
} from 'lucide-react';
import { safeGetStorage, safeSetStorage, safeRemoveStorage } from '../utils/safeStorage';

interface ChecklistItem {
  id: string;
  statute: 'FERPA' | 'COPPA' | 'CIPA';
  title: string;
  description: string;
  redFlag: string;
  recommendedAction: string;
}

const COMPLIANCE_CHECKLIST_DATA: ChecklistItem[] = [
  // --- FERPA (Family Educational Rights and Privacy Act) ---
  {
    id: 'ferpa-1',
    statute: 'FERPA',
    title: 'Zero Personally Identifiable Information (PII) in Prompts',
    description: 'Ensure no student first and last names, student ID numbers, emails, birthdays, home addresses, or parent contact info are typed or pasted into any AI tool.',
    redFlag: 'Prompting: "Here is Maria Rodriguez\'s essay on sea level rise, give her grade-level feedback."',
    recommendedAction: 'Anonymize completely: "Here is an anonymous 10th grade draft on sea level rise. Provide 3 formative feedback questions."',
  },
  {
    id: 'ferpa-2',
    statute: 'FERPA',
    title: 'No Sensitive Student Records, IEP, or 504 Health Information',
    description: 'Never input confidential student learning plans, behavioral incident logs, disciplinary records, or medical/special education diagnoses into generative LLMs.',
    redFlag: 'Pasting accommodation notes: "Create a worksheet for a student with an IEP and ADHD."',
    recommendedAction: 'Frame pedagogical parameters generically: "Generate a multi-step graphic organizer with visual cues and chunked instructions for executive function support."',
  },
  {
    id: 'ferpa-3',
    statute: 'FERPA',
    title: 'School-Managed Enterprise Accounts vs. Personal Consumer Accounts',
    description: 'Verify that AI tools storing student work (e.g. Google Gemini for Education, NotebookLM) are accessed through Gulliver Prep managed school accounts where data is not used for model training.',
    redFlag: 'Directing students to sign up with personal Gmail or unvetted commercial AI accounts.',
    recommendedAction: 'Use Google Workspace domain single sign-on (SSO) with enterprise educational data protection agreements.',
  },

  // --- COPPA (Youth Privacy & Vendor SDPA Governance) ---
  {
    id: 'coppa-1',
    statute: 'COPPA',
    title: 'Terms of Service Age-Gate & Commercial Account Governance (Grades 9–12)',
    description: 'Many commercial generative AI platforms enforce 18+ consumer age gates or require verified parental/school governance for minor accounts. Ensure Upper School students (Grades 9–12) operate strictly within managed Workspace enterprise domains.',
    redFlag: 'Directing 9th–12th grade students to bypass 18+ Terms of Service gates on unvetted commercial AI platforms.',
    recommendedAction: 'Direct Upper School students strictly to school-approved Google Workspace Gemini Education, NotebookLM, or vetted tools with signed Student Data Privacy Agreements (SDPA).',
  },
  {
    id: 'coppa-2',
    statute: 'COPPA',
    title: 'No Commercial Data Harvesting or Targeted Behavioral Advertising',
    description: 'Confirm that the AI platform’s terms of service explicitly prohibit selling student data, building advertising profiles, or tracking student browsing across the web.',
    redFlag: 'Using freemium AI tools funded by behavioral tracking ads.',
    recommendedAction: 'Verify vendor is on the Gulliver Prep approved educational software roster with signed Student Data Privacy Agreements (SDPA).',
  },
  {
    id: 'coppa-3',
    statute: 'COPPA',
    title: 'Parental Transparency & Disclosure in Course Syllabi',
    description: 'Provide parents and guardians with clear notice regarding which classroom AI tools are utilized during inquiry projects and how student privacy is safeguarded.',
    redFlag: 'Deploying new generative AI tools without prior department chair approval or curriculum syllabus disclosure.',
    recommendedAction: 'Include the standard Gulliver Prep Classroom AI Disclosure paragraph in your course syllabus and assignment handouts.',
  },

  // --- CIPA (Children’s Internet Protection Act) ---
  {
    id: 'cipa-1',
    statute: 'CIPA',
    title: 'Content Safety & Harassment Guardrails Active',
    description: 'Verify that student inquiry prompts and AI outputs do not generate obscene, harmful, defamatory, or self-harm content, and that school network filters remain enforced.',
    redFlag: 'Bypassing school content filters using personal cellular hotspots or proxy services.',
    recommendedAction: 'Operate all digital inquiry on school Wi-Fi with active content filtering and supervised classroom protocols.',
  },
  {
    id: 'cipa-2',
    statute: 'CIPA',
    title: 'Supervised Classroom Digital Research Protocols',
    description: 'Maintain active teacher oversight during student AI interactions. Do not assign unmonitored independent AI interactions without clear research boundaries.',
    redFlag: 'Unstructured, unmonitored web browsing during inquiry research stages.',
    recommendedAction: 'Implement structured GID research logs where students document their search queries and cited sources.',
  },
  {
    id: 'cipa-3',
    statute: 'CIPA',
    title: 'Cyberbullying, Defamation & Deepfake Prevention',
    description: 'Explicitly prohibit generating text, synthetic voices, or modified images that imitate, satirize, or target classmates, faculty, or community members.',
    redFlag: 'Students using generative image or voice tools to create memes depicting school staff or peers.',
    recommendedAction: 'Review the Gulliver Prep Responsible Use Policy (RUP) prior to launching creative synthesis in GID Stage 6.',
  },
  {
    id: 'cipa-4',
    statute: 'CIPA',
    title: 'Critical Evaluation of AI Hallucinations & Bias',
    description: 'Teach students to cross-examine all AI-generated assertions against authoritative primary sources to avoid spreading misinformation or accepting biased stereotypes.',
    redFlag: 'Accepting AI factual claims as verified truth without checking citations.',
    recommendedAction: 'Enforce the GID Stage 5 (Gather) Lateral Reading protocol: require at least 2 non-AI corroborated sources for every factual assertion.',
  },
];

export const ComplianceValidator: React.FC = () => {
  // Checklist checked state
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>(() => {
    try {
      const saved = safeGetStorage('compliance_checklist_state_us912_v2');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Scanner State
  const [sampleText, setSampleText] = useState('');
  const [detectedIssues, setDetectedIssues] = useState<string[]>([]);
  const [hasScanned, setHasScanned] = useState(false);
  const [filterStatute, setFilterStatute] = useState<'all' | 'FERPA' | 'COPPA' | 'CIPA'>('all');
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);

  // Certificate metadata
  const [teacherName, setTeacherName] = useState('Susan Bostick');
  const [unitTitle, setUnitTitle] = useState('10th Grade Coastal Resilience & GID Inquiry');
  const [gradeLevel, setGradeLevel] = useState('Upper School (Grade 10)');

  const handleToggleCheck = (id: string) => {
    setCheckedIds((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      safeSetStorage('compliance_checklist_state_us912_v2', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSelectAll = () => {
    const allChecked: Record<string, boolean> = {};
    COMPLIANCE_CHECKLIST_DATA.forEach((item) => {
      allChecked[item.id] = true;
    });
    setCheckedIds(allChecked);
    safeSetStorage('compliance_checklist_state_us912_v2', JSON.stringify(allChecked));
  };

  const handleClearAll = () => {
    setCheckedIds({});
    safeRemoveStorage('compliance_checklist_state_us912_v2');
  };

  const checkedCount = Object.values(checkedIds).filter(Boolean).length;
  const totalCount = COMPLIANCE_CHECKLIST_DATA.length;
  const complianceScore = Math.round((checkedCount / totalCount) * 100);

  // Run live PII and compliance heuristic audit on pasted text
  const handleScanText = () => {
    const issues: string[] = [];
    const text = sampleText.toLowerCase();

    // Check for email addresses
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    if (emailRegex.test(sampleText)) {
      issues.push('FERPA Alert: Personal email address detected. Remove all direct student/parent email addresses.');
    }

    // Check for phone numbers
    const phoneRegex = /(\+?\d{1,2}\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}/g;
    if (phoneRegex.test(sampleText) && sampleText.match(phoneRegex)![0].length >= 10) {
      issues.push('FERPA Alert: Possible phone number detected. Strip all contact numbers.');
    }

    // Check for IEP / 504 / Health / Special Ed keywords
    if (
      text.includes('iep') || 
      text.includes('504 plan') || 
      text.includes('adhd') || 
      text.includes('bipolar') || 
      text.includes('autism') || 
      text.includes('special ed') ||
      text.includes('behavior plan')
    ) {
      issues.push('FERPA Privacy Violation: Special education / IEP / confidential health terminology detected. Replace with generic pedagogical scaffolding language (e.g. "chunked instructions", "visual aids").');
    }

    // Check for direct student names or gradebook phrasing
    const studentNameKeywords = ['student name:', 'student:', 'grade:', 'test score:', 'gpa:'];
    for (const kw of studentNameKeywords) {
      if (text.includes(kw)) {
        issues.push(`FERPA Alert: Specific student identifier "${kw}" found. Use anonymous aliases like "Student A" or "Learner 1".`);
      }
    }

    // Check for personal consumer account usage on minor learners
    if (text.includes('sign up with your own email') || text.includes('create a personal account')) {
      issues.push('COPPA / SDPA Notice: Instructing Upper School students (Grades 9–12) to create personal consumer accounts is prohibited. Use Gulliver Prep managed Workspace SSO accounts.');
    }

    // Check for harmful content or unvetted domains
    if (text.includes('hack') || text.includes('jailbreak') || text.includes('bypass filter')) {
      issues.push('CIPA Alert: Reference to bypassing filters or unmonitored access detected.');
    }

    setDetectedIssues(issues);
    setHasScanned(true);
  };

  const copySnippet = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  const filteredItems = COMPLIANCE_CHECKLIST_DATA.filter((item) => {
    if (filterStatute !== 'all' && item.statute !== filterStatute) return false;
    return true;
  });

  // Disclosure templates for faculty
  const disclosureSnippets = [
    {
      id: 'upper-school-disclosure',
      title: 'Upper School Student Assignment Disclosure (Grades 9-12)',
      content: `AI Transparency Notice: In this Guided Inquiry project, students may utilize school-approved AI tools (such as Google NotebookLM, Gemini for Education, or Diffit) during Stages 1-5 for exploratory brainstorming, reading differentiation, and source synthesis. In accordance with FERPA and Gulliver Prep academic integrity standards, no student personal data may be entered. All student final submissions must include an AI Disclosure Footnote detailing how tools assisted their process, with all final arguments representing the student's original analysis.`,
    },
    {
      id: 'ap-capstone-disclosure',
      title: 'AP Capstone & Advanced Research Syllabus Disclosure (Grades 11-12)',
      content: `College Board & Advanced Research AI Policy: In accordance with AP Capstone policy and Gulliver Prep Upper School guidelines, generative AI tools may be used solely as exploratory research thought-partners during backgrounding and preliminary topic exploration. AI models may NOT be used to generate thesis statements, draft paper sections, create fabricated source citations, or analyze data without full attribution. Students must maintain an audit trail of search queries and drafts in Google Docs.`,
    },
    {
      id: 'syllabus-disclosure',
      title: 'Course Syllabus Policy Statement (ISTE & Academic Integrity)',
      content: `Classroom AI & Digital Ethics Policy: We embrace educational technology as an intellectual thought-partner, not an academic shortcut. Students are taught ethical prompt engineering and source corroboration. Unauthorized AI generation of whole essays, copying unverified outputs, or misrepresenting AI content as original work violates the Gulliver Prep Honor Code. Student writing revision histories may be reviewed using Brisk Teaching to confirm genuine authentic drafting.`,
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">
                US Student Data Privacy & AI Compliance Validator
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Verify that all AI-generated lesson materials, student prompt templates, and inquiry projects comply strictly with US Federal statutes: <strong>FERPA</strong>, <strong>COPPA</strong>, and <strong>CIPA</strong>.
            </p>
          </div>

          <button
            onClick={() => setIsCertificateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-xs shrink-0"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Compliance Clearance</span>
          </button>
        </div>

        {/* 3 Statutes Snapshot */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3 rounded-md bg-blue-50/50 border border-blue-100">
            <span className="font-bold text-blue-900 block mb-0.5">FERPA Compliance</span>
            <span className="text-slate-600 leading-relaxed text-[11px] block">
              Protects student education records. Zero student PII or special education notes entered into generative models.
            </span>
          </div>

          <div className="p-3 rounded-md bg-emerald-50/50 border border-emerald-100">
            <span className="font-bold text-emerald-900 block mb-0.5">COPPA & Vendor SDPA</span>
            <span className="text-slate-600 leading-relaxed text-[11px] block">
              Enforces Student Data Privacy Agreements (SDPA), bans commercial ad profiling on high school minors (Grades 9–12), and requires approved Workspace SSO.
            </span>
          </div>

          <div className="p-3 rounded-md bg-amber-50/50 border border-amber-100">
            <span className="font-bold text-amber-900 block mb-0.5">CIPA Compliance</span>
            <span className="text-slate-600 leading-relaxed text-[11px] block">
              Enforces school internet safety filters, active teacher supervision, and safeguards against cyberbullying/harmful media.
            </span>
          </div>
        </div>
      </div>

      {/* Live AI Material PII & Compliance Scanner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Live AI Lesson Material & Prompt Scanner</span>
            </h3>
            <p className="text-xs text-slate-500">
              Paste your draft prompt, lesson plan text, or student assignment instructions to audit for PII and compliance leaks
            </p>
          </div>

          <button
            onClick={handleScanText}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-xs"
          >
            Audit Text for Compliance
          </button>
        </div>

        <div>
          <textarea
            rows={4}
            value={sampleText}
            onChange={(e) => {
              setSampleText(e.target.value);
              setHasScanned(false);
            }}
            placeholder="Paste draft AI prompt or student activity here (e.g. 'Co-plan a 10th grade AP Environmental Science inquiry unit with NotebookLM where students analyze coastal flood charts...')"
            className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Scanner Results */}
        {hasScanned && (
          <div className="space-y-2 animate-fade-in">
            {detectedIssues.length === 0 ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md flex items-center gap-2 text-xs text-emerald-800 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Clearance Pass: No student PII, special education diagnoses, or direct compliance violations detected in the provided text.</span>
              </div>
            ) : (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-md space-y-2 text-xs">
                <div className="flex items-center gap-2 text-rose-900 font-bold">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{detectedIssues.length} Potential Compliance Issue(s) Flagged:</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-rose-800">
                  {detectedIssues.map((issue, idx) => (
                    <li key={idx} className="leading-relaxed">{issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Compliance Checklist Grid */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
        
        {/* Header & Score Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                US Educator Pre-Flight Privacy Checklist
              </h3>
              <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded tabular-nums">
                {checkedCount} of {totalCount} Verified ({complianceScore}%)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Verify each safeguard before launching an AI-assisted lesson or student activity
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAll}
              className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
            >
              Verify All
            </button>
            <button
              onClick={handleClearAll}
              className="px-2.5 py-1 text-xs text-slate-500 hover:text-rose-600 rounded transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              complianceScore === 100 ? 'bg-emerald-600' : 'bg-indigo-600'
            }`}
            style={{ width: `${complianceScore}%` }}
          />
        </div>

        {/* Statute Filter */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-md text-xs w-fit">
          <button
            onClick={() => setFilterStatute('all')}
            className={`px-3 py-1 font-medium rounded transition-colors ${
              filterStatute === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Statutes ({COMPLIANCE_CHECKLIST_DATA.length})
          </button>
          <button
            onClick={() => setFilterStatute('FERPA')}
            className={`px-3 py-1 font-medium rounded transition-colors ${
              filterStatute === 'FERPA' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            FERPA (Student Records)
          </button>
          <button
            onClick={() => setFilterStatute('COPPA')}
            className={`px-3 py-1 font-medium rounded transition-colors ${
              filterStatute === 'COPPA' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            COPPA (Vendor SDPA)
          </button>
          <button
            onClick={() => setFilterStatute('CIPA')}
            className={`px-3 py-1 font-medium rounded transition-colors ${
              filterStatute === 'CIPA' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            CIPA (Safety Filters)
          </button>
        </div>

        {/* Checklist Items */}
        <div className="divide-y divide-slate-100 border border-slate-200 rounded-md overflow-hidden">
          {filteredItems.map((item) => {
            const isChecked = !!checkedIds[item.id];
            return (
              <div
                key={item.id}
                onClick={() => handleToggleCheck(item.id)}
                className={`p-3.5 cursor-pointer transition-colors flex items-start gap-3 ${
                  isChecked ? 'bg-slate-50/70' : 'hover:bg-slate-50/50'
                }`}
              >
                <button
                  type="button"
                  className="mt-0.5 text-indigo-600 focus:outline-none shrink-0"
                >
                  {isChecked ? (
                    <CheckCircle2 className="w-4 h-4 fill-indigo-600 text-white" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-300 hover:text-slate-400" />
                  )}
                </button>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                      {item.statute}
                    </span>
                    <h4 className={`text-xs font-bold ${isChecked ? 'text-slate-700' : 'text-slate-900'}`}>
                      {item.title}
                    </h4>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="pt-1.5 grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-rose-50/60 p-2 rounded border border-rose-100 text-rose-800">
                      <strong>Red Flag to Avoid:</strong> {item.redFlag}
                    </div>
                    <div className="bg-emerald-50/60 p-2 rounded border border-emerald-100 text-emerald-800">
                      <strong>Recommended Practice:</strong> {item.recommendedAction}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ready-to-Copy Classroom AI Disclosure Statements */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <Copy className="w-4 h-4 text-slate-600" />
          <span>Classroom AI Disclosure Statements for Syllabi & Handouts</span>
        </h3>
        <p className="text-xs text-slate-500">
          Copy these compliant statements directly into your course syllabi, Google Classroom announcements, or assignment handouts
        </p>

        <div className="space-y-3">
          {disclosureSnippets.map((snip) => (
            <div key={snip.id} className="p-3.5 border border-slate-200 rounded-md bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{snip.title}</span>
                <button
                  onClick={() => copySnippet(snip.content, snip.id)}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-700 bg-white px-2 py-0.5 rounded border border-slate-200"
                >
                  {copiedSnippetId === snip.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-sans bg-white p-2.5 rounded border border-slate-100">
                {snip.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Clearance Certificate Modal */}
      {isCertificateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-wider">
                  Official Verification Record
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  US Upper School AI Lesson Compliance Clearance
                </h3>
              </div>
              <button
                onClick={() => setIsCertificateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            {/* Form Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded border border-slate-200">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Educator / ETIS Name</label>
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="w-full bg-white px-2.5 py-1.5 border border-slate-300 rounded focus:outline-none"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Grade Level / Division</label>
                <input
                  type="text"
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="w-full bg-white px-2.5 py-1.5 border border-slate-300 rounded focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-medium text-slate-700 block mb-1">Inquiry Unit / Assignment Title</label>
                <input
                  type="text"
                  value={unitTitle}
                  onChange={(e) => setUnitTitle(e.target.value)}
                  className="w-full bg-white px-2.5 py-1.5 border border-slate-300 rounded focus:outline-none"
                />
              </div>
            </div>

            {/* The Certificate Card */}
            <div className="border-2 border-indigo-600/30 rounded-lg p-5 bg-gradient-to-b from-indigo-50/20 to-white text-center space-y-3">
              <div className="w-10 h-10 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Gulliver Prep Independent Schools
                </h4>
                <div className="text-xs text-slate-500 font-mono">
                  Educational Technology & Information Systems (ETIS)
                </div>
              </div>

              <div className="text-xs text-slate-700 space-y-1 pt-1">
                <p>This certifies that the educational AI tools, prompts, and student activities for:</p>
                <div className="font-bold text-slate-900 text-sm">{unitTitle}</div>
                <div className="text-slate-500">Instructor: {teacherName} · {gradeLevel}</div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 space-y-0.5">
                <div>✓ Verified FERPA Zero-PII Compliance</div>
                <div>✓ Verified COPPA Age-Appropriate Account Protocol</div>
                <div>✓ Verified CIPA Filtered Supervised Research Protocol</div>
                <div className="text-slate-400 font-mono mt-1">Audit Score: {complianceScore}% Verified on {new Date().toLocaleDateString()}</div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-400 font-mono text-[11px]">Valid for Fall 2026 Academic Term</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCertificateModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 font-medium text-white bg-slate-900 hover:bg-slate-800 rounded shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Certificate</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
