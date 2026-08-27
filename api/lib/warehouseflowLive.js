const MAX_PROMPT_LENGTH = 1000

export const validateLivePrompt = (value) => {
  const prompt = typeof value === 'string' ? value.trim() : ''
  if (!prompt) return { ok: false, error: 'Enter a warehouse question.' }
  if (prompt.length > MAX_PROMPT_LENGTH) return { ok: false, error: 'Prompt must be 1000 characters or fewer.' }
  return { ok: true, prompt }
}

export const buildWarehouseflowRequest = (prompt) => ({
  messages: [
    {
      role: 'system',
      content: 'You are a warehouse workflow demonstrator. Use only the supplied generic tools when appropriate. Never claim that a real warehouse record was changed.'
    },
    { role: 'user', content: prompt }
  ],
  tools: [
    {
      type: 'function',
      function: {
        name: 'inventory_lookup',
        description: 'Look up an inventory quantity for a SKU in a demonstration.',
        parameters: {
          type: 'object',
          properties: { sku: { type: 'string', description: 'Stock keeping unit' } },
          required: ['sku'],
          additionalProperties: false
        }
      }
    }
  ],
  tool_choice: 'auto',
  max_tokens: 256,
  temperature: 0
})
