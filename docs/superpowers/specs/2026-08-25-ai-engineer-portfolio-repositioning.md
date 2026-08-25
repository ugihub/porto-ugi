# AI Engineer Portfolio Repositioning

## Goal

Reposition the site from a general student web portfolio to an AI Engineer portfolio centered on verifiable systems, while preserving private work without exposing source code, credentials, or unsupported claims.

## Audience

Recruiters and engineering reviewers evaluating applied AI, agent systems, LLM tooling, and full-stack delivery.

## Content Direction

The first portfolio section must present these projects in this order:

1. WarehouseFlow Gemma 3 1B IT: domain model for warehouse and logistics tool calling. It is shown as a private model case study until its public visibility is explicitly confirmed. The card may describe its model family, GGUF delivery, 12 tools, local deployment, and documented LogiBench schema-match result of 89.6%.
2. CuanLimbah: one AI-enabled waste-management product with public Frontend, Backend, and AI System repository links. The card describes the user/admin product, NestJS backend, and RAG plus tool-calling system as one architecture. Role copy is "Full-stack and AI contributor" until the owner supplies a more specific role statement.
3. Long Horizon Task Manager: public deterministic agent execution framework. The card describes validation gates, evidence verification, recovery, evaluations, and its documented 242 tests.
4. MT5-TradeAI: private research case study. It describes hybrid signal analysis, ML, LLM orchestration, risk gates, and simulation mode. It has no source, deployment, broker, credential, profit, or win-rate link.

Old web, game, and school projects remain available under an archive view. They do not compete with AI systems in the first project view.

## Site Changes

- Hero copy makes Applied AI Engineer the first role and describes reliable domain-agent systems.
- About copy replaces generic language with model, agent, and product engineering evidence.
- The Work section becomes "Selected AI Systems" with a secondary archive tab and a credentials tab.
- Every featured project card includes problem, role, system summary, evidence, technology tags, privacy status, and only public links.
- Project selection and active tab use Redux Toolkit because `AGENTS.MD` mandates RTK for implementation state.
- No runtime GitHub or Hugging Face API calls. Portfolio content is curated static data so the experience remains deterministic and private projects never leak a URL.
- Existing animated visual language remains, but featured cards use data-dense case-study layouts rather than generic claims or self-scored skill bars.
- Remove unused fake award data so claims cannot accidentally be rendered later. Keep only verified credentials already stored in `Projects.jsx`.

## Privacy and Evidence Rules

- Private project records must have an empty `publicLinks` array.
- Private cards may show `Technical brief available on request`; they never show a download, GitHub, Hugging Face, live-demo, or source-code action.
- Do not add performance, user, revenue, investment, profit, accuracy, or certification claims unless they have an identified first-party source.
- Do not add new project imagery until first-party screenshots or diagrams are supplied. Cards must remain complete and legible without placeholder imagery.

## Acceptance Criteria

- The first visible project view contains only the four selected AI systems above.
- A private project cannot render a public source link.
- CuanLimbah renders as one system with three public repository links.
- The existing archive remains accessible but is visually secondary.
- The site has no fictional award or aggregate-statistic content.
- `npm test`, `npm run lint`, and `npm run build` complete without errors.
