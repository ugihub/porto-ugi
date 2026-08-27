const certificateScout = new URL('../assets/Sertifikat1.jpg', import.meta.url).href
const certificateOracle = new URL('../assets/Sertifikat2.png', import.meta.url).href
const certificateWebinar = new URL('../assets/Sertifikat3.png', import.meta.url).href

export const featuredProjects = [
  {
    id: 'warehouseflow',
    title: 'WarehouseFlow Gemma 3 1B IT',
    category: 'Domain LLM',
    visibility: 'public',
    role: 'Model developer',
    problem: 'Warehouse operations need reliable, local tool-calling assistance.',
    summary: 'Fine-tuned Gemma 3 1B delivered as GGUF for local logistics workflows.',
    evidence: ['12 warehouse tools', 'GGUF local deployment', 'LogiBench schema match: 89.6%'],
    tech: ['Gemma 3', 'LoRA', 'GGUF', 'llama.cpp', 'Tool calling'],
    publicLinks: [{ label: 'Hugging Face', url: 'https://huggingface.co/Ugisr/warehouseflow-gemma3-1b-it-gguf' }]
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

export const toolGroups = [
  {
    id: 'llm-agents',
    area: 'c01',
    variant: 'headline',
    accent: 'cyan',
    headline: { lead: 'LLM &', accentWord: 'AGENTS' },
    sub: 'Domain SLM quantization, LoRA adapter tuning, and deterministic tool-calling workflows for fast local inference.',
    tools: ['Gemma 3', 'LoRA', 'GGUF'],
    badge: 'Model Delivery',
    title: 'LLM and Agents',
    explanation: {
      title: 'LLM & Agent Systems',
      purpose: 'Encompasses fine-tuning lightweight SLMs, GGUF conversion for low-latency local execution, and building autonomous agents with strict tool-calling contracts.',
      highlights: [
        'LoRA & QLoRA domain adaptation',
        'GGUF / llama.cpp local orchestration',
        'Deterministic JSON-schema tool calling',
        'Retrieval-Augmented Generation workflows'
      ]
    }
  },
  {
    id: 'ai-infrastructure',
    area: 'c02',
    variant: 'stat',
    accent: 'emerald',
    stat: { value: 12, unit: 'SYSTEMS WIRED' },
    line: 'Scalable vector retrieval, deterministic task execution gates, and automated safety evaluation pipelines.',
    tools: ['Python', 'pgvector', 'Supabase'],
    badge: 'Data & Guardrails',
    title: 'AI Infrastructure',
    explanation: {
      title: 'AI Infrastructure & Guardrails',
      purpose: 'Provides robust vector retrieval, state persistence, deterministic validation gates, and automated regression testing harnesses.',
      highlights: [
        'pgvector index optimization and semantic search',
        'LHTM (Long-Horizon Task Management) state machines',
        'Adversarial policy and safety gating',
        'Automated CI/CD validation pipelines'
      ]
    }
  },
  {
    id: 'product-engineering',
    area: 'c03',
    variant: 'volt',
    accent: 'amber',
    badge: { icon: 'award', text: 'SHIP' },
    headline: { lead: 'FROM PROTOTYPE', accentWord: 'TO PRODUCTION' },
    sub: 'Reactive web applications, high-throughput backend microservices, and hybrid ML trading systems with strict risk gates.',
    tools: ['React', 'TypeScript', 'NestJS'],
    title: 'Product Engineering',
    explanation: {
      title: 'Applied Product Engineering',
      purpose: 'Bridges AI capabilities into production-ready web applications, reactive dashboards, real-time trading engines, and scalable microservices.',
      highlights: [
        'Interactive React 18 frontend with fluid Framer Motion',
        'Scalable NestJS / TypeScript backend microservices',
        'Hybrid ML signal synthesis (XGBoost + LLM consensus)',
        'Accessible, mobile-responsive design systems'
      ]
    }
  },
  {
    id: 'github-profile',
    area: 'c04',
    variant: 'callout',
    accent: 'coral',
    handle: '@ugihub',
    headline: { lead: 'OPEN SOURCE', accentWord: 'ECOSYSTEM' },
    stats: [
      { label: 'Public Repos', value: '8+' },
      { label: 'Model Weights', value: 'GGUF' },
      { label: 'Primary Tech', value: 'TypeScript' }
    ],
    cta: { label: 'Open GitHub Profile', href: 'https://github.com/ugihub', external: true },
    huggingFaceUrl: 'https://huggingface.co/Ugisr',
    tools: ['@ugihub', 'Hugging Face', 'Open Source'],
    badge: 'Active Builder',
    title: 'GitHub & Open Source',
    explanation: {
      title: 'Open Source & Code Activity',
      purpose: 'Public repository hub featuring reproducible research, model weights, framework tools, and open benchmarks.',
      highlights: [
        'Open-source AI repositories and fine-tuning scripts',
        'Quantized GGUF models on Hugging Face hub',
        'Strict CI/CD test coverage on every repository',
        'Direct links to inspect source code and weights'
      ]
    }
  },
  {
    id: 'tech-arsenal',
    area: 'c05',
    variant: 'arsenal',
    accent: 'violet',
    headline: { lead: 'TECH', accentWord: 'ARSENAL' },
    routeLine: 'Prompt layer to serving layer',
    categories: [
      {
        id: 'runtime',
        label: 'RUNTIME',
        accent: 'cyan',
        tools: ['Python 3.11+', 'llama.cpp GGUF', 'Node.js / Bun', 'FastAPI'],
        waypoints: [
          { x: 18, y: 38, label: 'Prompt', placement: 'top' },
          { x: 50, y: 52, label: 'llama.cpp', placement: 'bottom' },
          { x: 82, y: 38, label: 'Inference', placement: 'top' }
        ]
      },
      {
        id: 'intelligence',
        label: 'INTEL',
        accent: 'amber',
        tools: ['Gemma 3', 'LoRA Adapters', 'Structured JSON', 'RAG Flow'],
        waypoints: [
          { x: 18, y: 64, label: 'Gemma 3', placement: 'top' },
          { x: 50, y: 78, label: 'LoRA', placement: 'bottom' },
          { x: 82, y: 64, label: 'Schema', placement: 'top' }
        ]
      },
      {
        id: 'memory',
        label: 'MEMORY',
        accent: 'emerald',
        tools: ['pgvector', 'PostgreSQL', 'Supabase', 'Redis State'],
        waypoints: [
          { x: 18, y: 90, label: 'pgvector', placement: 'top' },
          { x: 50, y: 104, label: 'Supabase', placement: 'bottom' },
          { x: 82, y: 90, label: 'Vectors', placement: 'top' }
        ]
      },
      {
        id: 'delivery',
        label: 'DELIVERY',
        accent: 'coral',
        tools: ['Action Gates', 'GitHub Actions', 'Vercel / Docker', 'Unit Tests'],
        waypoints: [
          { x: 18, y: 116, label: 'Action Gate', placement: 'top' },
          { x: 50, y: 130, label: 'CI/CD', placement: 'bottom' },
          { x: 82, y: 116, label: 'Production', placement: 'top' }
        ]
      }
    ],
    tools: ['Python', 'Gemma 3', 'GGUF', 'pgvector', 'React', 'NestJS', 'Supabase', 'Docker'],
    badge: 'Architecture Route',
    title: 'AI Arsenal & Tech Map',
    explanation: {
      title: 'AI Arsenal & System Architecture Route',
      purpose: 'Visualizes the end-to-end applied AI engineering stack spanning inference runtimes, vector storage, agent guardrails, and cloud deployment.',
      highlights: [
        'Runtime Layer: High-performance local and edge inference',
        'Intelligence Layer: Domain-specific model tuning and tool calling',
        'Memory Layer: Vector indexing and structured persistence',
        'Delivery Layer: Guardrails, continuous evaluation, and containerization'
      ]
    }
  }
]

export const archiveProjects = [
  {
    id: 'uipiece',
    title: 'UIPiece',
    category: 'Web Development',
    visibility: 'public',
    role: 'Developer',
    summary: 'A responsive website built with HTML, CSS, and PHP.',
    evidence: ['Responsive website'],
    tech: ['HTML', 'CSS', 'PHP'],
    publicLinks: [{ label: 'GitHub', url: 'https://github.com/ugihub/uipiece' }]
  },
  {
    id: 'infinity-snake',
    title: 'InfinitySnake',
    category: 'Game Development',
    visibility: 'public',
    role: 'Developer',
    summary: 'Classic Snake game reimagined with infinite gameplay mechanics.',
    evidence: ['Infinite gameplay'],
    tech: ['Java', 'Greenfoot'],
    publicLinks: [{ label: 'GitHub', url: 'https://github.com/ugihub/InfinitySnake' }]
  },
  {
    id: 'portfolio-ai',
    title: 'Portfolio AI',
    category: 'Web Development',
    visibility: 'public',
    role: 'Developer',
    summary: 'A responsive portfolio website with modern animations.',
    evidence: ['Responsive interface'],
    tech: ['HTML', 'CSS', 'JavaScript'],
    publicLinks: [{ label: 'GitHub', url: 'https://github.com/ugihub/portofolioAI' }]
  },
  {
    id: 'finance-web',
    title: 'Finance Web',
    category: 'Web Application',
    visibility: 'public',
    role: 'Developer',
    summary: 'Personal finance tracker to record expenses.',
    evidence: ['Expense tracking'],
    tech: ['HTML', 'CSS', 'JavaScript'],
    publicLinks: [{ label: 'GitHub', url: 'https://github.com/ugihub/financeWeb' }]
  },
  {
    id: 'maze-game',
    title: 'Maze Game',
    category: 'Game Development',
    visibility: 'public',
    role: 'Developer',
    summary: '3D maze exploration game built with Alice3.',
    evidence: ['3D maze exploration'],
    tech: ['Alice3', 'Java'],
    publicLinks: [{ label: 'GitHub', url: 'https://github.com/ugihub/MazeGameAlice3' }]
  },
  {
    id: 'todo-app',
    title: 'ToDo App',
    category: 'Web Application',
    visibility: 'public',
    role: 'Developer',
    summary: 'Activity tracker and task management app.',
    evidence: ['Task tracking'],
    tech: ['HTML', 'CSS', 'JavaScript'],
    publicLinks: [{ label: 'GitHub', url: 'https://github.com/ugihub/ToDoApp' }]
  },
  {
    id: 'kinkoffie',
    title: 'Kinkoffie',
    category: 'Commercial Website',
    visibility: 'public',
    role: 'Developer',
    summary: 'Professional website for Kinkoffie coffee shop.',
    evidence: ['Commercial website'],
    tech: ['HTML', 'CSS', 'JavaScript'],
    publicLinks: [{ label: 'Live demo', url: 'https://kinkoffie.netlify.app' }]
  },
  {
    id: 'solana-dapp',
    title: 'Solana dApp',
    category: 'Blockchain Development',
    visibility: 'public',
    role: 'Developer',
    summary: 'Decentralized app using Solana blockchain.',
    evidence: ['Solana transaction flow'],
    tech: ['Solana', 'JavaScript', 'Web3'],
    publicLinks: [{ label: 'GitHub', url: 'https://github.com/ugihub/dapps-transaction-solana' }]
  }
]

export const verifiedCredentials = [
  {
    id: 'scout-secretary',
    title: 'Head of Secretary',
    organization: 'Scout SMAN 6 Cirebon',
    year: '2023 - 2024',
    description: 'Head of secretary in the SMAN 6 Cirebon Scout Organization.',
    credentialUrl: 'https://drive.google.com/file/d/1lXprDQZuU9R50iefhy3Atx8yFBibd6fT/view?usp=sharing',
    image: certificateScout
  },
  {
    id: 'oracle-java',
    title: 'Java Fundamentals',
    organization: 'Oracle Academy',
    year: '2024',
    description: 'Completed the Java Fundamentals course.',
    credentialUrl: 'https://drive.google.com/file/d/1XQG1mabRbhcvmVsBrUSWpNH_9rhqbrF2/view?usp=sharing',
    image: certificateOracle
  },
  {
    id: 'it-webinar',
    title: 'IT Webinar',
    organization: 'Berkemah ID',
    year: '2024',
    description: 'Webinar on IT professional careers in an era of rapid technological progress.',
    credentialUrl: 'https://drive.google.com/file/d/1IP_WyTstkMl29-Jr-10E-LlmU8HbZywW/view?usp=sharing',
    image: certificateWebinar
  }
]

export const portfolioPositioning = {
  primaryRole: 'Applied AI Engineer',
  supportingRoles: ['LLM Systems Builder', 'Full-stack AI Developer'],
  summary: 'Building reliable domain-agent systems, local model workflows, and AI products for real operations.',
  about: 'I build applied AI systems across model delivery, agent reliability, and product engineering. My work includes warehouse tool-calling models, RAG-enabled product flows, and deterministic controls for long-running agents.'
}

export const getProjectsForTab = (tab) => tab === 'ai' ? featuredProjects : archiveProjects
