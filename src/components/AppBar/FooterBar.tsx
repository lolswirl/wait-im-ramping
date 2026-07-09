"use client"
import { AppBar, Toolbar, Box, Typography } from "@mui/material";
import { useThemeContext } from "@context/ThemeContext";
import { GlassTooltip } from "@components/Glass";
import { ColoredIconButton } from "@components/Buttons/ColoredIconButton";
import { SOCIAL_LINKS } from "@data/socials";

const FooterBar = () => {
    const { themeMode } = useThemeContext();
    const currentYear = new Date().getFullYear();

    return (
        <AppBar
            color="primary"
            position="static"
            component="footer"
            sx={{
                mt: 3.5,
                backgroundImage: 'none',
                bgcolor: themeMode === "light" ? "primary.main" : "rgba(23, 23, 23, 0.85)",
                backdropFilter: "blur(12px)",
                borderTop: "1px solid",
                borderColor: themeMode === "light" ? "rgba(255,255,255,0.15)" : "divider",
                boxShadow: "none",
            }}
        >
            <Toolbar
                variant="dense"
                sx={{
                    minHeight: 44,
                    py: 0.5,
                    gap: 2,
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr auto 1fr" },
                    justifyItems: { xs: "center", md: "stretch" },
                }}
            >
                <Typography
                    variant="caption"
                    sx={{
                        color: "rgba(255, 255, 255, 0.5)",
                        fontSize: "0.7rem",
                        whiteSpace: "nowrap",
                        justifySelf: { xs: "center", md: "start" },
                    }}
                >
                    © {currentYear} Wait, I'm Ramping!
                </Typography>

                <Typography
                    variant="caption"
                    sx={{
                        color: "rgba(255, 255, 255, 0.35)",
                        fontSize: "0.65rem",
                        textAlign: "center",
                    }}
                >
                    World of Warcraft and related assets are trademarks and/or registered trademarks of Blizzard Entertainment, Inc.
                </Typography>

                <Box sx={{ display: "flex", gap: 0.5, justifySelf: { xs: "center", md: "end" } }}>
                    {Object.values(SOCIAL_LINKS).map(({ label, href, icon, color }) => (
                        <GlassTooltip
                            key={label}
                            title={label}
                            placement="top"
                        >
                            <ColoredIconButton
                                color="inherit"
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                hoverColor={color}
                                enableLift={true}
                                initialColor="rgba(255, 255, 255, 0.5)"
                            >
                                {icon}
                            </ColoredIconButton>
                        </GlassTooltip>
                    ))}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default FooterBar;