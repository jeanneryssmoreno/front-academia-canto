import { Box, Grid, Card, CardContent, Typography, Chip, Skeleton } from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import ClassIcon from '@mui/icons-material/Class'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningIcon from '@mui/icons-material/Warning'
import { useProfiles } from '../../hooks/useProfiles'
import { useAllClasses } from '../../hooks/useClasses'
import { useAllPayments } from '../../hooks/usePayments'
import { useCourses } from '../../hooks/useCourses'

export default function AdminDashboard() {
    const { data: profiles, isLoading: loadingProfiles } = useProfiles()
    const { data: classes, isLoading: loadingClasses } = useAllClasses()
    const { data: payments, isLoading: loadingPayments } = useAllPayments()
    const { data: courses, isLoading: loadingCourses } = useCourses()

    const students = profiles?.filter((p) => p.role === 'student') ?? []
    const teachers = profiles?.filter((p) => p.role === 'teacher') ?? []
    const pendingPayments = payments?.filter((p: any) => p.status === 'pending') ?? []
    const totalRevenue = payments?.filter((p: any) => p.status === 'paid').reduce((sum: number, p: any) => sum + Number(p.amount), 0) ?? 0

    const stats = [
        { label: 'Estudiantes', value: students.length, color: '#8b5cf6', icon: <PeopleIcon />, loading: loadingProfiles },
        { label: 'Profesores', value: teachers.length, color: '#06b6d4', icon: <PeopleIcon />, loading: loadingProfiles },
        { label: 'Cursos activos', value: courses?.length ?? 0, color: '#e040fb', icon: <MenuBookIcon />, loading: loadingCourses },
        { label: 'Clases totales', value: classes?.length ?? 0, color: '#f59e0b', icon: <ClassIcon />, loading: loadingClasses },
        { label: 'Pagos pendientes', value: pendingPayments.length, color: '#f43f5e', icon: <WarningIcon />, loading: loadingPayments },
        { label: 'Ingresos confirmados', value: `$${totalRevenue.toFixed(0)}`, color: '#10b981', icon: <CheckCircleIcon />, loading: loadingPayments },
    ]

    const recentPayments = payments?.slice(0, 5) ?? []
    const recentClasses = (classes ?? []).slice(0, 5)

    return (
        <Box>
            <Box sx={{ mb: { xs: 2, md: 4 } }}>
                <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.125rem' } }}>Panel de Administración</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5, fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                    Resumen global de la academia.
                </Typography>
            </Box>

            {/* Stats grid */}
            <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 2, md: 4 } }}>
                {stats.map((s) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={s.label}>
                        <Card>
                            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                    <Box sx={{ width: 40, height: 40, borderRadius: 2, background: `${s.color}20`, border: `1px solid ${s.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                                        {s.icon}
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">{s.label}</Typography>
                                </Box>
                                {s.loading ? <Skeleton width={60} height={36} /> : (
                                    <Typography variant="h4" fontWeight={700}>{s.value}</Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                {/* Recent payments */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={600} sx={{ mb: 2.5 }}>Pagos Recientes</Typography>
                            {loadingPayments ? <Skeleton height={120} /> : recentPayments.length === 0 ? (
                                <Typography variant="body2" color="text.secondary">Sin pagos registrados.</Typography>
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                    {recentPayments.map((p: any) => (
                                        <Box key={p.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, borderRadius: 2, background: 'rgba(255,255,255,0.02)' }}>
                                            <Box>
                                                <Typography variant="body2" fontWeight={600}>{p.profiles?.full_name ?? 'Usuario'}</Typography>
                                                <Typography variant="caption" color="text.secondary">{new Date(p.created_at).toLocaleDateString('es-ES')}</Typography>
                                            </Box>
                                            <Box sx={{ textAlign: 'right' }}>
                                                <Typography variant="body2" fontWeight={700}>${Number(p.amount).toFixed(2)}</Typography>
                                                <Chip label={p.status === 'paid' ? 'Pagado' : 'Pendiente'} size="small"
                                                    sx={p.status === 'paid'
                                                        ? { background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', fontSize: '0.68rem' }
                                                        : { background: 'rgba(245,158,11,0.15)', color: '#fcd34d', fontSize: '0.68rem' }} />
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent classes */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={600} sx={{ mb: 2.5 }}>Clases Próximas</Typography>
                            {loadingClasses ? <Skeleton height={120} /> : recentClasses.length === 0 ? (
                                <Typography variant="body2" color="text.secondary">Sin clases registradas.</Typography>
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                    {recentClasses.map((c: any) => (
                                        <Box key={c.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, borderRadius: 2, background: 'rgba(255,255,255,0.02)' }}>
                                            <Box>
                                                <Typography variant="body2" fontWeight={600}>{c.courses?.name ?? 'Clase'}</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {new Date(c.start_time).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
                                                </Typography>
                                            </Box>
                                            <Chip label={c.status ?? 'scheduled'} size="small"
                                                sx={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa', fontSize: '0.68rem', textTransform: 'capitalize' }} />
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
