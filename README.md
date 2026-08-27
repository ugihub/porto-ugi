# Applied AI Engineer Portfolio

A React and Vite portfolio focused on curated AI engineering case studies, including local model delivery, agent reliability, and applied AI product work. Older public projects remain available as an archive, while private research stays private.

## Features

- Curated AI Systems, Tools and Systems, and Credentials views
- Applied AI Lab for deterministic tool-call, retrieval, reliability, and token-cost demonstrations
- Static case-study content with no GitHub or Hugging Face runtime fetch
- Public links rendered only for approved public projects
- Redux Toolkit state for the active portfolio view and project details modal
- Theme customization, animations, and responsive layout

## Stack

- React 18 and Vite
- Redux Toolkit and React Redux
- Framer Motion and GSAP
- Supabase for optional theme persistence

## Start

```bash
npm install
npm run dev
```

For a production bundle:

```bash
npm run build
npm run preview
```

## Environment Variables

Copy `.env.example` to `.env` and configure only the services you use:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
MISTRAL_API_KEY=your-server-only-mistral-key
ENABLE_WAREHOUSEFLOW_LIVE_DEMO=false
VITE_ENABLE_WAREHOUSEFLOW_LIVE_DEMO=false
```

`MISTRAL_API_KEY` must stay server-side. Do not prefix it with `VITE_`, do not commit `.env`, and do not call `api.mistral.ai` from browser code.

The AI Lab is local-first. Its default demonstrations never call an LLM. The optional WarehouseFlow live demo is disabled unless both `ENABLE_WAREHOUSEFLOW_LIVE_DEMO` and `VITE_ENABLE_WAREHOUSEFLOW_LIVE_DEMO` equal `true`; it is rate-limited and uses the server-side Mistral key. Token costs use an editable USD-to-IDR exchange rate and dated, local pricing snapshots linked to each provider's official source.

## Content

Portfolio content is centralized in `src/data/portfolioContent.js`:

- `featuredProjects` contains approved AI case studies.
- `toolGroups` contains AI engineering capabilities backed by the case studies.
- `verifiedCredentials` contains evidence-backed credential records.
- `portfolioPositioning` supplies Hero and About copy.

Private records must use `visibility: 'private'` with an empty `publicLinks` array. Public links should only be added after their repository or site is approved for release.

## Checks

```bash
npm test
npm run lint
npm run build
```
