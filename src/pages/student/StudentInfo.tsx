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
    Divider,
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import EditIcon from '@mui/icons-material/Edit'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import SchoolIcon from '@mui/icons-material/School'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useAuth } from '../../context/AuthContext'
import { useUpdateProfile } from '../../hooks/useProfiles'
import { useStudentClasses } from '../../hooks/useClasses'
import { useSnackbar } from '../../context/SnackbarContext'

export default function StudentInfo() {
    const { profile, refreshProfile } = useAuth()
    const updateProfile = useUpdateProfile()
    const { data: enrollments, isLoading } = useStudentClasses(profile?.id)
    const { showSnackbar } = useSnackbar()

    const [editMode, setEditMode] = useState(false)
    const [fullName, setFullName] = useState('')
    const [phone, setPhone] = useState('')
    const [avatarUrl, setAvatarUrl] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name || '')
            setPhone(profile.phone || '')
            setAvatarUrl(profile.avatar_url || '')
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
                phone: phone.trim() || null,
                avatar_url: avatarUrl.trim() || null,
            })
            await refreshProfile()
            showSnackbar('Información actualizada correctamente')
            setEditMode(false)
        } catch {
            setError('Error al actualizar la información.')
        }
    }

    const completedClasses = enrollments?.filter((e: any) => e.classes?.status === 'completed')?.length ?? 0
    const upcomingClasses = enrollments?.filter((e: any) => e.classes?.status === 'scheduled')?.length ?? 0
    const totalEnrolled = enrollments?.length ?? 0

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: { xs: 3, md: 4 } }}>
                <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.125rem' } }}>
                    Mi Información
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                    Información personal y estadísticas académicas
                </Typography>
            </Box>

            <Grid container spacing={{ xs: 2, md: 3 }}>
                {/* Información Personal */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Card>
                        <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                                <Typography variant="h6" fontWeight={700}>
                                    Información Personal
                                </Typography>
                                {!editMode && (
                                    <Button
                                        size="small"
                                        startIcon={<EditIcon />}
                                        onClick={() => setEditMode(true)}
                                        sx={{ color: 'primary.light' }}
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
                                    src={avatarUrl || profile?.avatar_url || undefined}
                                >
                                    {profile?.full_name?.[0]?.toUpperCase() || 'E'}
                                </Avatar>
                                <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
                                    {profile?.full_name || 'Usuario'}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        px: 2,
                                        py: 0.5,
                                        borderRadius: 2,
                                        background: 'rgba(139,92,246,0.15)',
                                        color: '#8b5cf6',
                                        textTransform: 'capitalize',
                                        fontWeight: 600,
                                    }}
                                >
                                    {profile?.role || 'Estudiante'}
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
                                        label="Teléfono"
                                        fullWidth
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        placeholder="+1 234 567 8900"
                                        size="small"
                                        type="tel"
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
                                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
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
                                                setFullName(profile?.full_name || '')
                                                setPhone(profile?.phone || '')
                                                setAvatarUrl(profile?.avatar_url || '')
                                                setError('')
                                            }}
                                        >
                                            Cancelar
                                        </Button>
                                    </Box>
                                </Box>
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <EmailIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                                EMAIL
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 0.3 }}>
                                                {profile?.email || 'Sin asignar'}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Divider sx={{ borderColor: 'rgba(139,92,246,0.1)' }} />

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <PhoneIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                                TELÉFONO
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 0.3 }}>
                                                {profile?.phone || 'No registrado'}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Divider sx={{ borderColor: 'rgba(139,92,246,0.1)' }} />

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <CalendarTodayIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                                MIEMBRO DESDE
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 0.3 }}>
                                                {profile?.created_at
                                                    ? new Date(profile.created_at).toLocaleDateString('es-ES', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                    })
                                                    : 'Recientemente'}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Divider sx={{ borderColor: 'rgba(139,92,246,0.1)' }} />

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <SchoolIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                                ROL
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 0.3, textTransform: 'capitalize' }}>
                                                {profile?.role || 'Estudiante'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Estadísticas */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ mb: 2 }}>
                        <CardContent sx={{ textAlign: 'center', p: 2.5 }}>
                            <SchoolIcon sx={{ fontSize: 48, color: '#8b5cf6', mb: 1.5 }} />
                            <Typography variant="h4" fontWeight={700} sx={{ color: '#8b5cf6', mb: 0.5 }}>
                                {isLoading ? '...' : totalEnrolled}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Clases Inscritas
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card sx={{ mb: 2 }}>
                        <CardContent sx={{ textAlign: 'center', p: 2.5 }}>
                            <CheckCircleIcon sx={{ fontSize: 48, color: '#10b981', mb: 1.5 }} />
                            <Typography variant="h4" fontWeight={700} sx={{ color: '#10b981', mb: 0.5 }}>
                                {isLoading ? '...' : completedClasses}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Completadas
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent sx={{ textAlign: 'center', p: 2.5 }}>
                            <CalendarTodayIcon sx={{ fontSize: 48, color: '#06b6d4', mb: 1.5 }} />
                            <Typography variant="h4" fontWeight={700} sx={{ color: '#06b6d4', mb: 0.5 }}>
                                {isLoading ? '...' : upcomingClasses}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Próximas
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}
