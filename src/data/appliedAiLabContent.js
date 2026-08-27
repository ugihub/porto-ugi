export const labTabs = [
  {
    id: 'warehouse',
    label: 'WAREHOUSEFLOW',
    premise: 'Tool call tracing',
    explanation: {
      title: 'WarehouseFlow Tool-Call Console',
      badge: 'Fine-Tuned Domain SLM',
      purpose: 'Simulates deterministic tool calling where domain-tuned models (Gemma 3 1B IT) translate natural language into schema-compliant warehouse operations.',
      workflow: [
        'User Prompt: Receives natural language warehouse request.',
        'Intent Extraction: Identifies domain action (inventory lookup, pick task creation).',
        'Payload Validation: Binds strict parameters without schema leakage.',
        'Deterministic Execution: Simulates dispatch and state transition with zero external API calls.'
      ],
      takeaway: 'Enforces safe, zero-hallucination tool-call execution for ERP and logistics systems.'
    }
  },
  {
    id: 'retrieval',
    label: 'RAG INSPECTOR',
    premise: 'Vector & lexical retrieval',
    explanation: {
      title: 'RAG Retrieval Inspector',
      badge: 'Lexical Retrieval & Re-Ranking',
      purpose: 'Inspects how search queries are tokenized, matched against knowledge documents, and re-ranked into structured context chunks.',
      workflow: [
        'Query Tokenization: Cleans and breaks input into searchable keywords.',
        'Candidate Scoring: Calculates keyword match density against local corpus.',
        'Re-ranking: Sorts documents by relevance score.',
        'Context Selection: Filters top-k context candidates for LLM prompt augmentation.'
      ],
      takeaway: 'Provides transparent, explainable retrieval without black-box embeddings.'
    }
  },
  {
    id: 'reliability',
    label: 'RELIABILITY GATE',
    premise: 'Deterministic policy gate',
    explanation: {
      title: 'Agent Reliability Gate',
      badge: 'Zero-Trust Policy Checkpoint',
      purpose: 'Enforces hard validation rules on proposed agent actions before runtime execution.',
      workflow: [
        'Schema Validation: Checks if the action contract matches allowed schemas.',
        'Evidence Policy: Ensures high-risk mutations have verified retrieval or sensory evidence.',
        'Execution Decision: Emits binary Allowed, Blocked, or Evidence Required verdict.'
      ],
      takeaway: 'Decouples model generation from execution permissions for security in autonomous agent architectures.'
    }
  },
  {
    id: 'estimator',
    label: 'TOKEN ESTIMATOR',
    premise: 'Token & cost estimation',
    explanation: {
      title: 'Token & Cost Estimator',
      badge: 'Workload & Financial Architecture',
      purpose: 'Breaks down multi-layered token consumption across system, user, retrieval, and tool layers to estimate operational costs.',
      workflow: [
        'Layer Aggregation: Measures token weight across every prompt segment.',
        'Token Stream Simulation: Visualizes input-to-output pipeline load.',
        'Model Price Calculation: Compares cost profiles across OpenAI, Gemini, Claude, and DeepSeek.',
        'Currency Conversion: Dynamically converts USD rates to IDR with custom exchange rate.'
      ],
      takeaway: 'Prevents budget overruns and guides model routing strategy in production AI systems.'
    }
  }
]

export const warehouseScenarios = [
  { id: 'stock', label: 'Check stock for SKU A-17', request: 'Check stock for SKU A-17', intent: 'inventory_lookup', arguments: { sku: 'A-17' }, result: 'Available quantity: 42 units.', recordedTrace: true },
  { id: 'pickup', label: 'Create a priority pick task', request: 'Create a priority pick task for zone B', intent: 'pick_task_create', arguments: { priority: 'high', zone: 'B' }, result: 'Priority pick task prepared for zone B.', recordedTrace: true }
]

export const retrievalCorpus = [
  { id: 'wallet', title: 'Wallet workflow', text: 'Wallet balance and withdrawal approval workflow.', actionRoute: 'wallet.review', localFixture: true },
  { id: 'pickup', title: 'Pickup workflow', text: 'Pickup requests track recyclable waste from collection to completion.', actionRoute: 'pickup.track', localFixture: true },
  { id: 'admin', title: 'Admin workflow', text: 'Administrators review user submissions and manage drop points.', actionRoute: 'admin.review', localFixture: true },
  { id: 'pricing', title: 'Pricing workflow', text: 'Waste pricing supports transparent estimates before a pickup request.', actionRoute: 'pricing.estimate', localFixture: true }
]

export const reliabilityFixtures = [
  { id: 'allowed', label: 'Validated low-risk action', schemaValid: true, risk: 'low', evidence: [] },
  { id: 'evidence', label: 'High-risk action without evidence', schemaValid: true, risk: 'high', evidence: [] },
  { id: 'blocked', label: 'Invalid action schema', schemaValid: false, risk: 'low', evidence: [] }
]

export const estimatorScenarios = [
  { id: 'chat', label: 'Simple chat', layers: { system: 300, user: 120, retrieval: 0, tool: 0, output: 250 } },
  { id: 'rag', label: 'RAG query', layers: { system: 300, user: 120, retrieval: 840, tool: 0, output: 250 } },
  { id: 'agent', label: 'Tool-calling agent', layers: { system: 300, user: 120, retrieval: 840, tool: 200, output: 250 } }
]

export const modelPricingSnapshot = {
  effectiveDate: '2026-08-25',
  currency: 'USD',
  models: [
    { id: 'openai-gpt-5-4-mini', provider: 'OpenAI API', name: 'GPT-5.4 mini', inputPerMillion: 0.75, outputPerMillion: 4.5, sourceUrl: 'https://platform.openai.com/pricing' },
    { id: 'gemini-3-flash', provider: 'Gemini API', name: 'Gemini 3 Flash', inputPerMillion: 0.375, outputPerMillion: 1.875, sourceUrl: 'https://ai.google.dev/gemini-api/docs/pricing' },
    { id: 'claude-sonnet-4-6', provider: 'Claude API', name: 'Claude Sonnet 4.6', inputPerMillion: 3, outputPerMillion: 15, sourceUrl: 'https://platform.claude.com/docs/en/about-claude/pricing' },
    { id: 'deepseek-v4-flash', provider: 'DeepSeek API', name: 'DeepSeek V4 Flash', inputPerMillion: 0.14, outputPerMillion: 0.28, sourceUrl: 'https://api-docs.deepseek.com/quick_start/pricing/' }
  ]
}

export const getLabTab = (id) => labTabs.find((tab) => tab.id === id) || labTabs[0]
