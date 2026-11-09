# ETIS Command & GID Workflow Hub

An executive workflow workstation for **Educational Technology Integration Specialists (ETIS)** supporting **US Upper School (Grades 9–12)** faculty with **Guided Inquiry Design (GID)** unit coaching, classroom AI literacy, US federal privacy compliance, and live Google Workspace integration.

---

## Key Capabilities

### 1. Overview & Daily Task Command
- **Executive KPI Summary**: Tracks active Upper School (Grades 9–12) GID inquiry units, daily task completion, ETIS core role alignment percentage, and coaching hours.
- **Time-Boxed Daily Task Board**: Organizes coaching tasks across `Core ETIS`, `Supporting`, and `Time Leak` classifications, prioritizing instructional scaffolding over hardware or password requests.
- **Visual Analytics**: Charts GID stage distribution and departmental instructional integration metrics across Grades 9–12.

### 2. GID 8-Stage Project Matrix
- Tracks inquiry units strictly scoped to **Grades 9–12** (`9th`, `10th`, `11th`, `12th`, Honors, and AP Capstone) across all eight Guided Inquiry Design stages:
  `01. Open` → `02. Immerse` → `03. Explore` → `04. Identify` → `05. Gather` → `06. Create` → `07. Share` → `08. Evaluate`.
- Interactive milestone checklists, stage progression tracking, Essential Questions, and unit creation filtered exclusively for US Upper School courses.

### 3. Google Workspace Hub
- Connects via Firebase Google OAuth (`src/services/googleAuth.ts`) using read-only scopes for **Google Drive**, **Google Sheets**, **Google Calendar**, and **Gmail** (`src/services/googleWorkspace.ts`).
- Automatically classifies inbound workspace activity and meetings by ETIS role relevance and maps items to GID inquiry stages.

### 4. Role Relevancy Engine & Executive Reporting
- **AI Role Audit (`POST /api/gemini/analyze-role`)**: Evaluates tasks, calendar events, and inbound emails using Gemini (`gemini-3.8-flash`) to flag hardware/sysadmin time leaks and surface faculty coaching opportunities.
- **Executive Report Generator (`POST /api/gemini/generate-report`)**: Produces weekly or monthly Upper School leadership briefings aligned with US academic standards (**CCSS Grades 9–12**, **NGSS High School**, **C3 Framework**, **ISTE**, **AP Capstone**).

### 5. Faculty AI Studio
Includes four dedicated workspaces tailored to US Upper School educators:
- **Vetted AI Tools Matrix**: Filterable catalog of approved classroom AI tools (e.g., Google NotebookLM, Diffit, Brisk Teaching, Curipod, MagicSchool AI, Gemini for Education) with sample teacher prompts mapped to GID stages.
- **GID Resource Library**: Filterable repository of Grades 9–12 curriculum guides, AI prompt templates, and rubrics mapped to US academic standards, featuring **8-Stage Visual Progress Cards** tracking available resources vs. faculty usage/adoption and live Grades 9–12 inquiry unit completion.
- **Compliance Validator**: Interactive US privacy checklist and live lesson/prompt text scanner covering **FERPA**, **COPPA (Vendor SDPA)**, and **CIPA** standards, plus a printable/copyable verification summary.
- **AI Workshop Presentation Builder (`POST /api/gemini/generate-workshop`)**: Generates custom Upper School professional development slide decks, ETIS speaker scripts, hands-on sprint activities, and academic integrity guidance.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide Icons, Motion
- **Backend**: Node.js, Express 4 (`server.ts` serving Vite middleware in dev and `dist/` in production)
- **AI Integration**: `@google/genai` (`gemini-3.8-flash`) via server-side `/api/gemini/*` endpoints
- **Authentication & Workspace**: Firebase Auth Google Provider with Google Drive, Sheets, Calendar, and Gmail read-only OAuth scopes

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm or bun

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and populate your runtime values:

```env
GEMINI_API_KEY="your-gemini-api-key"
APP_URL="http://localhost:3000"
```

> Google Workspace OAuth and Firebase client settings are read from `firebase-applet-config.json`. Requested OAuth scopes:
> - `https://www.googleapis.com/auth/drive.readonly`
> - `https://www.googleapis.com/auth/spreadsheets.readonly`
> - `https://www.googleapis.com/auth/calendar.events.readonly`
> - `https://www.googleapis.com/auth/gmail.readonly`

### 3. Run the Development Server
Starts the Express backend and Vite dev middleware on port **3000**:
```bash
npm run dev
```

### 4. Type-Check & Build for Production
```bash
npm run lint
npm run build
npm start
```

---

## API Endpoints

