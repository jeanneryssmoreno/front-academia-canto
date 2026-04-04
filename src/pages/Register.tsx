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
import PersonIcon from '@mui/icons-material/Person'
import MicIcon from '@mui/icons-material/Mic'
import { useAuth } from '../context/AuthContext'

export default function Register() {
    const { signUp } = useAuth()
    const navigate = useNavigate()
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState<'student' | 'teacher'>('student')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.')
            return
        }
        setLoading(true)
        const { error: err, needsConfirmation } = await signUp(email, password, fullName, role)
        setLoading(false)
        if (err) {
            setError(err)
            return
        }
        if (needsConfirmation) {
            setSuccess('Cuenta creada. Revisa tu email y haz clic en el enlace de confirmación para activar tu cuenta.')
            return
        }
        // Email confirmation disabled — session is active, redirect by role
        if (role === 'teacher') navigate('/teacher/dashboard')
        else navigate('/student/dashboard')
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
                py: 4,
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background:
                        'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(6,182,212,0.1) 0%, transparent 60%)',
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
                        Comienza tu viaje vocal hoy
                    </Typography>
                </Box>

                <Card>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
                            Crear cuenta
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Únete a la academia de forma gratuita
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                                {error}
                            </Alert>
                        )}

                        {success && (
                            <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                                {success}
                            </Alert>
                        )}

                        {/* Role selector */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                Quiero unirme como:
                            </Typography>
                            <ToggleButtonGroup
                                value={role}
                                exclusive
                                onChange={(_, v) => v && setRole(v)}
                                fullWidth
                                size="small"
                                sx={{
                                    '& .MuiToggleButton-root': {
                                        borderColor: 'rgba(139,92,246,0.2)',
                                        color: 'text.secondary',
                                        py: 1.2,
                                        '&.Mui-selected': {
                                            background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(6,182,212,0.1))',
                                            borderColor: 'primary.main',
                                            color: 'primary.light',
                                        },
                                    },
                                }}
                            >
                                <ToggleButton value="student">
                                    <PersonIcon sx={{ mr: 1, fontSize: 18 }} /> Estudiante
                                </ToggleButton>
                                <ToggleButton value="teacher">
                                    <MicIcon sx={{ mr: 1, fontSize: 18 }} /> Profesor
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>

                        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Nombre completo"
                                fullWidth
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                autoComplete="name"
                            />
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
                                autoComplete="new-password"
                                helperText="Mínimo 6 caracteres"
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
                                {loading ? <CircularProgress size={22} color="inherit" /> : 'Crear cuenta gratis'}
                            </Button>
                        </Box>

                        <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: 'text.secondary' }}>
                            ¿Ya tienes cuenta?{' '}
                            <MuiLink component={Link} to="/login" sx={{ color: 'primary.light', fontWeight: 600 }}>
                                Inicia sesión
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
