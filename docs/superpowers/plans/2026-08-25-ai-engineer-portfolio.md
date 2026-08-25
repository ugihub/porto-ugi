# AI Engineer Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reposition the portfolio around four verifiable AI engineering case studies while retaining older work as a secondary archive and keeping private projects private.

**Architecture:** Curated portfolio data lives in one static module. Redux Toolkit owns only shared project-view state: active tab and selected project ID. The existing React section renders cards and a modal from that data, filtering links by visibility rather than requesting remote GitHub or Hugging Face data at runtime.

**Tech Stack:** React 18, Vite 6, Redux Toolkit, React Redux, Framer Motion, CSS, Node built-in test runner.

**Spec:** `docs/superpowers/specs/2026-08-25-ai-engineer-portfolio-repositioning.md`

## Global Constraints

- Follow `AGENTS.MD`: use RTK for shared state, current Caveman core/component structure, Ponytail for minimal UI composition, and Superpowers for TDD and verification.
- Keep all content ASCII-only unless a project name or existing source requires otherwise.
- Do not add a GitHub/Hugging Face runtime fetch, new third-party UI library, synthetic metric, placeholder image, public link for a private project, source link for MT5-TradeAI, Agentic Office, or LogistiKita.
- Preserve the existing Mistral server-side security patch and `test/api-key-exposure.test.js`.
- Treat `dist/` as generated output and do not commit it.

---

## File Structure

- Create: `src/data/portfolioContent.js` - Curated AI, archive, and verified credential records plus pure selectors.
- Create: `src/app/store.js` - Redux Toolkit store configuration.
- Create: `src/features/portfolio/portfolioSlice.js` - Shared active-tab and selected-project state.
- Create: `src/sections/Projects/ProjectCard.jsx` - Presentational featured/archive project card.
- Create: `src/sections/Projects/ProjectModal.jsx` - Presentational evidence and public-link modal.
- Create: `test/portfolio-content.test.js` - Data privacy and project-selection regression tests.
- Create: `test/portfolio-slice.test.js` - Shared view-state reducer tests.
- Modify: `package.json` - Add Redux dependencies without changing existing scripts.
- Modify: `src/main.jsx` - Add Redux Provider around existing ThemeProvider.
- Modify: `src/sections/Projects/Projects.jsx` - Replace inline project/skill/award arrays and local view state with data selectors and RTK state.
- Modify: `src/sections/Projects/Projects.css` - Add case-study and privacy-status styling while preserving existing responsive grid conventions.
- Modify: `src/sections/Hero/Hero.jsx` - Replace generic role rotation and description with Applied AI Engineer positioning.
- Modify: `src/sections/About/About.jsx` - Replace generic bio with evidence-led AI engineering copy.
- Modify: `src/components/Navigation/Navigation.jsx` - Rename the Work label to AI Systems and keep the existing `#projects` destination.
- Modify: `src/sections/Awards/Awards.jsx` - Remove fabricated awards and aggregate statistics from unused source; do not add a new awards UI.
- Modify: `README.md` - Update project description and content-customization notes to match the AI Engineer portfolio.

### Task 1: Add Curated Content and RTK View State

**Files:**
- Create: `src/data/portfolioContent.js`
- Create: `src/app/store.js`
- Create: `src/features/portfolio/portfolioSlice.js`
- Create: `test/portfolio-content.test.js`
- Create: `test/portfolio-slice.test.js`
- Modify: `package.json`
- Modify: `src/main.jsx`

**Interfaces:**
- Produces `featuredProjects`, `archiveProjects`, `verifiedCredentials`, and `getProjectsForTab(tab)` from `src/data/portfolioContent.js`.
- Produces `portfolioReducer`, `setActiveTab(tab)`, `selectProject(id)`, and `clearSelectedProject()` from `src/features/portfolio/portfolioSlice.js`.
- Produces a Redux store with `{ portfolio: portfolioReducer }` from `src/app/store.js`.

- [ ] **Step 1: Write the failing content and reducer tests**

