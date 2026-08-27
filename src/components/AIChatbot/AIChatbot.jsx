import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RiRobot2Fill } from 'react-icons/ri'
import { IoClose, IoSend } from 'react-icons/io5'
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope } from 'react-icons/fa'
import { parseActions } from '../../features/chatbot/actions.js'
import './AIChatbot.css'

// Portfolio data context for the AI
const PORTFOLIO_DATA = {
    owner: 'Ugi Sugiman R',
    role: 'Applied AI Engineer',
    university: 'University of Logistics & International Business',
    location: 'Indonesia',
    status: 'Available for work',
    github: 'https://github.com/ugihub',
    linkedin: 'https://www.linkedin.com/in/ugisugimanr',
    instagram: 'https://www.instagram.com/ugisr_/',
    cv: 'https://drive.google.com/file/d/1INKbJIG2jzJzQ4g0rr9rxVm2bw4xi3AX/view?usp=sharing',
    projects: [
        { title: 'WarehouseFlow', type: 'Fine-tuned logistics model', tech: 'Gemma 3, GGUF, Hugging Face', model: 'https://huggingface.co/Ugisr/warehouseflow-gemma3-1b-it-gguf' },
        { title: 'CuanLimbah', type: 'Applied product system', tech: 'React, API design, operational workflow' },
        { title: 'MT5-trade', type: 'Trading automation research', tech: 'MetaTrader 5, Python, automation' },
    ],
    skills: [
        { name: 'LLM applications', level: 85 }, { name: 'RAG and retrieval', level: 80 }, { name: 'Agent reliability', level: 80 },
        { name: 'Python', level: 80 }, { name: 'React', level: 78 }, { name: 'Model delivery', level: 75 },
    ],
    sections: ['hero', 'about', 'projects', 'playground', 'contact'],
    lab: ['WarehouseFlow Tool-Call Console', 'RAG Retrieval Inspector', 'Agent Reliability Gate', 'Token and Cost Estimator'],
}

const SYSTEM_PROMPT = `You are a friendly AI assistant embedded in Ugi Sugiman R's portfolio website.
You have FULL CONTROL over the website and can navigate users to different sections.

## PORTFOLIO DATA
${JSON.stringify(PORTFOLIO_DATA, null, 2)}

## AVAILABLE ACTIONS
You can trigger website actions by including special tags in your response. The tags will be automatically parsed and executed. Place them at the END of your message.

Available action tags:
- [ACTION:navigate:hero] - Scroll to the Hero/Home section
- [ACTION:navigate:about] - Scroll to the About section
- [ACTION:navigate:projects] - Scroll to the Projects section
- [ACTION:navigate:playground] - Scroll to the Playground section
- [ACTION:navigate:contact] - Scroll to the Contact section
- [ACTION:tab:projects] - Switch to Projects tab
- [ACTION:tab:tools] - Switch to Tools/Skills tab
- [ACTION:ptab:warehouse] - Switch to WarehouseFlow Tool-Call Console
- [ACTION:ptab:retrieval] - Switch to RAG Retrieval Inspector
- [ACTION:ptab:reliability] - Switch to Agent Reliability Gate
- [ACTION:ptab:estimator] - Switch to Token and Cost Estimator
- [ACTION:open:cv] - Open CV download link

## RULES
1. When someone asks about projects, navigate to the projects section AND switch to the projects tab.
2. When someone asks about skills/tools, navigate to projects section AND switch to the tools tab.
3. When someone asks about applied AI systems, navigate to projects section AND switch to the projects tab.
4. When someone asks about Ugi/who he is, navigate to the about section.
5. When someone wants to contact/hire, navigate to the contact section.
6. When someone asks for CV/resume, trigger open cv action.
7. When someone asks about the AI Lab, navigate to the playground section.
8. When someone asks about WarehouseFlow or tool calling, navigate to playground AND switch to warehouse tab.
9. When someone asks about RAG or retrieval, navigate to playground AND switch to retrieval tab.
10. When someone asks about reliability or evidence gates, navigate to playground AND switch to reliability tab.
11. When someone asks about token estimates or API costs, navigate to playground AND switch to estimator tab.
13. Always provide a helpful text response BEFORE the action tags.
14. You can use multiple action tags in one response.
15. Keep responses concise, friendly, and professional.
16. Respond in the same language the user uses (Indonesian or English).
17. Do NOT show the action tags as visible text — just include them naturally at the end.`

const QUICK_ACTIONS = [
    { label: '👤 About Ugi', message: 'Siapa Ugi?' },
    { label: '🚀 Projects', message: 'Apa saja proyek yang pernah dikerjakan?' },
    { label: '🛠️ Skills', message: 'Apa saja skill yang dimiliki?' },
    { label: '📧 Contact', message: 'Bagaimana cara menghubungi Ugi?' },
]

