import { useRef } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Box, CircularProgress } from '@mui/material'
import AppShell from './AppShell'

interface Props {
    children: React.ReactNode
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

export default function ProtectedPage({ children, roles }: Props) {
    const { user, profile, loading } = useAuth()
    const hadProfile = useRef(false)

    if (profile) hadProfile.current = true

    // PROFILE-FIRST: if profile exists, trust it immediately
    if (profile) {
        if (!roles.includes(profile.role)) {
            if (profile.role === 'teacher') return <Navigate to="/teacher/dashboard" replace />
            if (profile.role === 'admin') return <Navigate to="/admin/dashboard" replace />
            return <Navigate to="/student/dashboard" replace />
        }
        return <AppShell>{children}</AppShell>
    }

    // Still waiting for auth to settle
    if (loading || user || hadProfile.current || hasSupabaseSession()) {
        return Spinner
    }

    // Truly unauthenticated
    return <Navigate to="/login" replace />
}
