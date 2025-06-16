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
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ArrowDropDown,
  ArrowRight,
  Brightness4,
  Brightness7,
  ArrowDropDown as ArrowDownIcon,
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
  { label: "Spell Timeline", path: "/timeline" },
];

function ResponsiveAppBar() {
  const location = useLocation();
  const [dropdownAnchor, setDropdownAnchor] = React.useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [mobileGraphsOpen, setMobileGraphsOpen] = React.useState(false);
  const { toggleTheme, themeMode } = useThemeContext();
  const { spec } = useSpec();
  const hoverColor = themeMode === "dark" ? "#90caf9" : "#212121";

  const isGraphPage = graphPages.some(({ path }) => location.pathname === path);

  const handleDrawerToggle = () => setDrawerOpen((prev) => !prev);

  const renderDropdownLinks = () =>
    graphPages
      .filter(({ label }) => label.toLowerCase() !== "graphs")
      .map(({ label, path }) => (
        <MenuItem
          key={GetTitle(label)}
          component="a"
          href={path}
          onClick={() => setDropdownAnchor(null)}
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

  // sidebar drawer for mobile
  const drawer = (
    <Box
      sx={{ width: 250, display: "flex", flexDirection: "column", height: "100%" }}
      role="presentation"
      onClick={handleDrawerToggle}
      onKeyDown={handleDrawerToggle}
    >
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1, whiteSpace: "nowrap" }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            flexGrow: 1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          𖦹 {GetTitle("Wait, I'm Ramping!")}
        </Typography>
      </Box>
      <Divider />
      <List>
        {pages.map(({ label, path }) => (
          <ListItem key={label} disablePadding>
            <ListItemButton component="a" href={path} selected={location.pathname === path}>
              <ListItemText primary={GetTitle(label)} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton
            onClick={e => {
              e.stopPropagation();
              setMobileGraphsOpen(open => !open);
            }}
            sx={{ pl: 2 }}
          >
            <ListItemText primary={GetTitle("Graphs")} />
            {mobileGraphsOpen ? <ArrowDownIcon /> : <ArrowRight />}
          </ListItemButton>
        </ListItem>
        {mobileGraphsOpen &&
          graphPages
            .filter(({ label }) => label.toLowerCase() !== "graphs")
            .map(({ label, path }) => (
              <ListItem key={label} disablePadding>
                <ListItemButton
                  component="a"
                  href={path}
                  selected={location.pathname === path}
                  sx={{ pl: 4 }}
                >
                  <ListItemText primary={GetTitle(label)} />
                </ListItemButton>
              </ListItem>
            ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1 }}>
        {specObj && <SpecDisplay specObj={specObj} />}
        <IconButton onClick={toggleTheme} sx={{ color: "inherit", ml: "auto" }}>
          {themeMode === "dark" ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Box>
    </Box>
  );

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
          {/* hamburger for mobile */}
          <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", mr: 1 }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={e => {
                e.stopPropagation();
                setDrawerOpen(true);
              }}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          <Typography
            variant="h5"
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              fontWeight: 700,
              color: location.pathname === "/" ? hoverColor : "inherit",
              textDecoration: "none",
              whiteSpace: "nowrap",
              fontSize: { xs: "1.1rem", md: "1.5rem" },
              flexGrow: { xs: 1, md: 0 },
              "&:hover": { color: hoverColor },
            }}
          >
            𖦹 {GetTitle("Wait, I'm Ramping!")}
          </Typography>

          {/* desktop divider */}
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              display: { xs: "none", md: "block" },
              mx: 0.5,
              height: "100%",
              alignSelf: "center",
              borderColor: "rgba(255,255,255,0.2)"
            }}
          />

          {/* desktop left side */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map(({ label, path }) => (
              <Button
                key={GetTitle(label)}
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
            ))}
            <Button
              onClick={e => setDropdownAnchor(e.currentTarget)}
              sx={{
                color: isGraphPage ? hoverColor : "white",
                fontWeight: isGraphPage ? 700 : 400,
                "&:hover": { color: hoverColor },
                textTransform: "none"
              }}
            >
              {GetTitle("Graphs")} <ArrowDropDown />
            </Button>
            <Menu
              anchorEl={dropdownAnchor}
              open={Boolean(dropdownAnchor)}
              onClose={() => setDropdownAnchor(null)}
            >
              {renderDropdownLinks()}
            </Menu>
          </Box>
          {/* desktop right side */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>
            {specObj && <SpecDisplay specObj={specObj} />}
            <IconButton onClick={toggleTheme} sx={{ color: "white" }}>
              {themeMode === "dark" ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* mobile drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}

export default ResponsiveAppBar;
