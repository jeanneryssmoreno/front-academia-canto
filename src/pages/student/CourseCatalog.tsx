import { Box, Typography, Grid, Card, CardContent, Chip, Button, Skeleton } from '@mui/material'
import SchoolIcon from '@mui/icons-material/School'
import PersonIcon from '@mui/icons-material/Person'
import EventIcon from '@mui/icons-material/Event'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useAuth } from '../../context/AuthContext'
import { useAvailableClasses, useStudentEnrollments, useCreateEnrollment } from '../../hooks/useEnrollments'
import { useSnackbar } from '../../context/SnackbarContext'

const levelColors: Record<string, { bg: string; color: string }> = {
    Principiante: { bg: 'rgba(16,185,129,0.12)', color: '#6ee7b7' },
    Intermedio: { bg: 'rgba(245,158,11,0.12)', color: '#fcd34d' },
    Avanzado: { bg: 'rgba(244,63,94,0.12)', color: '#fda4af' },
}

export default function CourseCatalog() {
    const { profile } = useAuth()
    const { data: classes, isLoading } = useAvailableClasses()
    const { data: enrolledClassIds } = useStudentEnrollments(profile?.id)
    const enroll = useCreateEnrollment()
    const { showSnackbar } = useSnackbar()

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('es-ES', {
            weekday: 'short', day: 'numeric', month: 'short',
            hour: '2-digit', minute: '2-digit',
        })

    const handleEnroll = async (classId: string) => {
        if (!profile) return
        try {
            await enroll.mutateAsync({ studentId: profile.id, classId })
            showSnackbar('¡Te has inscrito exitosamente!')
        } catch {
            showSnackbar('Error al inscribirte. Intenta de nuevo.', 'error')
        }
    }

    return (
        <Box>
            <Box sx={{ mb: { xs: 2, md: 4 } }}>
                <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.125rem' } }}>
                    Explorar Clases
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5, fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                    Descubre y únete a clases disponibles en la academia.
                </Typography>
            </Box>

            {isLoading ? (
                <Grid container spacing={{ xs: 2, sm: 3 }}>
                    {[1, 2, 3, 4].map(i => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                            <Skeleton variant="rectangular" height={240} sx={{ borderRadius: 2 }} />
                        </Grid>
                    ))}
                </Grid>
            ) : (classes?.length ?? 0) === 0 ? (
                <Card>
                    <CardContent sx={{ py: 8, textAlign: 'center' }}>
                        <SchoolIcon sx={{ fontSize: 56, color: 'text.secondary', opacity: 0.4, mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">No hay clases disponibles en este momento.</Typography>
                    </CardContent>
                </Card>
            ) : (
                <Grid container spacing={{ xs: 2, sm: 3 }}>
                    {classes?.map((c: any) => {
                        const isEnrolled = enrolledClassIds?.includes(c.id)
                        const lvl = levelColors[c.courses?.level ?? ''] ?? { bg: 'rgba(139,92,246,0.12)', color: '#a78bfa' }
                        return (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={c.id}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
                                    <CardContent sx={{ p: { xs: 2, md: 3 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                                            <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1rem', sm: '1.15rem' } }}>
                                                {c.courses?.name ?? 'Clase'}
                                            </Typography>
                                            {c.courses?.level && (
                                                <Chip label={c.courses.level} size="small" sx={{ background: lvl.bg, color: lvl.color, fontSize: '0.7rem', fontWeight: 600 }} />
                                            )}
                                        </Box>
                                        {c.courses?.description && (
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6, flex: 1 }}>
                                                {c.courses.description}
                                            </Typography>
                                        )}
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, mb: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                <Typography variant="caption" color="text.secondary">
                                                    {c.profiles?.full_name ?? 'Sin asignar'}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <EventIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                <Typography variant="caption" color="text.secondary">
                                                    {formatDate(c.start_time)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        {isEnrolled ? (
                                            <Button fullWidth variant="outlined" disabled startIcon={<CheckCircleIcon />}
                                                sx={{ borderColor: '#10b981', color: '#10b981', '&.Mui-disabled': { borderColor: 'rgba(16,185,129,0.3)', color: '#6ee7b7' } }}>
                                                Ya inscrito
                                            </Button>
                                        ) : (
                                            <Button fullWidth variant="contained" disabled={enroll.isPending}
                                                onClick={() => handleEnroll(c.id)}
                                                sx={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)' }}>
                                                Inscribirme
                                            </Button>
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
