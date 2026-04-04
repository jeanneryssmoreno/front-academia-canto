import {
    Box, Card, CardContent, Typography, Chip, Skeleton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material'
import ClassIcon from '@mui/icons-material/Class'
import { useAllClasses } from '../../hooks/useClasses'

const statusConfig = {
    scheduled: { label: 'Programada', bg: 'rgba(139,92,246,0.15)', color: '#a78bfa' },
    completed: { label: 'Completada', bg: 'rgba(16,185,129,0.15)', color: '#6ee7b7' },
    cancelled: { label: 'Cancelada', bg: 'rgba(244,63,94,0.12)', color: '#fda4af' },
}

export default function AdminClasses() {
    const { data: classes, isLoading } = useAllClasses()

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700}>Clases</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                    Todas las clases programadas en la academia.
                </Typography>
            </Box>

            <Card>
                <CardContent sx={{ p: 0 }}>
                    <Box sx={{ p: 3, pb: 2 }}>
                        <Typography variant="h6" fontWeight={600}>
                            Registro de Clases
                            {classes && (
                                <Chip label={`${classes.length} clases`} size="small"
                                    sx={{ ml: 1.5, background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)' }} />
                            )}
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
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Curso</TableCell>
                                        <TableCell>Profesor</TableCell>
                                        <TableCell>Inicio</TableCell>
                                        <TableCell>Fin</TableCell>
                                        <TableCell>Estado</TableCell>
                                        <TableCell>Enlace</TableCell>
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
                                                    {c.courses?.level && (
                                                        <Typography variant="caption" color="text.secondary">{c.courses.level}</Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" color="text.secondary">{c.profiles?.full_name ?? '—'}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" color="text.secondary">{formatDate(c.start_time)}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" color="text.secondary">{formatDate(c.end_time)}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label={cfg.label} size="small" sx={{ background: cfg.bg, color: cfg.color, fontSize: '0.72rem', fontWeight: 600 }} />
                                                </TableCell>
                                                <TableCell>
                                                    {c.meeting_link ? (
                                                        <a href={c.meeting_link} target="_blank" rel="noopener noreferrer"
                                                            style={{ color: '#22d3ee', fontSize: '0.8rem' }}>
                                                            Ver enlace
                                                        </a>
                                                    ) : '—'}
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
