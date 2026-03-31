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

    Chip
} from "@mui/material";
import { Timeline, Analytics, TimerTwoTone, BugReport, ArrowForward } from "@mui/icons-material";

import { GetTitle } from "@util/stringManipulation";
import Changelog from "@components/Changelog/Changelog";

const wdirPreview = "/previews/when-do-i-ramp.png";
const spellTimelinePreview = "/previews/timeline.png";
const analysisPreview = "/previews/harmonic-surge.png";
const bugsPreview = "/previews/bugs.png";
const swirlImg = "/swirl.png";

const siteInfo = [
    { label: "Data-Driven Optimization",   color: "#7ee5ff" },
    { label: "Growing Spec Support",   color: "#89ff7f" },
    { label: "Free & Open Source (Please contribute!)",     color: "#ffd700" },
    { label: "Comprehensive Healing Analysis",        color: "#ff69b4" },
];

const quickAccessPages = [
    {
        title: "When Do I Ramp?",
        description: "Calculate ramp timings for spell cast efficiency and planning",
        icon: <TimerTwoTone sx={{ fontSize: 30 }} />,
        path: "/when-do-i-ramp",
        preview: wdirPreview
    },
    {
        title: "Spell Timeline", 
        description: "Create customized timelines for spell casts and cooldowns",
        icon: <Timeline sx={{ fontSize: 30 }} />,
        path: "/timeline",
        preview: spellTimelinePreview
    },
    {
        title: "Graph & Analysis Tools",
        description: "Compare healing mechanics with data-driven insights",
        icon: <Analytics sx={{ fontSize: 30 }} />,
        path: "/analysis",
        preview: analysisPreview
    },
    {
        title: "Bugs & Issues",
        description: "Track known issues and bugs affectng specializations",
        icon: <BugReport sx={{ fontSize: 30 }} />,
        path: "/bugs",
        preview: bugsPreview
    }
];


const Home = () => {
    return (
        <Container maxWidth="lg" sx={{ mt: 1, mb: 6 }}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography
                  variant="h2"
                  component="h1"
                  gutterBottom
                  sx={{ fontWeight: 'bold', color: 'text.primary' }}
                >
                  {GetTitle("Wait, I'm Ramping!")}
                </Typography>
                <Typography variant="h5" color="text.secondary" sx={{ mb: 2, maxWidth: 800, mx: 'auto' }}>
                    {GetTitle("Healer theorycrafting and optimization tools for World of Warcraft")}
                </Typography>
            </Box>
            
            <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
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
                        <Card 
                            key={index}
                            variant="outlined"
                            sx={{ 
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 6,
                                    borderColor: 'primary.main'
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
                                            borderRadius: 3,
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
                                            {GetTitle(tool.title)}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ textAlign: 'center' }}
                                        >
                                            {GetTitle(tool.description)}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Link>
                        </Card>
                    ))}
                </Box>
            </Box>

            <Box sx={{ mb: 6, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                        {GetTitle("What's New")}
                    </Typography>
                    <Changelog />
                </Box>

                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                        {GetTitle("About This Site")}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {siteInfo.map((info, i) => (
                            <Chip
                                key={i}
                                label={GetTitle(info.label)}
                                size="small"
                                variant="outlined"
                                sx={{ borderColor: info.color, color: info.color }}
                            />
                        ))}
                    </Box>
                </Box>
            </Box>

            <Box sx={{ pt: 4, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>
                <Link href="/about" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Box sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 2,
                        px: 3,
                        py: 1.5,
                        borderRadius: 2,
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                        '&:hover': { backgroundColor: 'action.hover' }
                    }}>
                        <Box
                            component="img"
                            src={swirlImg}
                            alt="swirl"
                            sx={{ width: 40, height: 40, borderRadius: 1.5, objectFit: 'cover', border: '1px solid', borderColor: 'divider' }}
                        />
                        <Box sx={{ textAlign: 'left' }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                {GetTitle("made by swirl")}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {GetTitle("mistweaver guide writer for wowhead · veteran & mod at peak of serenity")}
                            </Typography>
                        </Box>
                        <ArrowForward sx={{ color: 'text.secondary', fontSize: 16 }} />
                    </Box>
                </Link>
            </Box>
        </Container>
    );
};

export default Home;