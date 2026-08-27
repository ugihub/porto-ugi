import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { getThemeMode } from './themeMode'

const defaultTheme = {
    colors: {
        primary: '#ff3d00',
        secondary: '#00e5ff',
        accent: '#ffea00',
        background: '#0a0a0a',
        surface: '#111111',
        text: '#ffffff',
        muted: '#7a7a7a'
    },
    fonts: {
        heading: "'Syne', sans-serif",
        body: "'Outfit', sans-serif"
    },
    animationSpeed: 1
}

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
    // Load theme from localStorage or use default
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('portfolio-theme')
        return savedTheme ? JSON.parse(savedTheme) : defaultTheme
    })

    const [themeId, setThemeId] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const root = document.documentElement
        root.style.setProperty('--color-primary', theme.colors.primary)
        root.style.setProperty('--color-secondary', theme.colors.secondary)
        root.style.setProperty('--color-accent', theme.colors.accent)
        root.style.setProperty('--color-bg', theme.colors.background)
        root.style.setProperty('--color-surface', theme.colors.surface)
        root.style.setProperty('--color-text', theme.colors.text)
        root.style.setProperty('--color-text-muted', theme.colors.muted)
        root.dataset.themeMode = getThemeMode(theme.colors.background)
        root.style.setProperty('--font-heading', theme.fonts.heading)
        root.style.setProperty('--font-body', theme.fonts.body)
        root.style.setProperty('--animation-speed', theme.animationSpeed)

        // Save to localStorage
        localStorage.setItem('portfolio-theme', JSON.stringify(theme))
    }, [theme])

    const updateTheme = (updates) => {
        setTheme(prev => ({
            ...prev,
            ...updates,
            colors: { ...prev.colors, ...updates.colors },
            fonts: { ...prev.fonts, ...updates.fonts }
        }))
    }

    const updateColor = (key, value) => {
        setTheme(prev => ({
            ...prev,
            colors: { ...prev.colors, [key]: value }
        }))
    }

    const updateFont = (key, value) => {
        setTheme(prev => ({
            ...prev,
            fonts: { ...prev.fonts, [key]: value }
        }))
    }

    const setAnimationSpeed = (speed) => {
        setTheme(prev => ({ ...prev, animationSpeed: speed }))
    }

    const resetTheme = () => {
        setTheme(defaultTheme)
        setThemeId(null)
    }

    const saveTheme = async (name = 'Custom Theme') => {
        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from('themes')
                .insert({
                    name,
                    colors: theme.colors,
                    fonts: theme.fonts,
                    animation_speed: theme.animationSpeed
                })
                .select()
                .single()

            if (error) throw error
            setThemeId(data.id)
            return data.id
        } catch (error) {
            console.error('Error saving theme:', error)
            return null
        } finally {
            setIsLoading(false)
        }
    }

    const loadTheme = async (id) => {
        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from('themes')
                .select('*')
                .eq('id', id)
                .single()

            if (error) throw error

            setTheme({
                colors: data.colors,
                fonts: data.fonts || defaultTheme.fonts,
                animationSpeed: data.animation_speed || 1
            })
            setThemeId(id)
            return true
        } catch (error) {
            console.error('Error loading theme:', error)
            return false
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <ThemeContext.Provider value={{
            theme,
            themeId,
            isLoading,
            updateTheme,
            updateColor,
            updateFont,
            setAnimationSpeed,
            resetTheme,
            saveTheme,
            loadTheme,
            defaultTheme
        }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}
