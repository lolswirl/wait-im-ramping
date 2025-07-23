import { AppBar, Toolbar, IconButton, Box, Tooltip } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TwitterIcon from "@mui/icons-material/Twitter";
import { GetTitle } from "../../util/stringManipulation";
import { useThemeContext } from "../../context/ThemeContext";

const DiscordSVG = (props: React.SVGProps<SVGSVGElement>) => (
    <svg  
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <title>Discord</title>
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
    </svg>
);

const TwitchSVG = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
        <title>Twitch</title>
        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
    </svg>
);

const FooterBar = () => {
    const { themeMode } = useThemeContext();

    return (
        <AppBar
            color="primary"
            position="static"
            sx={{
                minHeight: 48,
                height: 48,
                backgroundImage: 'none',
                bgcolor: themeMode === "light" ? "primary.main" : "#171717",
                '& .MuiToolbar-root': { minHeight: 48, height: 48, padding: 0 }
            }}
        >
            <Toolbar sx={{ justifyContent: "center", minHeight: 48, height: 48, padding: 0 }}>
                <Box sx={{ display: "flex", gap: 0 }}>
                    <Tooltip title={GetTitle("GitHub")} arrow disableInteractive>
                        <IconButton color="inherit" href="https://github.com/lolswirl/wait-im-ramping" target="_blank">
                            <GitHubIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={GetTitle("Discord")} arrow disableInteractive>
                        <IconButton color="inherit" href="https://discord.gg/ZU5rhXtbNd" target="_blank">
                            <DiscordSVG />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={GetTitle("Twitch")} arrow disableInteractive>
                        <IconButton color="inherit" href="https://www.twitch.tv/lolswirl" target="_blank">
                            <TwitchSVG />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={GetTitle("YouTube")} arrow disableInteractive>
                        <IconButton color="inherit" href="https://www.youtube.com/@swirlstreams" target="_blank">
                            <YouTubeIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={GetTitle("Twitter")} arrow disableInteractive>
                        <IconButton color="inherit" href="https://x.com/seismically" target="_blank">
                            <TwitterIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={GetTitle("Raider.IO")} arrow disableInteractive>
                        <IconButton
                            color="inherit"
                            href="https://raider.io/characters/us/area-52/Swirl"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ p: 0, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                            <img
                                src="https://cdn.raiderio.net/images/brand/Mark_White.svg"
                                alt="Raider.IO"
                                width={24}
                                height={24}
                                style={{ display: "block" }}
                                draggable={false}
                            />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={GetTitle("Wago")} arrow disableInteractive>
                        <IconButton
                            color="inherit"
                            href="https://wago.io/p/Swirl"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ p: 0, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                            <img
                                src="data:image/png;base64,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"
                                alt="Wago"
                                width={32}
                                height={32}
                                style={{ display: "block" }}
                                draggable={false}
                            />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default FooterBar;