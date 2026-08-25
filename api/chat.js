const DEFAULT_MISTRAL_MODEL = 'mistral-medium-latest'
const ALLOWED_MESSAGE_ROLES = new Set(['user', 'assistant'])
const MAX_HISTORY_MESSAGES = 12

const readBody = (body) => {
    if (!body) return {}
    if (typeof body === 'string') {
        try {
            return JSON.parse(body)
        } catch {
            return {}
        }
    }
    return body
}

const toChatMessages = (messages) => messages
    .filter((message) => (
        message
        && ALLOWED_MESSAGE_ROLES.has(message.role)
        && typeof message.content === 'string'
        && message.content.trim()
    ))
    .slice(-MAX_HISTORY_MESSAGES)
    .map((message) => ({
        role: message.role,
        content: message.content.trim()
    }))

const readProviderResponse = async (response) => {
    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
        return response.json()
    }

    return {
        error: {
            message: await response.text()
        }
    }
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    // --- 1. Basic IP Rate Limiting ---
    // In a real app you would use Redis or Upstash for distributed rate limiting.
    // For a simple Vercel specific limit, this memory limit works per-instance (cold starts reset it).
    // It's not perfect but blocks simple aggressive scripts hitting the same edge node.
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'
    global.rateLimitCache = global.rateLimitCache || {}
    
    const now = Date.now()
    const limitWindowMs = 60 * 1000 // 1 minute
    const maxRequestsPerWindow = 10 

    if (!global.rateLimitCache[ip]) {
        global.rateLimitCache[ip] = { count: 1, firstRequest: now }
    } else {
        const timePassed = now - global.rateLimitCache[ip].firstRequest
        if (timePassed < limitWindowMs) {
            global.rateLimitCache[ip].count++
            if (global.rateLimitCache[ip].count > maxRequestsPerWindow) {
                return res.status(429).json({ error: 'Too many requests. Please try again later.' })
            }
        } else {
            // Reset window
            global.rateLimitCache[ip] = { count: 1, firstRequest: now }
        }
    }

    try {
        const { messages, systemPrompt } = readBody(req.body)

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid messages array' })
        }

        // --- 2. Call Mistral API securely ---
        const mistralApiKey = process.env.MISTRAL_API_KEY
        
        if (!mistralApiKey) {
            return res.status(500).json({ error: 'Server configuration error: Missing MISTRAL_API_KEY' })
        }

        const sanitizedMessages = toChatMessages(messages)
        if (sanitizedMessages.length === 0) {
            return res.status(400).json({ error: 'No valid chat messages provided' })
        }

        // Add the system prompt to the beginning of the messages array
        const mistralMessages = [
            {
                role: 'system',
                content: typeof systemPrompt === 'string' && systemPrompt.trim()
                    ? systemPrompt
                    : 'You are a concise portfolio assistant.'
            },
            ...sanitizedMessages
        ]

        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${mistralApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: process.env.MISTRAL_MODEL || DEFAULT_MISTRAL_MODEL,
                messages: mistralMessages,
                max_tokens: 500,
                temperature: 0.7,
            }),
        })

        const data = await readProviderResponse(response)

        if (!response.ok) {
            console.error('Mistral API error:', response.status, data.message || data.error?.message || data)
            const isAuthError = response.status === 401 || response.status === 403

            return res.status(isAuthError ? 500 : 502).json({
                error: isAuthError
                    ? 'AI provider credentials are not configured correctly.'
                    : 'The AI provider is unavailable right now. Please try again later.'
            })
        }

        const content = data.choices?.[0]?.message?.content
        const rawContent = Array.isArray(content)
            ? content.map((part) => part.text || '').join('')
            : content || 'Sorry, I could not process that.'

        return res.status(200).json({ content: rawContent })
    } catch (error) {
        if (error?.statusCode === 400 && /invalid json/i.test(error.message || '')) {
            return res.status(400).json({ error: 'Invalid JSON request body' })
        }

        console.error('Server error calling Mistral:', error)
        return res.status(500).json({ error: 'Internal server error processing the chat request.' })
    }
}
