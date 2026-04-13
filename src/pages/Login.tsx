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
    ToggleButtonGroup,
    ToggleButton,
} from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import GraphicEqIcon from '@mui/icons-material/GraphicEq'
import SchoolIcon from '@mui/icons-material/School'
import MicExternalOnIcon from '@mui/icons-material/MicExternalOn'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'

export default function Login() {
    const { signIn, refreshProfile } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState<'student' | 'teacher'>('student')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const { error: err } = await signIn(email, password)
            if (err) {
                setLoading(false)
                setError(err)
                return
            }

            // Update role in profile to match selection
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data: currentProfile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single()

                // Only switch if not admin (admins keep their role)
                if (currentProfile && currentProfile.role !== 'admin' && currentProfile.role !== role) {
                    await supabase.from('profiles').update({ role }).eq('id', user.id)
                }
            }

            await refreshProfile()
            setLoading(false)

            // Navigate directly to the role's dashboard
            const finalRole = role === 'student' ? 'student' : 'teacher'
            navigate(`/${finalRole}/dashboard`)
        } catch {
            setLoading(false)
            setError('Error de conexión. Intenta de nuevo.')
        }
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
            <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1, px: { xs: 2, sm: 3 } }}>
                {/* Logo */}
                <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
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
                    <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
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

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <Box sx={{ mb: 0.5 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
                                    Ingresar como:
                                </Typography>
                                <ToggleButtonGroup
                                    value={role}
                                    exclusive
                                    onChange={(_e, v) => v && setRole(v)}
                                    fullWidth
                                    sx={{
                                        '& .MuiToggleButton-root': {
                                            py: 1.2,
                                            border: '1px solid rgba(139,92,246,0.2)',
                                            color: 'text.secondary',
                                            '&.Mui-selected': {
                                                background: 'linear-gradient(135deg, rgba(139,92,246,0.18), rgba(6,182,212,0.12))',
                                                color: '#a78bfa',
                                                borderColor: 'rgba(139,92,246,0.4)',
                                            },
                                        },
                                    }}
                                >
                                    <ToggleButton value="student">
                                        <SchoolIcon sx={{ mr: 1, fontSize: 20 }} /> Estudiante
                                    </ToggleButton>
                                    <ToggleButton value="teacher">
                                        <MicExternalOnIcon sx={{ mr: 1, fontSize: 20 }} /> Profesor
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Box>
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
                        </form>

                        <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: 'text.secondary' }}>
                            ¿No tienes cuenta?{' '}
                            <MuiLink component={Link} to="/register" sx={{ color: 'primary.light', fontWeight: 600 }}>
                                Regístrate gratis
                            </MuiLink>
                        </Typography>
                        <Typography variant="body2" sx={{ textAlign: 'center', mt: 1.5, color: 'text.secondary' }}>
                            <MuiLink component={Link} to="/forgot-password" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                                ¿Olvidaste tu contraseña?
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