```js
import assert from 'node:assert/strict'
import test from 'node:test'
import { featuredProjects, getProjectsForTab } from '../src/data/portfolioContent.js'
import reducer, { selectProject, setActiveTab } from '../src/features/portfolio/portfolioSlice.js'

test('private project records never expose public source links', () => {
  for (const project of featuredProjects.filter((item) => item.visibility === 'private')) {
    assert.deepEqual(project.publicLinks, [])
  }
})

test('featured AI view contains the approved project order', () => {
  assert.deepEqual(
    getProjectsForTab('ai').map((project) => project.id),
    ['warehouseflow', 'cuanlimbah', 'long-horizon-task', 'mt5-tradeai']
  )
})

test('project view state selects a project and switches tabs', () => {
  let state = reducer(undefined, { type: 'init' })
  state = reducer(state, setActiveTab('archive'))
  state = reducer(state, selectProject('warehouseflow'))
  assert.deepEqual(state, { activeTab: 'archive', selectedProjectId: 'warehouseflow' })
})
```

- [ ] **Step 2: Run tests to verify the expected RED failure**

Run: `npm test`

Expected: FAIL because `portfolioContent.js` and `portfolioSlice.js` do not exist.

- [ ] **Step 3: Add Redux packages**

Run: `npm install @reduxjs/toolkit react-redux`

Expected: `package.json` and lockfile contain only those two direct dependencies.

- [ ] **Step 4: Implement the curated content module**

```js
export const featuredProjects = [
  {
    id: 'warehouseflow',
    title: 'WarehouseFlow Gemma 3 1B IT',
    category: 'Domain LLM',
    visibility: 'private',
    role: 'Model developer',
    problem: 'Warehouse operations need reliable, local tool-calling assistance.',
    summary: 'Fine-tuned Gemma 3 1B delivered as GGUF for local logistics workflows.',
    evidence: ['12 warehouse tools', 'GGUF local deployment', 'LogiBench schema match: 89.6%'],
    tech: ['Gemma 3', 'LoRA', 'GGUF', 'llama.cpp', 'Tool calling'],
    publicLinks: []
  },
  {
    id: 'cuanlimbah',
    title: 'CuanLimbah',
    category: 'Applied AI Product',
    visibility: 'public',
    role: 'Full-stack and AI contributor',
    problem: 'Waste collection needs traceable operations, user incentives, and useful assistance.',
    summary: 'A user/admin waste-management product with NestJS services and a RAG plus tool-calling AI system.',
    evidence: ['User and admin workflows', 'Wallet and withdrawal flow', 'RAG with pgvector', 'Tool registry and action routing'],
    tech: ['React', 'NestJS', 'TypeScript', 'Supabase', 'pgvector', 'RAG'],
    publicLinks: [
      { label: 'Frontend', url: 'https://github.com/CuanLimbah/frontend' },
      { label: 'Backend', url: 'https://github.com/CuanLimbah/backend' },
      { label: 'AI System', url: 'https://github.com/CuanLimbah/llm' }
    ]
  },
  {
    id: 'long-horizon-task',
    title: 'Long Horizon Task Manager',
    category: 'Agent Infrastructure',
    visibility: 'public',
    role: 'Creator and maintainer',
    problem: 'Long-running agent tasks need deterministic controls and verifiable completion.',
    summary: 'A Python engine that validates plans, gates actions, verifies evidence, and recovers failed tasks.',
    evidence: ['242 documented tests', 'Adversarial evaluation harness', 'Evidence verification', 'Deterministic action gate'],
    tech: ['Python', 'PyYAML', 'unittest', 'GitHub Actions'],
    publicLinks: [{ label: 'GitHub', url: 'https://github.com/ugihub/long-horizon-task' }]
  },
  {
    id: 'mt5-tradeai',
    title: 'MT5-TradeAI',
    category: 'Private R&D',
    visibility: 'private',
    role: 'Builder',
    problem: 'Market analysis systems need explicit risk controls before execution.',
    summary: 'Private hybrid research system combining technical signals, ML, LLM orchestration, and simulation-aware risk gates.',
    evidence: ['SMC signal analysis', 'XGBoost model layer', 'LLM consensus', 'Dry-run and risk controls'],
    tech: ['Python', 'MetaTrader 5', 'XGBoost', 'LLM orchestration', 'Supabase'],
    publicLinks: []
  }
]

export const getProjectsForTab = (tab) => tab === 'ai' ? featuredProjects : archiveProjects
```

