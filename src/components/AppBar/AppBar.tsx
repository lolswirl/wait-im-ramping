"use client";
import * as React from "react";
import { usePathname } from "next/navigation";
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Container,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    SvgIcon,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useThemeContext } from "@context/ThemeContext";
import { GetTitle } from "@util/stringManipulation";
import { useSpec } from "@context/SpecContext";
import SpecializationSelect from "@components/SpecializationSelect/SpecializationSelect";
import SwirlButton from "@components/Buttons/SwirlButton";

const MoonIcon = () => (
    <SvgIcon viewBox="0 0 16 16" sx={{ fontSize: 15 }}>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.5 8.00005C1.5 5.53089 2.99198 3.40932 5.12349 2.48889C4.88136 3.19858 4.75 3.95936 4.75 4.7501C4.75 8.61609 7.88401 11.7501 11.75 11.7501C11.8995 11.7501 12.048 11.7454 12.1953 11.7361C11.0955 13.1164 9.40047 14.0001 7.5 14.0001C4.18629 14.0001 1.5 11.3138 1.5 8.00005ZM6.41706 0.577759C2.78784 1.1031 0 4.22536 0 8.00005C0 12.1422 3.35786 15.5001 7.5 15.5001C10.5798 15.5001 13.2244 13.6438 14.3792 10.9921L13.4588 9.9797C12.9218 10.155 12.3478 10.2501 11.75 10.2501C8.71243 10.2501 6.25 7.78767 6.25 4.7501C6.25 3.63431 6.58146 2.59823 7.15111 1.73217L6.41706 0.577759ZM13.25 1V1.75V2.75L14.25 2.75H15V4.25H14.25H13.25V5.25V6H11.75V5.25V4.25H10.75L10 4.25V2.75H10.75L11.75 2.75V1.75V1H13.25Z"
            fill="currentColor"
        />
    </SvgIcon>
);

const SunIcon = () => (
    <SvgIcon viewBox="0 0 16 16" sx={{ fontSize: 15 }}>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.75 0.75V0H7.25V0.75V2V2.75H8.75V2V0.75ZM11.182 3.75732L11.7123 3.22699L12.0659 2.87344L12.5962 2.34311L13.6569 3.40377L13.1265 3.9341L12.773 4.28765L12.2426 4.81798L11.182 3.75732ZM8 10.5C9.38071 10.5 10.5 9.38071 10.5 8C10.5 6.61929 9.38071 5.5 8 5.5C6.61929 5.5 5.5 6.61929 5.5 8C5.5 9.38071 6.61929 10.5 8 10.5ZM8 12C10.2091 12 12 10.2091 12 8C12 5.79086 10.2091 4 8 4C5.79086 4 4 5.79086 4 8C4 10.2091 5.79086 12 8 12ZM13.25 7.25H14H15.25H16V8.75H15.25H14H13.25V7.25ZM0.75 7.25H0V8.75H0.75H2H2.75V7.25H2H0.75ZM2.87348 12.0659L2.34315 12.5962L3.40381 13.6569L3.93414 13.1265L4.28769 12.773L4.81802 12.2426L3.75736 11.182L3.22703 11.7123L2.87348 12.0659ZM3.75735 4.81798L3.22702 4.28765L2.87347 3.9341L2.34314 3.40377L3.4038 2.34311L3.93413 2.87344L4.28768 3.22699L4.81802 3.75732L3.75735 4.81798ZM12.0659 13.1265L12.5962 13.6569L13.6569 12.5962L13.1265 12.0659L12.773 11.7123L12.2426 11.182L11.182 12.2426L11.7123 12.773L12.0659 13.1265ZM8.75 13.25V14V15.25V16H7.25V15.25V14V13.25H8.75Z"
            fill="currentColor"
        />
    </SvgIcon>
);

const pages = [
    { label: "Home", path: "/" },
    { label: "When do I ramp?", path: "/when-do-i-ramp" },
    { label: "Spell Timeline", path: "/timeline" },
    { label: "Analysis Tools", path: "/analysis" },
    { label: "Bugs", path: "/bugs" },
];

