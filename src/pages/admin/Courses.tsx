import { useState } from 'react'
import {
    Box, Card, CardContent, Typography, Button, Chip, Skeleton,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import { useCourses, useCreateCourse, useUpdateCourse, useDeleteCourse } from '../../hooks/useCourses'
import { useSnackbar } from '../../context/SnackbarContext'
import type { Course } from '../../types/database'

const levelColors: Record<string, { bg: string; color: string }> = {
    Principiante: { bg: 'rgba(16,185,129,0.12)', color: '#6ee7b7' },
    Intermedio: { bg: 'rgba(245,158,11,0.12)', color: '#fcd34d' },
    Avanzado: { bg: 'rgba(244,63,94,0.12)', color: '#fda4af' },
}

const emptyForm = { name: '', description: '', level: '' }

export default function AdminCourses() {
    const { data: courses, isLoading } = useCourses()
    const createCourse = useCreateCourse()
    const updateCourse = useUpdateCourse()
    const deleteCourse = useDeleteCourse()
    const { showSnackbar } = useSnackbar()

    const [open, setOpen] = useState(false)
    const [editing, setEditing] = useState<Course | null>(null)
    const [form, setForm] = useState(emptyForm)
    const [deleteId, setDeleteId] = useState<string | null>(null)

    const openCreate = () => {
        setEditing(null)
        setForm(emptyForm)
        setOpen(true)
    }

    const openEdit = (c: Course) => {
        setEditing(c)
        setForm({ name: c.name, description: c.description ?? '', level: c.level ?? '' })
        setOpen(true)
    }

    const handleSubmit = async () => {
        if (!form.name.trim()) return
        try {
            if (editing) {
                await updateCourse.mutateAsync({ id: editing.id, name: form.name, description: form.description || null, level: form.level || null })
                showSnackbar('Curso actualizado')
            } else {
                await createCourse.mutateAsync({ name: form.name, description: form.description || null, level: form.level || null })
                showSnackbar('Curso creado exitosamente')
            }
            setOpen(false)
        } catch {
            showSnackbar('Error al guardar el curso', 'error')
        }
    }

    const handleDelete = async () => {
        if (!deleteId) return
        try {
            await deleteCourse.mutateAsync(deleteId)
            showSnackbar('Curso eliminado')
            setDeleteId(null)
        } catch {
            showSnackbar('Error al eliminar el curso', 'error')
        }
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700}>Cursos</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                        Gestiona el catálogo de cursos de la academia.
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}
                    sx={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', flexShrink: 0 }}>
                    Nuevo Curso
                </Button>
            </Box>

            <Card>
                <CardContent sx={{ p: 0 }}>
                    {isLoading ? (
                        <Box sx={{ p: 3 }}>{[1, 2, 3].map(i => <Skeleton key={i} height={52} sx={{ mb: 1 }} />)}</Box>
                    ) : (courses?.length ?? 0) === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
                            <MenuBookIcon sx={{ fontSize: 52, opacity: 0.3, mb: 2 }} />
                            <Typography variant="body2">No hay cursos registrados.</Typography>
                        </Box>
                    ) : (
                        <TableContainer sx={{ overflowX: 'auto' }}>
                            <Table sx={{ minWidth: 500 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Nombre</TableCell>
                                        <TableCell>Descripción</TableCell>
                                        <TableCell>Nivel</TableCell>
                                        <TableCell>Creado</TableCell>
                                        <TableCell align="right">Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {courses?.map((c) => {
                                        const lvl = levelColors[c.level ?? ''] ?? { bg: 'rgba(139,92,246,0.12)', color: '#a78bfa' }
                                        return (
                                            <TableRow key={c.id} sx={{ '&:hover': { background: 'rgba(139,92,246,0.04)' } }}>
                                                <TableCell><Typography variant="body2" fontWeight={600}>{c.name}</Typography></TableCell>
                                                <TableCell><Typography variant="body2" color="text.secondary" sx={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.description ?? '—'}</Typography></TableCell>
                                                <TableCell>
                                                    {c.level ? (
                                                        <Chip label={c.level} size="small" sx={{ background: lvl.bg, color: lvl.color, border: `1px solid ${lvl.color}30`, fontSize: '0.72rem' }} />
                                                    ) : '—'}
                                                </TableCell>
                                                <TableCell><Typography variant="body2" color="text.secondary">{new Date(c.created_at).toLocaleDateString('es-ES')}</Typography></TableCell>
                                                <TableCell align="right">
                                                    <Tooltip title="Editar">
                                                        <IconButton size="small" onClick={() => openEdit(c)} sx={{ color: 'text.secondary', mr: 0.5 }}>
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Eliminar">
                                                        <IconButton size="small" onClick={() => setDeleteId(c.id)} sx={{ color: '#f43f5e' }}>
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
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
                <DialogTitle>{editing ? 'Editar Curso' : 'Nuevo Curso'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                        <TextField label="Nombre del curso *" fullWidth value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                        <TextField label="Descripción" fullWidth multiline rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                        <TextField label="Nivel" fullWidth placeholder="Principiante, Intermedio, Avanzado" value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))} />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2.5, pt: 1 }}>
                    <Button onClick={() => setOpen(false)} sx={{ color: 'text.secondary' }}>Cancelar</Button>
                    <Button variant="contained" onClick={handleSubmit}
                        disabled={createCourse.isPending || updateCourse.isPending || !form.name.trim()}
                        sx={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)' }}>
                        {editing ? 'Guardar cambios' : 'Crear curso'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirm */}
            <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="xs" fullWidth
                PaperProps={{ sx: { background: '#0d0d24', border: '1px solid rgba(244,63,94,0.2)' } }}>
                <DialogTitle>¿Eliminar curso?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary">Esta acción no se puede deshacer.</Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2.5, pt: 0 }}>
                    <Button onClick={() => setDeleteId(null)} sx={{ color: 'text.secondary' }}>Cancelar</Button>
                    <Button variant="contained" color="error" onClick={handleDelete} disabled={deleteCourse.isPending}>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