Populate `archiveProjects` with the eight current project records and preserve their existing public links. Export the three existing Oracle, Scout, and IT Webinar records as `verifiedCredentials`.

- [ ] **Step 5: Implement the RTK store and reducer**

```js
import { configureStore } from '@reduxjs/toolkit'
import portfolioReducer from '../features/portfolio/portfolioSlice.js'

export const store = configureStore({
  reducer: { portfolio: portfolioReducer }
})
```

```js
import { createSlice } from '@reduxjs/toolkit'

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState: { activeTab: 'ai', selectedProjectId: null },
  reducers: {
    setActiveTab: (state, action) => { state.activeTab = action.payload },
    selectProject: (state, action) => { state.selectedProjectId = action.payload },
    clearSelectedProject: (state) => { state.selectedProjectId = null }
  }
})

export const { setActiveTab, selectProject, clearSelectedProject } = portfolioSlice.actions
export default portfolioSlice.reducer
```

Wrap the current `ThemeProvider` tree with `<Provider store={store}>` in `src/main.jsx`.

- [ ] **Step 6: Run tests to verify GREEN**

Run: `npm test`

Expected: existing API-key bundle test plus the new content and reducer tests PASS.

- [ ] **Step 7: Commit the isolated content-state change**

```bash
git add package.json package-lock.json src/app/store.js src/data/portfolioContent.js src/features/portfolio/portfolioSlice.js src/main.jsx test/portfolio-content.test.js test/portfolio-slice.test.js
git commit -m "feat: add curated AI portfolio content state"
```

### Task 2: Render Featured AI Systems and Archive Views

**Files:**
- Create: `src/sections/Projects/ProjectCard.jsx`
- Create: `src/sections/Projects/ProjectModal.jsx`
- Modify: `src/sections/Projects/Projects.jsx`
- Modify: `src/sections/Projects/Projects.css`

**Interfaces:**
- Consumes `featuredProjects`, `archiveProjects`, `verifiedCredentials`, and `getProjectsForTab(tab)`.
- Consumes `portfolio.activeTab` and `portfolio.selectedProjectId`; dispatches `setActiveTab`, `selectProject`, and `clearSelectedProject`.
- `ProjectCard({ project, onSelect })` renders one card without owning selection state.
- `ProjectModal({ project, onClose })` renders public links only from `project.publicLinks`.

- [ ] **Step 1: Add a failing integration assertion for private-link behavior**

Extend `test/portfolio-content.test.js`:

```js
test('only public project records provide external actions', () => {
  for (const project of featuredProjects) {
    assert.equal(project.publicLinks.length > 0, project.visibility === 'public')
  }
})
```

- [ ] **Step 2: Run tests to verify RED**

Run: `npm test`

Expected: FAIL until every featured record has the required `visibility` and `publicLinks` behavior.

- [ ] **Step 3: Create presentational cards and modal**

`ProjectCard` must show category, title, role, summary, evidence bullets, tags, and status. For `visibility === 'private'`, show the literal status `Technical brief available on request` and no anchor action. Use the existing `motion.div` card animation style and no nested card containers.

`ProjectModal` must show problem, summary, evidence, tags, and map only `project.publicLinks` into anchors with `target="_blank"` and `rel="noreferrer"`. It must render no empty link container.

- [ ] **Step 4: Replace `Projects.jsx` state and inline data**

Remove its inline `projects`, `skills`, `awards`, `activeTab`, and `selectedProject` data/state. Use Redux selectors and provide exactly these tabs:

```js
const tabs = [
  { id: 'ai', label: 'AI SYSTEMS' },
  { id: 'archive', label: 'ARCHIVE' },
  { id: 'credentials', label: 'CREDENTIALS' }
]
```

