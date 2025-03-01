import { createTheme, ThemeProvider } from "@mui/material/styles";
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
  },
});


interface ThemeProps {
  children: ReactNode;
}

export const Theme = ({ children }: ThemeProps) => {
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

