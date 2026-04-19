import { useState } from 'react'
import {
    Box, Card, CardContent, Typography, Chip, Skeleton, Button, Grid,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
} from '@mui/material'
import PaymentIcon from '@mui/icons-material/Payment'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AddIcon from '@mui/icons-material/Add'
import { useAllPayments, useMarkPaymentPaid, useCreatePayment } from '../../hooks/usePayments'
import { useStudents } from '../../hooks/useProfiles'
import { useSnackbar } from '../../context/SnackbarContext'

export default function AdminPayments() {
    const { data: payments, isLoading } = useAllPayments()
    const { data: students } = useStudents()
    const markPaid = useMarkPaymentPaid()
    const createPayment = useCreatePayment()
    const { showSnackbar } = useSnackbar()

    const [open, setOpen] = useState(false)
    const [form, setForm] = useState({ student_id: '', amount: '', due_date: '' })

    const total = payments?.reduce((sum: number, p: any) => sum + Number(p.amount), 0) ?? 0
    const paid = payments?.filter((p: any) => p.status === 'paid').reduce((sum: number, p: any) => sum + Number(p.amount), 0) ?? 0
    const pending = payments?.filter((p: any) => p.status === 'pending').reduce((sum: number, p: any) => sum + Number(p.amount), 0) ?? 0

    const handleCreate = async () => {
        if (!form.student_id || !form.amount || !form.due_date) return
        try {
            await createPayment.mutateAsync({
                student_id: form.student_id,
                amount: Number(form.amount),
                due_date: form.due_date,
                status: 'pending',
            })
            showSnackbar('Pago creado exitosamente')
            setOpen(false)
            setForm({ student_id: '', amount: '', due_date: '' })
        } catch {
            showSnackbar('Error al crear el pago', 'error')
        }
    }

    const handleMarkPaid = async (id: string) => {
        try {
            await markPaid.mutateAsync(id)
            showSnackbar('Pago marcado como pagado')
        } catch {
            showSnackbar('Error al marcar el pago', 'error')
        }
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: { xs: 2, md: 4 }, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.125rem' } }}>Pagos</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5, fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                        Gestión de cobros y pagos de todos los estudiantes.
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}
                    sx={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', flexShrink: 0 }}>
                    Nuevo Pago
                </Button>
            </Box>

            {/* Summary */}
            <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 2, md: 4 } }}>
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
                        <TableContainer sx={{ overflowX: 'auto' }}>
                            <Table sx={{ minWidth: 650 }}>
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
                                                        onClick={() => handleMarkPaid(p.id)}
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

            {/* Create Payment Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth
                PaperProps={{ sx: { background: '#0d0d24', border: '1px solid rgba(139,92,246,0.15)' } }}>
                <DialogTitle>Nuevo Pago</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                        <TextField label="Estudiante *" select fullWidth value={form.student_id}
                            onChange={e => setForm(f => ({ ...f, student_id: e.target.value }))}>
                            {students?.map(s => <MenuItem key={s.id} value={s.id}>{s.full_name} — {s.email}</MenuItem>)}
                        </TextField>
                        <TextField label="Monto ($) *" type="number" fullWidth value={form.amount}
                            onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                            slotProps={{ htmlInput: { min: 0, step: '0.01' } }} />
                        <TextField label="Fecha de vencimiento *" type="date" fullWidth value={form.due_date}
                            onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
                            slotProps={{ inputLabel: { shrink: true } }} />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2.5, pt: 1 }}>
                    <Button onClick={() => setOpen(false)} sx={{ color: 'text.secondary' }}>Cancelar</Button>
                    <Button variant="contained" onClick={handleCreate}
                        disabled={createPayment.isPending || !form.student_id || !form.amount || !form.due_date}
                        sx={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)' }}>
                        Crear pago
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
