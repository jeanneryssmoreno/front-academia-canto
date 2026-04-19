import { useState, useEffect } from 'react'
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Avatar,
    Alert,
    Grid,
    Chip,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import EditIcon from '@mui/icons-material/Edit'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import SchoolIcon from '@mui/icons-material/School'
import ClassIcon from '@mui/icons-material/Class'
import { useAuth } from '../../context/AuthContext'
import { useUpdateProfile } from '../../hooks/useProfiles'
import { useStudentClasses } from '../../hooks/useClasses'
import { useSnackbar } from '../../context/SnackbarContext'

export default function StudentProfile() {
    const { profile, refreshProfile } = useAuth()
    const updateProfile = useUpdateProfile()
    const { data: enrollments, isLoading: loadingClasses } = useStudentClasses(profile?.id)
    const { showSnackbar } = useSnackbar()

    const [editMode, setEditMode] = useState(false)
    const [fullName, setFullName] = useState('')
    const [avatarUrl, setAvatarUrl] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name ?? '')
            setAvatarUrl(profile.avatar_url ?? '')
        }
    }, [profile])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!profile) return
        if (!fullName.trim()) {
            setError('El nombre es obligatorio.')
            return
        }
        setError('')
        try {
            await updateProfile.mutateAsync({
                id: profile.id,
                full_name: fullName.trim(),
                avatar_url: avatarUrl.trim() || null,
            })
            await refreshProfile()
            showSnackbar('Perfil actualizado correctamente')
            setEditMode(false)
        } catch {
            setError('Error al actualizar el perfil.')
        }
    }

    const completedClasses = enrollments?.filter((e: any) => e.classes?.status === 'completed') ?? []
    const upcomingClasses = enrollments?.filter((e: any) => e.classes?.status === 'scheduled') ?? []
    const totalEnrolled = enrollments?.length ?? 0

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: { xs: 2, md: 4 } }}>
                <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.125rem' } }}>
                    Mi Perfil Académico
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                    Información personal y académica
                </Typography>
            </Box>

            <Grid container spacing={{ xs: 2, md: 3 }}>
                {/* Información Personal */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Typography variant="h6" fontWeight={700}>
                                    Información Personal
                                </Typography>
                                {!editMode && (
                                    <Button
                                        size="small"
                                        startIcon={<EditIcon />}
                                        onClick={() => setEditMode(true)}
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        Editar
                                    </Button>
                                )}
                            </Box>

                            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                                <Avatar
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        mb: 2,
                                        background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                                        fontSize: '2.5rem',
                                        fontWeight: 700,
                                    }}
                                    src={avatarUrl}
                                >
                                    {profile?.full_name?.[0]?.toUpperCase() ?? 'E'}
                                </Avatar>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ textTransform: 'capitalize', fontSize: '0.85rem' }}
                                >
                                    {profile?.role ?? 'Estudiante'}
                                </Typography>
                            </Box>

                            {editMode ? (
                                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <TextField
                                        label="Nombre completo"
                                        fullWidth
                                        value={fullName}
                                        onChange={e => setFullName(e.target.value)}
                                        size="small"
                                    />
                                    <TextField
                                        label="URL Avatar (opcional)"
                                        fullWidth
                                        value={avatarUrl}
                                        onChange={e => setAvatarUrl(e.target.value)}
                                        placeholder="https://..."
                                        size="small"
                                        type="url"
                                    />
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            startIcon={<SaveIcon />}
                                            fullWidth
                                            sx={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)' }}
                                        >
                                            Guardar cambios
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            onClick={() => {
                                                setEditMode(false)
                                                setFullName(profile?.full_name ?? '')
                                                setAvatarUrl(profile?.avatar_url ?? '')
                                                setError('')
                                            }}
                                        >
                                            Cancelar
                                        </Button>
                                    </Box>
                                </Box>
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                            NOMBRE
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                                            {profile?.full_name ?? 'Sin asignar'}
                                        </Typography>
                                    </Box>
                                    <Divider />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                            EMAIL
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                                            {profile?.email ?? 'Sin asignar'}
                                        </Typography>
                                    </Box>
                                    <Divider />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                            MIEMBRO DESDE
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                                            {profile?.created_at ? formatDate(profile.created_at) : 'Recientemente'}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Estadísticas */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Grid container spacing={2} sx={{ height: '100%' }}>
                        <Grid size={{ xs: 6, sm: 6 }}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                                    <ClassIcon sx={{ fontSize: 40, color: '#8b5cf6', mb: 1 }} />
                                    <Typography variant="h5" fontWeight={700} sx={{ color: '#8b5cf6' }}>
                                        {totalEnrolled}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Clases Inscritas
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 6 }}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                                    <CheckCircleIcon sx={{ fontSize: 40, color: '#10b981', mb: 1 }} />
                                    <Typography variant="h5" fontWeight={700} sx={{ color: '#10b981' }}>
                                        {completedClasses.length}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Completadas
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                                    <SchoolIcon sx={{ fontSize: 40, color: '#06b6d4', mb: 1 }} />
                                    <Typography variant="h5" fontWeight={700} sx={{ color: '#06b6d4' }}>
                                        {upcomingClasses.length}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Próximas
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Clases Próximas */}
                {upcomingClasses.length > 0 && (
                    <Grid size={{ xs: 12 }}>
                        <Card>
                            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                                    Próximas Clases
                                </Typography>
                                <TableContainer component={Paper} sx={{ background: 'transparent', boxShadow: 'none' }}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow sx={{ borderBottom: '2px solid rgba(139,92,246,0.15)' }}>
                                                <TableCell sx={{ fontWeight: 700, color: '#a78bfa' }}>Curso</TableCell>
                                                <TableCell sx={{ fontWeight: 700, color: '#a78bfa' }}>Profesor</TableCell>
                                                <TableCell sx={{ fontWeight: 700, color: '#a78bfa' }}>Fecha</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {upcomingClasses.slice(0, 5).map((enrollment: any) => (
                                                <TableRow key={enrollment.id} sx={{ '&:hover': { background: 'rgba(139,92,246,0.04)' } }}>
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {enrollment.classes?.courses?.name ?? 'Clase'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {enrollment.classes?.profiles?.full_name ?? 'Sin asignar'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {formatDate(enrollment.classes?.start_time)}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {/* Clases Completadas */}
                {completedClasses.length > 0 && (
                    <Grid size={{ xs: 12 }}>
                        <Card>
                            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                                    Clases Completadas
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {completedClasses.slice(0, 5).map((enrollment: any) => (
                                        <Box
                                            key={enrollment.id}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                p: 1.5,
                                                borderRadius: 1,
                                                background: 'rgba(16,185,129,0.06)',
                                                border: '1px solid rgba(16,185,129,0.15)',
                                            }}
                                        >
                                            <Box>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {enrollment.classes?.courses?.name ?? 'Clase'}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {formatDate(enrollment.classes?.end_time ?? enrollment.classes?.start_time)}
                                                </Typography>
                                            </Box>
                                            <Chip
                                                label="Completada"
                                                size="small"
                                                icon={<CheckCircleIcon />}
                                                sx={{ background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: 'none' }}
                                            />
                                        </Box>
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {/* Sin clases */}
                {!loadingClasses && totalEnrolled === 0 && (
                    <Grid size={{ xs: 12 }}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center', py: 6 }}>
                                <ClassIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.4, mb: 2 }} />
                                <Typography variant="h6" color="text.secondary">
                                    Aún no tienes clases inscritas
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Explora las clases disponibles en el dashboard para inscribirte.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>
        </Box>
    )
}
