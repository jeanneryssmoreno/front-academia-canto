import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#8b5cf6',
            light: '#a78bfa',
            dark: '#7c3aed',
        },
        secondary: {
            main: '#06b6d4',
            light: '#22d3ee',
            dark: '#0891b2',
        },
        background: {
            default: '#06060f',
            paper: '#0d0d24',
        },
        text: {
            primary: '#f1f5f9',
            secondary: '#94a3b8',
        },
        success: { main: '#10b981' },
        error: { main: '#f43f5e' },
        warning: { main: '#f59e0b' },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontWeight: 800, letterSpacing: '-0.02em' },
        h2: { fontWeight: 700, letterSpacing: '-0.01em' },
        h3: { fontWeight: 700 },
        h4: { fontWeight: 600 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
    },
    shape: { borderRadius: 12 },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#8b5cf6 #06060f',
                    '&::-webkit-scrollbar': { width: '8px' },
                    '&::-webkit-scrollbar-track': { background: '#06060f' },
                    '&::-webkit-scrollbar-thumb': {
                        background: '#8b5cf6',
                        borderRadius: '4px',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none' as const,
                    fontWeight: 600,
                    borderRadius: 8,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    borderRadius: 16,
                    border: '1px solid rgba(139, 92, 246, 0.12)',
                    background: '#0d0d24',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: { backgroundImage: 'none' },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': { borderRadius: 10 },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: { borderRadius: 8 },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottomColor: 'rgba(139, 92, 246, 0.08)',
                },
                head: {
                    fontWeight: 600,
                    color: '#94a3b8',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.08em',
                },
            },
        },
    },
})
