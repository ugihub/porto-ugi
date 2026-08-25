const certificateScout = new URL('../assets/Sertifikat1.jpg', import.meta.url).href
const certificateOracle = new URL('../assets/Sertifikat2.png', import.meta.url).href
const certificateWebinar = new URL('../assets/Sertifikat3.png', import.meta.url).href

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
