import { GidStageInfo, GidStageId } from '../types/gid';

export const GID_STAGES: GidStageInfo[] = [
  {
    id: 'open',
    stageNumber: 1,
    name: 'Open',
    tagline: 'Invitation to Inquiry & High School Curiosity Hook',
    studentExperience: 'Upper School students (Grades 9–12) feel curious, open, and slightly uncertain. They share wonderings, explore lived connections, and get excited about overarching real-world dilemmas without premature thesis pressure.',
    educatorRole: 'Introduce a compelling provocation (drone footage, primary historical artifact, ethical AI dilemma) that invites high schoolers to care deeply without grading penalties.',
    recommendedTools: ['Curipod (interactive polling)', 'Padlet (digital wonder walls)', 'Mentimeter (word clouds)', 'YouTube Shorts / TED-Ed'],
    keyInquiryQuestions: ['What sparks your curiosity about this real-world dilemma?', 'Where does this intersect with your community or future field of study?'],
    color: '#3B82F6', // Blue
  },
  {
    id: 'immerse',
    stageNumber: 2,
    name: 'Immerse',
    tagline: 'Background Knowledge & High School "Third Space" Connection',
    studentExperience: '9th–12th graders build broad background knowledge, connecting College Board / NGSS curriculum to their own lived experience (Third Space). Early information overload transitions into conceptual orientation.',
    educatorRole: 'Provide rich, diverse Upper School background archives (scholarly overviews, primary sources, podcast interviews) before students pick narrow topics.',
    recommendedTools: ['NotebookLM (source ingestion & synthesis)', 'Diffit (differentiated Lexile tiers)', 'Gale In Context', 'Google Earth'],
    keyInquiryQuestions: ['What are the core debates and foundational vocabulary in this field?', 'Where does my personal perspective intersect with this academic concept?'],
    color: '#06B6D4', // Cyan
  },
  {
    id: 'explore',
    stageNumber: 3,
    name: 'Explore',
    tagline: 'Lateral Browsing & Managing Adolescent Research Anxiety',
    studentExperience: 'Students browse scholarly databases (JSTOR, Gale, Google Scholar) without locking into a rigid thesis. They scan abstracts, identify contrasting perspectives, and learn to manage statistical uncertainty.',
    educatorRole: 'Model lateral reading and academic database filters, teach non-committal keyword queries, and encourage Socratic talking circles.',
    recommendedTools: ['Gale In Context & Academic OneFile', 'Google Scholar / Advanced Search', 'JSTOR High School', 'Perplexity Edu'],
    keyInquiryQuestions: ['What conflicting perspectives or institutional tensions exist around this topic?', 'Which sub-angle offers the most fertile ground for deep inquiry?'],
    color: '#10B981', // Emerald
  },
  {
    id: 'identify',
    stageNumber: 4,
    name: 'Identify',
    tagline: 'Formulating a Driving Upper School Inquiry Question',
    studentExperience: 'The pivotal turning point in Upper School inquiry. Uncertainty gives way to intellectual direction as 9th–12th graders draft non-Googleable, researchable driving questions.',
    educatorRole: 'Conduct 3-minute proposal conferences; coach students to elevate simple fact-retrieval questions into debatable, evaluative inquiry theses.',
    recommendedTools: ['Gemini / Claude (Socratic question refiner)', 'Canva Whiteboard / MindMeister', 'Google Forms (proposal submissions)'],
    keyInquiryQuestions: ['Can my question be answered with a simple search engine query?', 'Does my question challenge assumptions and demand evidence corroboration?'],
    color: '#F59E0B', // Amber
  },
  {
    id: 'gather',
    stageNumber: 5,
    name: 'Gather',
    tagline: 'Targeted Research & Scholarly Evidence Corroboration',
    studentExperience: 'Focused, intentional high school research. Students feel confident and purposeful as they cross-examine peer-reviewed papers, extract data, and synthesize multi-source evidence.',
    educatorRole: 'Scaffold digital information literacy: evaluate author authority and bias, teach lateral evidence corroboration, and guide NoodleTools/APA/MLA citations.',
    recommendedTools: ['NotebookLM (grounded source synthesis with citations)', 'NoodleTools (academic bibliography)', 'Kami (PDF annotation)', 'Diffit for Education'],
    keyInquiryQuestions: ['Where do my primary and secondary sources corroborate or disagree?', 'What evidence directly supports or complicates my driving question?'],
    color: '#6366F1', // Indigo
  },
  {
    id: 'create',
    stageNumber: 6,
    name: 'Create',
    tagline: 'Synthesizing Understanding into an Upper School Artifact',
    studentExperience: 'Students transition from information consumers to creators. They organize findings, articulate structured arguments, and produce digital policy briefs, Google Sites portfolios, or scientific white papers.',
    educatorRole: 'Provide clear synthesis criteria, enforce mandatory AI Disclosure Statements, and monitor revision history via Brisk Teaching to celebrate authentic student writing.',
    recommendedTools: ['Google Sites & Docs', 'Canva for Education', 'Adobe Express', 'Brisk Teaching (writing process feedback)'],
    keyInquiryQuestions: ['How clearly does my creation communicate my evidence-based conclusions?', 'Does my artifact include a transparent disclosure of tools used in the process?'],
    color: '#8B5CF6', // Purple
  },
  {
    id: 'share',
    stageNumber: 7,
    name: 'Share',
    tagline: 'Communicating to Authentic Upper School Audiences & Defense Panels',
    studentExperience: 'High schoolers experience pride and communicative engagement as they present findings to peers, academic review panels, community leaders, or symposium attendees.',
    educatorRole: 'Facilitate authentic presentation opportunities (simulated town halls, AP Capstone oral defense panels, QR code exhibitions), structuring respectful peer critique.',
    recommendedTools: ['Google Sites (portfolio publishing)', 'Flip / Loom (asynchronous walkthroughs)', 'Classroom QR Code Exhibition Galleries'],
    keyInquiryQuestions: ['How effectively did I defend my research against counter-arguments?', 'What constructive insights did authentic community stakeholders contribute?'],
    color: '#EC4899', // Pink
  },
  {
    id: 'evaluate',
    stageNumber: 8,
    name: 'Evaluate',
    tagline: 'Metacognitive Self-Audit & "Learning How to Learn"',
    studentExperience: 'Students reflect on both their academic deliverables and their cognitive growth as independent researchers. They develop transferable metacognitive strategies for college readiness.',
    educatorRole: 'Guide structured reflection using Carol Kuhlthau’s 5 Kinds of Learning (Content, Information Literacy, Literacy Competence, Collaboration, Metacognition).',
    recommendedTools: ['Google Forms (metacognitive self-audits)', 'Digital Learning Journals', 'Voice reflections (Mote / Audio memos)'],
    keyInquiryQuestions: ['What research and emotional regulation strategies worked best for me?', 'How has my critical thinking transformed from Stage 1 (Open) to Stage 8 (Evaluate)?'],
    color: '#14B8A6', // Teal
  },
];

export function getStageById(stageId: GidStageId): GidStageInfo {
  return GID_STAGES.find((s) => s.id === stageId) || GID_STAGES[0];
}

export function getStageNumber(stageId: GidStageId): number {
  return getStageById(stageId).stageNumber;
}
