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
    Avatar,
} from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import { useAuth } from '../../context/AuthContext'
import { useTeacherClasses } from '../../hooks/useClasses'
import { supabase } from '../../lib/supabaseClient'
import { useQuery } from '@tanstack/react-query'

export default function TeacherStudents() {
    const { profile } = useAuth()
    const { data: classes } = useTeacherClasses(profile?.id)

    const classIds = classes?.map((c: any) => c.id) ?? []

    const { data: enrollments, isLoading } = useQuery({
        queryKey: ['teacher-enrollments', classIds],
        enabled: classIds.length > 0,
        queryFn: async () => {
            const { data, error } = await supabase
                .from('enrollments')
                .select('*, profiles(*), classes(*, courses(name))')
                .in('class_id', classIds)
                .order('enrolled_at', { ascending: false })
            if (error) throw error
            return data
        },
    })

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700}>Mis Alumnos</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                    Estudiantes inscritos en tus clases.
                </Typography>
            </Box>

            <Card>
                <CardContent sx={{ p: 0 }}>
                    <Box sx={{ p: 3, pb: 2 }}>
                        <Typography variant="h6" fontWeight={600}>
                            Lista de Alumnos
                            {enrollments && (
                                <Chip label={`${enrollments.length} inscritos`} size="small"
                                    sx={{ ml: 1.5, background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)' }} />
                            )}
                        </Typography>
                    </Box>
                    {isLoading ? (
                        <Box sx={{ p: 3 }}>
                            {[1, 2, 3].map(i => <Skeleton key={i} height={52} sx={{ mb: 1 }} />)}
                        </Box>
                    ) : classIds.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
                            <PeopleIcon sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
                            <Typography variant="body2">No tienes alumnos aún.</Typography>
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Alumno</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Clase</TableCell>
                                        <TableCell>Inscrito el</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {enrollments?.map((e: any) => (
                                        <TableRow key={e.id} sx={{ '&:hover': { background: 'rgba(139,92,246,0.04)' } }}>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Avatar sx={{ width: 32, height: 32, background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', fontSize: '0.8rem' }}>
                                                        {e.profiles?.full_name?.[0]?.toUpperCase() ?? 'U'}
                                                    </Avatar>
                                                    <Typography variant="body2" fontWeight={600}>{e.profiles?.full_name ?? '—'}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">{e.profiles?.email ?? '—'}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{e.classes?.courses?.name ?? '—'}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {new Date(e.enrolled_at).toLocaleDateString('es-ES')}
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
