import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeContext } from '../Theme/ThemeContext.tsx'; // Import the context

const pages = [
  { label: "Spell Timeline", path: "/timeline" },
];

const dropdownPages = [
  { label: "Absorb vs. Damage Reduction", path: "/graphs/external-comparison" },
  { label: "Sheilun's Gift vs. Jade Empowerment", path: "/graphs/spellpower-comparison" },
];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElDropdown, setAnchorElDropdown] = React.useState<null | HTMLElement>(null);
  const { toggleTheme, themeMode } = useThemeContext(); // Use theme context here

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenDropdownMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElDropdown(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseDropdownMenu = () => {
    setAnchorElDropdown(null);
  };

  // Define the hover background color based on themeMode
  const hoverColor = themeMode === "dark" ? "#90caf9" : "#212121"; // Different hover colors for light and dark modes

  return (
    <AppBar position="static">
      <Container maxWidth="100%">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "inherit",
              textDecoration: "none",
              "&:hover": {
                color: hoverColor,
              },
            }}
          >
            <AdbIcon sx={{ fontSize: 24, cursor: "pointer" }} />
            When do I ramp?
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map(({ label, path }) => (
                <MenuItem key={label} onClick={handleCloseNavMenu}>
                  <Typography sx={{ textAlign: "center" }}>
                    <a href={path} style={{ color: 'inherit', textDecoration: 'none' }}>{label}</a>
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map(({ label, path }) => (
              <Button
                key={label}
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                  "&:hover": {
                    backgroundColor: hoverColor, // Apply dynamic hover color
                  },
                }}
              >
                <a href={path} style={{ color: 'inherit', textDecoration: 'none' }}>{label}</a>
              </Button>
            ))}

            <Button
              onClick={handleOpenDropdownMenu}
              sx={{
                my: 2,
                color: "white",
                display: "flex",
                alignItems: "center",
                "&:hover": {
                  backgroundColor: hoverColor, // Apply dynamic hover color
                },
              }}
            >
              Graphs
              <ArrowDropDownIcon sx={{ marginLeft: 1 }} />
            </Button>
            <Menu
              anchorEl={anchorElDropdown}
              open={Boolean(anchorElDropdown)}
              onClose={handleCloseDropdownMenu}
            >
              {dropdownPages.map(({ label, path }) => (
                <MenuItem
                  key={label}
                  component="a"
                  href={path}
                  onClick={handleCloseDropdownMenu}
                  sx={{
                    "&:hover": {
                      backgroundColor: hoverColor, // Apply dynamic hover color
                    },
                  }}
                >
                  {label}
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <IconButton onClick={toggleTheme} sx={{ ml: 2, color: "white" }}>
            {themeMode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
