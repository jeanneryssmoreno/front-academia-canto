import {
    Box, Card, CardContent, Typography, Chip, Skeleton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar,
} from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import { useProfiles } from '../../hooks/useProfiles'

const roleConfig = {
    student: { label: 'Estudiante', bg: 'rgba(139,92,246,0.15)', color: '#a78bfa' },
    teacher: { label: 'Profesor', bg: 'rgba(6,182,212,0.12)', color: '#22d3ee' },
    admin: { label: 'Admin', bg: 'rgba(245,158,11,0.12)', color: '#fcd34d' },
}

export default function AdminUsers() {
    const { data: profiles, isLoading } = useProfiles()

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700}>Usuarios</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
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
                        <TableContainer>
                            <Table>
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
                                                    <Chip label={cfg.label} size="small" sx={{ background: cfg.bg, color: cfg.color, fontSize: '0.72rem', fontWeight: 600 }} />
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
        </Box>
    )
}
