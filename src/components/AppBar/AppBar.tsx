import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
// import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
// import AdbIcon from "@mui/icons-material/Adb";
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

// const SwirlIcon = (props: SvgIconProps) => (
//   <SvgIcon {...props} viewBox="0 0 32 32">
//     <text x="4" y="26" fontSize="24">𖦹</text>
//   </SvgIcon>
// );

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
            {/* <SwirlIcon/> */}
            𖦹 When do I ramp?
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton size="large" onClick={handleOpenNavMenu} color="inherit">
              <MenuIcon />
            </IconButton>
            <Menu anchorEl={anchorElNav} open={Boolean(anchorElNav)} onClose={handleCloseNavMenu}>
              {pages.map(({ label, path }) => (
                <MenuItem key={label} onClick={handleCloseNavMenu}>
                  <Typography>
                    <a href={path} style={{ color: "inherit", textDecoration: "none" }}>{label}</a>
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
              <Button key={label} onClick={handleCloseNavMenu} sx={{ my: 2, color: "white" }}>
                <a href={path} style={{ color: "inherit", textDecoration: "none" }}>{label}</a>
              </Button>
            ))}
            <Button onClick={handleOpenDropdownMenu} sx={{ my: 2, color: "white", display: "flex", alignItems: "center" }}>
              Graphs <ArrowDropDownIcon sx={{ ml: 1 }} />
            </Button>
            <Menu anchorEl={anchorElDropdown} open={Boolean(anchorElDropdown)} onClose={handleCloseDropdownMenu}>
              {dropdownPages.map(({ label, path }) => (
                <MenuItem key={label} component="a" href={path} onClick={handleCloseDropdownMenu}>
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
