import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useThemeContext } from "../Theme/ThemeContext.tsx";

const pages = [{ label: "Spell Timeline", path: "/timeline" }];
const dropdownPages = [
  { label: "Absorb vs. Damage Reduction", path: "/graphs/external-comparison" },
  { label: "Sheilun's Gift vs. Jade Empowerment", path: "/graphs/jade-empowerment-sheiluns" },
  { label: "Jade Empowerment vs. DocJ", path: "/graphs/jade-empowerment-docj" },
  { label: "ST Rotation vs. Spinning Crane Kick", path: "/graphs/st-spinning" }
];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElDropdown, setAnchorElDropdown] = React.useState<null | HTMLElement>(null);
  const { toggleTheme, themeMode } = useThemeContext();
  
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

  const hoverColor = themeMode === "dark" ? "#90caf9" : "#212121";

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters variant="dense">
          <Typography
            variant="h5"
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
              "&:hover": {
                color: hoverColor,
              },
            }}
          >
            𖦹 When do I ramp?
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton size="large" onClick={handleOpenNavMenu} color="inherit">
              <MenuIcon />
            </IconButton>
            <Menu anchorEl={anchorElNav} open={Boolean(anchorElNav)} onClose={handleCloseNavMenu}>
              {pages.map(({ label, path }) => (
                <MenuItem key={label} onClick={handleCloseNavMenu}>
                  <Typography component="a" href="{path}" sx={{ "&:hover": {
                color: hoverColor,
              }, }}>
                    {/* <a href={path} style={{ color: "inherit", textDecoration: "none" }}> */}
                      {label}
                      {/* </a> */}
                  </Typography>
                </MenuItem>
              ))}
              <MenuItem onClick={handleOpenDropdownMenu}>
                <Typography sx={{ display: "flex", alignItems: "center" }}>
                  Graphs <ArrowDropDownIcon sx={{ ml: 1 }} />
                </Typography>
              </MenuItem>
            </Menu>
            <Menu anchorEl={anchorElDropdown} open={Boolean(anchorElDropdown)} onClose={handleCloseDropdownMenu}>
              {dropdownPages.map(({ label, path }) => (
                <MenuItem
                  key={label}
                  component="a"
                  href={path}
                  onClick={() => {
                    handleCloseDropdownMenu();
                    handleCloseNavMenu();
                  }}
                >
                  {label}
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map(({ label, path }) => (
              <Button key={label} component="a" href={path} onClick={handleCloseNavMenu} 
                sx={{ color: "white", "&:hover": {color: hoverColor,}, }}
              >
                {label}
              </Button>
            ))}
            <Button onClick={handleOpenDropdownMenu} sx={{ color: "white", display: "flex", alignItems: "center", "&:hover": {color: hoverColor,} }}>
              Graphs <ArrowDropDownIcon sx={{ ml: 1 }} />
            </Button>
            <Menu anchorEl={anchorElDropdown} open={Boolean(anchorElDropdown)} onClose={handleCloseDropdownMenu}>
              {dropdownPages.map(({ label, path }) => (
                <MenuItem key={label} component="a" href={path} onClick={handleCloseDropdownMenu} sx={{"&:hover": {color: hoverColor,}}}>
                  {label}
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <IconButton onClick={toggleTheme} sx={{ color: "white" }}>
            {themeMode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
