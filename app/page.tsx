import React from "react";
import { 
    Typography, 
    Card, 
    CardContent, 
    CardActionArea,
    Container, 
    Box, 
    Button,
    Stack,
    Chip,
    ChipProps
} from "@mui/material";
import Link from "next/link";
import { Timeline, Analytics, TrendingUp, Person, TimerTwoTone } from "@mui/icons-material";
import { GetTitle } from "@util/stringManipulation";

const wdirPreview = "/previews/when-do-i-ramp.png";
const spellTimelinePreview = "/previews/timeline.png";
const analysisPreview = "/previews/harmonic-surge.png";

const infoChips: { label: string; color: ChipProps["color"] }[] = [
    {
        label: GetTitle("Comprehensive Healing Analysis"),
        color: "primary"
    },
    {
        label: GetTitle("Growing Spec Support"),
        color: "secondary"
    },
    {
        label: GetTitle("Data-Driven Optimization"),
        color: "success"
    }
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
    }
];

const customButtonStyles = {
    borderRadius: 3,
    px: 4,
    py: 1.5,
    fontWeight: 600,
    textTransform: 'none',
    fontSize: '1rem',
    boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)',
    transition: "transform 0.3s ease",
    '&:hover': {
        transform: 'scale(1.1)',
        boxShadow: '0 6px 20px 0 rgba(0,0,0,0.15)',
        backgroundColor: 'primary.main',
    }
};

const outlineButtonStyles = {
    ...customButtonStyles,
    borderWidth: 2,
    '&:hover': {
        ...customButtonStyles['&:hover'],
        backgroundColor: 'transparent',
        borderWidth: 2,
    }
};

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
                <Typography variant="h5" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
                    {GetTitle("Healing optimization tools for World of Warcraft")}
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="center" sx={{ flexWrap: 'wrap', gap: 2 }}>
                    {infoChips.map((chip, index) => (
                        <Chip 
                            key={index}
                            label={chip.label} 
                            color={chip.color} 
                            size="medium"
                            sx={{ fontSize: '1rem', px: 2, py: 1 }}
                        />
                    ))}
                </Stack>
            </Box>
            
            <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(3, 1fr)', 
                    gap: 3,
                    width: '100%',
                    maxWidth: 1200,
                    '@media (max-width: 900px)': {
                        gridTemplateColumns: '1fr',
                        maxWidth: 400
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

            <Box sx={{ textAlign: 'center', mt: 6, mb: 6 }}>
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{ fontWeight: 'bold', color: 'primary.main' }}
                >
                  {GetTitle("Ready to improve your healing?")}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    {GetTitle("Start optimizing your gameplay with personalized analysis tools")}
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="center" sx={{ flexWrap: 'wrap', gap: 2 }}>
                    <Link href="/analysis">
                        <Button 
                            variant="contained" 
                            size="large"
                            startIcon={<TrendingUp />}
                            sx={customButtonStyles}
                        >
                            {GetTitle("Start Optimizing")}
                        </Button>
                    </Link>
                    <Link href="/about">
                        <Button 
                            variant="outlined" 
                            size="large"
                            startIcon={<Person />}
                            sx={outlineButtonStyles}
                        >
                            {GetTitle("About Me")}
                        </Button>
                    </Link>
                </Stack>
            </Box>
        </Container>
    );
};

export default Home;