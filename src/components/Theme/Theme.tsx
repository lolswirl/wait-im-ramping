"use client"
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useIsNonProd } from "@lib/betaModeClient";
import { RAINBOW_COLORS } from '@components/Buttons/RainbowCard';

const THEME_COLORS = {
    nonProd: RAINBOW_COLORS[3],
    primary: RAINBOW_COLORS[0],
    chart: "#494949",
    tableHead: "#1e1e1e",
    tableBody: "#121212",
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
    const isNonProd = useIsNonProd();

    const theme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: isNonProd ? THEME_COLORS.nonProd : THEME_COLORS.primary,
            }
        },
        custom: {
            chart: {
                gridColor: THEME_COLORS.chart,
            },
        },
        typography: {
            fontFamily: 'inherit',
            allVariants: {
                textTransform: 'lowercase' as const,
            },
        },
        components: {
            MuiTableHead: {
                styleOverrides: {
                    root: {
                        backgroundColor: THEME_COLORS.tableHead,
                    },
                },
            },
            MuiTableBody: {
                styleOverrides: {
                    root: {
                        backgroundColor: THEME_COLORS.tableBody,
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
