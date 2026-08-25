import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Components
import CustomCursor from './components/CustomCursor'
import Navigation from './components/Navigation'
import ParticleBackground from './components/ParticleBackground'
import ThemeCustomizer from './components/ThemeCustomizer'
import Footer from './components/Footer'
import AIChatbot from './components/AIChatbot'

// Sections
import Hero from './sections/Hero'
import About from './sections/About'
import Projects from './sections/Projects'
import Playground from './sections/Playground/Playground'
import Contact from './sections/Contact'

// Hooks
import { useTheme } from './contexts/ThemeContext'

function App() {
    const [isLoading, setIsLoading] = useState(true)
    const [isCustomizerOpen, setIsCustomizerOpen] = useState(false)
    const { theme } = useTheme()

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1500)

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const sharedTheme = urlParams.get('theme')

        if (sharedTheme) {
            try {
                const colors = JSON.parse(atob(sharedTheme))
                Object.entries(colors).forEach(([key, value]) => {
                    document.documentElement.style.setProperty(`--color-${key}`, value)
                })
            } catch (error) {
                console.error('Invalid shared theme')
            }
        }
    }, [])

    return (
        <>
            {/* Loading Screen */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        className="loading-screen"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'var(--color-bg)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 9999,
                            gap: '20px'
                        }}
                    >
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 'clamp(2rem, 6vw, 4rem)',
                                fontWeight: 800,
                                letterSpacing: '-0.04em',
                                textTransform: 'uppercase'
                            }}
                        >
                            UGI<span style={{ color: 'var(--color-primary)' }}>.</span>
                        </motion.h1>
                        <motion.div
                            animate={{ width: ['0%', '100%'] }}
                            transition={{ duration: 1.2, ease: 'easeInOut' }}
                            style={{
                                height: '2px',
                                background: 'var(--color-primary)',
                                width: '100px',
                                maxWidth: '200px'
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Noise Overlay */}
            <div className="noise-overlay" />

            {/* Custom Cursor */}
            <CustomCursor />

            {/* Particle Background */}
            <ParticleBackground />

            {/* Navigation */}
            <Navigation onOpenCustomizer={() => setIsCustomizerOpen(true)} />

            {/* Theme Customizer */}
            <ThemeCustomizer
                isOpen={isCustomizerOpen}
                onClose={() => setIsCustomizerOpen(false)}
            />

            {/* Main Content */}
            <main>
                <Hero />
                <About />
                <Projects />
                <Playground />
                <Contact />
            </main>

            {/* Footer */}
            <Footer />

            {/* AI Chatbot */}
            <AIChatbot />
        </>
    )
}

export default App
