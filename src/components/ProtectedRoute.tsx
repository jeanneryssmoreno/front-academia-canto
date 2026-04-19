import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Box, CircularProgress } from '@mui/material'

interface Props {
    children: React.ReactNode
    roles?: string[]
}

const Spinner = (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress color="primary" />
    </Box>
)

function hasSupabaseSession(): boolean {
    return Object.keys(localStorage).some(k => k.startsWith('sb-') && k.endsWith('-auth-token'))
}

export default function ProtectedRoute({ children, roles }: Props) {
    const { user, profile, loading } = useAuth()

    // If profile exists, trust it — it's only cleared on explicit SIGNED_OUT
    if (profile) {
        if (roles && !roles.includes(profile.role)) {
            if (profile.role === 'teacher') return <Navigate to="/teacher/dashboard" replace />
            if (profile.role === 'admin') return <Navigate to="/admin/dashboard" replace />
            return <Navigate to="/student/dashboard" replace />
        }
        return <>{children}</>
    }

    // No profile yet — still loading or auth flicker
    if (loading || user || hasSupabaseSession()) return Spinner

    // No profile, no user, no session → truly unauthenticated
    return <Navigate to="/login" replace />
}
