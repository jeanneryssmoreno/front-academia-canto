import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'
import { Box, Typography, Button } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

interface Props { children: ReactNode }
interface State { hasError: boolean; error: Error | null }

export default class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false, error: null }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('ErrorBoundary caught:', error, info)
    }

    render() {
        if (this.state.hasError) {
            return (
                <Box sx={{
                    minHeight: '100vh', background: '#06060f',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    textAlign: 'center', p: 4,
                }}>
                    <Box>
                        <ErrorOutlineIcon sx={{ fontSize: 64, color: '#f43f5e', mb: 2 }} />
                        <Typography variant="h4" fontWeight={700} sx={{ mb: 1, color: '#f1f5f9' }}>
                            Algo salió mal
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 420, mx: 'auto' }}>
                            Ha ocurrido un error inesperado. Intenta recargar la página.
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => window.location.reload()}
                            sx={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)' }}
                        >
                            Recargar página
                        </Button>
                    </Box>
                </Box>
            )
        }
        return this.props.children
    }
}
