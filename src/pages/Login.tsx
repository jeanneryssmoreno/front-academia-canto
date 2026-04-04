import { useState } from 'react'
import {
    Box,
    Container,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Link as MuiLink,
} from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import GraphicEqIcon from '@mui/icons-material/GraphicEq'
import { useAuth } from '../context/AuthContext'

export default function Login() {
    const { signIn } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        const { error: err } = await signIn(email, password)
        setLoading(false)
        if (err) {
            setError(err)
            return
        }
        navigate('/dashboard')
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: '#06060f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background:
                        'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(139,92,246,0.12) 0%, transparent 60%)',
                    pointerEvents: 'none',
                },
            }}
        >
            <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
                {/* Logo */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                        <GraphicEqIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                        <Typography
                            variant="h5"
                            fontWeight={800}
                            sx={{
                                background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Resonance
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        Bienvenido de vuelta
                    </Typography>
                </Box>

                <Card>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
                            Iniciar sesión
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Accede a tu cuenta de la academia
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Email"
                                type="email"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                            />
                            <TextField
                                label="Contraseña"
                                type="password"
                                fullWidth
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                size="large"
                                disabled={loading}
                                sx={{
                                    mt: 1,
                                    py: 1.5,
                                    background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                                    '&:disabled': { background: 'rgba(139,92,246,0.3)' },
                                }}
                            >
                                {loading ? <CircularProgress size={22} color="inherit" /> : 'Iniciar sesión'}
                            </Button>
                        </Box>

                        <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: 'text.secondary' }}>
                            ¿No tienes cuenta?{' '}
                            <MuiLink component={Link} to="/register" sx={{ color: 'primary.light', fontWeight: 600 }}>
                                Regístrate gratis
                            </MuiLink>
                        </Typography>
                    </CardContent>
                </Card>

                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 3 }}>
                    <MuiLink component={Link} to="/" sx={{ color: 'text.secondary' }}>
                        ← Volver al inicio
                    </MuiLink>
                </Typography>
            </Container>
        </Box>
    )
}