const escapeHtml = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const readJsonResponse = async (response) => {
    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
        return response.json()
    }

    return {
        error: 'Chat endpoint returned a non-JSON response.'
    }
}

// Format markdown to HTML for chat messages
const formatMarkdown = (text) => {
    return escapeHtml(text)
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')     // **bold**
        .replace(/\*(.+?)\*/g, '<em>$1</em>')                  // *italic*
        .replace(/`(.+?)`/g, '<code>$1</code>')                // `code`
        .replace(/\n/g, '<br />')                               // newlines
}

// Execute website actions
const executeActions = (actions) => {
    actions.forEach((action, index) => {
        setTimeout(() => {
            switch (action.type) {
                case 'navigate': {
                    const section = document.getElementById(action.target)
                    if (section) {
                        section.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }
                    break
                }
                case 'tab': {
                    // Find and click the tab button
                    const tabButtons = document.querySelectorAll('.tab-btn')
                    tabButtons.forEach(btn => {
                        const tabText = btn.querySelector('.mono')
                        if (tabText && tabText.textContent.toLowerCase().includes(action.target)) {
                            btn.click()
                        }
                    })
                    break
                }
                case 'ptab': {
                    const labTargets = {
                        warehouse: 'warehouseflow',
                        retrieval: 'rag inspector',
                        reliability: 'reliability gate',
                        estimator: 'token estimator'
                    }
                    const playgroundTabs = document.querySelectorAll('.playground-tab')
                    playgroundTabs.forEach(btn => {
                        if (btn.textContent.toLowerCase().includes(labTargets[action.target] || action.target)) {
                            btn.click()
                        }
                    })
                    break
                }
                case 'open': {
                    if (action.target === 'cv') {
                        window.open(PORTFOLIO_DATA.cv, '_blank')
                    }
                    break
                }
                default:
                    break
            }
        }, index * 600) // Stagger actions by 600ms
    })
}

// Rate Limiting Config
const RATE_LIMIT_KEY = 'ai_chatbot_rate_limit'
const MAX_MESSAGES_PER_DAY = 15

const checkRateLimit = () => {
    try {
        const today = new Date().toDateString()
        const limitData = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '{}')

        if (limitData.date !== today) {
            return { count: 0, date: today }
        }
        return limitData
    } catch {
        return { count: 0, date: new Date().toDateString() }
    }
}

