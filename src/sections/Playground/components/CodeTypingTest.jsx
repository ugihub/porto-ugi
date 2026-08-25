import { useState, useEffect, useRef, useCallback } from 'react'
import { FaPlay, FaRedo } from 'react-icons/fa'

const CODE_SNIPPETS = [
    `const sum = (a, b) => a + b;\nconst result = sum(3, 7);\nconsole.log(result);`,
    `function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}`,
    `const users = ["Alice", "Bob"];\nconst greet = users.map(u => \`Hello, \${u}!\`);\nconsole.log(greet);`,
    `class Animal {\n  constructor(name) {\n    this.name = name;\n  }\n  speak() {\n    return \`\${this.name} says hi!\`;\n  }\n}`,
    `const fetchData = async (url) => {\n  const res = await fetch(url);\n  const data = await res.json();\n  return data;\n};`,
    `const arr = [3, 1, 4, 1, 5, 9];\nconst sorted = arr.sort((a, b) => a - b);\nconst unique = [...new Set(sorted)];`,
    `const debounce = (fn, delay) => {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), delay);\n  };\n};`,
    `const pipe = (...fns) => (x) =>\n  fns.reduce((acc, fn) => fn(acc), x);\nconst add1 = (x) => x + 1;\nconst double = (x) => x * 2;`,
]

const CodeTypingTest = () => {
    const [snippet, setSnippet] = useState('')
    const [typed, setTyped] = useState('')
    const [started, setStarted] = useState(false)
    const [finished, setFinished] = useState(false)
    const [startTime, setStartTime] = useState(null)
    const [wpm, setWpm] = useState(0)
    const [accuracy, setAccuracy] = useState(100)
    const [errors, setErrors] = useState(0)
    const [elapsed, setElapsed] = useState(0)
    const inputRef = useRef(null)
    const timerRef = useRef(null)

    const pickSnippet = useCallback(() => {
        const idx = Math.floor(Math.random() * CODE_SNIPPETS.length)
        setSnippet(CODE_SNIPPETS[idx])
    }, [])

    useEffect(() => {
        pickSnippet()
    }, [])

    useEffect(() => {
        if (started && !finished) {
            timerRef.current = setInterval(() => {
                setElapsed(Date.now() - startTime)
            }, 100)
        }
        return () => clearInterval(timerRef.current)
    }, [started, finished, startTime])

    const startTest = () => {
        pickSnippet()
        setTyped('')
        setStarted(false)
        setFinished(false)
        setStartTime(null)
        setWpm(0)
        setAccuracy(100)
        setErrors(0)
        setElapsed(0)
        setTimeout(() => inputRef.current?.focus(), 100)
    }

    const handleInput = (e) => {
        const val = e.target.value

        if (!started) {
            setStarted(true)
            setStartTime(Date.now())
        }

        setTyped(val)

        // Calculate errors
        let errs = 0
        for (let i = 0; i < val.length; i++) {
            if (val[i] !== snippet[i]) errs++
        }
        setErrors(errs)

        // Calculate accuracy
        const acc = val.length > 0 ? Math.round(((val.length - errs) / val.length) * 100) : 100
        setAccuracy(acc)

        // Check if finished
        if (val.length >= snippet.length) {
            setFinished(true)
            clearInterval(timerRef.current)
            const timeMin = (Date.now() - startTime) / 60000
            const words = snippet.length / 5 // standard: 5 chars = 1 word
            setWpm(Math.round(words / timeMin))
        }
    }

    const formatTime = (ms) => {
        const secs = Math.floor(ms / 1000)
        const mins = Math.floor(secs / 60)
        const rem = secs % 60
        return `${mins}:${rem.toString().padStart(2, '0')}`
    }

    const renderCode = () => {
        return snippet.split('').map((char, idx) => {
            let className = 'char-pending'
            if (idx < typed.length) {
                className = typed[idx] === char ? 'char-correct' : 'char-wrong'
            } else if (idx === typed.length) {
                className = 'char-cursor'
            }
            return (
                <span key={idx} className={className}>
                    {char === '\n' ? '↵\n' : char === ' ' ? '\u00A0' : char}
                </span>
            )
        })
    }

    return (
        <div className="tool-card" style={{ '--tool-accent': '#e91e63' }}>
            <h3 className="tool-title">⌨️ Code Typing Test</h3>
            <p className="tool-subtitle">How fast can you type code? Test your WPM!</p>

            <div className="typing-stats">
                <div className="stat-box">
                    <span className="stat-value">{finished ? wpm : '—'}</span>
                    <span className="stat-label">WPM</span>
                </div>
                <div className="stat-box">
                    <span className="stat-value">{accuracy}%</span>
                    <span className="stat-label">Accuracy</span>
                </div>
                <div className="stat-box">
                    <span className="stat-value">{errors}</span>
                    <span className="stat-label">Errors</span>
                </div>
                <div className="stat-box">
                    <span className="stat-value">{formatTime(elapsed)}</span>
                    <span className="stat-label">Time</span>
                </div>
            </div>

            <div
                className="typing-display"
                onClick={() => inputRef.current?.focus()}
            >
                <pre className="typing-code">{renderCode()}</pre>
            </div>

            {/* Hidden input for capturing keystrokes */}
            <textarea
                ref={inputRef}
                className="typing-hidden-input"
                value={typed}
                onChange={handleInput}
                disabled={finished}
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
            />

            <div className="typing-progress">
                <div
                    className="typing-progress-bar"
                    style={{ width: `${(typed.length / snippet.length) * 100}%` }}
                />
            </div>

            <div className="typing-actions">
                {finished && (
                    <div className="typing-result">
                        🎉 Done! <strong>{wpm} WPM</strong> with {accuracy}% accuracy
                    </div>
                )}
                <button className="run-btn" onClick={startTest}>
                    {finished || !started ? <><FaPlay /> {finished ? 'Try Again' : 'Start'}</> : <><FaRedo /> Reset</>}
                </button>
            </div>
        </div>
    )
}

export default CodeTypingTest
