import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    Chip,
} from '@mui/material'
import { Link } from 'react-router-dom'
import PublicNavbar from '../components/PublicNavbar'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import MicIcon from '@mui/icons-material/Mic'
import StarIcon from '@mui/icons-material/Star'
import PeopleIcon from '@mui/icons-material/People'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import GraphicEqIcon from '@mui/icons-material/GraphicEq'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const stats = [
    { label: 'Estudiantes Activos', value: '2,400+', icon: <PeopleIcon /> },
    { label: 'Clases Impartidas', value: '12,000+', icon: <PlayCircleIcon /> },
    { label: 'Calificación Promedio', value: '4.9 ★', icon: <StarIcon /> },
    { label: 'Profesores Expertos', value: '48', icon: <MicIcon /> },
]

const courses = [
    {
        name: 'Técnica Vocal Básica',
        level: 'Principiante',
        description: 'Fundamentos de respiración, postura y emisión de voz para cantantes nuevos.',
        color: '#8b5cf6',
    },
    {
        name: 'Masterclass de Jazz',
        level: 'Intermedio',
        description: 'Improvisación, scat y estilo jazzístico con los mejores referentes del género.',
        color: '#06b6d4',
    },
    {
        name: 'Vocal Performance',
        level: 'Avanzado',
        description: 'Prepárate para el escenario con técnicas de performance y presencia artística.',
        color: '#e040fb',
    },
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
    return (
        <Box sx={{ background: '#06060f', minHeight: '100vh' }}>
            <PublicNavbar />

            {/* Hero */}
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    pt: 8,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        background:
                            'radial-gradient(ellipse 80% 60% at 70% 50%, rgba(139,92,246,0.18) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 20% 60%, rgba(6,182,212,0.12) 0%, transparent 55%)',
                        pointerEvents: 'none',
                    },
                }}
            >
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Grid container spacing={6} alignItems="center">
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Chip
                                label="PREMIUM VOCAL TRAINING"
                                size="small"
                                sx={{
                                    background: 'rgba(139,92,246,0.15)',
                                    border: '1px solid rgba(139,92,246,0.3)',
                                    color: '#a78bfa',
                                    mb: 3,
                                    fontWeight: 600,
                                    letterSpacing: '0.06em',
                                }}
                            />
                            <Typography variant="h1" sx={{ fontSize: { xs: '3.5rem', md: '5rem' }, lineHeight: 1.1, color: 'white', mb: 0.5 }}>
                                Desbloquea
                            </Typography>
                            <Typography
                                variant="h1"
                                sx={{
                                    fontSize: { xs: '3.5rem', md: '5rem' },
                                    lineHeight: 1.1,
                                    background: 'linear-gradient(135deg, #8b5cf6 30%, #06b6d4 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    mb: 3,
                                }}
                            >
                                tu voz
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400, mb: 4, maxWidth: 440, lineHeight: 1.7 }}>
                                Elevate your performance from the soul to the stage. Professional vocal technique meets artistic resonance in the world's most immersive vocal academy.
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    component={Link}
                                    to="/register"
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{
                                        background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                                        px: 3.5,
                                        py: 1.5,
                                        fontSize: '1rem',
                                        boxShadow: '0 0 32px rgba(139,92,246,0.35)',
                                        '&:hover': { boxShadow: '0 0 48px rgba(139,92,246,0.5)' },
                                    }}
                                >
                                    Start Audition
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    component={Link}
                                    to="/login"
                                    sx={{
                                        borderColor: 'rgba(139,92,246,0.4)',
                                        color: 'text.primary',
                                        px: 3.5,
                                        py: 1.5,
                                        fontSize: '1rem',
                                        '&:hover': { borderColor: 'primary.main', background: 'rgba(139,92,246,0.08)' },
                                    }}
                                >
                                    View Curriculum
                                </Button>
                            </Box>
                        </Grid>

                        {/* Hero visual */}
                        <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
                            <Box
                                sx={{
                                    width: 420,
                                    height: 420,
                                    borderRadius: '50%',
                                    background: 'radial-gradient(ellipse, rgba(139,92,246,0.2) 0%, transparent 70%)',
                                    border: '1px solid rgba(139,92,246,0.15)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 280,
                                        height: 280,
                                        borderRadius: '50%',
                                        border: '1px solid rgba(6,182,212,0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <GraphicEqIcon
                                        sx={{
                                            fontSize: 120,
                                            color: 'primary.main',
                                            filter: 'drop-shadow(0 0 24px rgba(139,92,246,0.6)) drop-shadow(0 0 48px rgba(6,182,212,0.3))',
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Stats */}
            <Box sx={{ py: 8, borderTop: '1px solid rgba(139,92,246,0.08)', borderBottom: '1px solid rgba(139,92,246,0.08)' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={3}>
                        {stats.map((s) => (
                            <Grid size={{ xs: 6, md: 3 }} key={s.label}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h3" sx={{ color: 'primary.light', fontWeight: 800, mb: 0.5 }}>
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
            <Box sx={{ py: 10 }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Typography variant="h2" sx={{ mb: 2 }}>
                            Nuestros Programas
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 520, mx: 'auto' }}>
                            Desde principiantes hasta artistas avanzados, tenemos el programa perfecto para tu nivel.
                        </Typography>
                    </Box>
                    <Grid container spacing={3}>
                        {courses.map((c) => (
                            <Grid size={{ xs: 12, md: 4 }} key={c.name}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: `0 16px 48px rgba(139,92,246,0.2)`,
                                        },
                                    }}
                                >
                                    <CardContent sx={{ p: 3.5 }}>
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
                                        <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                                            {c.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                            {c.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Features */}
            <Box
                sx={{
                    py: 10,
                    background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(139,92,246,0.07) 0%, transparent 70%)',
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={6} alignItems="center">
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="h2" sx={{ mb: 2 }}>
                                Todo lo que necesitas para brillar
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8 }}>
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
                            <Card sx={{ p: 4 }}>
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
                    py: 5,
                    borderTop: '1px solid rgba(139,92,246,0.08)',
                    textAlign: 'center',
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                        <GraphicEqIcon sx={{ color: 'primary.main' }} />
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
                        © 2026 Resonance Vocal Academy. All rights reserved.
                    </Typography>
                </Container>
            </Box>
        </Box>
    )
}
