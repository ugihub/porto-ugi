import { useState, useRef } from 'react'
import { FaPlay, FaTrash } from 'react-icons/fa'

const DEFAULT_CODE = `// 🚀 Write your JavaScript code here
// Click "Run" to execute it

function greet(name) {
    return \`Hello, \${name}! Welcome to the playground 🎉\`
}

console.log(greet("World"))

// Try more:
// console.log(Array.from({length: 5}, (_, i) => i * 2))
// console.log(Object.keys({a: 1, b: 2, c: 3}))
`

const LiveCodeEditor = () => {
    const [code, setCode] = useState(DEFAULT_CODE)
    const [output, setOutput] = useState([])
    const [error, setError] = useState(null)
    const textareaRef = useRef(null)

    const runCode = () => {
        setOutput([])
        setError(null)

        const logs = []
        const originalLog = console.log
        const originalWarn = console.warn
        const originalError = console.error

        // Override console methods to capture output
        console.log = (...args) => logs.push({ type: 'log', text: args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ') })
        console.warn = (...args) => logs.push({ type: 'warn', text: args.map(a => String(a)).join(' ') })
        console.error = (...args) => logs.push({ type: 'error', text: args.map(a => String(a)).join(' ') })

        try {
            // eslint-disable-next-line no-new-func
            const result = new Function(code)()
            if (result !== undefined) {
                logs.push({ type: 'result', text: `→ ${typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)}` })
            }
        } catch (err) {
            setError(err.message)
        } finally {
            console.log = originalLog
            console.warn = originalWarn
            console.error = originalError
        }

        setOutput(logs)
    }

    const handleKeyDown = (e) => {
        // Tab support
        if (e.key === 'Tab') {
            e.preventDefault()
            const start = e.target.selectionStart
            const end = e.target.selectionEnd
            const newCode = code.substring(0, start) + '    ' + code.substring(end)
            setCode(newCode)
            setTimeout(() => {
                e.target.selectionStart = e.target.selectionEnd = start + 4
            }, 0)
        }
        // Ctrl+Enter to run
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault()
            runCode()
        }
    }

    const lineCount = code.split('\n').length

    return (
        <div className="tool-card" style={{ '--tool-accent': '#00bcd4' }}>
            <h3 className="tool-title">💻 Live Code Editor</h3>
            <p className="tool-subtitle">Write &amp; run JavaScript in the browser — Ctrl+Enter to execute</p>

            <div className="editor-container">
                <div className="editor-area">
                    <div className="line-numbers">
                        {Array.from({ length: lineCount }, (_, i) => (
                            <span key={i}>{i + 1}</span>
                        ))}
                    </div>
                    <textarea
                        ref={textareaRef}
                        className="code-textarea"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        onKeyDown={handleKeyDown}
                        spellCheck={false}
                    />
                </div>

                <div className="editor-actions">
                    <button className="run-btn" onClick={runCode}>
                        <FaPlay /> Run
                    </button>
                    <button className="clear-btn" onClick={() => { setCode(''); setOutput([]); setError(null) }}>
                        <FaTrash /> Clear
                    </button>
                </div>

                {(output.length > 0 || error) && (
                    <div className="console-output">
                        <div className="console-header">
                            <span>// CONSOLE OUTPUT</span>
                        </div>
                        <div className="console-body">
                            {output.map((log, idx) => (
                                <div key={idx} className={`console-line ${log.type}`}>
                                    {log.text}
                                </div>
                            ))}
                            {error && (
                                <div className="console-line error">
                                    ❌ Error: {error}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default LiveCodeEditor
