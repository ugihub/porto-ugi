import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Create a mock client if no credentials are provided
const isMockMode = !supabaseUrl || !supabaseAnonKey

export const supabase = isMockMode
    ? {
        from: () => ({
            insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) }) }),
            select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) }) }),
            update: () => ({ eq: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) })
        })
    }
    : createClient(supabaseUrl, supabaseAnonKey)

export const isSupabaseConfigured = !isMockMode

// Helper functions
export const saveThemeToDb = async (themeData) => {
    if (isMockMode) {
        console.warn('Supabase not configured. Theme will not be persisted.')
        return { success: false, id: null }
    }

    try {
        const { data, error } = await supabase
            .from('themes')
            .insert(themeData)
            .select()
            .single()

        if (error) throw error
        return { success: true, id: data.id }
    } catch (error) {
        console.error('Error saving theme:', error)
        return { success: false, id: null }
    }
}

export const getThemeById = async (id) => {
    if (isMockMode) return null

    try {
        const { data, error } = await supabase
            .from('themes')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error fetching theme:', error)
        return null
    }
}

export const getPopularThemes = async (limit = 10) => {
    if (isMockMode) return []

    try {
        const { data, error } = await supabase
            .from('themes')
            .select('*')
            .order('view_count', { ascending: false })
            .limit(limit)

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error fetching popular themes:', error)
        return []
    }
}
