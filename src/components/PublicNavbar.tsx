import { useState } from 'react'
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Container,
    IconButton,
    Drawer,
    List,
    ListItemButton,
    ListItemText,
} from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import GraphicEqIcon from '@mui/icons-material/GraphicEq'
import MenuIcon from '@mui/icons-material/Menu'
import { useAuth } from '../context/AuthContext'

const navLinks = ['Curriculum', 'Masterclasses', 'Studio', 'Pricing']

export default function PublicNavbar() {
    const { user, profile } = useAuth()
    const navigate = useNavigate()
    const [mobileOpen, setMobileOpen] = useState(false)

    const getDashboard = () => {
        if (!profile) return '/student/dashboard'
        if (profile.role === 'teacher') return '/teacher/dashboard'
        if (profile.role === 'admin') return '/admin/dashboard'
        return '/student/dashboard'
    }

    return (
        <>
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    background: 'rgba(6, 6, 15, 0.85)',
                    backdropFilter: 'blur(16px)',
                    borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
                }}
            >
                <Container maxWidth="lg">
                    <Toolbar disableGutters sx={{ gap: 2 }}>
                        {/* Logo */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: { xs: 1, md: 0 } }}>
                            <GraphicEqIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                            <Typography
                                variant="h6"
                                fontWeight={800}
                                sx={{
                                    background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Resonance
                            </Typography>
                        </Box>

                        {/* Desktop links */}
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 0.5 }}>
                            {navLinks.map((item) => (
                                <Button
                                    key={item}
                                    sx={{ color: 'text.secondary', '&:hover': { color: 'white' } }}
                                >
                                    {item}
                                </Button>
                            ))}
                        </Box>

                        {/* Auth buttons */}
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                            {user ? (
                                <Button
                                    variant="contained"
                                    onClick={() => navigate(getDashboard())}
                                    sx={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)' }}
                                >
                                    Mi Dashboard
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        component={Link}
                                        to="/login"
                                        sx={{ color: 'text.secondary', '&:hover': { color: 'white' } }}
                                    >
                                        Sign In
                                    </Button>
                                    <Button
                                        variant="contained"
                                        component={Link}
                                        to="/register"
                                        sx={{
                                            background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                                            px: 2.5,
                                        }}
                                    >
                                        Join Academy
                                    </Button>
                                </>
                            )}
                        </Box>

                        {/* Mobile menu */}
                        <IconButton
                            sx={{ display: { md: 'none' }, color: 'text.secondary' }}
                            onClick={() => setMobileOpen(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                PaperProps={{
                    sx: { background: '#0a0a1e', width: 240, p: 2 },
                }}
            >
                <List>
                    {navLinks.map((item) => (
                        <ListItemButton key={item} onClick={() => setMobileOpen(false)}>
                            <ListItemText primary={item} />
                        </ListItemButton>
                    ))}
                    {!user && (
                        <>
                            <ListItemButton component={Link} to="/login" onClick={() => setMobileOpen(false)}>
                                <ListItemText primary="Sign In" />
                            </ListItemButton>
                            <ListItemButton component={Link} to="/register" onClick={() => setMobileOpen(false)}>
                                <ListItemText primary="Join Academy" sx={{ color: 'primary.main' }} />
                            </ListItemButton>
                        </>
                    )}
                </List>
            </Drawer>
        </>
    )
}
