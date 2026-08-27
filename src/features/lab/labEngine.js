const words = (text) => new Set(String(text || '').toLowerCase().match(/[a-z0-9]+/g) || [])

const deliveryRoute = [
  { left: 5, top: 72, rotate: 0 },
  { left: 28, top: 24, rotate: -18 },
  { left: 50, top: 72, rotate: 18 },
  { left: 72, top: 24, rotate: -18 },
  { left: 94, top: 72, rotate: 18 }
]

export const getDeliveryPosition = (step) => {
  const routeIndex = Math.min(Math.max(Math.floor(Number(step) || 0), 0), deliveryRoute.length - 1)
  return deliveryRoute[routeIndex]
}

export const estimateTokens = (text) => {
  const content = String(text || '').trim()
  return content ? Math.ceil(content.length / 4) : 0
}

export const rankDocuments = (query, documents) => {
  const queryWords = words(query)
  return documents.map((document, index) => ({
    ...document,
    score: [...queryWords].filter((word) => words(document.text).has(word)).length,
    index
  })).sort((left, right) => right.score - left.score || left.index - right.index)
}

export const evaluateReliability = ({ schemaValid, risk, evidence }) => {
  if (!schemaValid) return { status: 'blocked', reason: 'The action schema is invalid.' }
  if (risk === 'high' && evidence.length === 0) return { status: 'evidence-required', reason: 'High-risk actions require evidence before execution.' }
  return { status: 'allowed', reason: 'The action passed deterministic validation.' }
}

export const estimateModelCost = ({ inputTokens, outputTokens }, model, usdToIdr) => {
  const usd = ((inputTokens * model.inputPerMillion) + (outputTokens * model.outputPerMillion)) / 1000000
  const roundedUsd = Number(usd.toFixed(6))
  return { usd: roundedUsd, idr: Number((roundedUsd * usdToIdr).toFixed(2)) }
}

export const formatMoney = (amount, currency) => new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
