import { createTheme, ThemeProvider as MuiThemeProvider, PaletteMode } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useThemeContext } from '../../context/ThemeContext.tsx';

declare module '@mui/material/styles' {
    interface Theme {
        custom: {
            chart: {
                gridColor: string;
            };
        };
    }
    
    interface ThemeOptions {
        custom?: {
            chart?: {
                gridColor?: string;
            };
        };
    }
}

const Theme = ({ children }: { children: React.ReactNode }) => {
    const { themeMode } = useThemeContext();

    const theme = createTheme({
        palette: {
            mode: themeMode as PaletteMode,
        },
        custom: {
            chart: {
                gridColor: themeMode === 'dark' ? '#494949' : '#c4c4c4',
            },
        },
        components: {
            MuiTableBody: {
                styleOverrides: {
                    root: {
                        backgroundColor: themeMode === 'dark' ? '#121212' : '#f5f5f5',
                    },
                },
            },
            MuiTableRow: {
                styleOverrides: {
                    root: {
                        backgroundColor: themeMode === 'dark' ? '#1e1e1e' : '#e0e0e0',
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        '&:hover': {
                            backgroundColor: 'transparent',
                        },
                    },
                },
            },
        },
    });

    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </MuiThemeProvider>
    );
};

export default Theme;
