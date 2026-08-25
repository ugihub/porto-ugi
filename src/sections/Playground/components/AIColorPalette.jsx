import { useState, useCallback } from 'react'
import { FaPalette, FaCopy, FaCheck, FaRedo } from 'react-icons/fa'
import { RiRobot2Fill } from 'react-icons/ri'

const MISTRAL_API_KEY = import.meta.env.VITE_MISTRAL_API_KEY

const PALETTE_PROMPT = (mood) => `Generate a color palette for the following mood/theme: "${mood}"

Return ONLY valid JSON with this exact format, no other text:
{
    "name": "Palette Name",
    "colors": [
        {"hex": "#XXXXXX", "name": "Color Name"},
        {"hex": "#XXXXXX", "name": "Color Name"},
        {"hex": "#XXXXXX", "name": "Color Name"},
        {"hex": "#XXXXXX", "name": "Color Name"},
        {"hex": "#XXXXXX", "name": "Color Name"}
    ],
    "suggestion": "A brief description of how to use this palette"
}`

const MOODS = ['Dark Elegant', 'Ocean Breeze', 'Sunset Warm', 'Forest Natural', 'Neon Cyber', 'Pastel Soft', 'Minimalist', 'Retro Vintage']

const AIColorPalette = () => {
    const [mood, setMood] = useState('')
    const [palette, setPalette] = useState(null)
    const [loading, setLoading] = useState(false)
    const [copiedIdx, setCopiedIdx] = useState(-1)

    const generatePalette = useCallback(async (moodText) => {
        const target = moodText || mood
        if (!target.trim()) return
        setLoading(true)
        setPalette(null)

        try {
            const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${MISTRAL_API_KEY}`,
                },
                body: JSON.stringify({
                    model: 'mistral-small-latest',
                    messages: [{ role: 'user', content: PALETTE_PROMPT(target) }],
                    max_tokens: 400,
                    temperature: 0.9,
                }),
            })

            const data = await response.json()
            const raw = data.choices[0]?.message?.content || ''
            const jsonMatch = raw.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0])
                setPalette(parsed)
            } else {
                throw new Error('Invalid format')
            }
        } catch (err) {
            console.error('Palette error:', err)
            setPalette({
                name: 'Error',
                colors: [],
                suggestion: 'Failed to generate palette. Please try again.',
            })
        } finally {
            setLoading(false)
        }
    }, [mood])

    const copyColor = (hex, idx) => {
        navigator.clipboard.writeText(hex)
        setCopiedIdx(idx)
        setTimeout(() => setCopiedIdx(-1), 1500)
    }

    const copyAll = () => {
        if (!palette) return
        const text = palette.colors.map(c => `${c.hex} — ${c.name}`).join('\n')
        navigator.clipboard.writeText(text)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            generatePalette()
        }
    }

    return (
        <div className="tool-card" style={{ '--tool-accent': '#e91e63' }}>
            <h3 className="tool-title">🎨 AI Color Palette</h3>
            <p className="tool-subtitle">Describe a mood — AI generates the perfect palette</p>

            <div className="mood-presets">
                {MOODS.map((m) => (
                    <button
                        key={m}
                        className={`mood-btn ${mood === m ? 'active' : ''}`}
                        onClick={() => { setMood(m); generatePalette(m) }}
                        disabled={loading}
                    >
                        {m}
                    </button>
                ))}
            </div>

            <div className="palette-input-area">
                <input
                    type="text"
                    placeholder="Or describe your own mood/theme..."
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                />
                <button
                    className="generate-btn"
                    onClick={() => generatePalette()}
                    disabled={!mood.trim() || loading}
                >
                    {loading ? (
                        <><span className="loading-spinner" /> Generating...</>
                    ) : (
                        <><RiRobot2Fill /> Generate</>
                    )}
                </button>
            </div>

            {palette && palette.colors.length > 0 && (
                <div className="palette-result">
                    <div className="palette-header">
                        <h4>{palette.name}</h4>
                        <button className="copy-all-btn" onClick={copyAll}>
                            <FaCopy /> Copy All
                        </button>
                    </div>

                    <div className="color-cards">
                        {palette.colors.map((color, idx) => (
                            <div
                                key={idx}
                                className="color-card"
                                onClick={() => copyColor(color.hex, idx)}
                            >
                                <div
                                    className="color-preview"
                                    style={{ backgroundColor: color.hex }}
                                />
                                <div className="color-info">
                                    <span className="color-hex">
                                        {copiedIdx === idx ?
                                            <><FaCheck /> Copied!</> :
                                            color.hex
                                        }
                                    </span>
                                    <span className="color-name">{color.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="palette-suggestion">
                        💡 {palette.suggestion}
                    </div>

                    {/* Live Preview */}
                    <div className="palette-preview">
                        <span className="preview-label">PREVIEW</span>
                        <div className="preview-strip">
                            {palette.colors.map((color, idx) => (
                                <div
                                    key={idx}
                                    className="preview-segment"
                                    style={{ backgroundColor: color.hex }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AIColorPalette
