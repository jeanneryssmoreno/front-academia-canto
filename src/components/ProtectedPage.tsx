import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Box, CircularProgress } from '@mui/material'
import AppShell from './AppShell'

interface Props {
    children: React.ReactNode
    roles: string[]
}

export default function ProtectedPage({ children, roles }: Props) {
    const { profile, loading } = useAuth()

    // Show loading spinner while auth is initializing
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress color="primary" />
            </Box>
        )
    }

    // No profile = not authenticated
    if (!profile) {
        return <Navigate to="/login" replace />
    }

    // Check if user has correct role
    if (!roles.includes(profile.role)) {
        // Redirect to appropriate dashboard
        if (profile.role === 'teacher') return <Navigate to="/teacher/dashboard" replace />
        if (profile.role === 'admin') return <Navigate to="/admin/dashboard" replace />
        return <Navigate to="/student/dashboard" replace />
    }

    // All checks passed, render the page
    return <AppShell>{children}</AppShell>
}