All AI generation endpoints run server-side in `server.ts` and include structured US Upper School (Grades 9–12) fallbacks if the upstream model is unavailable:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/gemini/analyze-role` | Analyzes tasks, emails, calendar events, and GID projects for role alignment and time leaks |
| `POST` | `/api/gemini/generate-report` | Generates an executive impact briefing for Upper School leadership |
| `POST` | `/api/gemini/generate-workshop` | Synthesizes a slide-by-slide faculty AI PD deck with speaker scripts and activities |

---

## Project Structure

```text
├── server.ts                            # Express server, Gemini API routes, Vite dev/prod serving
├── index.html                           # HTML entry point & typography imports
├── firebase-applet-config.json          # Firebase project configuration
├── src/
│   ├── App.tsx                          # Root state, US Upper School (9–12) guards, tab routing
│   ├── components/
│   │   ├── HeaderNav.tsx                # Top navigation bar and Google Sign-In controls
│   │   ├── KpiSummaryRow.tsx            # Executive KPI cards
│   │   ├── DailyTaskBoard.tsx           # Time-boxed ETIS daily task management
│   │   ├── GidMilestoneTracker.tsx      # 8-stage Upper School GID inquiry project matrix
│   │   ├── WorkspaceIntegrationsPanel.tsx # Live Drive, Sheets, Calendar, Gmail feed
│   │   ├── AnalyticsCharts.tsx          # GID & workload charts
│   │   ├── RoleRelevancyView.tsx        # Workload balance & delegation analyzer
│   │   ├── FacultyAiHub.tsx             # Faculty AI Literacy & Workshop Studio container
│   │   ├── GidResourceLibrary.tsx       # 8-stage GID resource catalog & visual progress cards
│   │   ├── ComplianceValidator.tsx      # US FERPA / COPPA (SDPA) / CIPA checklist & scanner
│   │   └── ReportGeneratorModal.tsx     # Automated executive report generator modal
│   ├── data/
│   │   ├── gidKnowledge.ts              # 8 GID stages knowledge base (Grades 9–12)
│   │   ├── gidResourcesData.ts          # Curriculum guides, prompts, and rubrics mapped to US standards
│   │   └── mockData.ts                  # Default Upper School units, tasks, Workspace items, AI tools
│   ├── services/
│   │   ├── googleAuth.ts                # Firebase Auth & Google Workspace OAuth helpers
│   │   └── googleWorkspace.ts           # Drive, Calendar, and Gmail fetchers
│   └── types/
│       └── gid.ts                       # Core TypeScript domain models
```

---

## Browser Storage Keys

Application state persists locally in `localStorage` using versioned Upper School (Grades 9–12) keys:
- `etis_projects_us912_v3` — Active Upper School GID units and stage milestones
- `etis_tasks_us912_v3` — Daily task board items
- `etis_workspace_items_us912_v3` — Synced/seeded Google Workspace items
- `gid_resource_library_v2` — Custom & seed GID curriculum guides and prompt templates
- `gid_resource_usage_us912_v1` — Faculty adoption flags, run counts, and last-used dates
- `compliance_checklist_state_us912_v2` — Verified FERPA/COPPA/CIPA checklist selections

---

## Publishing & Embedding in Google Sites

Because Google Sites renders embedded web apps inside a cross-origin iframe, host this app on HTTPS first and then embed or link it from your Google Site.

### Option A: Full-Stack Deployment (Recommended — Live Gemini AI + UI)
Deploy the full Express + Vite application (via Cloud Run, Render, Railway, or another Node host with `GEMINI_API_KEY` set) so both the frontend and server-side `/api/gemini/*` endpoints remain live.

### Option B: GitHub Pages Deployment (Static Frontend)
1. Push this repository to GitHub (includes `.github/workflows/deploy-pages.yml` and relative asset paths via `base: './'` in `vite.config.ts`).
2. In your GitHub repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Wait for the `Deploy to GitHub Pages` workflow to complete and copy your published `https://<username>.github.io/<repo-name>/` URL.
4. *(Note)*: GitHub Pages hosts static files only (`dist/`) without the Express server, so the Role Audit, Executive Report Generator, and Workshop Builder automatically fall back to their built-in Upper School (Grades 9–12) structured templates.
5. *(For Google Sign-In on GitHub Pages)*: Add `<username>.github.io` under **Firebase Console → Authentication → Settings → Authorized domains** and in your Google OAuth Authorized JavaScript origins.

### Embedding in Your Google Site
1. Open your Google Site editor (`Insert → Embed`).
2. Select **By URL**, paste your published HTTPS app URL, choose **Whole page**, and click **Insert**.
3. Drag the frame handles to widen across the page canvas and set sufficient vertical height (`900px+` recommended).
4. Click **Publish** in Google Sites.
5. *(Tip)*: If an embedded iframe restricts the Google Sign-In OAuth popup in some browsers, add a Google Sites button linking directly to the full HTTPS app URL in a new tab.