Render `ProjectCard` for `getProjectsForTab(activeTab)` in the first two tabs. Render the current three verified credential entries in the third tab. Use `selectedProjectId` to locate the selected project across both project arrays before rendering `ProjectModal`.

- [ ] **Step 5: Add scoped CSS**

Add styles for `.project-role`, `.project-evidence`, `.project-privacy-status`, `.project-links`, and `.project-archive-label`. Keep existing responsive grid breakpoints. Use the existing color variables and an 8px-or-less radius for cards. Do not add gradients, placeholder art, decorative metric blobs, or viewport-scaled font sizes.

- [ ] **Step 6: Run tests and build to verify GREEN**

Run: `npm test && npm run build`

Expected: all tests PASS and Vite build exits 0.

- [ ] **Step 7: Manually verify the public/private boundary**

Run: `npm run dev -- --host 127.0.0.1`

Check at `http://127.0.0.1:5173/`:
- AI Systems is the default tab.
- WarehouseFlow and MT5-TradeAI show no external source action.
- CuanLimbah has three public repository actions.
- Archive items retain their old public links.
- Desktop and a 390px-wide viewport have no clipped card text.

- [ ] **Step 8: Commit the section refactor**

```bash
git add src/sections/Projects/ProjectCard.jsx src/sections/Projects/ProjectModal.jsx src/sections/Projects/Projects.jsx src/sections/Projects/Projects.css test/portfolio-content.test.js
git commit -m "feat: prioritize AI portfolio case studies"
```

### Task 3: Reposition Hero, About, and Navigation

**Files:**
- Modify: `src/sections/Hero/Hero.jsx`
- Modify: `src/sections/About/About.jsx`
- Modify: `src/components/Navigation/Navigation.jsx`

**Interfaces:**
- Keeps the existing `#projects` anchor and navigation scroll behavior.
- Produces no new state, API, or dependency.

- [ ] **Step 1: Add a failing content regression test**

Add this assertion to `test/portfolio-content.test.js` after exporting a `portfolioPositioning` object from `portfolioContent.js`:

```js
import { portfolioPositioning } from '../src/data/portfolioContent.js'

test('portfolio positioning leads with applied AI engineering', () => {
  assert.equal(portfolioPositioning.primaryRole, 'Applied AI Engineer')
  assert.match(portfolioPositioning.summary, /domain-agent systems/i)
})
```

- [ ] **Step 2: Run tests to verify RED**

Run: `npm test`

Expected: FAIL because `portfolioPositioning` has not yet been exported.

- [ ] **Step 3: Add positioning content and consume it in hero/about**

Add this record to `portfolioContent.js`:

```js
export const portfolioPositioning = {
  primaryRole: 'Applied AI Engineer',
  supportingRoles: ['LLM Systems Builder', 'Full-stack AI Developer'],
  summary: 'Building reliable domain-agent systems, local model workflows, and AI products for real operations.',
  about: 'I build applied AI systems across model delivery, agent reliability, and product engineering. My work includes warehouse tool-calling models, RAG-enabled product flows, and deterministic controls for long-running agents.'
}
```

In `Hero.jsx`, use `primaryRole` as the first and default visible role. Keep only `Applied AI Engineer`, `LLM Systems Builder`, and `Full-stack AI Developer` in the typewriter list. Replace the generic description with `summary`.

In `About.jsx`, replace the first-semester and generic language claims with `about`. Keep education as a supporting factual sentence only if its wording is current and verified by the owner.

In `Navigation.jsx`, replace the `Work` label with `AI Systems`; preserve `id: 'projects'`.

- [ ] **Step 4: Run tests and lint to verify GREEN**

Run: `npm test && npm run lint`

Expected: tests PASS. Lint exits 0; record only warnings that predate this task and do not broaden the patch to clean unrelated files.

- [ ] **Step 5: Commit the positioning update**

```bash
git add src/data/portfolioContent.js src/sections/Hero/Hero.jsx src/sections/About/About.jsx src/components/Navigation/Navigation.jsx test/portfolio-content.test.js
git commit -m "feat: position portfolio for applied AI engineering"
```

