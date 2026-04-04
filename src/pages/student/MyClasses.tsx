import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Skeleton,
    Grid,
    Link as MuiLink,
} from '@mui/material'
import ClassIcon from '@mui/icons-material/Class'
import VideoCallIcon from '@mui/icons-material/VideoCall'
import PersonIcon from '@mui/icons-material/Person'
import { useAuth } from '../../context/AuthContext'
import { useStudentClasses } from '../../hooks/useClasses'

const statusConfig = {
    scheduled: { label: 'Programada', bg: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: 'rgba(139,92,246,0.25)' },
    completed: { label: 'Completada', bg: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: 'rgba(16,185,129,0.25)' },
    cancelled: { label: 'Cancelada', bg: 'rgba(244,63,94,0.12)', color: '#fda4af', border: 'rgba(244,63,94,0.2)' },
}

export default function StudentClasses() {
    const { profile } = useAuth()
    const { data: enrollments, isLoading } = useStudentClasses(profile?.id)

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('es-ES', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })

    const formatDuration = (start: string, end: string) => {
        const ms = new Date(end).getTime() - new Date(start).getTime()
        const mins = Math.round(ms / 60000)
        return mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60 > 0 ? `${mins % 60}min` : ''}` : `${mins}min`
    }

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700}>
                    Mis Clases
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                    Todas tus clases inscritas — pasadas, presentes y futuras.
                </Typography>
            </Box>

            {isLoading ? (
                <Grid container spacing={3}>
                    {[1, 2, 3].map((i) => (
                        <Grid size={{ xs: 12, md: 6 }} key={i}>
                            <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2 }} />
                        </Grid>
                    ))}
                </Grid>
            ) : (enrollments?.length ?? 0) === 0 ? (
                <Card>
                    <CardContent sx={{ py: 8, textAlign: 'center' }}>
                        <ClassIcon sx={{ fontSize: 56, color: 'text.secondary', opacity: 0.4, mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                            No tienes clases inscritas aún.
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <Grid container spacing={3}>
                    {enrollments?.map((e: any) => {
                        const cls = e.classes
                        const status = (cls?.status ?? 'scheduled') as keyof typeof statusConfig
                        const cfg = statusConfig[status] ?? statusConfig.scheduled

                        return (
                            <Grid size={{ xs: 12, md: 6 }} key={e.id}>
                                <Card
                                    sx={{
                                        transition: 'transform 0.2s',
                                        '&:hover': { transform: 'translateY(-2px)' },
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        {/* Header */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                            <Box>
                                                <Typography variant="h6" fontWeight={600}>
                                                    {cls?.courses?.name ?? 'Clase'}
                                                </Typography>
                                                {cls?.courses?.level && (
                                                    <Chip
                                                        label={cls.courses.level}
                                                        size="small"
                                                        sx={{
                                                            mt: 0.5,
                                                            background: 'rgba(6,182,212,0.12)',
                                                            color: '#22d3ee',
                                                            border: '1px solid rgba(6,182,212,0.2)',
                                                            fontSize: '0.7rem',
                                                        }}
                                                    />
                                                )}
                                            </Box>
                                            <Chip
                                                label={cfg.label}
                                                size="small"
                                                sx={{
                                                    background: cfg.bg,
                                                    color: cfg.color,
                                                    border: `1px solid ${cfg.border}`,
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                }}
                                            />
                                        </Box>

                                        {/* Info */}
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <ClassIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    {cls?.start_time ? formatDate(cls.start_time) : '—'}
                                                </Typography>
                                            </Box>
                                            {cls?.start_time && cls?.end_time && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="caption" color="text.secondary" sx={{ pl: '24px' }}>
                                                        Duración: {formatDuration(cls.start_time, cls.end_time)}
                                                    </Typography>
                                                </Box>
                                            )}
                                            {cls?.profiles?.full_name && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {cls.profiles.full_name}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>

                                        {/* Meeting link */}
                                        {cls?.meeting_link && status === 'scheduled' && (
                                            <Box
                                                sx={{
                                                    mt: 2,
                                                    pt: 2,
                                                    borderTop: '1px solid rgba(139,92,246,0.1)',
                                                }}
                                            >
                                                <MuiLink
                                                    href={cls.meeting_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 0.5,
                                                        color: 'secondary.light',
                                                        fontSize: '0.875rem',
                                                        fontWeight: 600,
                                                        textDecoration: 'none',
                                                        '&:hover': { color: 'secondary.main' },
                                                    }}
                                                >
                                                    <VideoCallIcon sx={{ fontSize: 18 }} />
                                                    Unirse a la clase
                                                </MuiLink>
                                            </Box>
                                        )}

                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
                                            Inscrito el {new Date(e.enrolled_at).toLocaleDateString('es-ES')}
                                        </Typography>
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
