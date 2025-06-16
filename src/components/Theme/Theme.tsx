import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useThemeContext } from '../../context/ThemeContext.tsx';

const Theme = ({ children }: { children: React.ReactNode }) => {
  const { themeMode } = useThemeContext();

  const theme = createTheme({
    palette: {
      mode: themeMode,
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
