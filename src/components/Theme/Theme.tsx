"use client"
import { createTheme, ThemeProvider as MuiThemeProvider, PaletteMode } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useIsNonProd } from "@lib/betaModeClient";
import { useThemeContext } from '../../context/ThemeContext';

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
    const isNonProd = useIsNonProd();

    const theme = createTheme({
        palette: {
            mode: themeMode as PaletteMode,
            primary: {
                main: isNonProd 
                    ? "#ff7700ff" 
                    : themeMode === 'dark' 
                        ? "#90caf9" 
                        : "#1976d2",
            }
        },
        custom: {
            chart: {
                gridColor: themeMode === 'dark' ? '#494949' : '#c4c4c4',
            },
        },
        components: {
            MuiTableHead: {
                styleOverrides: {
                    root: {
                        backgroundColor: themeMode === 'dark' ? '#1e1e1e' : '#f5f5f5',
                    },
                },
            },
            MuiTableBody: {
                styleOverrides: {
                    root: {
                        backgroundColor: themeMode === 'dark' ? '#121212' : '#e0e0e0',
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
