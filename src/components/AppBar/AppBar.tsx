import * as React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Container,
  Button,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ArrowDropDown,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";
import { useThemeContext } from "../Theme/ThemeContext.tsx";

const pages = [{ label: "Spell Timeline", path: "/timeline" }];
const dropdownPages = [
  { label: "Absorb vs. Damage Reduction", path: "/graphs/external-comparison" },
  { label: "Sheilun's Gift vs. Jade Empowerment", path: "/graphs/jade-empowerment-sheiluns" },
  { label: "Jade Empowerment vs. DocJ", path: "/graphs/jade-empowerment-docj" },
  { label: "ST Rotation vs. Spinning Crane Kick", path: "/graphs/st-spinning" },
];

function ResponsiveAppBar() {
  const [navAnchor, setNavAnchor] = React.useState<null | HTMLElement>(null);
  const [dropdownAnchor, setDropdownAnchor] = React.useState<null | HTMLElement>(null);
  const { toggleTheme, themeMode } = useThemeContext();
  const hoverColor = themeMode === "dark" ? "#90caf9" : "#212121";

  const handleOpenMenu = (setter: React.Dispatch<React.SetStateAction<HTMLElement | null>>) => 
    (event: React.MouseEvent<HTMLElement>) => setter(event.currentTarget);

  const handleCloseMenu = (setter: React.Dispatch<React.SetStateAction<HTMLElement | null>>) => () => 
    setter(null);

  const renderNavLinks = (isMobile = false) =>
    pages.map(({ label, path }) => (
      <Button key={label} onClick={handleCloseMenu(setNavAnchor)} component="a" href={path} sx={!isMobile ? { color: "white", "&:hover": { color: hoverColor }, textTransform: "none" } : {}}>
        {label}
      </Button>
    ));

  const renderDropdownLinks = () =>
    dropdownPages.map(({ label, path }) => (
      <MenuItem
        key={label}
        component="a"
        href={path}
        onClick={() => {
          setDropdownAnchor(null);
          setNavAnchor(null);
        }}
        sx={{ "&:hover": { color: hoverColor } }}
      >
        {label}
      </MenuItem>
    ));

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
              "&:hover": { color: hoverColor },
            }}
          >
            𖦹 When do I ramp?
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton size="large" onClick={handleOpenMenu(setNavAnchor)} color="inherit">
              <MenuIcon />
            </IconButton>
            <Menu anchorEl={navAnchor} open={Boolean(navAnchor)} onClose={handleCloseMenu(setNavAnchor)}>
              {renderNavLinks(true)}
              <Button onClick={handleOpenMenu(setDropdownAnchor)} sx={{textTransform: "none"}}>
                  Graphs <ArrowDropDown />
              </Button>
            </Menu>
            <Menu anchorEl={dropdownAnchor} open={Boolean(dropdownAnchor)} onClose={handleCloseMenu(setDropdownAnchor)}>
              {renderDropdownLinks()}
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {renderNavLinks()}
            <Button onClick={handleOpenMenu(setDropdownAnchor)}
              sx={{ color: "white", "&:hover": { color: hoverColor }, textTransform: "none" }}
            >
              Graphs <ArrowDropDown />
            </Button>
            <Menu anchorEl={dropdownAnchor} open={Boolean(dropdownAnchor)} onClose={handleCloseMenu(setDropdownAnchor)}>
              {renderDropdownLinks()}
            </Menu>
          </Box>

          <IconButton onClick={toggleTheme} sx={{ color: "white" }}>
            {themeMode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
