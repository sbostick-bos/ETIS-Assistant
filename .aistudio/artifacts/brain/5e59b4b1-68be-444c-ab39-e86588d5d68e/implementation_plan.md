# US K-12 Educational Focus & GID Resource Library Integration

Ensure the entire ETIS workstation, Guided Inquiry Design (GID) curriculum scaffolding, and AI prompt studio strictly align with **US K-12 education standards**, US federal student data privacy laws (**FERPA, COPPA, CIPA**), and integrate the new **`GidResourceLibrary`** component within the **Faculty AI Studio** tab.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> All educational terminology, grade bands, curriculum standards, and AI safety protocols will be strictly localized to the **US K-12 educational system** (Common Core State Standards, Next Generation Science Standards, C3 Framework for Social Studies, ISTE Standards for Students & Educators, and Florida B.E.S.T. Standards). Non-US terminology or external school systems are explicitly excluded.

- **US Privacy & Compliance Foundation**: Prominently enforce US Federal compliance tags (**FERPA**, **COPPA**, **CIPA**) across all classroom AI tools and prompt templates, with strict zero-student-PII instructions.
- **GID Resource Library Integration**: Complete the dedicated 3-tab view in `FacultyAiHub` (`Vetted AI Tools Matrix` · `GID Resource Library` · `Workshop Presentation Builder`), featuring downloadable curriculum guides (PDF/markdown), rubrics, and copyable prompt templates across all 8 GID stages.
- **US K-12 AI Workshop & Report Generation**: Update server-side prompt instructions in `server.ts` to anchor automated executive reports and faculty workshop outlines in US grade bands (Elementary PK-5, Middle School 6-8, High School 9-12, AP Capstone).

---

### 1. Overview & Core Concept

- **What It Delivers**:
  1. **Strict US K-12 Alignment**: Tailors every curriculum reference, coaching ticket, student inquiry example, and AI prompt to US classroom environments (e.g., US school calendars, semester/quarter cycles, US independent school governance).
  2. **GID Resource Library (`GidResourceLibrary`)**: A centralized repository in the Faculty AI Hub containing downloadable curriculum guides, student inquiry logs, assessment rubrics, and copyable prompt templates for all 8 stages:
     - **Stage 1 (Open)**: US curiosity hooks, Wonder Wall protocols, and open-ended scenario prompts.
     - **Stage 2 (Immerse)**: Third Space connection logs, background reading differentiation (Lexile bands).
     - **Stage 3 (Explore)**: US scholarly database search scaffolds (Gale, JSTOR, Google Scholar) and counter-argument interrogators.
     - **Stage 4 (Identify)**: Socratic driving question formulation rubrics aligned to CCSS/NGSS benchmarks.
     - **Stage 5 (Gather)**: Primary source corroboration checklists and NotebookLM evidence synthesis workflows.
     - **Stage 6 (Create)**: Multi-modal student synthesis guidelines with mandatory US AI disclosure statements.
     - **Stage 7 (Share)**: Authentic community audience town halls and TAG peer critique protocols.
     - **Stage 8 (Evaluate)**: The 5-Kinds of Learning metacognitive reflection audit journals.
  3. **Stage-by-Stage Filtering**: Real-time filtering by GID stage (Stages 1 through 8), resource type (Curriculum Guides, AI Prompt Templates, Rubrics), and search query.
  4. **Active Downloads & Quick Copy**: Real browser file downloads (`.md` / printable documents) and one-click prompt copying with visual feedback.
  5. **Custom Resource Contribution**: Allows the ETIS and faculty to add new custom guides or prompt templates directly into the library, persisted in `localStorage`.

---

### 2. User Experience & Visual Design

Following the **Universal Frontend Design Constitution** and **SaaS & Dashboard Guidelines**:

- **Navigation & Layout**:
  - The `FacultyAiHub` tab will feature a clean segmented mode selector:
    `[ Vetted AI Tools Matrix | GID Resource Library | Workshop Presentation Builder ]`
  - In the `GID Resource Library`, an 8-stage interactive ribbon allows faculty to instantly isolate resources for their current inquiry phase with single-click filtering.
- **Typography & Styling**:
  - `Plus Jakarta Sans` for clean titles, `JetBrains Mono` for tabular figures and format tags (`[PDF]`, `[PROMPT]`, `[DOCX]`).
  - Zero-pill metadata discipline: clean unboxed text with `·` separators (e.g. `Stage 04: Identify · Curriculum Guide · Grades 6-12 · FERPA Compliant`).
  - Single-line action buttons with subtle hover settling (`Download`, `Copy Prompt`, `Quick Preview`).
- **Interactive Modals**:
  - Full-screen Quick Preview modal displaying complete formatted guide text, instructions, and download triggers.
  - Add Resource modal for contributing new guides or prompts.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Exclusively US-Anchored Standards (CCSS, NGSS, C3, ISTE, FERPA)**
  - *Chosen Approach*: Hardcode and prompt-instruct all AI features and data models to use US K-12 frameworks, excluding UK/Commonwealth or generic international terminology.
  - *Why*: The user explicitly stated they only work with US teachers and must only capture US-relevant information.
- **Decision 2: Seamless Tab Integration within `FacultyAiHub`**
  - *Chosen Approach*: Mount `GidResourceLibrary` as the centerpiece tab of `FacultyAiHub`, positioned between the Tools Matrix and the Workshop Studio.
  - *Why*: Directly connects the theoretical tool recommendations with concrete downloadable lesson materials and workshop decks.
- **Decision 3: Zero-Dependency Real File Download**
  - *Chosen Approach*: Client-side `Blob` generator creating clean UTF-8 markdown files that download instantly in any browser without external server latency.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Faculty AI Studio                             │
├────────────────────────────────────────────────────────────────────────┤
│  Mode Tabs: [ Vetted AI Tools Matrix | GID Resource Library | Studio ] │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ 8-Stage GID Filter Ribbon: [All | 01 Open ... 08 Evaluate]       │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │ Type Filter: [All Types | Curriculum Guides | AI Prompts | Rubric]│  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │ Search Bar: "Filter by US standard, tool, or keyword..."         │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │ Resource Grid (2-column layout):                                 │  │
│  │  • Card: Title · Stage · US Grade Band · Format · Tags           │  │
│  │  • Action Strip: [Quick Preview] · [Copy Prompt] · [Download]    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

- **Data Models**:
  - `GidResource`: `id`, `title`, `stage` (1..8), `type`, `format`, `description`, `targetAudience` (US grade bands), `downloadFileName`, `content`, `tags`.
  - Stored in `src/data/gidResourcesData.ts` and synced with `localStorage` (`gid_resource_library`).
- **Server Updates (`server.ts`)**:
  - Update system prompts for `/api/gemini/analyze-role`, `/api/gemini/generate-report`, and `/api/gemini/generate-workshop` to enforce US educational context, US student privacy (FERPA/COPPA), and US standards (CCSS, NGSS, C3, ISTE).
