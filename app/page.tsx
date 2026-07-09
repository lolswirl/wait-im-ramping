"use client";
import Link from "next/link";
import {
    Typography,
    Card,
    CardContent,
    CardActionArea,
    Container,
    Box,
    Avatar,
    Divider,
} from "@mui/material";
import WarningChip from "@components/WarningChip/WarningChip";
import RainbowCard, { RAINBOW_COLORS } from "@components/Buttons/RainbowCard";
import { Timeline, Analytics, TimerTwoTone, BugReport, ChevronRight, OpenInNew } from "@mui/icons-material";
import { GlassTooltip } from "@components/Glass";
import SwirlLink from "@components/SwirlLink/SwirlLink";
import { T } from "@util/T";
import { CHANGELOG } from "@data/changelog";
import { formatDate } from "@util/stringManipulation";
import { SOCIAL_LINKS } from "@data/socials";

const CURRENT_PATCH = "12.0.7";

const siteInfo = [
    { label: "Data-Driven Optimization", color: "#7ee5ff" },
    { label: "Growing Spec Support", color: "#89ff7f" },
    { label: "Comprehensive Analysis", color: "#ff69b4" },
];

const quickAccessIconSize = 25;
const quickAccessPages = [
    {
        title: "When Do I Ramp?",
        description: "Calculate ramp timings for spell cast efficiency and planning",
        icon: <TimerTwoTone sx={{ fontSize: quickAccessIconSize }} />,
        path: "/when-do-i-ramp",
        preview: "/previews/when-do-i-ramp.png"
    },
    {
        title: "Spell Timeline",
        description: "Create customized timelines for spell casts and cooldowns",
        icon: <Timeline sx={{ fontSize: quickAccessIconSize }} />,
        path: "/timeline",
        preview: "/previews/timeline.png"
    },
    {
        title: "Graph & Analysis Tools",
        description: "Compare healing mechanics with data-driven insights",
        icon: <Analytics sx={{ fontSize: quickAccessIconSize }} />,
        path: "/analysis",
        preview: "/previews/heart-of-the-jade-serpent.png"
    },
    {
        title: "Bugs & Issues",
        description: "Track known issues and bugs affecting specializations",
        icon: <BugReport sx={{ fontSize: quickAccessIconSize }} />,
        path: "/bugs",
        preview: "/previews/bugs.png"
    }
];

const Hero = () => (
    <Box sx={{
        textAlign: 'center',
        py: 1,
        mb: 1.5,
        borderRadius: 2,
        '@keyframes gradientShift': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
        },
    }}>
        <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
                fontWeight: 'bold',
                background: `linear-gradient(90deg, ${[...RAINBOW_COLORS, ...RAINBOW_COLORS].join(', ')})`,
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'gradientShift 6s linear infinite',
            }}
        >
            Wait, I'm Ramping!
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 2, maxWidth: 800, mx: 'auto' }}>
            Healer theorycrafting and optimization tools for World of Warcraft
        </Typography>
    </Box>
);

