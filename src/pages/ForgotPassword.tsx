import { useState } from 'react'
import {
    Box, Container, Card, CardContent, Typography, TextField, Button,
    Alert, Link as MuiLink,
} from '@mui/material'
import { Link } from 'react-router-dom'
import GraphicEqIcon from '@mui/icons-material/GraphicEq'
import { useAuth } from '../context/AuthContext'

export default function ForgotPassword() {
    const { resetPassword } = useAuth()
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        const { error: err } = await resetPassword(email)
        setLoading(false)
        if (err) { setError(err); return }
        setSuccess(true)
    }

    return (
        <Box sx={{
            minHeight: '100vh', background: '#06060f',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
            '&::before': {
                content: '""', position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(139,92,246,0.12) 0%, transparent 60%)',
            },
        }}>
            <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1, px: { xs: 2, sm: 3 } }}>
                <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                        <GraphicEqIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                        <Typography variant="h5" fontWeight={800} sx={{
                            background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        }}>Resonance</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">Recupera tu contraseña</Typography>
                </Box>

                <Card>
                    <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
                        <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>Restablecer contraseña</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Te enviaremos un enlace para restablecer tu contraseña.
                        </Typography>

                        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
                        {success ? (
                            <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                                Revisa tu email. Te hemos enviado un enlace para restablecer tu contraseña.
                            </Alert>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <TextField
                                    label="Email" type="email" fullWidth required
                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                />
                                <Button type="submit" variant="contained" fullWidth size="large" disabled={loading}
                                    sx={{ mt: 1, py: 1.5, background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', '&:disabled': { background: 'rgba(139,92,246,0.3)' } }}>
                                    {loading ? 'Enviando...' : 'Enviar enlace'}
                                </Button>
                            </form>
                        )}

                        <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: 'text.secondary' }}>
                            <MuiLink component={Link} to="/login" sx={{ color: 'primary.light', fontWeight: 600 }}>
                                ← Volver al login
                            </MuiLink>
                        </Typography>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    )
}
