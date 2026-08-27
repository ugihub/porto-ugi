import { buildWarehouseflowRequest, validateLivePrompt } from '../lib/warehouseflowLive.js'

const WINDOW_MS = 10 * 60 * 1000
const MAX_REQUESTS = 3

const getClientIp = (req) => String(req.headers?.['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim()

const isRateLimited = (ip) => {
  global.warehouseflowLiveRateLimit ??= new Map()
  const now = Date.now()
  const entry = global.warehouseflowLiveRateLimit.get(ip)
  if (!entry || now - entry.startedAt >= WINDOW_MS) {
    global.warehouseflowLiveRateLimit.set(ip, { startedAt: now, count: 1 })
    return false
  }
  entry.count += 1
  return entry.count > MAX_REQUESTS
}

const readBody = (body) => {
  if (typeof body !== 'string') return body || {}
  try { return JSON.parse(body) } catch { return {} }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (process.env.ENABLE_WAREHOUSEFLOW_LIVE_DEMO !== 'true') return res.status(403).json({ error: 'Live demo is unavailable.' })
  if (isRateLimited(getClientIp(req))) return res.status(429).json({ error: 'Live demo limit reached. Try again later.' })

  const validation = validateLivePrompt(readBody(req.body).prompt)
  if (!validation.ok) return res.status(400).json({ error: validation.error })
  if (!process.env.MISTRAL_API_KEY) return res.status(500).json({ error: 'Live demo is unavailable.' })

  try {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: process.env.MISTRAL_MODEL || 'mistral-medium-latest', ...buildWarehouseflowRequest(validation.prompt) })
    })
    if (!response.ok) return res.status(502).json({ error: 'Live model is unavailable right now.' })
    const data = await response.json()
    const content = data.choices?.[0]?.message?.content
    return res.status(200).json({ content: typeof content === 'string' ? content : 'The live demo returned a tool-call trace.' })
  } catch {
    return res.status(502).json({ error: 'Live model is unavailable right now.' })
  }
}
