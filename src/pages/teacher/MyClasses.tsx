import { Box, Grid, Card, CardContent, Typography, Chip, Skeleton, Link as MuiLink } from '@mui/material'
import ClassIcon from '@mui/icons-material/Class'
import VideoCallIcon from '@mui/icons-material/VideoCall'
import { useAuth } from '../../context/AuthContext'
import { useTeacherClasses } from '../../hooks/useClasses'

const statusConfig = {
    scheduled: { label: 'Programada', bg: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: 'rgba(139,92,246,0.25)' },
    completed: { label: 'Completada', bg: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: 'rgba(16,185,129,0.25)' },
    cancelled: { label: 'Cancelada', bg: 'rgba(244,63,94,0.12)', color: '#fda4af', border: 'rgba(244,63,94,0.2)' },
}

export default function TeacherClasses() {
    const { profile } = useAuth()
    const { data: classes, isLoading } = useTeacherClasses(profile?.id)

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('es-ES', {
            weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
        })

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700}>Mis Clases</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                    Todas las clases asignadas a ti.
                </Typography>
            </Box>

            {isLoading ? (
                <Grid container spacing={3}>
                    {[1, 2, 3].map(i => (
                        <Grid size={{ xs: 12, md: 6 }} key={i}>
                            <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 2 }} />
                        </Grid>
                    ))}
                </Grid>
            ) : (classes?.length ?? 0) === 0 ? (
                <Card>
                    <CardContent sx={{ py: 8, textAlign: 'center' }}>
                        <ClassIcon sx={{ fontSize: 56, color: 'text.secondary', opacity: 0.4, mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">No tienes clases asignadas.</Typography>
                    </CardContent>
                </Card>
            ) : (
                <Grid container spacing={3}>
                    {classes?.map((c: any) => {
                        const status = (c.status ?? 'scheduled') as keyof typeof statusConfig
                        const cfg = statusConfig[status] ?? statusConfig.scheduled
                        return (
                            <Grid size={{ xs: 12, md: 6 }} key={c.id}>
                                <Card sx={{ transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                            <Box>
                                                <Typography variant="h6" fontWeight={600}>{c.courses?.name ?? 'Clase'}</Typography>
                                                {c.courses?.level && (
                                                    <Chip label={c.courses.level} size="small" sx={{ mt: 0.5, background: 'rgba(6,182,212,0.12)', color: '#22d3ee', border: '1px solid rgba(6,182,212,0.2)', fontSize: '0.7rem' }} />
                                                )}
                                            </Box>
                                            <Chip label={cfg.label} size="small" sx={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, fontWeight: 600 }} />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                            Inicio: {formatDate(c.start_time)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Fin: {formatDate(c.end_time)}
                                        </Typography>
                                        {c.meeting_link && status === 'scheduled' && (
                                            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(139,92,246,0.1)' }}>
                                                <MuiLink href={c.meeting_link} target="_blank" rel="noopener noreferrer"
                                                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'secondary.light', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', '&:hover': { color: 'secondary.main' } }}>
                                                    <VideoCallIcon sx={{ fontSize: 18 }} /> Abrir enlace de clase
                                                </MuiLink>
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        )
                    })}
                </Grid>
            )}
        </Box>
    )
}
