import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Grid,
} from '@mui/material'
import PaymentIcon from '@mui/icons-material/Payment'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningIcon from '@mui/icons-material/Warning'
import { useAuth } from '../../context/AuthContext'
import { useStudentPayments } from '../../hooks/usePayments'

export default function StudentPayments() {
    const { profile } = useAuth()
    const { data: payments, isLoading } = useStudentPayments(profile?.id)

    const total = payments?.reduce((sum: number, p: any) => sum + Number(p.amount), 0) ?? 0
    const paid = payments?.filter((p: any) => p.status === 'paid').reduce((sum: number, p: any) => sum + Number(p.amount), 0) ?? 0
    const pending = payments?.filter((p: any) => p.status === 'pending').reduce((sum: number, p: any) => sum + Number(p.amount), 0) ?? 0

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700}>
                    Mis Pagos
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                    Historial completo de pagos y saldos pendientes.
                </Typography>
            </Box>

            {/* Summary cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Card>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                <PaymentIcon sx={{ color: '#8b5cf6' }} />
                                <Typography variant="body2" color="text.secondary">Total cobrado</Typography>
                            </Box>
                            {isLoading ? <Skeleton width={80} height={36} /> : (
                                <Typography variant="h4" fontWeight={700}>${total.toFixed(2)}</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Card>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                <CheckCircleIcon sx={{ color: '#10b981' }} />
                                <Typography variant="body2" color="text.secondary">Pagado</Typography>
                            </Box>
                            {isLoading ? <Skeleton width={80} height={36} /> : (
                                <Typography variant="h4" fontWeight={700} sx={{ color: '#10b981' }}>${paid.toFixed(2)}</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Card>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                <WarningIcon sx={{ color: '#f59e0b' }} />
                                <Typography variant="body2" color="text.secondary">Pendiente</Typography>
                            </Box>
                            {isLoading ? <Skeleton width={80} height={36} /> : (
                                <Typography variant="h4" fontWeight={700} sx={{ color: '#f59e0b' }}>${pending.toFixed(2)}</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Table */}
            <Card>
                <CardContent sx={{ p: 0 }}>
                    <Box sx={{ p: 3, pb: 2 }}>
                        <Typography variant="h6" fontWeight={600}>Historial de Pagos</Typography>
                    </Box>
                    {isLoading ? (
                        <Box sx={{ p: 3 }}>
                            {[1, 2, 3].map(i => <Skeleton key={i} height={52} sx={{ mb: 1 }} />)}
                        </Box>
                    ) : (payments?.length ?? 0) === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
                            <PaymentIcon sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
                            <Typography variant="body2">No hay registros de pagos.</Typography>
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Monto</TableCell>
                                        <TableCell>Estado</TableCell>
                                        <TableCell>Fecha de vencimiento</TableCell>
                                        <TableCell>Fecha de pago</TableCell>
                                        <TableCell>Creado</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {payments?.map((p: any) => (
                                        <TableRow
                                            key={p.id}
                                            sx={{ '&:hover': { background: 'rgba(139,92,246,0.04)' } }}
                                        >
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={600}>
                                                    ${Number(p.amount).toFixed(2)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={p.status === 'paid' ? 'Pagado' : 'Pendiente'}
                                                    size="small"
                                                    sx={
                                                        p.status === 'paid'
                                                            ? { background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.25)', fontSize: '0.72rem' }
                                                            : { background: 'rgba(245,158,11,0.15)', color: '#fcd34d', border: '1px solid rgba(245,158,11,0.25)', fontSize: '0.72rem' }
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {new Date(p.due_date).toLocaleDateString('es-ES')}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {p.paid_at ? new Date(p.paid_at).toLocaleDateString('es-ES') : '—'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {new Date(p.created_at).toLocaleDateString('es-ES')}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </CardContent>
            </Card>
        </Box>
    )
}
