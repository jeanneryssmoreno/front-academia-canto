import { Box, Grid, Card, CardContent, Typography, Chip, Skeleton, Avatar, Button } from '@mui/material'
import ClassIcon from '@mui/icons-material/Class'
import PaymentIcon from '@mui/icons-material/Payment'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import EventIcon from '@mui/icons-material/Event'
import SchoolIcon from '@mui/icons-material/School'
import PersonIcon from '@mui/icons-material/Person'
import { useAuth } from '../../context/AuthContext'
import { useStudentClasses } from '../../hooks/useClasses'
import { useStudentPayments } from '../../hooks/usePayments'
import { useAvailableClasses, useStudentEnrollments, useCreateEnrollment } from '../../hooks/useEnrollments'
import { useSnackbar } from '../../context/SnackbarContext'

function StatCard({
    icon,
    label,
    value,
    color,
    loading,
}: {
    icon: React.ReactNode
    label: string
    value: string | number
    color: string
    loading?: boolean
}) {
    return (
        <Card>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box
                        sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 2,
                            background: `${color}20`,
                            border: `1px solid ${color}30`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color,
                        }}
                    >
                        {icon}
                    </Box>
                </Box>
                {loading ? (
                    <Skeleton width={40} height={36} />
                ) : (
                    <Typography variant="h4" fontWeight={700}>
                        {value}
                    </Typography>
                )}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {label}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default function StudentDashboard() {
    const { profile } = useAuth()
    const { data: enrollments, isLoading: loadingClasses } = useStudentClasses(profile?.id)
    const { data: payments, isLoading: loadingPayments } = useStudentPayments(profile?.id)
    const { data: availableClasses, isLoading: loadingAvailable } = useAvailableClasses()
    const { data: enrolledClassIds } = useStudentEnrollments(profile?.id)
    const enroll = useCreateEnrollment()
    const { showSnackbar } = useSnackbar()

    const upcomingClasses = enrollments?.filter(
        (e: any) => e.classes?.status === 'scheduled'
    ) ?? []

    const pendingPayments = payments?.filter((p: any) => p.status === 'pending') ?? []
    const paidPayments = payments?.filter((p: any) => p.status === 'paid') ?? []

    const nextClass = upcomingClasses[0]

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
        })

    const formatShortDate = (iso: string) =>
        new Date(iso).toLocaleDateString('es-ES', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
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

    const levelColors: Record<string, { bg: string; color: string }> = {
        Principiante: { bg: 'rgba(16,185,129,0.12)', color: '#6ee7b7' },
        Intermedio: { bg: 'rgba(245,158,11,0.12)', color: '#fcd34d' },
        Avanzado: { bg: 'rgba(244,63,94,0.12)', color: '#fda4af' },
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: { xs: 2, md: 4 } }}>
                <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.125rem' } }}>
                    Bienvenido, {profile?.full_name?.split(' ')[0]} 👋
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5, fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                    Aquí tienes un resumen de tu actividad en la academia.
                </Typography>
            </Box>

            {/* Stats */}
            <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 2, md: 4 } }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        icon={<ClassIcon />}
                        label="Clases inscritas"
                        value={enrollments?.length ?? 0}
                        color="#8b5cf6"
                        loading={loadingClasses}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        icon={<EventIcon />}
                        label="Clases próximas"
                        value={upcomingClasses.length}
                        color="#06b6d4"
                        loading={loadingClasses}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        icon={<PaymentIcon />}
                        label="Pagos pendientes"
                        value={pendingPayments.length}
                        color="#f59e0b"
                        loading={loadingPayments}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        icon={<CheckCircleIcon />}
                        label="Pagos completados"
                        value={paidPayments.length}
                        color="#10b981"
                        loading={loadingPayments}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Next class */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={600} sx={{ mb: 2.5 }}>
                                Próxima Clase
                            </Typography>
                            {loadingClasses ? (
                                <>
                                    <Skeleton height={24} sx={{ mb: 1 }} />
                                    <Skeleton width="60%" height={20} />
                                </>
                            ) : nextClass ? (
                                <Box>
                                    <Box
                                        sx={{
                                            p: 2.5,
                                            borderRadius: 2,
                                            background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(6,182,212,0.06))',
                                            border: '1px solid rgba(139,92,246,0.15)',
                                            mb: 2,
                                        }}
                                    >
                                        <Typography variant="h6" fontWeight={600}>
                                            {(nextClass as any).classes?.courses?.name ?? 'Clase'}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                            {formatDate((nextClass as any).classes?.start_time)}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
                                            <Chip
                                                label={(nextClass as any).classes?.courses?.level ?? 'General'}
                                                size="small"
                                                sx={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)' }}
                                            />
                                            <Chip
                                                label="Programada"
                                                size="small"
                                                sx={{ background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.2)' }}
                                            />
                                        </Box>
                                        {(nextClass as any).classes?.meeting_link && (
                                            <Box sx={{ mt: 2 }}>
                                                <a
                                                    href={(nextClass as any).classes.meeting_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ color: '#22d3ee', fontSize: '0.875rem' }}
                                                >
                                                    → Unirse a la clase
                                                </a>
                                            </Box>
                                        )}
                                    </Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Profesor: {(nextClass as any).classes?.profiles?.full_name ?? 'Por asignar'}
                                    </Typography>
                                </Box>
                            ) : (
                                <Box
                                    sx={{
                                        textAlign: 'center',
                                        py: 4,
                                        color: 'text.secondary',
                                    }}
                                >
                                    <ClassIcon sx={{ fontSize: 40, mb: 1, opacity: 0.4 }} />
                                    <Typography variant="body2">No tienes clases próximas.</Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Pending payments */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={600} sx={{ mb: 2.5 }}>
                                Pagos Pendientes
                            </Typography>
                            {loadingPayments ? (
                                <Skeleton height={80} />
                            ) : pendingPayments.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                                    <CheckCircleIcon sx={{ fontSize: 40, mb: 1, color: '#10b981', opacity: 0.6 }} />
                                    <Typography variant="body2">¡Estás al día con tus pagos!</Typography>
                                </Box>
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                    {pendingPayments.slice(0, 4).map((p: any) => (
                                        <Box
                                            key={p.id}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                p: 2,
                                                borderRadius: 2,
                                                background: 'rgba(245,158,11,0.06)',
                                                border: '1px solid rgba(245,158,11,0.15)',
                                            }}
                                        >
                                            <Box>
                                                <Typography variant="body2" fontWeight={600}>
                                                    ${Number(p.amount).toFixed(2)}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Vence: {new Date(p.due_date).toLocaleDateString('es-ES')}
                                                </Typography>
                                            </Box>
                                            <Chip
                                                label="Pendiente"
                                                size="small"
                                                sx={{ background: 'rgba(245,158,11,0.15)', color: '#fcd34d', border: '1px solid rgba(245,158,11,0.25)', fontSize: '0.7rem' }}
                                            />
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent enrollments */}
                <Grid size={{ xs: 12 }}>
                    <Card>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={600} sx={{ mb: 2.5 }}>
                                Mis Inscripciones Recientes
                            </Typography>
                            {loadingClasses ? (
                                <Skeleton height={100} />
                            ) : (enrollments?.length ?? 0) === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                                    <Typography variant="body2">No tienes inscripciones aún.</Typography>
                                </Box>
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {enrollments?.slice(0, 5).map((e: any) => (
                                        <Box
                                            key={e.id}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 2,
                                                p: 1.5,
                                                borderRadius: 2,
                                                '&:hover': { background: 'rgba(139,92,246,0.04)' },
                                            }}
                                        >
                                            <Avatar
                                                sx={{
                                                    width: 36,
                                                    height: 36,
                                                    background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                                                    fontSize: '0.8rem',
                                                }}
                                            >
                                                {e.classes?.courses?.name?.[0] ?? 'C'}
                                            </Avatar>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {e.classes?.courses?.name ?? 'Clase'}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {e.classes?.start_time ? formatDate(e.classes.start_time) : '—'}
                                                </Typography>
                                            </Box>
                                            <Chip
                                                label={e.classes?.status ?? '—'}
                                                size="small"
                                                sx={{
                                                    background:
                                                        e.classes?.status === 'scheduled'
                                                            ? 'rgba(139,92,246,0.15)'
                                                            : e.classes?.status === 'completed'
                                                                ? 'rgba(16,185,129,0.15)'
                                                                : 'rgba(244,63,94,0.15)',
                                                    color:
                                                        e.classes?.status === 'scheduled'
                                                            ? '#a78bfa'
                                                            : e.classes?.status === 'completed'
                                                                ? '#6ee7b7'
                                                                : '#fda4af',
                                                    border: 'none',
                                                    fontSize: '0.7rem',
                                                    textTransform: 'capitalize',
                                                }}
                                            />
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Clases Disponibles */}
            <Box sx={{ mt: { xs: 2, md: 4 } }}>
                <Typography variant="h5" fontWeight={700} sx={{ mb: 2, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
                    🎓 Explorar Clases Disponibles
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Clases publicadas por profesores. ¡Inscríbete ahora!
                </Typography>

                {loadingAvailable ? (
                    <Grid container spacing={{ xs: 2, sm: 3 }}>
                        {[1, 2, 3].map(i => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                                <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 2 }} />
                            </Grid>
                        ))}
                    </Grid>
                ) : (availableClasses?.length ?? 0) === 0 ? (
                    <Card>
                        <CardContent sx={{ py: 6, textAlign: 'center' }}>
                            <SchoolIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.4, mb: 1.5 }} />
                            <Typography variant="h6" color="text.secondary">
                                No hay clases disponibles en este momento.
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Los profesores aún no han publicado clases.
                            </Typography>
                        </CardContent>
                    </Card>
                ) : (
                    <Grid container spacing={{ xs: 2, sm: 3 }}>
                        {availableClasses?.map((c: any) => {
                            const isEnrolled = enrolledClassIds?.includes(c.id)
                            const lvl = levelColors[c.courses?.level ?? ''] ?? { bg: 'rgba(139,92,246,0.12)', color: '#a78bfa' }
                            return (
                                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={c.id}>
                                    <Card sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 30px rgba(139,92,246,0.15)' },
                                    }}>
                                        <CardContent sx={{ p: { xs: 2, md: 3 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                                                <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1rem', sm: '1.15rem' } }}>
                                                    {c.courses?.name ?? 'Clase'}
                                                </Typography>
                                                {c.courses?.level && (
                                                    <Chip label={c.courses.level} size="small"
                                                        sx={{ background: lvl.bg, color: lvl.color, fontSize: '0.7rem', fontWeight: 600 }} />
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
                                                        {formatShortDate(c.start_time)}
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
                                                    sx={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', fontWeight: 600 }}>
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
        </Box>
    )
}
