import { Box, Grid, Card, CardContent, Typography, Chip, Skeleton, Avatar } from '@mui/material'
import ClassIcon from '@mui/icons-material/Class'
import PeopleIcon from '@mui/icons-material/People'
import EventIcon from '@mui/icons-material/Event'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useAuth } from '../../context/AuthContext'
import { useTeacherClasses } from '../../hooks/useClasses'

export default function TeacherDashboard() {
    const { profile } = useAuth()
    const { data: classes, isLoading } = useTeacherClasses(profile?.id)

    const upcomingClasses = classes?.filter((c: any) => c.status === 'scheduled') ?? []
    const completedClasses = classes?.filter((c: any) => c.status === 'completed') ?? []
    const cancelledClasses = classes?.filter((c: any) => c.status === 'cancelled') ?? []

    const nextClass = upcomingClasses[0]

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
        })

    return (
        <Box>
            <Box sx={{ mb: { xs: 2, md: 4 } }}>
                <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.125rem' } }}>
                    Dashboard del Profesor
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5, fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                    Bienvenido, {profile?.full_name}. Aquí tienes un resumen de tus clases.
                </Typography>
            </Box>

            {/* Stats */}
            <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 2, md: 4 } }}>
                {[
                    { label: 'Total de clases', value: classes?.length ?? 0, color: '#8b5cf6', icon: <ClassIcon /> },
                    { label: 'Próximas', value: upcomingClasses.length, color: '#06b6d4', icon: <EventIcon /> },
                    { label: 'Completadas', value: completedClasses.length, color: '#10b981', icon: <CheckCircleIcon /> },
                    { label: 'Canceladas', value: cancelledClasses.length, color: '#f43f5e', icon: <PeopleIcon /> },
                ].map((s) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={s.label}>
                        <Card>
                            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                                <Box
                                    sx={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 2,
                                        background: `${s.color}20`,
                                        border: `1px solid ${s.color}30`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: s.color,
                                        mb: 2,
                                    }}
                                >
                                    {s.icon}
                                </Box>
                                {isLoading ? (
                                    <Skeleton width={40} height={36} />
                                ) : (
                                    <Typography variant="h4" fontWeight={700}>{s.value}</Typography>
                                )}
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{s.label}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                {/* Next class */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={600} sx={{ mb: 2.5 }}>Próxima Clase</Typography>
                            {isLoading ? (
                                <Skeleton height={100} />
                            ) : nextClass ? (
                                <Box
                                    sx={{
                                        p: 2.5,
                                        borderRadius: 2,
                                        background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(6,182,212,0.06))',
                                        border: '1px solid rgba(139,92,246,0.15)',
                                    }}
                                >
                                    <Typography variant="h6" fontWeight={600}>{(nextClass as any).courses?.name ?? 'Clase'}</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                        {formatDate((nextClass as any).start_time)}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
                                        <Chip label={(nextClass as any).courses?.level ?? 'General'} size="small"
                                            sx={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)' }} />
                                        <Chip label="Programada" size="small"
                                            sx={{ background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.2)' }} />
                                    </Box>
                                    {(nextClass as any).meeting_link && (
                                        <a href={(nextClass as any).meeting_link} target="_blank" rel="noopener noreferrer"
                                            style={{ color: '#22d3ee', fontSize: '0.875rem', display: 'block', marginTop: 12 }}>
                                            → Enlace de la clase
                                        </a>
                                    )}
                                </Box>
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                                    <ClassIcon sx={{ fontSize: 40, opacity: 0.4, mb: 1 }} />
                                    <Typography variant="body2">No tienes clases programadas.</Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Upcoming schedule */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={600} sx={{ mb: 2.5 }}>Agenda Próxima</Typography>
                            {isLoading ? (
                                <Skeleton height={120} />
                            ) : upcomingClasses.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                                    <Typography variant="body2">Sin clases próximas.</Typography>
                                </Box>
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                    {upcomingClasses.slice(0, 4).map((c: any) => (
                                        <Box key={c.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar sx={{ width: 36, height: 36, background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', fontSize: '0.8rem' }}>
                                                {c.courses?.name?.[0] ?? 'C'}
                                            </Avatar>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="body2" fontWeight={600}>{c.courses?.name ?? 'Clase'}</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {new Date(c.start_time).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}
