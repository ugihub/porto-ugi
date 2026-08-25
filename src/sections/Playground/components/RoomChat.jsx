import { useState, useEffect, useRef } from 'react'
import { IoSend } from 'react-icons/io5'
import { FaComments } from 'react-icons/fa'
import { supabase, isSupabaseConfigured } from '../../../lib/supabase'

const ROOM_NAME = 'portfolio-chat'

const RoomChat = () => {
    const [username, setUsername] = useState('')
    const [joined, setJoined] = useState(false)
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [usernameInput, setUsernameInput] = useState('')
    const [alertMsg, setAlertMsg] = useState(null)
    const messagesEndRef = useRef(null)

    // Auto scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Load messages & subscribe to realtime
    useEffect(() => {
        if (!joined || !isSupabaseConfigured) return

        // Fetch existing messages
        const fetchMessages = async () => {
            const { data } = await supabase
                .from('room_messages')
                .select('*')
                .eq('room', ROOM_NAME)
                .order('created_at', { ascending: true })
                .limit(100)

            if (data) setMessages(data)
        }

        fetchMessages()

        // Subscribe to new messages
        const channel = supabase
            .channel(`room:${ROOM_NAME}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'room_messages',
                    filter: `room=eq.${ROOM_NAME}`,
                },
                (payload) => {
                    setMessages(prev => [...prev, payload.new])
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [joined])

    // Check local storage on mount
    useEffect(() => {
        const savedUsername = localStorage.getItem('portfolio_chat_username')
        if (savedUsername) {
            setUsername(savedUsername)
            setJoined(true)
        }
    }, [])

    const handleJoin = async (e) => {
        e.preventDefault()
        const newUsername = usernameInput.trim()
        if (!newUsername) return

        if (!isSupabaseConfigured) {
            // Fallback for demo/no-backend
            setUsername(newUsername)
            setJoined(true)
            localStorage.setItem('portfolio_chat_username', newUsername)
            return
        }

        try {
            // 1. Check if username exists
            const { data: existingUser, error: checkError } = await supabase
                .from('room_users')
                .select('username')
                .eq('username', newUsername)
                .maybeSingle()

            if (existingUser) {
                // If username exists, check if it's ours (re-login)
                const saved = localStorage.getItem('portfolio_chat_username')
                if (saved === newUsername) {
                    setUsername(newUsername)
                    setJoined(true)
                    return
                }
                setAlertMsg('Username sudah dipakai, silakan pilih yang lain! 🚫')
                return
            }

            // 2. Register new user
            const { error: insertError } = await supabase
                .from('room_users')
                .insert([{ username: newUsername }])

            if (insertError) {
                // Handle concurrent registration or other errors
                if (insertError.code === '23505') { // Unique violation
                    setAlertMsg('Username sudah dipakai, silakan pilih yang lain! 🚫')
                } else {
                    console.error('Error registering user:', insertError)
                    setAlertMsg('Terjadi kesalahan saat join room via Database. Coba lagi.')
                }
                return
            }

            // Success
            localStorage.setItem('portfolio_chat_username', newUsername)
            setUsername(newUsername)
            setJoined(true)

        } catch (err) {
            console.error('Unexpected error joining:', err)
            // Fallback if table doesn't exist yet (for smooth dev URL)
            setAlertMsg('Gagal menghubungkan ke database user. Pastikan tabel room_users sudah dibuat.')
        }
    }

    const sendMessage = async () => {
        if (!input.trim() || !isSupabaseConfigured) return

        const newMsg = {
            room: ROOM_NAME,
            username: username,
            content: input.trim(),
        }

        setInput('')

        // If Supabase is configured, insert into DB
        const { error } = await supabase
            .from('room_messages')
            .insert([newMsg])

        if (error) {
            console.error('Send message error:', error)
            // Fallback: add locally
            setMessages(prev => [...prev, { ...newMsg, id: Date.now(), created_at: new Date().toISOString() }])
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            sendMessage()
        }
    }

    const formatTime = (timestamp) => {
        if (!timestamp) return ''
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    if (!isSupabaseConfigured) {
        return (
            <div className="tool-card" style={{ '--tool-accent': '#4caf50' }}>
                <h3 className="tool-title">💬 Room Chat</h3>
                <p className="tool-subtitle">Real-time chat room for portfolio visitors</p>
                <div className="chat-room">
                    <div className="chat-join">
                        <span className="join-icon">⚠️</span>
                        <h5>Supabase Not Configured</h5>
                        <p>Room Chat requires Supabase to be properly configured with a room_messages table.</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="tool-card" style={{ '--tool-accent': '#4caf50' }}>
            <h3 className="tool-title">💬 Room Chat</h3>
            <p className="tool-subtitle">Real-time chat room — talk with other visitors</p>

            <div className="chat-room">
                {!joined ? (
                    <div className="chat-join">
                        <span className="join-icon"><FaComments /></span>
                        <h5>Join the Chat Room</h5>
                        <p>Enter a username to start chatting with other visitors on this portfolio.</p>
                        <form className="chat-join-form" onSubmit={handleJoin}>
                            <input
                                type="text"
                                placeholder="Enter username..."
                                value={usernameInput}
                                onChange={(e) => setUsernameInput(e.target.value)}
                                maxLength={20}
                            />
                            <button
                                type="submit"
                                className="join-btn"
                                disabled={!usernameInput.trim()}
                            >
                                JOIN
                            </button>
                        </form>
                    </div>
                ) : (
                    <>
                        <div className="online-count">
                            <span className="online-dot" />
                            Chatting as <strong>{username}</strong>
                        </div>

                        <div className="chat-messages-area">
                            {messages.length === 0 && (
                                <div style={{
                                    textAlign: 'center',
                                    color: 'var(--color-text-muted)',
                                    fontSize: '0.8rem',
                                    padding: '40px 0',
                                    opacity: 0.5,
                                }}>
                                    No messages yet. Say hello! 👋
                                </div>
                            )}

                            {messages.map((msg, idx) => (
                                <div
                                    key={msg.id || idx}
                                    className={`room-message ${msg.username === username ? 'own' : ''}`}
                                >
                                    <span className="msg-author">{msg.username}</span>
                                    <div className="msg-bubble">{msg.content}</div>
                                    <span className="msg-time">{formatTime(msg.created_at)}</span>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="chat-input-area">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                maxLength={500}
                            />
                            <button
                                className="chat-send-btn"
                                onClick={sendMessage}
                                disabled={!input.trim()}
                            >
                                <IoSend />
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Custom Alert Overlay */}
            {alertMsg && (
                <div className="custom-alert-overlay" onClick={() => setAlertMsg(null)}>
                    <div className="custom-alert-box" onClick={e => e.stopPropagation()}>
                        <div className="custom-alert-message">{alertMsg}</div>
                        <button className="custom-alert-btn" onClick={() => setAlertMsg(null)}>
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default RoomChat
