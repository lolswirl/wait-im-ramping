import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline"; // Import CssBaseline
import { ReactNode } from "react";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
  components: {
    MuiTableBody: {
      styleOverrides: {
        root: {
          backgroundColor: "#121212",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e1e1e",
        },
      },
    },
    // Add styling for hover effects to customize the transparency and tint behavior
    MuiButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'transparent', // Prevent changing the button background color
            // Additional hover effect styling can be added here
            // You could use the same hover color adjustments as before
          },
        },
      },
    },
  },
});

interface ThemeProps {
  children: ReactNode;
}

export const Theme = ({ children }: ThemeProps) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Ensures global background & text color respects theme */}
      {children}
    </ThemeProvider>
  );
};