### Task 4: Remove Unverified Award Claims and Align Documentation

**Files:**
- Modify: `src/sections/Awards/Awards.jsx`
- Modify: `README.md`
- Test: `test/portfolio-content.test.js`

**Interfaces:**
- `Awards.jsx` is not imported by `App.jsx` and must remain absent from the rendered application.
- Verified credentials continue to come from `verifiedCredentials` in `portfolioContent.js`.

- [ ] **Step 1: Add a failing claim-safety test**

```js
test('verified credentials do not use aggregate achievement claims', () => {
  const text = JSON.stringify(verifiedCredentials)
  assert.doesNotMatch(text, /Awards Won|5-Star Reviews|Google Developer Expert/i)
})
```

- [ ] **Step 2: Run tests to verify RED**

Run: `npm test`

Expected: FAIL until the test imports `verifiedCredentials` and the obsolete award source is removed.

- [ ] **Step 3: Delete fabricated award records and update README**

Replace the content of `Awards.jsx` with an empty compatibility module:

```js
const Awards = () => null

export default Awards
```

Do not include fake awards, certificate totals, review totals, or fabricated organization names elsewhere. Update the README title, feature list, and content-customization section to describe an AI Engineer portfolio with curated static case studies. Retain security documentation for `MISTRAL_API_KEY`.

- [ ] **Step 4: Run full verification**

Run: `npm test && npm run lint && npm run build && git diff --check`

Expected: all commands exit 0. Lint may emit existing warnings but no errors. `git diff --check` has no output.

- [ ] **Step 5: Commit documentation and claim cleanup**

```bash
git add src/sections/Awards/Awards.jsx README.md test/portfolio-content.test.js
git commit -m "docs: align portfolio claims with verified work"
```

### Task 5: Visual Acceptance and Content Approval Gate

**Files:**
- Modify only after review: `src/data/portfolioContent.js`

**Interfaces:**
- All card copy and links remain sourced from `portfolioContent.js`.

- [ ] **Step 1: Run the application locally**

Run: `npm run dev -- --host 127.0.0.1`

- [ ] **Step 2: Capture the required viewports**

Verify the following at `http://127.0.0.1:5173/`:
- 1440px wide: hero establishes Applied AI Engineer before the project section; all four AI cards are scannable.
- 390px wide: tabs wrap or scroll without overlap; private status and evidence lines stay within card bounds.
- Open each project modal: public projects show only their approved public links; private records show no external source action.
- Open CuanLimbah: Frontend, Backend, and AI System actions use the expected public GitHub URLs.

- [ ] **Step 3: Obtain owner approval for factual copy**

Confirm these exact claims with the portfolio owner before release:
- CuanLimbah role is accurately stated as `Full-stack and AI contributor` or replaced with an owner-supplied factual role.
- WarehouseFlow remains private and must not expose a model URL.
- MT5-TradeAI remains private and has no public financial-performance claim.
- Education wording in About is current.

- [ ] **Step 4: Run final release gate**

Run: `npm test && npm run lint && npm run build && git status --short`

Expected: tests and build PASS, lint has no errors, and `git status --short` contains only the intended portfolio files before commit.

- [ ] **Step 5: Commit approved copy only if changes were required**

```bash
git add src/data/portfolioContent.js
git commit -m "docs: verify AI portfolio case study copy"
```

## Self-Review

- Spec coverage: Tasks 1-2 deliver the four approved case studies, privacy rules, archive, credentials, RTK state, and no-runtime-fetch requirement. Task 3 updates positioning. Task 4 removes fictional claims and aligns documentation. Task 5 verifies responsive UI and factual copy.
- Placeholder scan: no implementation placeholders remain. Owner confirmation in Task 5 is a release gate for factual claims, not an implementation placeholder.
- Type consistency: all consumers use `featuredProjects`, `archiveProjects`, `verifiedCredentials`, `getProjectsForTab`, `portfolioPositioning`, `setActiveTab`, `selectProject`, and `clearSelectedProject` exactly as defined in Task 1 and Task 3.
