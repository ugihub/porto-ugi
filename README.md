# Applied AI Engineer Portfolio

A React and Vite portfolio focused on curated AI engineering case studies, including local model delivery, agent reliability, and applied AI product work. Older public projects remain available as an archive, while private research stays private.

## Features

- Curated AI Systems, Archive, and Credentials views
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
```

`MISTRAL_API_KEY` must stay server-side. Do not prefix it with `VITE_`, do not commit `.env`, and do not call `api.mistral.ai` from browser code.

## Content

Portfolio content is centralized in `src/data/portfolioContent.js`:

- `featuredProjects` contains approved AI case studies.
- `archiveProjects` contains older public work.
- `verifiedCredentials` contains evidence-backed credential records.
- `portfolioPositioning` supplies Hero and About copy.

Private records must use `visibility: 'private'` with an empty `publicLinks` array. Public links should only be added after their repository or site is approved for release.

## Checks

```bash
npm test
npm run lint
npm run build
```
