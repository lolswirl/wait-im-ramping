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
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ArrowDropDown,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";
import { useThemeContext } from "../Theme/ThemeContext.tsx";
import { GetTitle } from "../../util/stringManipulation.tsx";
import { graphPages } from "../../pages/graphs/GraphPages.tsx";
import { useSpec } from "../../context/SpecContext.tsx";
import { useLocation } from "react-router-dom";
import { getSpecObject } from "../../data/class.ts";
import SpecDisplay from "../SpecializationSelect/SpecDisplay.tsx";

const pages = [
  { label: "When do I ramp?", path: "/when-do-i-ramp" },
  { label: "Spell Timeline", path: "/timeline" }];

function ResponsiveAppBar() {
  const location = useLocation();
  const [navAnchor, setNavAnchor] = React.useState<null | HTMLElement>(null);
  const [dropdownAnchor, setDropdownAnchor] = React.useState<null | HTMLElement>(null);
  const { toggleTheme, themeMode } = useThemeContext();
  const { spec, setSpec } = useSpec();
  const hoverColor = themeMode === "dark" ? "#90caf9" : "#212121";

  const handleOpenMenu = (setter: React.Dispatch<React.SetStateAction<HTMLElement | null>>) => 
    (event: React.MouseEvent<HTMLElement>) => setter(event.currentTarget);

  const handleCloseMenu = (setter: React.Dispatch<React.SetStateAction<HTMLElement | null>>) => () => 
    setter(null);

  const isGraphPage = graphPages.some(({ path }) => location.pathname === path);

  const renderNavLinks = () =>
    pages.map(({ label, path }) => (
      <Button 
        key={GetTitle(label)} 
        onClick={handleCloseMenu(setNavAnchor)}
        component="a"
        href={path}
        sx={{
          color: location.pathname === path ? hoverColor : "inherit",
          fontWeight: location.pathname === path ? 700 : 400,
          "&:hover": { color: hoverColor },
          textTransform: "none"
        }}
      >
        {GetTitle(label)}
      </Button>
    ));

  const renderDropdownLinks = () =>
    graphPages
      .filter(({ label }) => label.toLowerCase() !== "graphs")
      .map(({ label, path }) => (
        <MenuItem
          key={GetTitle(label)}
          component="a"
          href={path}
          onClick={() => {
            setDropdownAnchor(null);
            setNavAnchor(null);
          }}
          sx={{
            color: location.pathname === path ? hoverColor : "inherit",
            fontWeight: location.pathname === path ? 700 : 400,
            "&:hover": { color: hoverColor },
            textTransform: "none"
          }}
        >
          {GetTitle(label)}
        </MenuItem>
      ));

  const specObj = getSpecObject(spec);

  return (
    <AppBar
      position="sticky"
      sx={{
        height: 48,
        minHeight: 48,
        justifyContent: "center",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          variant="dense"
          sx={{
            height: 48,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", width: "100%", height: "100%" }}>
            <Typography
              variant="h5"
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: "inline-flex", // changed from "flex" to "inline-flex"
                alignItems: "center",
                gap: 1,
                fontWeight: location.pathname === "/" ? 700 : 700,
                color: location.pathname === "/" ? hoverColor : "inherit",
                textDecoration: "none",
                whiteSpace: "nowrap", // prevent wrapping
                "&:hover": { color: hoverColor },
              }}
            >
              𖦹 {GetTitle("Wait, I'm Ramping!")}
            </Typography>

            <Divider
              orientation="vertical"
              flexItem
              sx={{
                mx: 1,
                height: "100%",
                alignSelf: "stretch",
              }}
            />

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton size="large" onClick={handleOpenMenu(setNavAnchor)} color="inherit">
                <MenuIcon />
              </IconButton>
              <Menu anchorEl={navAnchor} open={Boolean(navAnchor)} onClose={handleCloseMenu(setNavAnchor)}>
                {renderNavLinks()}
                <Button onClick={handleOpenMenu(setDropdownAnchor)}
                  sx={{ color: "white", "&:hover": { color: hoverColor }, textTransform: "none" }}
                >
                  {GetTitle("Graphs")} <ArrowDropDown />
                </Button>
              </Menu>
              <Menu anchorEl={dropdownAnchor} open={Boolean(dropdownAnchor)} onClose={handleCloseMenu(setDropdownAnchor)}>
                {renderDropdownLinks()}
              </Menu>
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {renderNavLinks()}
              <Button
                onClick={handleOpenMenu(setDropdownAnchor)}
                sx={{
                  color: isGraphPage ? hoverColor : "white",
                  fontWeight: isGraphPage ? 700 : 400,
                  "&:hover": { color: hoverColor },
                  textTransform: "none"
                }}
              >
                {GetTitle("Graphs")} <ArrowDropDown />
              </Button>
              <Menu anchorEl={dropdownAnchor} open={Boolean(dropdownAnchor)} onClose={handleCloseMenu(setDropdownAnchor)}>
                {renderDropdownLinks()}
              </Menu>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {specObj && <SpecDisplay specObj={specObj} />}
              <IconButton onClick={toggleTheme} sx={{ color: "white" }}>
                {themeMode === "dark" ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
