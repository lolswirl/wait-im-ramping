"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Typography,
    Container,
    Box,
    Avatar,
} from "@mui/material";
import RainbowCard, { RAINBOW_COLORS, RAINBOW_GRADIENT } from "@components/Buttons/RainbowCard";
import SwirlLink from "@components/SwirlLink/SwirlLink";
import { CONTENT_WIDTH, FONT, HAIRLINE } from "@components/Theme/tokens";
import { CHANGELOG } from "@data/changelog";

const CURRENT_PATCH = "12.1";

const leadTools = [
    {
        title: "When Do I Ramp?",
        description: "Calculate when to start your ramp before a mechanic",
        path: "/when-do-i-ramp",
        preview: "/previews/when-do-i-ramp.png"
    },
    {
        title: "Spell Timeline",
        description: "Build timelines for spell casts and cooldowns",
        path: "/timeline",
        preview: "/previews/timeline.png"
    }
];

const tools = [
    {
        title: "Reference",
        description: "View spellpower data for every spell and talent",
        path: "/analysis/spell-reference",
        preview: "/previews/spell-reference.png"
    },
    {
        title: "Analysis",
        description: "Compare healing mechanics with the math behind them",
        path: "/analysis",
        preview: "/previews/heart-of-the-jade-serpent.png"
    },
    {
        title: "Bugs",
        description: "Track known bugs and issues by specialization",
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

const StatusLine = () => {
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
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
            <Box sx={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: STATUS_GREEN }} />
            <Typography component="div" sx={{ fontSize: FONT.small, color: 'text.secondary' }}>
                current for patch{' '}
                <Box component="span" sx={{ fontFamily: 'monospace', fontWeight: 700, color: STATUS_GREEN }}>
                    {CURRENT_PATCH}
                </Box>
                {' · '}updated {relativeTime(latest)}{' · '}
                <Box component="span" sx={{ position: 'relative' }}>
                    <SwirlLink href="/changelog" fontWeight={700} sx={{ fontSize: FONT.small }} onClick={markSeen}>
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
            </Typography>
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
            component="h1"
            sx={{
                fontWeight: 'bold',
                fontSize: '2.75rem',
                lineHeight: 1.1,
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
        <Typography sx={{ fontSize: FONT.subhead, color: 'text.secondary' }}>
            Healer theorycrafting tools for World of Warcraft
        </Typography>
        <StatusLine />
    </Box>
);

const ToolCard = ({ tool, height }: { tool: typeof tools[number]; height: number }) => (
    <RainbowCard href={tool.path} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{
            height,
            backgroundImage: `url(${tool.preview})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderBottom: `1px solid ${HAIRLINE}`,
        }} />
        <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography sx={{ fontSize: FONT.subhead, fontWeight: 700, mb: 0.25, color: 'text.primary' }}>
                {tool.title}
            </Typography>
            <Typography sx={{ fontSize: FONT.body, color: 'text.secondary' }}>
                {tool.description}
            </Typography>
        </Box>
    </RainbowCard>
);

const ToolGrid = () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(6, 1fr)' }, gap: 2 }}>
        {leadTools.map(tool => (
            <Box key={tool.path} sx={{ gridColumn: { md: 'span 3' } }}>
                <ToolCard tool={tool} height={180} />
            </Box>
        ))}
        {tools.map(tool => (
            <Box key={tool.path} sx={{ gridColumn: { md: 'span 2' } }}>
                <ToolCard tool={tool} height={120} />
            </Box>
        ))}
    </Box>
);

const Byline = () => (
    <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }}>
        <Link href="/about" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', '&:hover': { '& p': { color: 'text.primary' } } }}>
                <Avatar
                    src={"/swirl_panda.jpg"}
                    alt="swirl"
                    sx={{ width: 24, height: 24, borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}
                />
                <Typography sx={{ fontSize: FONT.body, fontWeight: 600, color: 'text.secondary', transition: 'color 0.2s' }}>
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
    </Box>
);

const Home = () => (
    <Container maxWidth="lg" sx={{ mt: 1, mb: 2 }}>
        <Box sx={{ maxWidth: CONTENT_WIDTH.wide, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Hero />
            <ToolGrid />
            <Byline />
        </Box>
    </Container>
);

export default Home;