const QuickAccess = () => (
    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
        <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 3,
            width: '100%',
            maxWidth: 1200,
            '@media (max-width: 1200px)': { gridTemplateColumns: 'repeat(2, 1fr)', maxWidth: 800 },
            '@media (max-width: 600px)': { gridTemplateColumns: '1fr', maxWidth: '100%' },
        }}>
            {quickAccessPages.map((tool, index) => (
                <RainbowCard key={index} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Link href={tool.path} style={{ textDecoration: "none", color: "inherit", height: "100%", display: "flex", flexDirection: "column", flex: 1 }}>
                        <CardActionArea sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }} component="div">
                            <Box sx={{ height: 160, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Box sx={{
                                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                    backgroundImage: `url(${tool.preview})`,
                                    backgroundSize: 'cover', backgroundPosition: 'center',
                                    opacity: 0.8, filter: 'blur(0.5px)',
                                }} />
                                <Box sx={{
                                    position: 'relative', zIndex: 1, color: 'white',
                                    backgroundColor: 'rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(8px)',
                                    px: 1.5, py: 1.5, borderRadius: 1,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    {tool.icon}
                                </Box>
                            </Box>
                            <Divider />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                                    {tool.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                                    {tool.description}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Link>
                </RainbowCard>
            ))}
        </Box>
    </Box>
);

const CommunityCard = () => (
    <Card variant="outlined" sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <RainbowCard href={SOCIAL_LINKS.DISCORD.href} sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{
                    width: 36, height: 36, borderRadius: 1, flexShrink: 0,
                    backgroundColor: "#5865F222", border: "1px solid #5865F244",
                    display: "flex", alignItems: "center", justifyContent: "center", color: "#5865F2",
                }}>
                    {SOCIAL_LINKS.DISCORD.icon}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={600}>Discord</Typography>
                    <Typography variant="caption" color="text.secondary">Questions, feedback & theorycrafting</Typography>
                </Box>
                <OpenInNew fontSize="small" sx={{ color: "text.disabled", flexShrink: 0 }} />
            </RainbowCard>

            <RainbowCard href={SOCIAL_LINKS.PATREON.href} sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{
                    width: 36, height: 36, borderRadius: 1, flexShrink: 0,
                    backgroundColor: "#FF424D22", border: "1px solid #FF424D44",
                    display: "flex", alignItems: "center", justifyContent: "center", color: "#FF424D",
                }}>
                    {SOCIAL_LINKS.PATREON.icon}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={600}>Support on Patreon</Typography>
                    <Typography variant="caption" color="text.secondary">
                        
                            Has the site helped <i>you</i>? Help keep <i>it</i> running :)
                        
                    </Typography>
                </Box>
                <OpenInNew fontSize="small" sx={{ color: "text.disabled", flexShrink: 0 }} />
            </RainbowCard>
            <RainbowCard href={SOCIAL_LINKS.GITHUB.href} sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{
                    width: 36, height: 36, borderRadius: 1, flexShrink: 0,
                    backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    {SOCIAL_LINKS.GITHUB.icon}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={600}>GitHub - Contributions Welcome</Typography>
                    <Typography variant="caption" color="text.secondary">
                        Add Specs · Report Bugs · Suggest Tools · Improve Calcs
                    </Typography>
                </Box>
                <OpenInNew fontSize="small" sx={{ color: "text.disabled", flexShrink: 0 }} />
            </RainbowCard>
        </Box>
    </Card>
);

const AboutCard = () => {
    const latestDate = formatDate(CHANGELOG[0].date);
    return (
        <Card variant="outlined" sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    About The Site
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    {siteInfo.map((info, i) => (
                        <WarningChip key={i} message={info.label} borderColor={info.color} sx={{ fontWeight: 0, fontSize: '0.825rem' }} />
                    ))}
                </Box>
            </Box>

            <RainbowCard href="/about" sx={{
                p: 2, display: 'flex', alignItems: 'center', gap: 2,
                '&:hover': { '& .avatar-icon': { transform: 'scale(1.1)' } },
            }}>
                <Avatar
                    src={"/swirl_panda.jpg"}
                    alt="swirl"
                    className="avatar-icon"
                    sx={{
                        width: 62, height: 62,
                        backgroundColor: 'rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(8px)',
                        borderRadius: 1, boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        border: '1px solid rgba(255,255,255,0.1)', transition: 'transform 0.3s ease',
                    }}
                />
                <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" fontWeight={500}>made by swirl</Typography>
                    <Typography variant="body2" color="text.secondary">
                        healer theorycrafter · mistweaver guide writer at wowhead · engineer
                    </Typography>
                </Box>
                <ChevronRight />
            </RainbowCard>

            <Divider />

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Typography variant="body2" color="text.disabled">Updated for patch {CURRENT_PATCH}</Typography>
                <Typography variant="body2" color="text.disabled">·</Typography>
                <Typography variant="body2" color="text.disabled">Latest {latestDate}</Typography>
                <Typography variant="body2" color="text.disabled">·</Typography>
                <SwirlLink href="/changelog" variant="body2" fontWeight={600}>
                    What's New
                </SwirlLink>
            </Box>
        </Card>
    );
};

const Home = () => (
    <Container maxWidth="lg" sx={{ mt: 1, mb: 0 }}>
        <Hero />
        <QuickAccess />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            <CommunityCard />
            <AboutCard />
        </Box>
    </Container>
);

export default Home;
