import { useState } from 'react'
import {
    Box, Grid, Card, CardContent, Typography, Chip, Skeleton, Link as MuiLink,
    Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
} from '@mui/material'
import ClassIcon from '@mui/icons-material/Class'
import VideoCallIcon from '@mui/icons-material/VideoCall'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import { useAuth } from '../../context/AuthContext'
import { useTeacherClasses, useCreateClass, useUpdateClass, useUpdateClassStatus } from '../../hooks/useClasses'
import { useCourses } from '../../hooks/useCourses'
import { useSnackbar } from '../../context/SnackbarContext'

const statusConfig = {
    scheduled: { label: 'Programada', bg: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: 'rgba(139,92,246,0.25)' },
    completed: { label: 'Completada', bg: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: 'rgba(16,185,129,0.25)' },
    cancelled: { label: 'Cancelada', bg: 'rgba(244,63,94,0.12)', color: '#fda4af', border: 'rgba(244,63,94,0.2)' },
}

const emptyForm = { course_id: '', start_time: '', end_time: '', meeting_link: '' }

export default function TeacherClasses() {
    const { profile } = useAuth()
    const { data: classes, isLoading } = useTeacherClasses(profile?.id)
    const { data: courses } = useCourses()
    const createClass = useCreateClass()
    const updateClass = useUpdateClass()
    const updateStatus = useUpdateClassStatus()
    const { showSnackbar } = useSnackbar()

    const [open, setOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState(emptyForm)

    const openCreate = () => { setEditingId(null); setForm(emptyForm); setOpen(true) }

    const openEdit = (c: any) => {
        setEditingId(c.id)
        setForm({
            course_id: c.course_id ?? '',
            start_time: c.start_time?.slice(0, 16) ?? '',
            end_time: c.end_time?.slice(0, 16) ?? '',
            meeting_link: c.meeting_link ?? '',
        })
        setOpen(true)
    }

    const handleSubmit = async () => {
        if (!form.course_id || !form.start_time || !form.end_time || !profile?.id) return
        try {
            const payload = {
                course_id: form.course_id,
                teacher_id: profile.id,
                start_time: new Date(form.start_time).toISOString(),
                end_time: new Date(form.end_time).toISOString(),
                meeting_link: form.meeting_link || null,
                status: 'scheduled' as const,
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

    const handleStatusToggle = async (id: string, current: string) => {
        const next = current === 'scheduled' ? 'completed' : current === 'completed' ? 'cancelled' : 'scheduled'
        try {
            await updateStatus.mutateAsync({ id, status: next as any })
            showSnackbar(`Estado cambiado a ${statusConfig[next as keyof typeof statusConfig].label}`)
        } catch {
            showSnackbar('Error al cambiar estado', 'error')
        }
    }

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('es-ES', {
            weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
        })

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: { xs: 2, md: 4 }, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.125rem' } }}>Mis Clases</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5, fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                        Todas las clases asignadas a ti.
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}
                    sx={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', flexShrink: 0 }}>
                    Nueva Clase
                </Button>
            </Box>

            {isLoading ? (
                <Grid container spacing={3}>
                    {[1, 2, 3].map(i => (
                        <Grid size={{ xs: 12, md: 6 }} key={i}>
                            <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 2 }} />
                        </Grid>
                    ))}
                </Grid>
            ) : (classes?.length ?? 0) === 0 ? (
                <Card>
                    <CardContent sx={{ py: 8, textAlign: 'center' }}>
                        <ClassIcon sx={{ fontSize: 56, color: 'text.secondary', opacity: 0.4, mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">No tienes clases asignadas.</Typography>
                    </CardContent>
                </Card>
            ) : (
                <Grid container spacing={3}>
                    {classes?.map((c: any) => {
                        const status = (c.status ?? 'scheduled') as keyof typeof statusConfig
                        const cfg = statusConfig[status] ?? statusConfig.scheduled
                        return (
                            <Grid size={{ xs: 12, md: 6 }} key={c.id}>
                                <Card sx={{ transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                            <Box>
                                                <Typography variant="h6" fontWeight={600}>{c.courses?.name ?? 'Clase'}</Typography>
                                                {c.courses?.level && (
                                                    <Chip label={c.courses.level} size="small" sx={{ mt: 0.5, background: 'rgba(6,182,212,0.12)', color: '#22d3ee', border: '1px solid rgba(6,182,212,0.2)', fontSize: '0.7rem' }} />
                                                )}
                                            </Box>
                                            <Chip label={cfg.label} size="small"
                                                sx={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, fontWeight: 600, cursor: 'pointer' }}
                                                onClick={() => handleStatusToggle(c.id, status)} />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                            Inicio: {formatDate(c.start_time)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Fin: {formatDate(c.end_time)}
                                        </Typography>
                                        {c.meeting_link && status === 'scheduled' && (
                                            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(139,92,246,0.1)' }}>
                                                <MuiLink href={c.meeting_link} target="_blank" rel="noopener noreferrer"
                                                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'secondary.light', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', '&:hover': { color: 'secondary.main' } }}>
                                                    <VideoCallIcon sx={{ fontSize: 18 }} /> Abrir enlace de clase
                                                </MuiLink>
                                            </Box>
                                        )}
                                        <Button size="small" startIcon={<EditIcon />} onClick={() => openEdit(c)}
                                            sx={{ mt: 1.5, color: 'text.secondary', fontSize: '0.75rem' }}>
                                            Editar
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )
                    })}
                </Grid>
            )}

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
                        <TextField label="Inicio *" type="datetime-local" fullWidth value={form.start_time}
                            onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))}
                            slotProps={{ inputLabel: { shrink: true } }} />
                        <TextField label="Fin *" type="datetime-local" fullWidth value={form.end_time}
                            onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))}
                            slotProps={{ inputLabel: { shrink: true } }} />
                        <TextField label="Enlace de reunión" fullWidth value={form.meeting_link}
                            onChange={e => setForm(f => ({ ...f, meeting_link: e.target.value }))}
                            placeholder="https://meet.google.com/..." />
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
        </Box>
    )
}
