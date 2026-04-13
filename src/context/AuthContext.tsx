import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'
import type { Profile } from '../types/database'

interface AuthContextType {
    user: User | null
    profile: Profile | null
    loading: boolean
    signIn: (email: string, password: string) => Promise<{ error: string | null }>
    signUp: (email: string, password: string, fullName: string, role?: string) => Promise<{ error: string | null; needsConfirmation: boolean }>
    signOut: () => Promise<void>
    resetPassword: (email: string) => Promise<{ error: string | null }>
    refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchProfile = async (userId: string) => {
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single()
        setProfile(data)
    }

    useEffect(() => {
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (session?.user) {
                setUser(session.user)
                await fetchProfile(session.user.id)
            }
            setLoading(false)
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                setUser(null)
                setProfile(null)
            } else if (session?.user) {
                setUser(session.user)
                fetchProfile(session.user.id)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error?.message === 'Email not confirmed') {
            return { error: 'Debes confirmar tu email antes de iniciar sesión. Revisa tu bandeja de entrada.' }
        }
        return { error: error?.message ?? null }
    }

    const signUp = async (email: string, password: string, fullName: string, role = 'student') => {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) return { error: error.message, needsConfirmation: false }

        if (data.user) {
            const { error: profileError } = await supabase.from('profiles').insert({
                id: data.user.id,
                full_name: fullName,
                email,
                role,
            })
            if (profileError) return { error: profileError.message, needsConfirmation: false }
        }

        // If session is null, Supabase requires email confirmation
        const needsConfirmation = !data.session
        return { error: null, needsConfirmation }
    }

    const signOut = async () => {
        await supabase.auth.signOut()
    }

    const resetPassword = async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/login`,
        })
        return { error: error?.message ?? null }
    }

    const refreshProfile = async () => {
        const currentUser = user ?? (await supabase.auth.getUser()).data.user
        if (currentUser) await fetchProfile(currentUser.id)
    }

    return (
        <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut, resetPassword, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
