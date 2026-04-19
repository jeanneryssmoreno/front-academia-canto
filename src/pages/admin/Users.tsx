import { useState } from 'react'
import {
    Box, Card, CardContent, Typography, Chip, Skeleton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar,
    Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem, TextField,
} from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import { useProfiles, useUpdateRole } from '../../hooks/useProfiles'
import { useSnackbar } from '../../context/SnackbarContext'

const roleConfig = {
    student: { label: 'Estudiante', bg: 'rgba(139,92,246,0.15)', color: '#a78bfa' },
    teacher: { label: 'Profesor', bg: 'rgba(6,182,212,0.12)', color: '#22d3ee' },
    admin: { label: 'Admin', bg: 'rgba(245,158,11,0.12)', color: '#fcd34d' },
}

export default function AdminUsers() {
    const { data: profiles, isLoading } = useProfiles()
    const updateRole = useUpdateRole()
    const { showSnackbar } = useSnackbar()

    const [roleDialog, setRoleDialog] = useState<{ id: string; name: string; currentRole: string } | null>(null)
    const [newRole, setNewRole] = useState('')

    const openRoleDialog = (user: any) => {
        setRoleDialog({ id: user.id, name: user.full_name, currentRole: user.role })
        setNewRole(user.role)
    }

    const handleRoleChange = async () => {
        if (!roleDialog || newRole === roleDialog.currentRole) return
        try {
            await updateRole.mutateAsync({ id: roleDialog.id, role: newRole })
            showSnackbar(`Rol de ${roleDialog.name} cambiado a ${roleConfig[newRole as keyof typeof roleConfig]?.label ?? newRole}`)
            setRoleDialog(null)
        } catch {
            showSnackbar('Error al cambiar el rol', 'error')
        }
    }

    return (
        <Box>
            <Box sx={{ mb: { xs: 2, md: 4 } }}>
                <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.125rem' } }}>Usuarios</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5, fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                    Todos los perfiles registrados en la academia.
                </Typography>
            </Box>

            <Card>
                <CardContent sx={{ p: 0 }}>
                    <Box sx={{ p: 3, pb: 2 }}>
                        <Typography variant="h6" fontWeight={600}>
                            Lista de Usuarios
                            {profiles && (
                                <Chip label={`${profiles.length} registrados`} size="small"
                                    sx={{ ml: 1.5, background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)' }} />
                            )}
                        </Typography>
                    </Box>
                    {isLoading ? (
                        <Box sx={{ p: 3 }}>{[1, 2, 3, 4].map(i => <Skeleton key={i} height={52} sx={{ mb: 1 }} />)}</Box>
                    ) : (profiles?.length ?? 0) === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
                            <PeopleIcon sx={{ fontSize: 52, opacity: 0.3, mb: 2 }} />
                            <Typography variant="body2">No hay usuarios registrados.</Typography>
                        </Box>
                    ) : (
                        <TableContainer sx={{ overflowX: 'auto' }}>
                            <Table sx={{ minWidth: 500 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Usuario</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Rol</TableCell>
                                        <TableCell>Registrado</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {profiles?.map((p) => {
                                        const role = p.role as keyof typeof roleConfig
                                        const cfg = roleConfig[role] ?? roleConfig.student
                                        return (
                                            <TableRow key={p.id} sx={{ '&:hover': { background: 'rgba(139,92,246,0.04)' } }}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                        <Avatar sx={{ width: 34, height: 34, background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', fontSize: '0.8rem' }}>
                                                            {p.full_name?.[0]?.toUpperCase() ?? 'U'}
                                                        </Avatar>
                                                        <Typography variant="body2" fontWeight={600}>{p.full_name}</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" color="text.secondary">{p.email}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label={cfg.label} size="small" sx={{ background: cfg.bg, color: cfg.color, fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer' }}
                                                        onClick={() => openRoleDialog(p)} />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {new Date(p.created_at).toLocaleDateString('es-ES')}
                                                    </Typography>
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

            {/* Role Change Dialog */}
            <Dialog open={!!roleDialog} onClose={() => setRoleDialog(null)} maxWidth="xs" fullWidth
                PaperProps={{ sx: { background: '#0d0d24', border: '1px solid rgba(139,92,246,0.15)' } }}>
                <DialogTitle>Cambiar rol de {roleDialog?.name}</DialogTitle>
                <DialogContent>
                    <TextField label="Nuevo rol" select fullWidth value={newRole} sx={{ mt: 1 }}
                        onChange={e => setNewRole(e.target.value)}>
                        <MenuItem value="student">Estudiante</MenuItem>
                        <MenuItem value="teacher">Profesor</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions sx={{ p: 2.5, pt: 1 }}>
                    <Button onClick={() => setRoleDialog(null)} sx={{ color: 'text.secondary' }}>Cancelar</Button>
                    <Button variant="contained" onClick={handleRoleChange}
                        disabled={updateRole.isPending || newRole === roleDialog?.currentRole}
                        sx={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)' }}>
                        Cambiar rol
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
