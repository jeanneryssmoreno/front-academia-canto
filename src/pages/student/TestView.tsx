import { Box, Typography, Card, CardContent } from '@mui/material'
import { useAuth } from '../../context/AuthContext'

export default function TestView() {
    const { profile } = useAuth()

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h3" sx={{ mb: 3, color: 'primary.main' }}>
                ✅ Vista de Prueba Funcionando
            </Typography>

            <Card>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Información del Perfil:
                    </Typography>
                    <Typography>Nombre: {profile?.full_name || 'No disponible'}</Typography>
                    <Typography>Email: {profile?.email || 'No disponible'}</Typography>
                    <Typography>Rol: {profile?.role || 'No disponible'}</Typography>
                    <Typography>ID: {profile?.id || 'No disponible'}</Typography>
                </CardContent>
            </Card>

            <Box sx={{ mt: 3, p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
                <Typography variant="body1" sx={{ color: 'success.dark' }}>
                    Si ves este mensaje, el enrutamiento está funcionando correctamente.
                </Typography>
            </Box>
        </Box>
    )
}
