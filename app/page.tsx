"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Typography,
    Container,
    Box,
    Avatar,
    Divider,
} from "@mui/material";
import RainbowCard, { RAINBOW_COLORS, RAINBOW_GRADIENT } from "@components/Buttons/RainbowCard";
import { Timeline, Analytics, TimerTwoTone, BugReport, Percent } from "@mui/icons-material";
import SwirlLink from "@components/SwirlLink/SwirlLink";
import { CHANGELOG } from "@data/changelog";
import { CONTENT_WIDTH } from "@components/Theme/tokens";

const CURRENT_PATCH = "12.1 PTR";

const quickAccessIconSize = 22;
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
        title: "Spell Reference",
        description: "View spellpower data for all relevant spells and talents",
        icon: <Percent sx={{ fontSize: quickAccessIconSize }} />,
        path: "/analysis/spell-reference",
        preview: "/previews/spell-reference.png"
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

const STATUS_GREEN = RAINBOW_COLORS[1];
const LAST_SEEN_KEY = 'lastSeenChangelog';

const relativeTime = (date: Date): string => {
    const days = Math.floor((Date.now() - date.getTime()) / 86400000);
    if (days <= 0) return 'today';
    if (days === 1) return 'yesterday';
    if (days < 14) return `${days} days ago`;
    if (days < 60) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
};

const StatusChip = () => {
    const latest = CHANGELOG[0].date;
    const [hasNew, setHasNew] = useState(false);

    useEffect(() => {
        const lastSeen = localStorage.getItem(LAST_SEEN_KEY);
        setHasNew(!lastSeen || new Date(lastSeen) < latest);
    }, [latest]);

    const markSeen = () => {
        localStorage.setItem(LAST_SEEN_KEY, latest.toISOString());
        setHasNew(false);
    };

    return (
        <Box sx={{
            display: 'inline-flex',
            alignItems: 'stretch',
            borderRadius: 1,
            height: 24,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
        }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                px: 1.25,
                py: 0.5,
                backgroundColor: STATUS_GREEN + '14',
                borderRight: '1px solid',
                borderColor: 'divider',
            }}>
                <Box sx={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: STATUS_GREEN }} />
                <Typography sx={{ fontSize: '0.72rem', fontFamily: 'monospace', fontWeight: 700, color: STATUS_GREEN }}>
                    {CURRENT_PATCH}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.25, py: 0.5, backgroundColor: 'background.paper' }}>
                <Typography sx={{ fontSize: '0.72rem', color: 'text.disabled' }}>
                    updated {relativeTime(latest)}
                </Typography>
                <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                    <SwirlLink href="/changelog" variant="body2" fontWeight={700} sx={{ fontSize: '0.72rem' }} onClick={markSeen}>
                        what's new
                    </SwirlLink>
                    {hasNew && (
                        <Box sx={{
                            position: 'absolute',
                            top: -2,
                            right: -7,
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: '#7ee5ff',
                            boxShadow: '0 0 6px #7ee5ff',
                        }} />
                    )}
                </Box>
            </Box>
        </Box>
    );
};

const Hero = () => (
    <Box sx={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        '@keyframes gradientShift': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
        },
    }}>
        <Typography
            variant="h2"
            component="h1"
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
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: CONTENT_WIDTH.wide, mx: 'auto' }}>
            Healer theorycrafting and optimization tools for World of Warcraft
        </Typography>
    </Box>
);

const ToolGrid = () => (
    <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 2,
    }}>
        {quickAccessPages.map(tool => (
            <RainbowCard key={tool.path} sx={{ display: 'flex', flexDirection: 'column', width: { xs: '100%', sm: 350 } }}>
                <Link href={tool.path} style={{ textDecoration: 'none', color: 'inherit', height: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <Box sx={{ height: 140, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                    <Box sx={{ p: 2, flexGrow: 1 }}>
                        <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, textAlign: 'center', mb: 0.5 }}>
                            {tool.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                            {tool.description}
                        </Typography>
                    </Box>
                </Link>
            </RainbowCard>
        ))}
    </Box>
);

const Byline = () => (
    <Box sx={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
        pt: 2.5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        flexWrap: 'wrap',
    }}>
        <Link href="/about" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', '&:hover': { '& p': { color: 'text.primary' } } }}>
                <Avatar
                    src={"/swirl_panda.jpg"}
                    alt="swirl"
                    sx={{ width: 22, height: 22, borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}
                />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: 'text.secondary', transition: 'color 0.2s' }}>
                    made by{' '}
                    <Box
                        component="span"
                        sx={{
                            background: RAINBOW_GRADIENT,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        swirl
                    </Box>
                </Typography>
            </Box>
        </Link>
        <Typography sx={{ color: 'text.disabled' }}>·</Typography>
        <StatusChip />
    </Box>
);

const Home = () => (
    <Container maxWidth="lg" sx={{ mt: 1, mb: 2 }}>
        <Box sx={{ maxWidth: CONTENT_WIDTH.wide, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Hero />
            <ToolGrid />
            <Byline />
        </Box>
    </Container>
);

export default Home;
