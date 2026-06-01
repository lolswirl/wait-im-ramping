"use client"
import { AppBar, Toolbar, Box, Typography } from "@mui/material";
import { useThemeContext } from "@context/ThemeContext";
import { T } from "@util/T";
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
                sx={{ 
                    flexDirection: "column",
                    justifyContent: "center",
                    minHeight: 64,
                    py: 1,
                    gap: 0.5,
                }}
            >
                <Box sx={{ display: "flex", gap: 0.5 }}>
                    {Object.values(SOCIAL_LINKS).map(({ label, href, icon, color }) => (
                        <GlassTooltip 
                            key={label} 
                            title={T(label)}
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
                
                <Box 
                    sx={{ 
                        display: "flex", 
                        flexDirection: "column", 
                        alignItems: "center",
                        gap: 0.5,
                    }}
                >
                    <Typography 
                        variant="caption" 
                        sx={{ 
                            color: "rgba(255, 255, 255, 0.7)",
                            fontSize: "0.7rem",
                        }}
                    >
                        <T>
                            © {currentYear} Wait, I'm Ramping! All rights reserved.
                        </T>
                    </Typography>
                    <Typography 
                        variant="caption" 
                        sx={{ 
                            color: "rgba(255, 255, 255, 0.5)",
                            fontSize: "0.65rem",
                            textAlign: "center",
                            maxWidth: 600,
                        }}
                    >
                        <T>World of Warcraft and related assets are trademarks and/or registered trademarks of Blizzard Entertainment, Inc.</T>
                    </Typography>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default FooterBar;