import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
    Box,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    Avatar,
    Divider,
    IconButton,
    AppBar,
    Tooltip,
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ClassIcon from '@mui/icons-material/Class'
import PaymentIcon from '@mui/icons-material/Payment'
import PeopleIcon from '@mui/icons-material/People'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import GraphicEqIcon from '@mui/icons-material/GraphicEq'
import PersonIcon from '@mui/icons-material/Person'
import { useAuth } from '../context/AuthContext'

const DRAWER_WIDTH = 240

const navItems = {
    student: [
        { label: 'Dashboard', icon: <DashboardIcon />, path: '/student/dashboard' },
        { label: 'Mis Clases', icon: <ClassIcon />, path: '/student/classes' },
        { label: 'Mis Pagos', icon: <PaymentIcon />, path: '/student/payments' },
    ],
    teacher: [
        { label: 'Dashboard', icon: <DashboardIcon />, path: '/teacher/dashboard' },
        { label: 'Mis Clases', icon: <ClassIcon />, path: '/teacher/classes' },
        { label: 'Mis Alumnos', icon: <PeopleIcon />, path: '/teacher/students' },
    ],
    admin: [
        { label: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
        { label: 'Cursos', icon: <MenuBookIcon />, path: '/admin/courses' },
        { label: 'Clases', icon: <ClassIcon />, path: '/admin/classes' },
        { label: 'Usuarios', icon: <PeopleIcon />, path: '/admin/users' },
        { label: 'Pagos', icon: <PaymentIcon />, path: '/admin/payments' },
    ],
}

interface Props {
    children: React.ReactNode
}

export default function AppShell({ children }: Props) {
    const { profile, signOut } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const [mobileOpen, setMobileOpen] = useState(false)

    const role = profile?.role ?? 'student'
    const items = navItems[role as keyof typeof navItems] ?? navItems.student

    const handleNav = (path: string) => {
        setMobileOpen(false)
        navigate(path)
    }

    const handleSignOut = async () => {
        await signOut()
        navigate('/login')
    }

    const drawerContent = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Logo */}
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <GraphicEqIcon sx={{ color: 'primary.main', fontSize: 26 }} />
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

            <Divider sx={{ borderColor: 'rgba(139,92,246,0.1)' }} />

            {/* Nav items */}
            <List sx={{ px: 1.5, pt: 2, flex: 1 }}>
                {items.map((item) => {
                    const active = location.pathname === item.path
                    return (
                        <ListItemButton
                            key={item.path}
                            onClick={() => handleNav(item.path)}
                            sx={{
                                borderRadius: 2,
                                mb: 0.5,
                                color: active ? 'primary.light' : 'text.secondary',
                                background: active
                                    ? 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(6,182,212,0.08))'
                                    : 'transparent',
                                border: active ? '1px solid rgba(139,92,246,0.2)' : '1px solid transparent',
                                '&:hover': {
                                    background: 'rgba(139,92,246,0.08)',
                                    color: 'text.primary',
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 36,
                                    color: active ? 'primary.main' : 'text.secondary',
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.label}
                                primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: active ? 600 : 400 }}
                            />
                        </ListItemButton>
                    )
                })}
            </List>

            {/* User info + logout */}
            <Divider sx={{ borderColor: 'rgba(139,92,246,0.1)' }} />
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar
                    sx={{
                        width: 36,
                        height: 36,
                        background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                    }}
                >
                    {profile?.full_name?.[0]?.toUpperCase() ?? 'U'}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={600} noWrap>
                        {profile?.full_name ?? 'Usuario'}
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            color: 'text.secondary',
                            textTransform: 'capitalize',
                            background:
                                role === 'admin'
                                    ? 'linear-gradient(135deg, #f59e0b, #ef4444)'
                                    : role === 'teacher'
                                        ? 'linear-gradient(135deg, #06b6d4, #8b5cf6)'
                                        : 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 600,
                        }}
                    >
                        {role}
                    </Typography>
                </Box>
                <Tooltip title="Cerrar sesión">
                    <IconButton size="small" onClick={handleSignOut} sx={{ color: 'text.secondary' }}>
                        <LogoutIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    )

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* Mobile AppBar */}
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    display: { md: 'none' },
                    background: 'rgba(6,6,15,0.9)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid rgba(139,92,246,0.1)',
                    zIndex: 1201,
                }}
            >
                <Toolbar>
                    <IconButton color="inherit" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <GraphicEqIcon sx={{ color: 'primary.main', mr: 1 }} />
                    <Typography fontWeight={800} sx={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Resonance
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Sidebar - mobile */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        background: '#0a0a1e',
                        borderRight: '1px solid rgba(139,92,246,0.1)',
                    },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Sidebar - desktop */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    width: DRAWER_WIDTH,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        background: '#0a0a1e',
                        borderRight: '1px solid rgba(139,92,246,0.1)',
                    },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Main content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 1.5, sm: 2, md: 4 },
                    pt: { xs: 9, md: 4 },
                    minHeight: '100vh',
                    background: '#06060f',
                    overflow: 'auto',
                }}
            >
                {children}
            </Box>
        </Box>
    )
}