function ResponsiveAppBar() {
    const pathname = usePathname();
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const { toggleTheme, themeMode } = useThemeContext();
    const { spec, setSpec } = useSpec();
    const hoverColor = themeMode === "dark" ? "#90caf9" : "#212121";

    const handleDrawerToggle = () => setDrawerOpen((prev) => !prev);

    // sidebar drawer for mobile
    const drawer = (
        <Box
            sx={{ 
                width: 280, 
                display: "flex", 
                flexDirection: "column", 
                height: "100%",
                bgcolor: themeMode === "light" ? "primary.main" : "#171717"
            }}
            role="presentation"
        >
            <Box sx={{ 
                p: 3, 
                display: "flex", 
                alignItems: "center", 
                gap: 2,
                borderBottom: "1px solid",
                borderColor: "rgba(255,255,255,0.1)"
            }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        flexGrow: 1,
                        color: "white"
                    }}
                >
                    𖦹 {GetTitle("Wait, I'm Ramping!")}
                </Typography>
                <IconButton 
                    onClick={handleDrawerToggle}
                    size="small"
                    sx={{ color: "white" }}
                >
                    ✕
                </IconButton>
            </Box>

            {/* mobile nav */}
            <List sx={{ px: 1, py: 2 }}>
                {pages.map(({ label, path }) => {
                    const isActive = path === "/analysis" 
                        ? pathname?.startsWith("/analysis") 
                        : pathname === path;
                    
                    return (
                        <ListItem key={label} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton 
                                component="a" 
                                href={path} 
                                selected={isActive}
                                onClick={handleDrawerToggle}
                                sx={{
                                    mx: 1,
                                    position: "relative",
                                    color: "white",
                                    width: 'fit-content',
                                    minWidth: 'auto',
                                    flex: 'none',
                                    '&.MuiListItemButton-root': {
                                        width: 'fit-content',
                                        minWidth: 'auto',
                                        flex: 'none',
                                    },
                                    '&.Mui-selected': {
                                        bgcolor: 'transparent',
                                        '&:hover': {
                                            bgcolor: 'transparent',
                                        }
                                    },
                                    "&::after": {
                                        content: '""',
                                        position: "absolute",
                                        bottom: 0,
                                        left: 8,
                                        right: 8,
                                        height: 2,
                                        bgcolor: hoverColor,
                                        borderColor: "transparent",
                                        transform: isActive ? "scaleX(1)" : "scaleX(0)",
                                        transition: "transform 0.3s ease",
                                        zIndex: 2,
                                    },
                                    '&:hover': {
                                        bgcolor: 'transparent',
                                        "&::after": {
                                            transform: "scaleX(1)",
                                        }
                                    }
                                }}
                            >
                                <ListItemText 
                                    primary={GetTitle(label)}
                                    primaryTypographyProps={{
                                        fontWeight: isActive ? 600 : 400
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ 
                p: 3, 
                borderTop: "1px solid",
                borderColor: "rgba(255,255,255,0.1)"
            }}>
                <Typography 
                    variant="subtitle2" 
                    sx={{ 
                        mb: 2, 
                        color: "rgba(255,255,255,0.7)",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        letterSpacing: "0.5px"
                    }}
                >
                    {GetTitle("Settings")}
                </Typography>
                <Box 
                    sx={{ 
                        position: 'relative', 
                        zIndex: 1, 
                        color: 'white',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        backdropFilter: 'blur(8px)',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 'fit-content',
                        width: 'fit-content'
                    }}
                >
                    {spec && <SpecializationSelect selectedSpec={spec} onSpecChange={setSpec} short={true} />}
                    <IconButton 
                        onClick={toggleTheme}
                        sx={{ color: "white" }}
                    >
                        {themeMode === "dark" ? <MoonIcon /> : <SunIcon />}
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );

    return (
        <>
            <AppBar
                position="sticky"
                sx={{
                    height: 48,
                    minHeight: 48,
                    mb: 3.5,
                    justifyContent: "center",
                    backgroundImage: "none",
                    bgcolor: themeMode === "light" ? "primary.main" : "#171717"
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
                                color: pathname === "/" ? hoverColor : "inherit",
                                textDecoration: "none",
                                whiteSpace: "nowrap",
                                fontSize: { xs: "1.1rem", md: "1.5rem" },
                                "&:hover": { color: hoverColor },
                            }}
                        >
                            𖦹 {GetTitle("Wait, I'm Ramping!")}
                        </Typography>

                        <Box sx={{ flexGrow: 1 }} />

                        {/* desktop navigation */}
                        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>
                            {pages.map(({ label, path }) => {
                                const isActive = path === "/analysis" 
                                    ? pathname?.startsWith("/analysis") 
                                    : pathname === path;
                                
                                return (
                                    <SwirlButton
                                        key={GetTitle(label)}
                                        href={path}
                                        selected={isActive}
                                    >
                                        {GetTitle(label)}
                                    </SwirlButton>
                                );
                            })}
                        </Box>

                        <Box 
                            sx={{ 
                                position: 'relative', 
                                zIndex: 1, 
                                color: 'white',
                                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                backdropFilter: 'blur(8px)',
                                ml: 1,
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                display: { xs: "none", md: "flex" },
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: 'fit-content',
                            }}
                        >
                            {spec && <SpecializationSelect selectedSpec={spec} onSpecChange={setSpec} short={true} />}
                            <IconButton 
                                onClick={toggleTheme}
                                sx={{ 
                                    color: "white",
                                    transition: "transform 0.3s ease",
                                    "&:hover": {
                                        transform: "scale(1.1)",
                                        backgroundColor: "transparent",
                                    }, 
                                }}
                            >
                                {themeMode === "dark" ? <MoonIcon /> : <SunIcon />}
                            </IconButton>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            
            {/* mobile stuff */}
            <Box
                onClick={handleDrawerToggle}
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    display: { xs: "flex", md: "none" },
                    zIndex: 1000,
                    color: 'white',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(8px)',
                    px: 1.5,
                    py: 1.5,
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    }
                }}
            >
                <MenuIcon />
            </Box>
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
            >
                {drawer}
            </Drawer>
        </>
    );
}

export default ResponsiveAppBar;