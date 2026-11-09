import { GidResource } from '../types/gid';

export const INITIAL_GID_RESOURCES: GidResource[] = [
  // --- Stage 1: Open ---
  {
    id: 'res-open-guide-1',
    title: 'Stage 1 (Open): Upper School Inquiry Hook & Curiosity Provocation Protocol',
    stage: 'open',
    type: 'curriculum_guide',
    format: 'PDF',
    description: 'Instructional protocol for Upper School faculty designing high-impact inquiry hooks, mystery provocations, and digital wonder walls that spark curiosity while managing early student uncertainty.',
    targetAudience: 'Upper School (Grades 9-12) Faculty & Department Chairs',
    academicStandard: 'C3 Framework D1 (Inquiry Arc) & ISTE 1.1',
    gradeRange: 'Grades 9-12',
    downloadFileName: 'GID_Stage1_Open_Curiosity_Hook_Guide.md',
    tags: ['Curiosity Hook', 'Wonder Wall', 'Third Space', 'Padlet / Curipod', 'C3 Framework'],
    content: `# GID Stage 1 (Open): Inquiry Hook & Curiosity Provocation Protocol
**Framework:** Guided Inquiry Design® (Kuhlthau, Maniotes, Caspari)
**Target:** US Upper School Educational Technology Specialists & Faculty (Grades 9-12)
**US Academic Standards:** C3 Framework Dimension 1 (Developing Questions & Planning Inquiries) & ISTE Standard 1.1 (Empowered Learner)

---

### Objective & Emotional State
- **Goal:** Spark genuine curiosity and invite Upper School students to care deeply about a broad academic domain without premature pressure to pick a specific research thesis.
- **Emotional Arc:** Excitement, slight hesitation, wonder. High schoolers should feel supported and free to share personal wonderings without fear of grading penalties.

---

### Upper School Implementation Steps
1. **The Compelling Provocation (10-15 mins):**
   - Present an unresolved mystery, primary historical artifact, drone video, or ethical dilemma.
   - *Example (Science / AP Environmental):* Drone footage of sunny-day king tide flooding in South Florida neighborhoods paired with sea-level elevation models.
   - *Example (Humanities / AP History):* Side-by-side comparison of human vs. AI-generated award-winning historical journalism.

2. **Digital Wonder Wall Setup (Padlet or Google Jamboard/Canva):**
   - Prompt students: *"What do you notice? What surprised you? What do you wonder about who or what is affected in our community?"*
   - Allow anonymous sticky notes to lower the affective filter for hesitant high school learners.

3. **Curipod / Live Poll Word Cloud:**
   - Run a 3-question pulse check to surface class-wide interest clusters without grading accuracy.

---

### ETIS Coaching Checklist
- [ ] Ensure the provocation is open-ended with no singular "correct" answer.
- [ ] Remind faculty NOT to assign research papers in Stage 1. Keep students in open inquiry mindset.
- [ ] Archive the digital Wonder Wall to revisit during Stage 8 (Evaluate) reflection.`,
  },
  {
    id: 'res-open-prompt-1',
    title: 'AI Prompt Template: Socratic Curiosity Hook & Provocation Generator',
    stage: 'open',
    type: 'prompt_template',
    format: 'PROMPT',
    description: 'Customizable Gemini / Claude prompt that turns any standard Upper School curriculum benchmark into 3 gripping classroom scenarios, mystery cases, or ethical dilemma hooks.',
    targetAudience: 'Upper School Educators & Department Chairs',
    academicStandard: 'NGSS High School (HS-ESS3-4) & CCSS.ELA-LITERACY.SL.9-10.1',
    gradeRange: 'Grades 9-12',
    downloadFileName: 'Prompt_Stage1_Curiosity_Hook_Generator.txt',
    tags: ['Prompt Engineering', 'Lesson Hook', 'Curipod', 'Gemini', 'NGSS HS'],
    content: `You are an expert instructional designer trained in Carol Kuhlthau and Leslie Maniotes' Guided Inquiry Design (GID) framework and US Upper School pedagogical practices.

I am teaching a unit on [INSERT TOPIC / BENCHMARK - e.g., "South Florida Mangrove Ecosystems and Coastal Resilience"] for [INSERT GRADE LEVEL - e.g., "Grade 10 AP Environmental Science"].

Help me design 3 distinct "Stage 1: Open" inquiry hooks that spark intense student curiosity without revealing all the answers:

1. Scenario A: The Mystery Artifact / Dilemma (A real-world local anomaly that raises urgent scientific or civic questions).
2. Scenario B: The Ethical / Community Stakeholder Conflict (Opposing local viewpoints where high school students must explore multiple perspectives).
3. Scenario C: The Multimodal Provocation (A suggestion for a 2-minute video clip, interactive simulation, or drone imagery hook).

For each scenario, provide:
- The 2-minute teacher opening script (conversational and captivating for Upper School students).
- 3 open-ended "Wonder Questions" for students to post on our digital Wonder Wall.
- Recommended digital tool to facilitate the hook (e.g. Curipod, Mentimeter, Padlet).`,
  },

  // --- Stage 2: Immerse ---
  {
    id: 'res-immerse-guide-1',
    title: 'Stage 2 (Immerse): Building the "Third Space" & Foundational Background Knowledge',
    stage: 'immerse',
    type: 'curriculum_guide',
    format: 'PDF',
    description: 'Guidelines on connecting high schoolers’ everyday lived experience (First Space) with formal academic curriculum (Second Space) using multimodal media and primary sources.',
    targetAudience: 'Upper School Faculty (Grades 9-12)',
    academicStandard: 'CCSS.ELA-LITERACY.RH.11-12.2 & C3 Framework D2',
    gradeRange: 'Grades 9-12',
    downloadFileName: 'GID_Stage2_Immerse_ThirdSpace_Guide.md',
    tags: ['Third Space', 'Background Knowledge', 'Newsela', 'NotebookLM', 'CCSS 11-12'],
    content: `# GID Stage 2 (Immerse): Establishing Context & The "Third Space"
**Framework:** Guided Inquiry Design®
**Target:** US Upper School Faculty (Grades 9-12)
**US Academic Standards:** CCSS.ELA-LITERACY.RH.11-12.2 (Determine central ideas of primary/secondary sources) & C3 Framework Dimension 2

---

### The Power of the "Third Space" in Upper School
Dr. Carol Kuhlthau describes the **Third Space** as the intersection where:
- **First Space:** The high school student’s everyday lived experiences, culture, and personal interests.
- **Second Space:** The formal Upper School curriculum, textbooks, and College Board benchmarks.
- **Third Space:** The dynamic, authentic intersection where meaningful inquiry learning occurs.

---

### Step-by-Step Upper School Classroom Strategy
1. **Multimodal Immersion Stations:**
   - Station 1: Short documentary video or podcast segment.
   - Station 2: Leveled primary source news archives (via Diffit or Newsela).
   - Station 3: Interactive map or 3D artifact (Google Earth / NOAA Coastal Explorer).
2. **NotebookLM Source Grounding:**
   - Teachers curate 3-5 reliable background PDFs into a shared class notebook.
   - Upper School students query the notebook for foundational vocabulary, timelines, and opposing theories.
3. **Third Space Connection Log:**
   - Students write: *"How does this issue touch my city, my prospective field of study, or something I care about outside of school?"*`,
  },
  {
    id: 'res-immerse-prompt-1',
    title: 'AI Prompt Template: Multi-Tiered Lexile Differentiator for Background Reading',
    stage: 'immerse',
    type: 'prompt_template',
    format: 'PROMPT',
    description: 'Generates 3 reading levels (Foundational, Grade-Level, Advanced AP) of any primary source or scientific overview, with glossaries and concept comprehension checks.',
    targetAudience: 'Humanities, Science & AP Faculty (Grades 9-12)',
    academicStandard: 'CCSS.ELA-LITERACY.RI.9-10.7 & Diffit Lexile Differentiation',
    gradeRange: 'Grades 9-12',
    downloadFileName: 'Prompt_Stage2_Reading_Differentiator.txt',
    tags: ['Differentiation', 'Diffit', 'Lexile', 'AP Capstone', 'CCSS 9-10'],
    content: `Act as a master reading specialist and curriculum differentiation expert for US Upper School education.

Please take the following background reading text or summary on [INSERT TOPIC]:

"""
[PASTE COMPLEX BACKGROUND TEXT / ARTICLE HERE]
"""

Generate 3 tiered adaptations for our "GID Stage 2 (Immerse)" background knowledge building:

1. Tier 1 (Accessible High School / Lexile 900-1000): Simplified sentence structures, embedded vocabulary definitions in parentheses, bulleted key concepts.
2. Tier 2 (On-Grade High School / Lexile 1050-1150): Rich academic prose, contextual vocabulary, maintains original nuances.
3. Tier 3 (Advanced / AP Honors / Lexile 1250+): Full primary source syntax, complex rhetorical analysis prompts, and historiographical tension questions.

For all three tiers, also include:
- A 5-word "Essential Vocabulary Box" with student-friendly definitions.
- 2 "Third Space" connection questions that ask high school students to relate the text to their personal life or local community.`,
  },

  // --- Stage 3: Explore ---
  {
    id: 'res-explore-guide-1',
    title: 'Stage 3 (Explore): Lateral Browsing & Managing Cognitive Research Anxiety',
    stage: 'explore',
    type: 'curriculum_guide',
    format: 'PDF',
    description: 'Instructional roadmap for teaching non-committal exploratory search across scholarly databases (Gale, JSTOR, Google Scholar) while reducing information overload.',
    targetAudience: 'Upper School Educators & Research Librarians',
    academicStandard: 'AP Capstone QUEST Framework (Explore) & College Board Research',
    gradeRange: 'Grades 9-12',
    downloadFileName: 'GID_Stage3_Explore_Lateral_Search.md',
    tags: ['Lateral Reading', 'Database Search', 'Information Anxiety', 'Gale', 'AP Capstone'],
    content: `# GID Stage 3 (Explore): Browsing Patterns & Navigating Uncertainty
**Critical Phase:** This is statistically where Upper School students experience peak "Information Search Anxiety".
**US Academic Standards:** AP Capstone QUEST Framework (Explore) & Common Core ELA Research Standards

---

### Core Principles for Upper School Researchers
- **No Thesis Commitment Yet:** Students are "dipping into" sources, skimming abstracts, and browsing sub-topics.
- **The "Skim & Tag" Protocol:** Teach students to scan headings, bold terms, and executive summaries rather than reading 40-page papers cover-to-cover.

---

### Digital Scaffolding Tools
- **Gale In Context & JSTOR:** Filter by "Topic Overview" before diving into peer-reviewed journals.
- **Perplexity Edu / Google Advanced Search:** Practice site-specific queries (\`site:.edu\`, \`site:.gov\`, \`filetype:pdf\`).
- **Shared Exploration Padlet / Spreadsheet:** Students log 3 sub-angles they discovered that intrigued them.`,
  },
  {
    id: 'res-explore-prompt-1',
    title: 'AI Prompt Template: Devil’s Advocate & Counter-Perspective Explorer',
    stage: 'explore',
    type: 'prompt_template',
    format: 'PROMPT',
    description: 'Prompts AI to introduce alternative viewpoints, historical counter-arguments, and hidden tensions surrounding an inquiry topic so students avoid one-sided confirmation bias.',
    targetAudience: 'AP Capstone, Social Studies & English Faculty',
    academicStandard: 'AP Capstone Seminar (Perspective & Argument Synthesis)',
    gradeRange: 'Grades 11-12',
    downloadFileName: 'Prompt_Stage3_Devils_Advocate_Explorer.txt',
    tags: ['Counter-Arguments', 'Critical Thinking', 'Socratic', 'Claude/Gemini', 'AP Seminar'],
    content: `You are a critical inquiry facilitator and academic sparring partner for US Upper School students.

Our students are in "GID Stage 3: Explore", browsing ideas on the following topic:
Topic: [INSERT TOPIC - e.g., "The use of autonomous AI diagnostics in pediatric emergency medicine"]

Students currently hold this prevailing assumption:
[INSERT INITIAL STUDENT ASSUMPTION - e.g., "AI is too risky because algorithms have diagnostic bias."]

Provide:
1. 3 credible counter-arguments or alternative perspectives that challenge or complicate that simple assumption.
2. 2 real-world case studies or peer-reviewed precedents where the issue was not black-and-white.
3. 3 exploratory questions that encourage students to dig deeper rather than coming to a hasty conclusion.`,
  },

  // --- Stage 4: Identify ---
  {
    id: 'res-identify-guide-1',
    title: 'Stage 4 (Identify): Formulating Open-Ended Driving Inquiry Questions',
    stage: 'identify',
    type: 'curriculum_guide',
    format: 'PDF',
    description: 'The pivot point of Guided Inquiry Design. How to guide Upper School students from broad research topics to refined, actionable, non-Googleable driving questions.',
    targetAudience: 'Upper School Faculty across all disciplines',
    academicStandard: 'AP Capstone Quest (Question & Explore) & CCSS.ELA-LITERACY.W.9-10.7',
    gradeRange: 'Grades 9-12',
    downloadFileName: 'GID_Stage4_Identify_Driving_Questions.md',
    tags: ['Driving Questions', 'Inquiry Pivot', 'Proposal Conference', 'AP Capstone'],
    content: `# GID Stage 4 (Identify): Formulating the Driving Inquiry Question
**The Pivotal Turning Point:** Moving from broad exploratory browsing to focused, passionate direction.
**US Academic Standards:** AP Capstone QUEST (Question and Explore) & CCSS.ELA-LITERACY.W.9-10.7

---

### The "Googleable" vs "Inquiry" Test in Upper School
| Unrefined / Googleable (Weak) | Guided Inquiry Driving Question (Strong) |
|---|---|
| "What are sea level rise projections for Miami?" | "How can South Florida municipal planners balance mangrove preservation with affordable housing by 2040?" |
| "What is artificial intelligence?" | "To what extent do algorithmic generative models alter student concepts of authorship in high school journalism?" |
| "What is CRISPR gene editing?" | "How can federal biomedical regulatory frameworks balance CRISPR sickle-cell therapeutics against equitable patient access?" |

---

### Proposal Conference Protocol
- Hold a 3-minute 1-on-1 conference with each high school student or research pair.
- Check 3 criteria:
  1. Is it open-ended (cannot be answered with a quick search)?
  2. Is it researchable with available scholarly sources?
  3. Does the student genuinely care about the outcome?`,
  },
  {
    id: 'res-identify-prompt-1',
    title: 'AI Prompt Template: Socratic Driving Question Refiner & Feasibility Checker',
    stage: 'identify',
    type: 'prompt_template',
    format: 'PROMPT',
    description: 'Interactive Socratic coach that interrogates student draft questions, tests scope feasibility, and provides 3 refined iterations aligned with academic standards.',
    targetAudience: 'Upper School (Grades 9-12) Teachers & Students',
    academicStandard: 'CCSS.ELA-LITERACY.W.11-12.7 & C3 Framework D1.2',
    gradeRange: 'Grades 9-12',
    downloadFileName: 'Prompt_Stage4_Question_Refiner.txt',
    tags: ['Socratic Coach', 'Question Formulation', 'Rubric Check', 'CCSS 11-12'],
    content: `Act as a supportive Socratic research mentor for a [INSERT GRADE LEVEL - e.g., "10th grade"] student working on a Guided Inquiry Design project.

The student brings this draft inquiry question:
Draft: "[INSERT STUDENT DRAFT QUESTION]"

Perform the following evaluation:
1. Googleability Check: Can this question be answered in one sentence by Wikipedia? If yes, explain gently why it needs expansion.
2. Scope & Feasibility Check: Is the topic too vast (e.g. "World War II") or too narrow (e.g. "What color were boots in 1941") for a 3-week Upper School inquiry project?
3. Three Upgraded Variations:
   - Variation 1 (Local Community Focus): Connects the inquiry to South Florida or local civic action.
   - Variation 2 (Ethical / Dilemma Focus): Centers on a clash of values or human choices.
   - Variation 3 (Future / Solution Focus): Explores emerging technology or innovative proposals.
4. Concluding Socratic Question: Ask the student one question to help them choose their favorite path.`,
  },

  // --- Stage 5: Gather ---
  {
    id: 'res-gather-guide-1',
    title: 'Stage 5 (Gather): Source Corroboration & NotebookLM Research Workflow',
    stage: 'gather',
    type: 'curriculum_guide',
    format: 'PDF',
    description: 'Complete student and faculty workflow for interrogating primary sources, verifying evidence corroboration, and using NotebookLM citations ethically.',
    targetAudience: 'Science, AP Capstone & Social Studies Teachers (Grades 9-12)',
    academicStandard: 'CCSS.ELA-LITERACY.RH.11-12.8 & NGSS High School Practices',
    gradeRange: 'Grades 9-12',
    downloadFileName: 'GID_Stage5_Gather_NotebookLM_Workflow.md',
    tags: ['NotebookLM', 'Evidence Corroboration', 'Citations', 'NoodleTools', 'AP Research'],
    content: `# GID Stage 5 (Gather): Targeted Evidence Gathering with NotebookLM
**Phase Focus:** Purposeful research, ethical note-taking, and source cross-examination for Upper School scholars.
**US Academic Standards:** CCSS.ELA-LITERACY.RH.11-12.8 (Evaluate an author's premises and evidence) & NGSS Science Practices

---

### NotebookLM Upper School Classroom Architecture
1. **Source Ingestion:**
   - Students upload 4-8 vetted source documents (government reports, historical archives, peer-reviewed PDFs).
   - *Rule:* Zero open-web hallucinations; NotebookLM strictly answers from the uploaded source files.
2. **Citation Footnote Verification:**
   - Whenever NotebookLM synthesizes an answer, students click the numerical footnote to verify the original page context.
   - Students extract direct quotes into their NoodleTools or Google Docs bibliography.
3. **Lateral Corroboration Matrix:**
   - Question: *"Does Source A agree with Source B regarding flood frequency projections?"*
   - Teach high schoolers to identify conflicting statistics across authors.`,
  },
  {
    id: 'res-gather-prompt-1',
    title: 'AI Prompt Template: Primary Source Cross-Examination & Citation Coach',
    stage: 'gather',
    type: 'prompt_template',
    format: 'PROMPT',
    description: 'Compares two source excerpts, surfaces conflicting data points, and teaches students how to write rigorous attribution and citation commentary.',
    targetAudience: 'Upper School & AP Capstone Researchers',
    academicStandard: 'CCSS.ELA-LITERACY.RI.11-12.7 & AP Seminar Evidence Cross-Examination',
    gradeRange: 'Grades 11-12',
    downloadFileName: 'Prompt_Stage5_Source_Cross_Examination.txt',
    tags: ['Primary Sources', 'Corroboration', 'NotebookLM', 'Citation', 'AP Seminar'],
    content: `You are an academic research assistant helping Upper School students in GID Stage 5 (Gather).

Here are two short excerpts from different sources gathered by a student investigating [INSERT INQUIRY QUESTION]:

Source 1 Excerpt (Author: [INSERT AUTHOR / YEAR]):
"""
[PASTE EXCERPT 1]
"""

Source 2 Excerpt (Author: [INSERT AUTHOR / YEAR]):
"""
[PASTE EXCERPT 2]
"""

Please provide:
1. Points of Agreement: Where do both authors share factual consensus?
2. Points of Tension / Discrepancy: Where do their findings, data, or interpretations diverge?
3. Potential Sources of Bias / Context: What perspective or institutional background might explain this difference?
4. Student Synthesis Sentence: A sample academic sentence demonstrating how to cite both sources together (e.g. "While Miller (2024) asserts..., Alvarez (2025) counters that...").`,
  },

  // --- Stage 6: Create ---
  {
    id: 'res-create-guide-1',
    title: 'Stage 6 (Create): Multi-Modal Artifact Synthesis & AI Disclosure Rubric',
    stage: 'create',
    type: 'curriculum_guide',
    format: 'PDF',
    description: 'Guidelines on helping Upper School students synthesize research into creative digital products (Canva policy briefs, Google Sites portfolios, podcasts, interactive models) with transparent AI disclosure statements.',
    targetAudience: 'Upper School Faculty & Digital Media Instructors',
    academicStandard: 'ISTE 1.6 Creative Communicator & CCSS.ELA-LITERACY.W.11-12.2',
    gradeRange: 'Grades 9-12',
    downloadFileName: 'GID_Stage6_Create_Artifact_Synthesis.md',
    tags: ['Synthesis', 'Canva', 'AI Disclosure', 'Google Sites', 'ISTE 1.6'],
    content: `# GID Stage 6 (Create): Moving from Information to Original Synthesis
**Objective:** Transforming collected evidence into a creative solution or published artifact for high school audiences.
**US Academic Standards:** ISTE 1.6 (Creative Communicator) & CCSS.ELA-LITERACY.W.11-12.2

---

### Authentic Upper School Creation Formats
- **Google Sites Digital Portfolio:** Multi-page digital essay with embedded charts and bibliography.
- **Canva for Education Infographic / Policy Brief:** Visual data storytelling for authentic stakeholders.
- **Audio Podcast / Audio Overview:** Modeled after NotebookLM audio deep-dives, scripted by students.
- **Interactive 3D / Prototype:** Tinkercad, Figma, or slide deck proposal.

---

### Mandatory AI Disclosure Protocol
Every student creation must include an **AI Transparency Footnote**:
- *"I used [Tool Name] during Stage [X] to assist with [brainstorming / source summarization / drafting feedback]. All final synthesis, arguments, and conclusions represent my own original intellectual work."*`,
  },
  {
    id: 'res-create-prompt-1',
    title: 'AI Prompt Template: Formative Argument & Logical Flow Coach (Brisk Style)',
    stage: 'create',
    type: 'prompt_template',
    format: 'PROMPT',
    description: 'Inspects student draft arguments, highlights missing evidence links or logical leaps, and offers formative revision questions without rewriting the student’s prose.',
    targetAudience: 'Writing & Research Teachers (Grades 9-12)',
    academicStandard: 'CCSS.ELA-LITERACY.W.9-10.5 & Brisk Formative Process Inspection',
    gradeRange: 'Grades 9-12',
    downloadFileName: 'Prompt_Stage6_Formative_Argument_Coach.txt',
    tags: ['Formative Feedback', 'Brisk Teaching', 'Writing Coach', 'CCSS 9-10'],
    content: `Act as a constructive, encouraging writing coach for an Upper School student writing a synthesis essay or project rationale.

Here is the student's draft paragraph or section:
"""
[PASTE STUDENT DRAFT PARAGRAPH]
"""

CRITICAL INSTRUCTION: Do NOT rewrite or correct the student's text directly. Instead, provide targeted formative feedback:
1. Praise Point: One specific sentence or idea where the student makes a compelling, well-supported claim.
2. The Evidence Gap: Identify where a claim is made without citing specific evidence from Stage 5.
3. Logical Leap / Transition: Point out where the connection between ideas could be clarified.
4. Two Socratic Questions: Ask 2 questions that will inspire the high school student to strengthen their own revision.`,
  },

  // --- Stage 7: Share ---
  {
    id: 'res-share-guide-1',
    title: 'Stage 7 (Share): Authentic Audience Exhibition & Peer Critique Protocol',
    stage: 'share',
    type: 'curriculum_guide',
    format: 'PDF',
    description: 'Blueprint for designing Upper School student presentations to real-world community stakeholders, classroom gallery walks, QR code exhibitions, and defense panels.',
    targetAudience: 'Department Chairs & Upper School Educators',
    academicStandard: 'CCSS.ELA-LITERACY.SL.11-12.4 & AP Capstone Defense Protocol',
    gradeRange: 'Grades 9-12',
    downloadFileName: 'GID_Stage7_Share_Authentic_Audience.md',
    tags: ['Gallery Walk', 'Peer Critique', 'Town Hall', 'Authentic Audience', 'AP Capstone'],
    content: `# GID Stage 7 (Share): Communicating with Authentic Audiences
**Social Constructivist Goal:** Learning is social; sharing ideas tests understanding in the real world.
**US Academic Standards:** CCSS.ELA-LITERACY.SL.11-12.4 & AP Capstone Presentation and Oral Defense

---

### Authentic Audience Models for Upper School
1. **The Simulated Town Hall:** Students present policy proposals to invited administrators, parents, or local scientists.
2. **Interactive QR Code Gallery Walk:** Students stand by iPads displaying their digital artifacts; peers leave structured critique cards.
3. **Asynchronous Video Walkthroughs (Flip / Loom):** 3-minute screen recordings shared with partner schools or grade bands.

---

### The "TAG" Peer Feedback Protocol
- **T:** Tell something you learned from this presentation.
- **A:** Ask an open-ended inquiry question about their evidence.
- **G:** Give a constructive suggestion for future expansion.`,
  },
  {
    id: 'res-share-prompt-1',
    title: 'AI Prompt Template: Authentic Audience Q&A Simulator & Pitch Coach',
    stage: 'share',
    type: 'prompt_template',
    format: 'PROMPT',
    description: 'Simulates tough questions from authentic stakeholders (e.g. City Commissioner, School Board, Environmental Scientist) to prepare students for their defense presentation.',
    targetAudience: 'Teachers preparing students for presentations (Grades 9-12)',
    academicStandard: 'AP Capstone Oral Defense Panel & C3 Framework D4.3',
    gradeRange: 'Grades 11-12',
    downloadFileName: 'Prompt_Stage7_Audience_QA_Simulator.txt',
    tags: ['Presentation Prep', 'Q&A Simulation', 'Public Speaking', 'AP Capstone'],
    content: `You are simulating a live Q&A panel for an Upper School student who is presenting their Guided Inquiry project.

The student's project title: [INSERT PROJECT TITLE]
Their central thesis / proposal:
"""
[INSERT 2-3 SENTENCE SUMMARY OF STUDENT CONCLUSION / PROPOSAL]
"""

Roleplay as these 3 authentic community audience members and ask ONE challenging, respectful question each:
1. The Skeptical Community Member (concerned about practicality, cost, or disruption).
2. The Subject Matter Expert / Scientist (asking about data reliability and methodology).
3. The Future User / Beneficiary (asking how this solution impacts everyday people).

Provide a 1-sentence tip for the student on how to approach answering each type of question calmly and with evidence.`,
  },

  // --- Stage 8: Evaluate ---
  {
    id: 'res-evaluate-guide-1',
    title: 'Stage 8 (Evaluate): The 5-Kinds of Learning Metacognitive Reflection Rubric',
    stage: 'evaluate',
    type: 'rubric',
    format: 'DOCX',
    description: 'Comprehensive metacognitive reflection framework assessing Content, Information Literacy, Reading/Writing, Collaboration, and "Learning to Learn" for high schoolers.',
    targetAudience: 'All Upper School Faculty & Instructional Coaches',
    academicStandard: 'ISTE 1.1 Empowered Learner (Metacognition) & 5 Kinds of Learning',
    gradeRange: 'Grades 9-12',
    downloadFileName: 'GID_Stage8_Evaluate_Metacognitive_Rubric.md',
    tags: ['Metacognition', 'Evaluation Rubric', '5 Kinds of Learning', 'Self-Assessment', 'ISTE 1.1'],
    content: `# GID Stage 8 (Evaluate): Metacognitive Self-Assessment & Process Reflection
**Core Insight:** True inquiry education assesses both the final product AND the process of learning how to learn.
**US Academic Standards:** ISTE 1.1 (Empowered Learner) & Carol Kuhlthau's 5 Kinds of Learning

---

### The 5 Kinds of Learning Framework in Upper School
1. **Curriculum Content:** What deep conceptual understanding did the student construct?
2. **Information Literacy:** Did the student evaluate authority, detect bias, and corroborate primary evidence?
3. **Literacy Competence:** Did the student read actively, write with academic tone, and communicate clearly?
4. **Social & Collaborative Skills:** How effectively did the student collaborate and engage with peer critique?
5. **Learning How to Learn (Metacognition):** Can the student explain how they navigated uncertainty from Stage 1 to Stage 8?

---

### Student End-of-Unit Reflection Prompts
- *"Look back at your first sticky note on the Stage 1 Wonder Wall. How has your perspective evolved?"*
- *"When you felt stuck or overwhelmed in Stage 3 (Explore), what specific strategy helped you regain clarity?"*
- *"If you had two more weeks to continue this inquiry, what would you investigate next?"*`,
  },
  {
    id: 'res-evaluate-prompt-1',
    title: 'AI Prompt Template: Metacognitive Dialogue Generator for Student Self-Audit',
    stage: 'evaluate',
    type: 'prompt_template',
    format: 'PROMPT',
    description: 'Generates reflective questions tailored to an Upper School student’s specific inquiry journey, fostering self-efficacy and transferable research habits for their next unit.',
    targetAudience: 'Educators conducting Stage 8 Conferences (Grades 9-12)',
    academicStandard: 'AP Seminar Self-Evaluation & Reflective Research Habits',
    gradeRange: 'Grades 9-12',
    downloadFileName: 'Prompt_Stage8_Metacognitive_Audit.txt',
    tags: ['Metacognition', 'Self-Assessment', 'Learning-to-Learn', 'AP Seminar'],
    content: `Act as a reflective educational coach conducting a "GID Stage 8: Evaluate" closing conference for an Upper School student.

A student has just completed an inquiry project on:
Topic: [INSERT TOPIC]
Final Creation: [INSERT ARTIFACT - e.g. "Interactive Website & Town Hall Policy Brief"]

Generate a personalized reflection sheet with:
1. Three "Process Reflection" prompts (focusing on how they managed information anxiety and evaluated sources).
2. Two "Tech & AI Reflection" prompts (asking whether tools like NotebookLM or Diffit helped or hindered their own critical thinking).
3. One "Forward-Looking Growth" question (what research or inquiry habit will they carry forward into their next academic term).`,
  },
];
