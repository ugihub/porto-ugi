import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaCheck, FaMoon, FaSun } from 'react-icons/fa'
import { useTheme } from '../../contexts/ThemeContext'
import './ThemeCustomizer.css'

const ThemeCustomizer = ({ isOpen, onClose }) => {
    const { theme, updateTheme } = useTheme()
    
    // Determine initial mode based on background color
    const [mode, setMode] = useState(() => {
        const bg = theme.colors.background.toLowerCase()
        // Check if background matches known light themes or is generally light
        // Simple check: if it's white or very light pastel
        const lightBackgrounds = ['#ffffff', '#e1f5fe', '#f1f8e9', '#f3e5f5']
        return lightBackgrounds.includes(bg) ? 'light' : 'dark'
    })

    // Harmonious Dark Themes
    const darkPresets = [
        {
            id: 'carbon',
            name: 'CARBON',
            colors: {
                primary: '#00ff9d',
                secondary: '#00b8ff',
                accent: '#00ff9d',
                background: '#0a0a0a',
                surface: '#121212',
                text: '#ffffff',
                muted: '#808080'
            }
        },
        {
            id: 'midnight',
            name: 'MIDNIGHT',
            colors: {
                primary: '#818cf8',
                secondary: '#c084fc',
                accent: '#818cf8',
                background: '#0f172a',
                surface: '#1e293b',
                text: '#f8fafc',
                muted: '#94a3b8'
            }
        },
        {
            id: 'crimson',
            name: 'CRIMSON',
            colors: {
                primary: '#ff3333',
                secondary: '#ff6b6b',
                accent: '#ff0000',
                background: '#1a0505',
                surface: '#2d0a0a',
                text: '#ffecec',
                muted: '#ff9999'
            }
        },
        {
            id: 'luxury',
            name: 'LUXURY',
            colors: {
                primary: '#ffd700',
                secondary: '#bf9b30',
                accent: '#ffed4a',
                background: '#121212',
                surface: '#1e1e1e',
                text: '#ffffff',
                muted: '#a0a0a0'
            }
        }
    ]

    // Harmonious Light Themes
    const lightPresets = [
        {
            id: 'paper',
            name: 'PAPER',
            colors: {
                primary: '#2d3436',
                secondary: '#636e72',
                accent: '#2d3436',
                background: '#ffffff',
                surface: '#f5f5f5',
                text: '#1a1a1a',
                muted: '#636e72'
            }
        },
        {
            id: 'ocean-light',
            name: 'OCEAN',
            colors: {
                primary: '#0288d1',
                secondary: '#03a9f4',
                accent: '#4fc3f7',
                background: '#e1f5fe',
                surface: '#b3e5fc',
                text: '#01579b',
                muted: '#455a64'
            }
        },
        {
            id: 'sage',
            name: 'SAGE',
            colors: {
                primary: '#558b2f',
                secondary: '#7cb342',
                accent: '#AED581',
                background: '#f1f8e9',
                surface: '#dcedc8',
                text: '#33691e',
                muted: '#689f38'
            }
        },
        {
            id: 'lavender',
            name: 'LAVENDER',
            colors: {
                primary: '#8e24aa',
                secondary: '#ab47bc',
                accent: '#da66fa',
                background: '#f3e5f5',
                surface: '#e1bee7',
                text: '#4a148c',
                muted: '#8e24aa'
            }
        }
    ]

    const activePresets = mode === 'dark' ? darkPresets : lightPresets

    const handleApply = (preset) => {
        updateTheme({ colors: preset.colors })
    }

    const toggleMode = () => {
        setMode(prev => prev === 'dark' ? 'light' : 'dark')
    }

    const isPresetActive = (preset) => {
        // Simple check: primary color matches
        return theme.colors.primary === preset.colors.primary &&
            theme.colors.background === preset.colors.background
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="customizer-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    <motion.div
                        className={`customizer-sidebar ${mode}`}
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    >
                        <div className="customizer-header">
                            <div>
                                <h3>SELECT THEME</h3>
                                <p className="mono">CHOOSE YOUR VIBE</p>
                            </div>
                            <div className="header-actions">
                                <button className="mode-toggle" onClick={toggleMode}>
                                    {mode === 'dark' ? <FaMoon /> : <FaSun />}
                                </button>
                                <button className="close-btn" onClick={onClose}>
                                    <FaTimes />
                                </button>
                            </div>
                        </div>

                        <div className="customizer-content">
                            <h4 className="section-label mono">
                                {mode === 'dark' ? '// DARK MODE' : '// LIGHT MODE'}
                            </h4>
                            <div className="theme-grid">
                                {activePresets.map((preset) => (
                                    <motion.button
                                        key={preset.id}
                                        className={`theme-card ${isPresetActive(preset) ? 'active' : ''}`}
                                        onClick={() => handleApply(preset)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="theme-preview" style={{ background: preset.colors.background }}>
                                            <div className="preview-shape" style={{ background: preset.colors.primary }}></div>
                                            <div className="preview-shape" style={{ background: preset.colors.secondary }}></div>
                                            <div className="preview-shape" style={{ background: preset.colors.surface }}></div>
                                        </div>
                                        <div className="theme-info">
                                            <span className="theme-name mono">{preset.name}</span>
                                            {isPresetActive(preset) && <FaCheck className="active-icon" />}
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default ThemeCustomizer
