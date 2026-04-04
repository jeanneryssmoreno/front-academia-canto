import {
    Box, Card, CardContent, Typography, Chip, Skeleton, Button, Grid,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material'
import PaymentIcon from '@mui/icons-material/Payment'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useAllPayments, useMarkPaymentPaid } from '../../hooks/usePayments'

export default function AdminPayments() {
    const { data: payments, isLoading } = useAllPayments()
    const markPaid = useMarkPaymentPaid()

    const total = payments?.reduce((sum: number, p: any) => sum + Number(p.amount), 0) ?? 0
    const paid = payments?.filter((p: any) => p.status === 'paid').reduce((sum: number, p: any) => sum + Number(p.amount), 0) ?? 0
    const pending = payments?.filter((p: any) => p.status === 'pending').reduce((sum: number, p: any) => sum + Number(p.amount), 0) ?? 0

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700}>Pagos</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                    Gestión de cobros y pagos de todos los estudiantes.
                </Typography>
            </Box>

            {/* Summary */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {[
                    { label: 'Total facturado', value: total, color: '#8b5cf6', icon: <PaymentIcon /> },
                    { label: 'Cobrado', value: paid, color: '#10b981', icon: <CheckCircleIcon /> },
                    { label: 'Por cobrar', value: pending, color: '#f59e0b', icon: <PaymentIcon /> },
                ].map((s) => (
                    <Grid size={{ xs: 12, sm: 4 }} key={s.label}>
                        <Card>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                                    <Box sx={{ width: 38, height: 38, borderRadius: 2, background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                                        {s.icon}
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">{s.label}</Typography>
                                </Box>
                                {isLoading ? <Skeleton width={80} height={36} /> : (
                                    <Typography variant="h4" fontWeight={700} sx={{ color: s.color }}>${s.value.toFixed(2)}</Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Table */}
            <Card>
                <CardContent sx={{ p: 0 }}>
                    <Box sx={{ p: 3, pb: 2 }}>
                        <Typography variant="h6" fontWeight={600}>Todos los Pagos</Typography>
                    </Box>
                    {isLoading ? (
                        <Box sx={{ p: 3 }}>{[1, 2, 3, 4].map(i => <Skeleton key={i} height={52} sx={{ mb: 1 }} />)}</Box>
                    ) : (payments?.length ?? 0) === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
                            <PaymentIcon sx={{ fontSize: 52, opacity: 0.3, mb: 2 }} />
                            <Typography variant="body2">No hay pagos registrados.</Typography>
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Estudiante</TableCell>
                                        <TableCell>Monto</TableCell>
                                        <TableCell>Estado</TableCell>
                                        <TableCell>Vencimiento</TableCell>
                                        <TableCell>Pagado el</TableCell>
                                        <TableCell align="right">Acción</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {payments?.map((p: any) => (
                                        <TableRow key={p.id} sx={{ '&:hover': { background: 'rgba(139,92,246,0.04)' } }}>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={600}>{p.profiles?.full_name ?? '—'}</Typography>
                                                <Typography variant="caption" color="text.secondary">{p.profiles?.email ?? ''}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={700}>${Number(p.amount).toFixed(2)}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={p.status === 'paid' ? 'Pagado' : 'Pendiente'}
                                                    size="small"
                                                    sx={p.status === 'paid'
                                                        ? { background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.25)', fontSize: '0.72rem' }
                                                        : { background: 'rgba(245,158,11,0.15)', color: '#fcd34d', border: '1px solid rgba(245,158,11,0.25)', fontSize: '0.72rem' }}
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
                                            <TableCell align="right">
                                                {p.status === 'pending' && (
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        disabled={markPaid.isPending}
                                                        onClick={() => markPaid.mutate(p.id)}
                                                        sx={{ borderColor: '#10b981', color: '#10b981', fontSize: '0.75rem', '&:hover': { borderColor: '#10b981', background: 'rgba(16,185,129,0.08)' } }}
                                                    >
                                                        Marcar pagado
                                                    </Button>
                                                )}
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
