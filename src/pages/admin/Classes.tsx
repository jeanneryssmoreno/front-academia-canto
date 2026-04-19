import { useState } from 'react'
import {
    Box, Card, CardContent, Typography, Chip, Skeleton, Button,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    IconButton, Tooltip, MenuItem,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ClassIcon from '@mui/icons-material/Class'
import { useAllClasses, useCreateClass, useUpdateClass, useUpdateClassStatus, useDeleteClass } from '../../hooks/useClasses'
import { useCourses } from '../../hooks/useCourses'
import { useTeachers } from '../../hooks/useProfiles'
import { useSnackbar } from '../../context/SnackbarContext'

const statusConfig = {
    scheduled: { label: 'Programada', bg: 'rgba(139,92,246,0.15)', color: '#a78bfa' },
    completed: { label: 'Completada', bg: 'rgba(16,185,129,0.15)', color: '#6ee7b7' },
    cancelled: { label: 'Cancelada', bg: 'rgba(244,63,94,0.12)', color: '#fda4af' },
}

const emptyForm = { course_id: '', teacher_id: '', start_time: '', end_time: '', meeting_link: '', status: 'scheduled' as const }

export default function AdminClasses() {
    const { data: classes, isLoading } = useAllClasses()
    const { data: courses } = useCourses()
    const { data: teachers } = useTeachers()
    const createClass = useCreateClass()
    const updateClass = useUpdateClass()
    const updateStatus = useUpdateClassStatus()
    const deleteClass = useDeleteClass()
    const { showSnackbar } = useSnackbar()

    const [open, setOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState(emptyForm)
    const [deleteId, setDeleteId] = useState<string | null>(null)

    const openCreate = () => { setEditingId(null); setForm(emptyForm); setOpen(true) }

    const openEdit = (c: any) => {
        setEditingId(c.id)
        setForm({
            course_id: c.course_id ?? '',
            teacher_id: c.teacher_id ?? '',
            start_time: c.start_time?.slice(0, 16) ?? '',
            end_time: c.end_time?.slice(0, 16) ?? '',
            meeting_link: c.meeting_link ?? '',
            status: c.status ?? 'scheduled',
        })
        setOpen(true)
    }

    const handleSubmit = async () => {
        if (!form.course_id || !form.start_time || !form.end_time) return
        try {
            const payload = {
                course_id: form.course_id,
                teacher_id: form.teacher_id || null,
                start_time: new Date(form.start_time).toISOString(),
                end_time: new Date(form.end_time).toISOString(),
                meeting_link: form.meeting_link || null,
                status: form.status as 'scheduled' | 'completed' | 'cancelled',
            }
            if (editingId) {
                await updateClass.mutateAsync({ id: editingId, ...payload })
                showSnackbar('Clase actualizada')
            } else {
                await createClass.mutateAsync(payload)
                showSnackbar('Clase creada exitosamente')
            }
            setOpen(false)
        } catch {
            showSnackbar('Error al guardar la clase', 'error')
        }
    }

    const handleDelete = async () => {
        if (!deleteId) return
        try {
            await deleteClass.mutateAsync(deleteId)
            showSnackbar('Clase eliminada')
            setDeleteId(null)
        } catch {
            showSnackbar('Error al eliminar la clase', 'error')
        }
    }

    const handleStatusChange = async (id: string, status: 'scheduled' | 'completed' | 'cancelled') => {
        try {
            await updateStatus.mutateAsync({ id, status })
            showSnackbar(`Estado cambiado a ${statusConfig[status].label}`)
        } catch {
            showSnackbar('Error al cambiar estado', 'error')
        }
    }

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: { xs: 2, md: 4 }, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.125rem' } }}>Clases</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5, fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                        Gestiona todas las clases de la academia.
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}
                    sx={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', flexShrink: 0 }}>
                    Nueva Clase
                </Button>
            </Box>

            <Card>
                <CardContent sx={{ p: 0 }}>
                    <Box sx={{ p: 3, pb: 2 }}>
                        <Typography variant="h6" fontWeight={600}>
                            Registro de Clases
                            {classes && <Chip label={`${classes.length} clases`} size="small" sx={{ ml: 1.5, background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)' }} />}
                        </Typography>
                    </Box>
                    {isLoading ? (
                        <Box sx={{ p: 3 }}>{[1, 2, 3, 4].map(i => <Skeleton key={i} height={52} sx={{ mb: 1 }} />)}</Box>
                    ) : (classes?.length ?? 0) === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
                            <ClassIcon sx={{ fontSize: 52, opacity: 0.3, mb: 2 }} />
                            <Typography variant="body2">No hay clases registradas.</Typography>
                        </Box>
                    ) : (
                        <TableContainer sx={{ overflowX: 'auto' }}>
                            <Table sx={{ minWidth: 750 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Curso</TableCell>
                                        <TableCell>Profesor</TableCell>
                                        <TableCell>Inicio</TableCell>
                                        <TableCell>Fin</TableCell>
                                        <TableCell>Estado</TableCell>
                                        <TableCell>Enlace</TableCell>
                                        <TableCell align="right">Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {classes?.map((c: any) => {
                                        const status = (c.status ?? 'scheduled') as keyof typeof statusConfig
                                        const cfg = statusConfig[status] ?? statusConfig.scheduled
                                        return (
                                            <TableRow key={c.id} sx={{ '&:hover': { background: 'rgba(139,92,246,0.04)' } }}>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight={600}>{c.courses?.name ?? '—'}</Typography>
                                                    {c.courses?.level && <Typography variant="caption" color="text.secondary">{c.courses.level}</Typography>}
                                                </TableCell>
                                                <TableCell><Typography variant="body2" color="text.secondary">{c.profiles?.full_name ?? '—'}</Typography></TableCell>
                                                <TableCell><Typography variant="body2" color="text.secondary">{formatDate(c.start_time)}</Typography></TableCell>
                                                <TableCell><Typography variant="body2" color="text.secondary">{formatDate(c.end_time)}</Typography></TableCell>
                                                <TableCell>
                                                    <Chip label={cfg.label} size="small" sx={{ background: cfg.bg, color: cfg.color, fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer' }}
                                                        onClick={() => {
                                                            const next = status === 'scheduled' ? 'completed' : status === 'completed' ? 'cancelled' : 'scheduled'
                                                            handleStatusChange(c.id, next)
                                                        }} />
                                                </TableCell>
                                                <TableCell>
                                                    {c.meeting_link ? (
                                                        <a href={c.meeting_link} target="_blank" rel="noopener noreferrer" style={{ color: '#22d3ee', fontSize: '0.8rem' }}>Ver enlace</a>
                                                    ) : '—'}
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Tooltip title="Editar">
                                                        <IconButton size="small" onClick={() => openEdit(c)} sx={{ color: 'text.secondary', mr: 0.5 }}><EditIcon fontSize="small" /></IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Eliminar">
                                                        <IconButton size="small" onClick={() => setDeleteId(c.id)} sx={{ color: '#f43f5e' }}><DeleteIcon fontSize="small" /></IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </CardContent>
            </Card>

            {/* Create/Edit Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth
                PaperProps={{ sx: { background: '#0d0d24', border: '1px solid rgba(139,92,246,0.15)' } }}>
                <DialogTitle>{editingId ? 'Editar Clase' : 'Nueva Clase'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                        <TextField label="Curso *" select fullWidth value={form.course_id}
                            onChange={e => setForm(f => ({ ...f, course_id: e.target.value }))}>
                            {courses?.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
                        </TextField>
                        <TextField label="Profesor" select fullWidth value={form.teacher_id}
                            onChange={e => setForm(f => ({ ...f, teacher_id: e.target.value }))}>
                            <MenuItem value="">Sin asignar</MenuItem>
                            {teachers?.map((t: any) => <MenuItem key={t.id} value={t.id}>{t.full_name}</MenuItem>)}
                        </TextField>
                        <TextField label="Inicio *" type="datetime-local" fullWidth value={form.start_time}
                            onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))}
                            slotProps={{ inputLabel: { shrink: true } }} />
                        <TextField label="Fin *" type="datetime-local" fullWidth value={form.end_time}
                            onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))}
                            slotProps={{ inputLabel: { shrink: true } }} />
                        <TextField label="Enlace de reunión" fullWidth value={form.meeting_link}
                            onChange={e => setForm(f => ({ ...f, meeting_link: e.target.value }))}
                            placeholder="https://meet.google.com/..." />
                        {editingId && (
                            <TextField label="Estado" select fullWidth value={form.status}
                                onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}>
                                <MenuItem value="scheduled">Programada</MenuItem>
                                <MenuItem value="completed">Completada</MenuItem>
                                <MenuItem value="cancelled">Cancelada</MenuItem>
                            </TextField>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2.5, pt: 1 }}>
                    <Button onClick={() => setOpen(false)} sx={{ color: 'text.secondary' }}>Cancelar</Button>
                    <Button variant="contained" onClick={handleSubmit}
                        disabled={createClass.isPending || updateClass.isPending || !form.course_id || !form.start_time || !form.end_time}
                        sx={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)' }}>
                        {editingId ? 'Guardar cambios' : 'Crear clase'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirm */}
            <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="xs" fullWidth
                PaperProps={{ sx: { background: '#0d0d24', border: '1px solid rgba(244,63,94,0.2)' } }}>
                <DialogTitle>¿Eliminar clase?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary">Las inscripciones asociadas también podrían verse afectadas. Esta acción no se puede deshacer.</Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2.5, pt: 0 }}>
                    <Button onClick={() => setDeleteId(null)} sx={{ color: 'text.secondary' }}>Cancelar</Button>
                    <Button variant="contained" color="error" onClick={handleDelete} disabled={deleteClass.isPending}>Eliminar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
