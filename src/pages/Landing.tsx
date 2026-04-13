import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Card,
    Chip,
} from '@mui/material'
import { Link } from 'react-router-dom'
import PublicNavbar from '../components/PublicNavbar'
import Antigravity from '../components/Antigravity'
import BorderGlow from '../components/BorderGlow'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import MicIcon from '@mui/icons-material/Mic'
import StarIcon from '@mui/icons-material/Star'
import PeopleIcon from '@mui/icons-material/People'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { useCourses } from '../hooks/useCourses'
import { useProfiles } from '../hooks/useProfiles'

const glowPresets = [
    { color: '#8b5cf6', glowColors: ['#8b5cf6', '#a78bfa', '#c4b5fd'] },
    { color: '#06b6d4', glowColors: ['#06b6d4', '#22d3ee', '#67e8f9'] },
    { color: '#e040fb', glowColors: ['#e040fb', '#f472b6', '#c084fc'] },
    { color: '#10b981', glowColors: ['#10b981', '#6ee7b7', '#a7f3d0'] },
    { color: '#f59e0b', glowColors: ['#f59e0b', '#fcd34d', '#fde68a'] },
]

const features = [
    'Clases en vivo con profesores certificados',
    'Material de estudio disponible 24/7',
    'Seguimiento personalizado de progreso',
    'Comunidad exclusiva de artistas',
    'Certificado de finalización oficial',
    'Clases grabadas para repasar cuando quieras',
]

