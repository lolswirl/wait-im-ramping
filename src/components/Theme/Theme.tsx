"use client"
import { createTheme, ThemeProvider as MuiThemeProvider, PaletteMode } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useIsNonProd } from "@lib/betaModeClient";
import { useThemeContext } from '../../context/ThemeContext';
import { RAINBOW_COLORS } from '@components/Buttons/RainbowCard';

const THEME_COLORS = {
    nonProd: RAINBOW_COLORS[3],
    darkPrimary: RAINBOW_COLORS[0],
    lightPrimary: "#1976d2",
    chart: {
        dark: "#494949",
        light: "#c4c4c4",
    },
    tableHead: {
        dark: "#1e1e1e",
        light: "#f5f5f5",
    },
    tableBody: {
        dark: "#121212",
        light: "#e0e0e0",
    },
};

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
                    ? THEME_COLORS.nonProd 
                    : themeMode === 'dark' 
                        ? THEME_COLORS.darkPrimary 
                        : THEME_COLORS.lightPrimary,
            }
        },
        custom: {
            chart: {
                gridColor: themeMode === 'dark' ? THEME_COLORS.chart.dark : THEME_COLORS.chart.light,
            },
        },
        typography: {
            allVariants: {
                textTransform: 'lowercase' as const,
            },
        },
        components: {
            MuiTableHead: {
                styleOverrides: {
                    root: {
                        backgroundColor: themeMode === 'dark' ? THEME_COLORS.tableHead.dark : THEME_COLORS.tableHead.light,
                    },
                },
            },
            MuiTableBody: {
                styleOverrides: {
                    root: {
                        backgroundColor: themeMode === 'dark' ? THEME_COLORS.tableBody.dark : THEME_COLORS.tableBody.light,
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
