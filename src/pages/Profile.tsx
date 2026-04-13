import { useState, useEffect } from 'react'
import {
    Box, Card, CardContent, Typography, TextField, Button, Avatar, Alert,
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import { useAuth } from '../context/AuthContext'
import { useUpdateProfile } from '../hooks/useProfiles'
import { useSnackbar } from '../context/SnackbarContext'

export default function Profile() {
    const { profile, refreshProfile } = useAuth()
    const updateProfile = useUpdateProfile()
    const { showSnackbar } = useSnackbar()
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
        if (!fullName.trim()) { setError('El nombre es obligatorio.'); return }
        setError('')
        try {
            await updateProfile.mutateAsync({
                id: profile.id,
                full_name: fullName.trim(),
                avatar_url: avatarUrl.trim() || null,
            })
            await refreshProfile()
            showSnackbar('Perfil actualizado correctamente')
        } catch {
            setError('Error al actualizar el perfil.')
        }
    }

    return (
        <Box>
            <Box sx={{ mb: { xs: 2, md: 4 } }}>
                <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.125rem' } }}>
                    Mi Perfil
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5, fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                    Actualiza tu información personal.
                </Typography>
            </Box>

            <Card sx={{ maxWidth: 560 }}>
                <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <Avatar sx={{
                            width: 64, height: 64,
                            background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                            fontSize: '1.5rem', fontWeight: 700,
                        }}>
                            {profile?.full_name?.[0]?.toUpperCase() ?? 'U'}
                        </Avatar>
                        <Box>
                            <Typography variant="h6" fontWeight={600}>{profile?.full_name}</Typography>
                            <Typography variant="body2" color="text.secondary">{profile?.email}</Typography>
                            <Typography variant="caption" sx={{
                                textTransform: 'capitalize', fontWeight: 600,
                                background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            }}>{profile?.role}</Typography>
                        </Box>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <TextField
                            label="Nombre completo" fullWidth required
                            value={fullName} onChange={(e) => setFullName(e.target.value)}
                        />
                        <TextField
                            label="URL del avatar (opcional)" fullWidth
                            value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)}
                            placeholder="https://example.com/avatar.jpg"
                        />
                        <TextField label="Email" fullWidth value={profile?.email ?? ''} disabled />
                        <TextField label="Rol" fullWidth value={profile?.role ?? ''} disabled />
                        <Button
                            type="submit" variant="contained" startIcon={<SaveIcon />}
                            disabled={updateProfile.isPending}
                            sx={{ mt: 1, py: 1.3, background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)' }}
                        >
                            {updateProfile.isPending ? 'Guardando...' : 'Guardar cambios'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    )
}
