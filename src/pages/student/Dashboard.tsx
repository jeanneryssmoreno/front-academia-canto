import { Box, Grid, Card, CardContent, Typography, Chip, Skeleton, Avatar } from '@mui/material'
import ClassIcon from '@mui/icons-material/Class'
import PaymentIcon from '@mui/icons-material/Payment'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import EventIcon from '@mui/icons-material/Event'
import { useAuth } from '../../context/AuthContext'
import { useStudentClasses } from '../../hooks/useClasses'
import { useStudentPayments } from '../../hooks/usePayments'

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
        </Box>
    )
}