const incrementRateLimit = (currentCount) => {
    try {
        const today = new Date().toDateString()
        localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({
            count: currentCount + 1,
            date: today
        }))
    } catch (e) {
        console.warn('LocalStorage not available for rate limiting')
    }
}

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [showLimitPopup, setShowLimitPopup] = useState(false)
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)

    // Detect mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isLoading])

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 300)
        }
    }, [isOpen])

    const sendMessage = useCallback(async (messageText) => {
        const text = messageText || input.trim()
        if (!text || isLoading) return

        // CHECK RATE LIMIT
        const limitData = checkRateLimit()
        if (limitData.count >= MAX_MESSAGES_PER_DAY) {
            setShowLimitPopup(true)
            return
        }

        const userMessage = { role: 'user', content: text }
        const newMessages = [...messages, userMessage]
        setMessages(newMessages)
        setInput('')
        setIsLoading(true)

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Important to send cookies
                body: JSON.stringify({
                    messages: newMessages,
                    systemPrompt: SYSTEM_PROMPT
                }),
            })

            const data = await readJsonResponse(response)

            if (!response.ok) {
                // Handle specific errors like rate limiting or bot detection
                if (response.status === 429) {
                    setShowLimitPopup(true);
                    return;
                }
                throw new Error(data.error || 'Server error occurred')
            }

            const rawContent = data.content || 'Sorry, I could not process that.'

            // Parse actions from AI response
            const { cleanText, actions } = parseActions(rawContent)

            const assistantMessage = {
                role: 'assistant',
                content: cleanText,
            }
            setMessages(prev => [...prev, assistantMessage])
            
            // Increment rate limit after successful response
            incrementRateLimit(limitData.count)

            // Execute any website actions after a short delay
            if (actions.length > 0) {
                setTimeout(() => executeActions(actions), 800)
            }
        } catch (error) {
            console.error('Chat API Error:', error)
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: 'Maaf, sistem sedang sibuk atau menolak permintaan (coba verifikasi anti-bot). Coba lagi nanti ya! 🤖',
                },
            ])
        } finally {
            setIsLoading(false)
        }
    }, [input, messages, isLoading])

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    const handleQuickAction = (message) => {
        sendMessage(message)
    }

    const toggleChat = () => {
        setIsOpen(prev => !prev)
    }

    const buttonContent = (
        <div className="robot-icon">
            {isOpen ? <IoClose /> : <RiRobot2Fill />}
        </div>
    )

    return (
        <>
            {/* Draggable Button (Desktop) / Fixed Button (Mobile) */}
            {isMobile ? (
                <button
                    className={`chatbot-button${isOpen ? ' chat-open' : ''}`}
                    onClick={toggleChat}
                    aria-label="Toggle AI Chat"
                >
                    {buttonContent}
                </button>
            ) : (
                <motion.button
                    className="chatbot-button"
                    onClick={toggleChat}
                    drag
                    dragMomentum={false}
                    dragElastic={0.1}
                    dragConstraints={{
                        top: -(window.innerHeight - 90),
                        left: -(window.innerWidth - 90),
                        right: 0,
                        bottom: 0,
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Toggle AI Chat"
                >
                    {buttonContent}
                </motion.button>
            )}

            {/* Floating Suggestion Pills - visible when chat is closed */}
            <AnimatePresence>
                {!isOpen && messages.length < 3 && (
                    <motion.div
                        className="floating-suggestions"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    >
                        {QUICK_ACTIONS.map((action, idx) => (
                            <button
                                key={idx}
                                className="floating-pill"
                                onClick={() => {
                                    setIsOpen(true)
                                    setTimeout(() => sendMessage(action.message), 400)
                                }}
                            >
                                {action.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="chatbot-window"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                    >
                        {/* Header */}
                        <div className="chatbot-header">
                            <div className="chatbot-header-info">
                                <div className="chatbot-header-avatar">
                                    <RiRobot2Fill />
                                </div>
                                <div className="chatbot-header-text">
                                    <h4>AI Assistant</h4>
                                    <span>● Online</span>
                                </div>
                            </div>
                            <button className="chatbot-close" onClick={toggleChat}>
                                <IoClose />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="chatbot-messages">
                            {messages.length === 0 && (
                                <div className="chat-welcome">
                                    <span className="welcome-icon">🤖</span>
                                    <h5>Hi! I&apos;m Ugi&apos;s AI Assistant</h5>
                                    <p>
                                        Saya bisa menjawab pertanyaan tentang Ugi dan juga
                                        mengarahkan kamu ke bagian yang tepat di website ini!
                                    </p>
                                    <div className="chat-quick-actions">
                                        {QUICK_ACTIONS.map((action, idx) => (
                                            <button
                                                key={idx}
                                                className="quick-action-btn"
                                                onClick={() => handleQuickAction(action.message)}
                                            >
                                                {action.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`chat-message ${msg.role}`}
                                    dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.content) }}
                                />
                            ))}

                            {isLoading && (
                                <div className="typing-indicator">
                                    <div className="typing-dot" />
                                    <div className="typing-dot" />
                                    <div className="typing-dot" />
                                </div>
                            )}
                            
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="chatbot-input">
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Tanya sesuatu..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isLoading}
                            />
                            <button
                                className="chatbot-send"
                                onClick={() => sendMessage()}
                                disabled={!input.trim() || isLoading}
                            >
                                <IoSend />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Rate Limit Popup */}
            <AnimatePresence>
                {showLimitPopup && (
                    <div className="limit-popup-overlay" onClick={() => setShowLimitPopup(false)}>
                        <motion.div 
                            className="limit-popup-content"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className="limit-popup-close" onClick={() => setShowLimitPopup(false)}>
                                <IoClose />
                            </button>
                            <div className="limit-popup-icon">🤖</div>
                            <h3>Ayo Kenal Lebih dekat lagi dengan Mengunjungi Profil aku yaa!!</h3>
                            <p>Maaf, untuk menjaga kualitas layanan, kami membatasi jumlah pesan harian per pengguna. Yuk kenal Ugi lebih dekat lewat sosial media berikut!</p>
                            <div className="limit-social-links">
                                <a href={PORTFOLIO_DATA.github} target="_blank" rel="noopener noreferrer" className="social-link github">
                                    <FaGithub /> GitHub
                                </a>
                                <a href={PORTFOLIO_DATA.linkedin} target="_blank" rel="noopener noreferrer" className="social-link linkedin">
                                    <FaLinkedin /> LinkedIn
                                </a>
                                <a href={PORTFOLIO_DATA.instagram} target="_blank" rel="noopener noreferrer" className="social-link instagram">
                                    <FaInstagram /> Instagram
                                </a>
                                <a href="mailto:ugisugimanr@gmail.com" className="social-link email">
                                    <FaEnvelope /> Email
                                </a>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}

export default AIChatbot
