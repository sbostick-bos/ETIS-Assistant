import React, { useState } from 'react';
import { EDUCATOR_AI_TOOLS } from '../data/mockData';
import { EducatorAiTool, GidStageId, WorkshopOutline, GidProject } from '../types/gid';
import { GID_STAGES, getStageById } from '../data/gidKnowledge';
import { 
  Sparkles, 
  Presentation, 
  Search, 
  BookOpen, 
  Check, 
  Copy, 
  ExternalLink, 
  ShieldCheck, 
  Clock, 
  Layers, 
  Sliders, 
  FileText,
  FolderDown 
} from 'lucide-react';
import { GidResourceLibrary } from './GidResourceLibrary';
import { ComplianceValidator } from './ComplianceValidator';

interface FacultyAiHubProps {
  projects?: GidProject[];
}

export const FacultyAiHub: React.FC<FacultyAiHubProps> = ({ projects = [] }) => {
  const [tools, setTools] = useState<EducatorAiTool[]>(EDUCATOR_AI_TOOLS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGidStage, setSelectedGidStage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  // Workshop Generator State (Upper School Focus)
  const [gradeBand, setGradeBand] = useState('Upper School (Grades 9-12)');
  const [focusArea, setFocusArea] = useState('Classroom AI Literacy & Guided Inquiry Scaffolding');
  const [targetDuration, setTargetDuration] = useState('45 Minutes (Faculty Workshop / Assembly)');
  const [facultyTechLevel, setFacultyTechLevel] = useState('Mixed / Intermediate');
  const [specificTool, setSpecificTool] = useState('NotebookLM and Diffit');
  const [isGeneratingWorkshop, setIsGeneratingWorkshop] = useState(false);
  const [generatedWorkshop, setGeneratedWorkshop] = useState<WorkshopOutline | null>(null);
  const [activeTab, setActiveTab] = useState<'tools' | 'resources' | 'compliance' | 'workshop_studio'>('tools');

  // Filter tools
  const filteredTools = tools.filter((tool) => {
    if (selectedCategory !== 'all' && tool.category !== selectedCategory) return false;
    if (selectedGidStage !== 'all' && !tool.bestGidStages.includes(selectedGidStage as GidStageId)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.classroomUseCases.some((u) => u.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  const handleGenerateWorkshop = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingWorkshop(true);

    try {
      const res = await fetch('/api/gemini/generate-workshop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gradeBand,
          focusArea,
          targetDuration,
          facultyTechLevel,
          specificTool,
        }),
      });

      if (!res.ok) throw new Error('Failed to generate workshop');
      const data = await res.json();
      setGeneratedWorkshop(data);
    } catch (err) {
      console.error('Error generating workshop:', err);
      // Fallback structured workshop outline
      setGeneratedWorkshop({
        workshopTitle: 'AI Literacy in Action: Elevating Guided Inquiry from Hook to Synthesis',
        subtitle: 'Empowering educators to move beyond superficial prompting toward deep inquiry scaffolding',
        learningOutcomes: [
          'Identify where AI tools add pedagogical value across the 8 GID stages without replacing student critical thinking.',
          'Scaffold source synthesis and primary evidence interrogation using Google NotebookLM.',
          'Deploy transparent classroom AI usage rubrics aligned with Gulliver Prep academic integrity standards.',
        ],
        slides: [
          {
            slideNumber: 1,
            title: 'Welcome & The Third Space: Why AI Literacy Matters Now',
            keyPoints: [
              'Framing AI not as a shortcut, but as a thought partner.',
              'Connecting students’ everyday digital world with curricular rigor.',
            ],
            speakerScript: 'Good afternoon colleagues. Today we aren’t talking about replacing student writing or fearing technology. We are talking about equipping students to think critically with modern tools during inquiry.',
            visualPrompt: 'Visual slide of the GID 8-Stage Cycle with NotebookLM and Diffit icons highlighted.',
          },
          {
            slideNumber: 2,
            title: 'Stage 2 & 5: Curing the Information Overwhelm with NotebookLM',
            keyPoints: [
              'NotebookLM is source-grounded: it only speaks from teacher-selected documents.',
              'Students cite exact quotes and page numbers, eliminating hallucinations.',
            ],
            speakerScript: 'In Stage 5 (Gather), students often freeze when facing complex PDFs. With NotebookLM, we upload the primary documents into a classroom notebook so students can interrogate the text directly.',
            visualPrompt: 'Side-by-side screenshot: uploaded municipal flood report vs NotebookLM citation bubble.',
          },
          {
            slideNumber: 3,
            title: 'Hands-On Simulation: Building a 10-Minute Differentiated Hook with Diffit',
            keyPoints: [
              'Generate 3 Lexile levels of one primary news article in 30 seconds.',
              'Automatic vocabulary cards and open-ended curiosity prompts.',
            ],
            speakerScript: 'Let’s open your laptops. In this 10-minute sprint, pick an upcoming unit topic and let Diffit generate three tiered reading variations so all students participate in Stage 1 (Open).',
            visualPrompt: 'Live timer countdown (10:00) with step-by-step click guide.',
          },
          {
            slideNumber: 4,
            title: 'Ethical Guidelines & FERPA/COPPA Compliance',
            keyPoints: [
              'Zero student personally identifiable information (PII) input into public LLMs.',
              'Process-over-Product: using Brisk Teaching to observe student revision histories.',
            ],
            speakerScript: 'Never enter student names, IDs, or private data into general LLMs. We emphasize the creative process: the drafts, revisions, and reflection.',
            visualPrompt: 'Traffic light graphic: Green (vetted tools), Yellow (teacher-mediated), Red (unvetted PII).',
          },
        ],
        handsOnActivity: {
          title: 'The GID Stage Scaffold Sprint (15 Minutes)',
          instructions: 'Pairs select one upcoming unit. Choose one AI tool (Diffit, NotebookLM, or Curipod) and create one concrete inquiry resource for students.',
          duration: '15 Minutes',
          deliverable: 'A shared Google Doc link with the lesson hook or differentiated primary source organizer.',
        },
        suggestedPromptTemplates: [
          {
            title: 'Socratic Driving Question Refiner (Stage 4)',
            targetTask: 'Refining broad student curiosity into researchable questions',
            prompt: 'Act as a research mentor for Upper School inquiry. Here is a student question: "[Insert Question]". Suggest 3 revisions that make it more open-ended, measurable, and connected to local South Florida community impact.',
          },
          {
            title: 'Inquiry Source Synthesis Helper (Stage 5)',
            targetTask: 'Extracting key claims and opposing viewpoints',
            prompt: 'Based exclusively on the attached text, summarize the two primary opposing arguments regarding [Topic] and list 2 questions a researcher should investigate next.',
          },
        ],
        ethicsAndRubricNotes: 'Ensure all students are briefed on academic integrity. When students use AI for brainstorming or leveling, they must include a 2-sentence "AI Disclosure Statement" in their final project bibliography.',
      });
    } finally {
      setIsGeneratingWorkshop(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Studio Header & Mode Switch */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">
                Faculty AI Literacy & Workshop Studio
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Equip Upper School (Grades 9–12) faculty with vetted educational AI tools, US curriculum resource libraries, FERPA/COPPA/CIPA compliance checks, and workshop outlines mapped to Guided Inquiry Design.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-md text-xs shrink-0">
            <button
              onClick={() => setActiveTab('tools')}
              className={`px-3 py-1.5 font-medium rounded transition-colors ${
                activeTab === 'tools' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vetted AI Tools Matrix
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`px-3 py-1.5 font-medium rounded transition-colors flex items-center gap-1.5 ${
                activeTab === 'resources' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FolderDown className="w-3.5 h-3.5 text-indigo-600" />
              <span>GID Resource Library</span>
            </button>
            <button
              onClick={() => setActiveTab('compliance')}
              className={`px-3 py-1.5 font-medium rounded transition-colors flex items-center gap-1.5 ${
                activeTab === 'compliance' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Compliance Validator</span>
            </button>
            <button
              onClick={() => setActiveTab('workshop_studio')}
              className={`px-3 py-1.5 font-medium rounded transition-colors flex items-center gap-1.5 ${
                activeTab === 'workshop_studio' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Presentation className="w-3.5 h-3.5 text-indigo-600" />
              <span>Workshop Presentation Builder</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'tools' && (
        <div className="space-y-5">
          
          {/* Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-500 font-medium">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-slate-800 focus:outline-none"
              >
                <option value="all">All Categories</option>
                <option value="Research & Inquiry">Research & Inquiry</option>
                <option value="Curriculum & Differentiation">Curriculum & Differentiation</option>
                <option value="Presentation & Media">Presentation & Media</option>
                <option value="Assessment & Feedback">Assessment & Feedback</option>
                <option value="General LLM">General LLM</option>
              </select>

              <span className="text-slate-500 font-medium ml-2">GID Stage:</span>
              <select
                value={selectedGidStage}
                onChange={(e) => setSelectedGidStage(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-slate-800 focus:outline-none"
              >
                <option value="all">All Stages (1-8)</option>
                {GID_STAGES.map((s) => (
                  <option key={s.id} value={s.id}>
                    Stage {s.stageNumber}: {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
              <input
                type="text"
                placeholder="Search tools or prompts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded text-slate-800 placeholder-slate-400 focus:outline-none w-56"
              />
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredTools.map((tool) => (
              <div
                key={tool.id}
                className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Bar of card */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{tool.name}</h3>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500 mt-0.5">
                        <span>{tool.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-700 font-medium">{tool.privacyCompliance}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">{tool.learningCurve}</span>
                      </div>
                    </div>

                    <a
                      href={tool.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 text-slate-400 hover:text-indigo-600 rounded"
                      title="Open Tool Website"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {tool.description}
                  </p>

                  {/* Best GID Stages */}
                  <div>
                    <span className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Best Suited GID Inquiry Stages:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {tool.bestGidStages.map((stageId) => {
                        const stageInfo = getStageById(stageId);
                        return (
                          <span
                            key={stageId}
                            className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100"
                          >
                            0{stageInfo.stageNumber}. {stageInfo.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Classroom Use Cases */}
                  <div>
                    <span className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Classroom Applications for Faculty:
                    </span>
                    <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                      {tool.classroomUseCases.map((uc, i) => (
                        <li key={i}>{uc}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Sample Faculty Prompts */}
                  {tool.facultyPromptExamples.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 space-y-1.5">
                      <span className="text-[11px] font-semibold text-slate-700 block">
                        Sample Teacher Prompts (Ready to Copy):
                      </span>
                      {tool.facultyPromptExamples.map((promptText, i) => {
                        const copyId = `${tool.id}-${i}`;
                        return (
                          <div
                            key={i}
                            className="bg-slate-50 p-2.5 rounded border border-slate-200 flex items-start justify-between gap-2 text-xs"
                          >
                            <span className="text-slate-700 font-mono text-[11px] leading-relaxed italic">
                              "{promptText}"
                            </span>
                            <button
                              onClick={() => handleCopy(promptText, copyId)}
                              className="text-slate-400 hover:text-indigo-600 shrink-0 p-1"
                              title="Copy prompt"
                            >
                              {copiedPromptId === copyId ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">Gulliver Prep Approved</span>
                  <a
                    href={tool.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center gap-1"
                  >
                    <span>Launch Tool</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {activeTab === 'resources' && (
        <GidResourceLibrary projects={projects} />
      )}

      {activeTab === 'compliance' && (
        <ComplianceValidator />
      )}

      {activeTab === 'workshop_studio' && (
        /* Workshop Presentation Studio */
        <div className="space-y-6">
          
          {/* Workshop Configuration Form */}
          <form onSubmit={handleGenerateWorkshop} className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Customize Faculty Professional Development Presentation
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  Grade Band / Division
                </label>
                <select
                  value={gradeBand}
                  onChange={(e) => setGradeBand(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded focus:outline-none"
                >
                  <option>Upper School (Grades 9-12)</option>
                  <option>9th & 10th Grade Foundational Inquiry</option>
                  <option>11th & 12th Grade AP Capstone & Advanced Seminars</option>
                  <option>Upper School Humanities & Social Sciences</option>
                  <option>Upper School STEM, Science & Advanced Math</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  Primary Workshop Focus
                </label>
                <select
                  value={focusArea}
                  onChange={(e) => setFocusArea(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded focus:outline-none"
                >
                  <option>Classroom AI Literacy & Guided Inquiry Scaffolding</option>
                  <option>Grounding Student Research with NotebookLM</option>
                  <option>Differentiating Inquiry Reading with Diffit</option>
                  <option>Authentic Writing & Plagiarism Mitigation with Brisk</option>
                  <option>Designing GID Stage 4 Driving Questions with AI</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  Duration
                </label>
                <select
                  value={targetDuration}
                  onChange={(e) => setTargetDuration(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded focus:outline-none"
                >
                  <option>30 Minutes (Lunch & Learn / Dept Meeting)</option>
                  <option>45 Minutes (Faculty Workshop / Assembly)</option>
                  <option>60 Minutes (Deep Dive + Hands-on Lab)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                disabled={isGeneratingWorkshop}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-xs disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isGeneratingWorkshop ? 'animate-spin' : ''}`} />
                <span>{isGeneratingWorkshop ? 'Synthesizing Workshop...' : 'Generate Presentation Outline & Script'}</span>
              </button>
            </div>
          </form>

          {/* Generated Workshop Deck */}
          {generatedWorkshop && (
            <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-indigo-600 font-semibold uppercase tracking-wider">
                    Ready-to-Present Faculty Deck
                  </span>
                  <button
                    onClick={() => handleCopy(JSON.stringify(generatedWorkshop, null, 2), 'deck-export')}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-indigo-600 font-medium"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Full Script</span>
                  </button>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  {generatedWorkshop.workshopTitle}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 italic">
                  {generatedWorkshop.subtitle}
                </p>

                {/* Outcomes */}
                <div className="mt-3 bg-slate-50 p-3 rounded border border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                    Faculty Learning Outcomes:
                  </span>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                    {generatedWorkshop.learningOutcomes.map((out, i) => (
                      <li key={i}>{out}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Slides Breakdown */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-slate-900">
                  Slide-by-Slide Outline & Talking Points ({generatedWorkshop.slides.length} Slides)
                </h4>

                <div className="space-y-4">
                  {generatedWorkshop.slides.map((slide) => (
                    <div key={slide.slideNumber} className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                        <span className="text-xs font-mono font-bold text-indigo-600">
                          Slide {slide.slideNumber}: {slide.title}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          Screen: {slide.visualPrompt}
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] font-semibold text-slate-700 block mb-1">
                          Key Faculty Discussion Points:
                        </span>
                        <ul className="text-xs text-slate-600 space-y-0.5 list-disc pl-4">
                          {slide.keyPoints.map((kp, idx) => (
                            <li key={idx}>{kp}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-white p-3 rounded border border-slate-200">
                        <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider block mb-1">
                          ETIS Speaker Script:
                        </span>
                        <p className="text-xs text-slate-700 leading-relaxed italic">
                          "{slide.speakerScript}"
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hands-on Activity */}
              {generatedWorkshop.handsOnActivity && (
                <div className="bg-indigo-50/60 border border-indigo-200 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                      Interactive Hands-On Teacher Challenge: {generatedWorkshop.handsOnActivity.title}
                    </h4>
                    <span className="text-xs font-mono font-medium text-indigo-700">
                      {generatedWorkshop.handsOnActivity.duration}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {generatedWorkshop.handsOnActivity.instructions}
                  </p>
                  <div className="text-[11px] text-indigo-800 font-medium">
                    Deliverable: {generatedWorkshop.handsOnActivity.deliverable}
                  </div>
                </div>
              )}

              {/* Ethics & Academic Integrity Notes */}
              <div className="text-xs text-slate-600 bg-slate-50 p-4 rounded border border-slate-200 space-y-1">
                <span className="font-semibold text-slate-900 block">
                  FERPA / COPPA & Academic Integrity Guidance for Faculty:
                </span>
                <p className="leading-relaxed">{generatedWorkshop.ethicsAndRubricNotes}</p>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
