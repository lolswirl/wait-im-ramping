"use client";
import React from "react";
import Link from "next/link";
import { 
    Typography, 
    Card,
    CardContent, 
    CardActionArea,
    Container, 
    Box, 
    Avatar
} from "@mui/material";
import WarningChip from "@components/WarningChip/WarningChip";
import RainbowCard from "@components/Buttons/RainbowCard";
import { Timeline, Analytics, TimerTwoTone, BugReport, ChevronRight } from "@mui/icons-material";

import { T } from "@util/T";
import Changelog from "@components/Changelog/Changelog";


const wdirPreview = "/previews/when-do-i-ramp.png";
const spellTimelinePreview = "/previews/timeline.png";
const analysisPreview = "/previews/harmonic-surge.png";
const bugsPreview = "/previews/bugs.png";
const swirlAvatar = "/swirl_panda.jpg";

const siteInfo = [
    { label: "Data-Driven Optimization",   color: "#7ee5ff" },
    { label: "Growing Spec Support",   color: "#89ff7f" },
    { label: "Free & Open Source (Please contribute!)",     color: "#ffd700" },
    { label: "Comprehensive Healing Analysis",        color: "#ff69b4" },
];

const quickAccessIconSize = 25;
const quickAccessPages = [
    {
        title: "When Do I Ramp?",
        description: "Calculate ramp timings for spell cast efficiency and planning",
        icon: <TimerTwoTone sx={{ fontSize: quickAccessIconSize }} />,
        path: "/when-do-i-ramp",
        preview: wdirPreview
    },
    {
        title: "Spell Timeline", 
        description: "Create customized timelines for spell casts and cooldowns",
        icon: <Timeline sx={{ fontSize: quickAccessIconSize }} />,
        path: "/timeline",
        preview: spellTimelinePreview
    },
    {
        title: "Graph & Analysis Tools",
        description: "Compare healing mechanics with data-driven insights",
        icon: <Analytics sx={{ fontSize: quickAccessIconSize }} />,
        path: "/analysis",
        preview: analysisPreview
    },
    {
        title: "Bugs & Issues",
        description: "Track known issues and bugs affecting specializations",
        icon: <BugReport sx={{ fontSize: quickAccessIconSize }} />,
        path: "/bugs",
        preview: bugsPreview
    }
];


const Home = () => {
    return (
        <Container maxWidth="lg" sx={{ mt: 1, mb: 0 }}>
            <Box sx={{ textAlign: 'center', mb: 5 }}>
                <Typography
                  variant="h2"
                  component="h1"
                  gutterBottom
                  sx={{ fontWeight: 'bold', color: 'text.primary' }}
                >
                  <T>Wait, I'm Ramping!</T>
                </Typography>
                <Typography variant="h5" color="text.secondary" sx={{ mb: 2, maxWidth: 800, mx: 'auto' }}>
                    <T>Healer theorycrafting and optimization tools for World of Warcraft</T>
                </Typography>
            </Box>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(4, 1fr)', 
                    gap: 3,
                    width: '100%',
                    maxWidth: 1200,
                    '@media (max-width: 1200px)': {
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        maxWidth: 800
                    },
                    '@media (max-width: 600px)': {
                        gridTemplateColumns: '1fr',
                        maxWidth: '100%'
                    }
                }}>
                    {quickAccessPages.map((tool, index) => (
                        <RainbowCard 
                            key={index}
                            sx={{ 
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 6,
                                }
                            }}
                        >
                            <Link href={tool.path} style={{ textDecoration: "none", color: "inherit", height: "100%", display: "flex", flexDirection: "column", flex: 1 }}>
                                <CardActionArea 
                                    sx={{ 
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'stretch'
                                    }}
                                    component="div"
                                >
                                    <Box
                                        sx={{
                                            height: 160,
                                            position: 'relative',
                                            overflow: 'hidden',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                backgroundImage: `url(${tool.preview})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                opacity: 0.8,
                                                filter: 'blur(0.5px)'
                                            }}
                                        />
                                        
                                        <Box sx={{ 
                                            position: 'relative', 
                                            zIndex: 1, 
                                            color: 'white',
                                            backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                            backdropFilter: 'blur(8px)',
                                            px: 1.5,
                                            py: 1.5,
                                            borderRadius: 1,
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {tool.icon}
                                        </Box>
                                    </Box>
                                    <Box sx={{ 
                                        height: 0.001, 
                                        backgroundColor: 'divider',
                                        width: '100%'
                                    }} />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography
                                            variant="h6"
                                            gutterBottom
                                            sx={{ fontWeight: 'bold', textAlign: 'center' }}
                                        >
                                            <T>{tool.title}</T>
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ textAlign: 'center' }}
                                        >
                                            <T>{tool.description}</T>
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Link>
                        </RainbowCard>
                    ))}
                </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                <Card variant="outlined" sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                        <T>What's New</T>
                    </Typography>
                    <Changelog />
                </Card>

                <Card variant="outlined" sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                        <T>About The Site</T>
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                        {siteInfo.map((info, i) => (
                            <WarningChip
                                key={i}
                                message={info.label}
                                borderColor={info.color}
                                sx={{ fontWeight: 0 }}
                            />
                        ))}
                    </Box>
                    
                    <RainbowCard
                        href="/about"
                        sx={{
                            p: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            '&:hover': {
                                '& .avatar-icon': {
                                    transform: 'scale(1.1)',
                                }
                            },
                        }}
                    >
                        <Avatar
                            src={swirlAvatar}
                            alt="swirl"
                            className="avatar-icon"
                            sx={{
                                width: 62,
                                height: 62,
                                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                backdropFilter: 'blur(8px)',
                                borderRadius: 1,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                transition: 'transform 0.3s ease',
                            }}
                        />
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" fontWeight={500}>
                                made by swirl
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                healer theorycrafter · mistweaver guide writer at wowhead · engineer
                            </Typography>
                        </Box>
                        <ChevronRight />
                    </RainbowCard>
                </Card>
            </Box>
        </Container>
    );
};

export default Home;