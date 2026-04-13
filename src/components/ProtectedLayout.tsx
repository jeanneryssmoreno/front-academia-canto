import { useRef } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Box, CircularProgress } from '@mui/material'
import AppShell from './AppShell'

interface Props {
    roles: string[]
}

function hasSupabaseSession(): boolean {
    return Object.keys(localStorage).some(k => k.startsWith('sb-') && k.endsWith('-auth-token'))
}

const Spinner = (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress color="primary" />
    </Box>
)

export default function ProtectedLayout({ roles }: Props) {
    const { user, profile, loading } = useAuth()
    const hadProfile = useRef(false)
    const location = useLocation()

    // DEBUG — visible en pantalla
    console.log('[ProtectedLayout]', {
        path: location.pathname,
        loading,
        user: !!user,
        profile: profile?.role ?? null,
        hadProfile: hadProfile.current,
        hasSession: hasSupabaseSession(),
        roles,
    })

    // Once profile is loaded, remember it forever (layout routes don't remount)
    if (profile) hadProfile.current = true

    // PROFILE-FIRST: if profile exists, trust it immediately (skip loading check)
    if (profile) {
        if (!roles.includes(profile.role)) {
            console.log('[ProtectedLayout] ROLE MISMATCH → redirect')
            if (profile.role === 'teacher') return <Navigate to="/teacher/dashboard" replace />
            if (profile.role === 'admin') return <Navigate to="/admin/dashboard" replace />
            return <Navigate to="/student/dashboard" replace />
        }
        return (
            <AppShell>
                <Outlet />
            </AppShell>
        )
    }

    // No profile yet — still loading, or brief auth flicker
    if (loading || user || hadProfile.current || hasSupabaseSession()) {
        console.log('[ProtectedLayout] WAITING (spinner)')
        return Spinner
    }

    // No profile, no user, no session, never had profile → truly unauthenticated
    console.log('[ProtectedLayout] NO AUTH → redirect /login')
    return <Navigate to="/login" replace />
}
