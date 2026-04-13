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

    if (loading) return Spinner

    if (!user) {
        if (hasSupabaseSession()) return Spinner
        return <Navigate to="/login" replace />
    }

    if (!profile) return Spinner

    if (roles && !roles.includes(profile.role)) {
        if (profile.role === 'teacher') return <Navigate to="/teacher/dashboard" replace />
        if (profile.role === 'admin') return <Navigate to="/admin/dashboard" replace />
        return <Navigate to="/student/dashboard" replace />
    }

    return <>{children}</>
}