export default function Landing() {
    const muiTheme = useTheme()
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'))
    const { data: dbCourses } = useCourses()
    const { data: profiles } = useProfiles()

    const studentCount = profiles?.filter(p => p.role === 'student').length ?? 0
    const teacherCount = profiles?.filter(p => p.role === 'teacher').length ?? 0
    const courseCount = dbCourses?.length ?? 0

    const stats = [
        { label: 'Estudiantes Activos', value: `${studentCount}+`, icon: <PeopleIcon /> },
        { label: 'Cursos Disponibles', value: `${courseCount}`, icon: <PlayCircleIcon /> },
        { label: 'Calificación Promedio', value: '4.9 ★', icon: <StarIcon /> },
        { label: 'Profesores Expertos', value: `${teacherCount}`, icon: <MicIcon /> },
    ]

    const displayCourses = (dbCourses ?? []).slice(0, 6).map((c, i) => {
        const preset = glowPresets[i % glowPresets.length]
        return { ...c, ...preset }
    })

    return (
        <Box sx={{ background: '#06060f', minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
            {/* ── Antigravity fullscreen background ── */}
            <Box
                sx={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 0,
                }}
            >
                <Antigravity
                    count={isMobile ? 200 : 550}
                    magnetRadius={8}
                    ringRadius={9}
                    waveSpeed={0.4}
                    waveAmplitude={1.1}
                    particleSize={isMobile ? 1.4 : 1.8}
                    lerpSpeed={0.045}
                    color="#7C3AED"
                    autoAnimate
                    particleVariance={1.1}
                    rotationSpeed={0.02}
                    depthFactor={1.2}
                    pulseSpeed={2.8}
                    particleShape="capsule"
                    fieldStrength={10}
                    opacity={0.9}
                />
            </Box>

            {/* ── Subtle color overlay ── */}
            <Box
                sx={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 1,
                    pointerEvents: 'none',
                    background:
                        'radial-gradient(ellipse 90% 80% at 60% 40%, rgba(139,92,246,0.18) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 25% 65%, rgba(6,182,212,0.12) 0%, transparent 55%), linear-gradient(180deg, rgba(6,6,15,0.35) 0%, rgba(6,6,15,0.55) 50%, rgba(6,6,15,0.75) 100%)',
                }}
            />

            {/* ── Page content ── */}
            <Box sx={{ position: 'relative', zIndex: 2, overflowX: 'hidden' }}>
                <PublicNavbar />

                {/* Hero */}
                <Box
                    sx={{
                        minHeight: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        pt: { xs: 10, sm: 8 },
                        pb: { xs: 4, sm: 6 },
                        px: { xs: 1, sm: 0 },
                    }}
                >
                    <Container maxWidth="md">
                        <Chip
                            label="PREMIUM VOCAL TRAINING"
                            size="small"
                            sx={{
                                background: 'rgba(139,92,246,0.18)',
                                border: '1px solid rgba(139,92,246,0.35)',
                                color: '#c4b5fd',
                                mb: { xs: 2, sm: 4 },
                                fontWeight: 700,
                                letterSpacing: '0.1em',
                                fontSize: { xs: '0.6rem', sm: '0.7rem' },
                                backdropFilter: 'blur(8px)',
                            }}
                        />
                        <Typography
                            variant="h1"
                            sx={{
                                fontSize: { xs: '1.8rem', sm: '3rem', md: '4rem' },
                                lineHeight: 1.05,
                                color: 'white',
                                mb: 0.5,
                                wordBreak: 'break-word',
                                textShadow: '0 0 40px rgba(139,92,246,0.25), 0 2px 4px rgba(0,0,0,0.5)',
                            }}
                        >
                            DESBLOQUEA
                        </Typography>
                        <Typography
                            variant="h1"
                            sx={{
                                fontSize: { xs: '2.2rem', sm: '3.5rem', md: '4.8rem' },
                                lineHeight: 1.05,
                                background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 35%, #06b6d4 75%, #22d3ee 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 3,
                                wordBreak: 'break-word',
                            }}
                        >
                            TU VOZ
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                color: 'rgba(203,213,225,0.85)',
                                fontWeight: 400,
                                mb: { xs: 3, sm: 5 },
                                maxWidth: 520,
                                mx: 'auto',
                                lineHeight: 1.75,
                                fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1.1rem' },
                                px: { xs: 1, sm: 0 },
                            }}
                        >
                            Eleva tu performance del alma al escenario. Técnica vocal profesional
                            y resonancia artística en la academia más inmersiva del mundo.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: { xs: 1.5, sm: 2 }, justifyContent: 'center', flexWrap: 'wrap', px: { xs: 2, sm: 0 } }}>
                            <Button
                                variant="contained"
                                size="large"
                                component={Link}
                                to="/register"
                                endIcon={<ArrowForwardIcon />}
                                sx={{
                                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                                    px: { xs: 3, sm: 4 },
                                    py: { xs: 1.3, sm: 1.6 },
                                    fontSize: { xs: '0.9rem', sm: '1.05rem' },
                                    width: { xs: '100%', sm: 'auto' },
                                    borderRadius: 3,
                                    boxShadow: '0 0 40px rgba(139,92,246,0.4), 0 4px 20px rgba(0,0,0,0.3)',
                                    '&:hover': {
                                        boxShadow: '0 0 60px rgba(139,92,246,0.55), 0 4px 28px rgba(0,0,0,0.4)',
                                        transform: 'translateY(-2px)',
                                    },
                                    transition: 'all 0.25s ease',
                                }}
                            >
                                Comenzar ahora
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                component={Link}
                                to="/login"
                                sx={{
                                    borderColor: 'rgba(139,92,246,0.45)',
                                    color: '#e2e8f0',
                                    px: { xs: 3, sm: 4 },
                                    py: { xs: 1.3, sm: 1.6 },
                                    fontSize: { xs: '0.9rem', sm: '1.05rem' },
                                    width: { xs: '100%', sm: 'auto' },
                                    borderRadius: 3,
                                    backdropFilter: 'blur(8px)',
                                    background: 'rgba(139,92,246,0.06)',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        background: 'rgba(139,92,246,0.12)',
                                        transform: 'translateY(-2px)',
                                    },
                                    transition: 'all 0.25s ease',
                                }}
                            >
                                Iniciar sesión
                            </Button>
                        </Box>
                    </Container>
                </Box>

                {/* Stats */}
                <Box sx={{
                    py: { xs: 4, sm: 6, md: 8 },
                    borderTop: '1px solid rgba(139,92,246,0.1)',
                    borderBottom: '1px solid rgba(139,92,246,0.1)',
                    backdropFilter: 'blur(12px)',
                    background: 'rgba(6,6,15,0.5)',
                }}>
                    <Container maxWidth="lg">
                        <Grid container spacing={3}>
                            {stats.map((s) => (
                                <Grid size={{ xs: 6, md: 3 }} key={s.label}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography
                                            variant="h3"
                                            sx={{
                                                fontWeight: 800,
                                                mb: 0.5,
                                                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                                                background: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                            }}
                                        >
                                            {s.value}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {s.label}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </Box>

                {/* Courses */}
                <Box sx={{ py: { xs: 5, sm: 7, md: 10 }, overflowX: 'hidden' }}>
                    <Container maxWidth="lg">
                        <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 6 } }}>
                            <Typography
                                variant="h2"
                                sx={{
                                    mb: 2,
                                    fontSize: { xs: '1.6rem', sm: '2rem', md: '2.5rem' },
                                    background: 'linear-gradient(135deg, #f1f5f9 30%, #a78bfa 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Nuestros Programas
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 520, mx: 'auto', fontSize: { xs: '0.85rem', sm: '1rem' }, px: { xs: 2, sm: 0 } }}>
                                Desde principiantes hasta artistas avanzados, tenemos el programa perfecto para tu nivel.
                            </Typography>
                        </Box>
                        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
                            {displayCourses.map((c) => (
                                <Grid size={{ xs: 12, md: 4 }} key={c.id}>
                                    <BorderGlow
                                        edgeSensitivity={11}
                                        glowColor="270 70 70"
                                        backgroundColor="#0a0a1f"
                                        borderRadius={20}
                                        glowRadius={28}
                                        glowIntensity={1}
                                        coneSpread={24}
                                        colors={c.glowColors}
                                        fillOpacity={0.45}
                                    >
                                        <Box sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                                            <Box
                                                sx={{
                                                    width: 48,
                                                    height: 48,
                                                    borderRadius: 2,
                                                    background: `linear-gradient(135deg, ${c.color}33, ${c.color}11)`,
                                                    border: `1px solid ${c.color}33`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mb: 2.5,
                                                }}
                                            >
                                                <MicIcon sx={{ color: c.color }} />
                                            </Box>
                                            <Chip
                                                label={c.level}
                                                size="small"
                                                sx={{
                                                    background: `${c.color}20`,
                                                    color: c.color,
                                                    border: `1px solid ${c.color}30`,
                                                    mb: 1.5,
                                                    fontWeight: 600,
                                                }}
                                            />
                                            <Typography variant="h6" fontWeight={700} sx={{ mb: 1, color: '#f1f5f9' }}>
                                                {c.name}
                                            </Typography>
                                            <Typography variant="body2" sx={{ lineHeight: 1.7, color: '#94a3b8' }}>
                                                {c.description}
                                            </Typography>
                                        </Box>
                                    </BorderGlow>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </Box>

                {/* Features */}
                <Box
                    sx={{
                        py: { xs: 5, sm: 7, md: 10 },
                        backdropFilter: 'blur(10px)',
                        background: 'rgba(6,6,15,0.45)',
                    }}
                >
                    <Container maxWidth="lg">
                        <Grid container spacing={{ xs: 3, sm: 4, md: 6 }} alignItems="center">
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography
                                    variant="h2"
                                    sx={{
                                        mb: 2,
                                        fontSize: { xs: '1.6rem', sm: '2rem', md: '2.5rem' },
                                        textAlign: { xs: 'center', md: 'left' },
                                        background: 'linear-gradient(135deg, #f1f5f9 30%, #22d3ee 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    Todo lo que necesitas para brillar
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mb: { xs: 2, md: 4 }, lineHeight: 1.8, textAlign: { xs: 'center', md: 'left' }, fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                                    Una plataforma completa con todo el soporte que un artista vocal necesita para llegar al siguiente nivel.
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {features.map((f) => (
                                        <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <CheckCircleIcon sx={{ color: 'primary.main', fontSize: 20, flexShrink: 0 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {f}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Card sx={{
                                    p: 4,
                                    backdropFilter: 'blur(20px)',
                                    background: 'rgba(13,13,36,0.75)',
                                    border: '1px solid rgba(139,92,246,0.2)',
                                }}>
                                    <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
                                        Únete ahora — Es gratis
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
                                        Crea tu cuenta en segundos y accede a tu primer clase de prueba sin costo.
                                    </Typography>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        component={Link}
                                        to="/register"
                                        sx={{
                                            background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                                            py: 1.5,
                                            fontSize: '1rem',
                                        }}
                                    >
                                        Crear cuenta gratis
                                    </Button>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1.5 }}>
                                        Sin tarjeta de crédito requerida
                                    </Typography>
                                </Card>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

                {/* Footer */}
                <Box
                    component="footer"
                    sx={{
                        py: { xs: 3, sm: 5 },
                        borderTop: '1px solid rgba(139,92,246,0.1)',
                        textAlign: 'center',
                        backdropFilter: 'blur(10px)',
                        background: 'rgba(6,6,15,0.5)',
                    }}
                >
                    <Container maxWidth="lg">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                            <MicIcon sx={{ color: 'primary.main' }} />
                            <Typography
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
                            © 2026 Resonance Vocal Academy. All rights reserved JEANNERYS MORENO.
                        </Typography>
                    </Container>
                </Box>
            </Box>
        </Box>
    )
}
