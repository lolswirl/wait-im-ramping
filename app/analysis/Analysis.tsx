"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
    Card, 
    CardActionArea, 
    CardContent, 
    Container, 
    Typography, 
    Box, 
    Chip,
    Grid,
} from "@mui/material";

import PageHeader from "@components/PageHeader/PageHeader";
import { getCapsMode, GetTitle } from "@util/stringManipulation";

import { analysisPages, AnalysisPage } from "../AnalysisPages";

const wdirPreview = "/previews/when-do-i-ramp.png";
const spellTimelinePreview = "/previews/timeline.png";

const Analysis: React.FC<{ title: string; description: string }> = ({ title, description }) => {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const pages: AnalysisPage[] = [
        ...analysisPages,
        { 
            label: "When Do I Ramp?", 
            path: "/when-do-i-ramp",
            preview: wdirPreview,
            description: "Calculate ramp timings for spell cast efficiency and planning",
            tags: ["Healing", "Damage", "Rotation"],
            createdDate: "2025-02-28"
        },
        { 
            label: "Spell Timeline", 
            path: "/timeline",
            preview: spellTimelinePreview,
            description: "Create customized timelines for spell casts and cooldowns",
            tags: ["Healing", "Damage", "Rotation"],
            createdDate: "2025-03-10"
        },
    ];

    const filteredAnalysisPages = pages.filter(
        (tool) => tool.label.toLowerCase() !== "analysis"
    );

    const allTags = useMemo(() => {
        const tags = new Set<string>();
        filteredAnalysisPages.forEach(tool => {
            tool.tags.forEach(tag => tags.add(tag));
        });
        return Array.from(tags).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    }, [filteredAnalysisPages]);

    const displayedPages = useMemo(() => {
        let filtered = filteredAnalysisPages;

        if (selectedTags.length > 0) {
            filtered = filtered.filter(tool => 
                selectedTags.every(selectedTag => tool.tags.includes(selectedTag))
            );
        }
        
        return filtered.sort((a, b) => 
            new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
        );
    }, [filteredAnalysisPages, selectedTags]);

    const handleTagToggle = (tag: string) => {
        setSelectedTags(prev => 
            prev.includes(tag) 
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const clearAllFilters = () => {
        setSelectedTags([]);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    return (
        <Container>
            <PageHeader 
                title={title} 
                subtitle={description} 
                marginBottom={3}
            />

            <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                        {GetTitle("Filter:")}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', flexGrow: 1 }}>
                        {allTags.map((tag) => (
                            <Chip 
                                key={tag}
                                label={GetTitle(tag)}
                                variant={selectedTags.includes(tag) ? "filled" : "outlined"}
                                color={selectedTags.includes(tag) ? "primary" : "default"}
                                onClick={() => handleTagToggle(tag)}
                                size="small"
                                sx={{ 
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: selectedTags.includes(tag) 
                                            ? 'primary.dark' 
                                            : 'action.hover'
                                    }
                                }}
                            />
                        ))}
                    </Box>
                    {selectedTags.length > 0 && (
                        <>
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                {GetTitle(`${displayedPages.length} of ${filteredAnalysisPages.length} tools`)}
                            </Typography>
                            <Chip 
                                label={GetTitle(`Clear (${selectedTags.length})`)}
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={clearAllFilters}
                                sx={{ flexShrink: 0 }}
                            />
                        </>
                    )}
                </Box>
            </Box>

            <Grid container spacing={3}>
                {displayedPages.map((tool) => (
                    <Grid item xs={12} sm={6} md={4} key={tool.path}>
                        <Link
                            href={tool.path}
                            style={{
                                textDecoration: "none",
                                color: "inherit",
                                display: "block",
                                height: "100%",
                            }}
                        >
                            <Card
                                variant="outlined"
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    transition: "all 0.3s ease-in-out",
                                    "&:hover": {
                                        boxShadow: 6,
                                        transform: "translateY(-4px)",
                                        borderColor: "primary.main",
                                    },
                                    cursor: "pointer",
                                }}
                            >
                                <CardActionArea
                                    sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                                >
                                    <Box
                                        sx={{
                                            height: 160,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <Box sx={{ 
                                            position: 'absolute', 
                                            inset: 0, 
                                            backgroundImage: `url(${tool.preview})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            opacity: 0.8,
                                            filter: 'blur(0.5px)'
                                        }} />

                                        <Box sx={{ 
                                            position: 'absolute', 
                                            top: 8, 
                                            right: 8, 
                                            backgroundColor: 'primary',
                                            backdropFilter: 'blur(8px)',
                                            color: 'white',
                                            px: 1.5,
                                            py: 0.75,
                                            borderRadius: 2,
                                            fontSize: '0.7rem',
                                            fontWeight: 500,
                                            letterSpacing: '0.02em',
                                            textTransform: getCapsMode() ? 'none' : 'lowercase',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                            border: '1px solid rgba(255,255,255,0.1)'
                                        }}>
                                            {formatDate(tool.createdDate)}
                                        </Box>
                                    </Box>
                                    
                                    <Box sx={{ 
                                        height: 0.001, 
                                        backgroundColor: 'divider',
                                        width: '100%'
                                    }} />
                                    
                                    <CardContent sx={{ flexGrow: 1, p: 2.5, display: 'flex', flexDirection: 'column' }}>
                                        <Typography 
                                            variant="h6" 
                                            sx={{ 
                                                fontWeight: 'bold', 
                                                mb: 1.5,
                                                lineHeight: 1.3
                                            }}
                                        >
                                            {GetTitle(tool.label)}
                                        </Typography>
                                        
                                        <Typography 
                                            variant="body2" 
                                            color="text.secondary" 
                                            sx={{ 
                                                mb: 2, 
                                                lineHeight: 1.5,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                flexGrow: 1
                                            }}
                                        >
                                            {GetTitle(tool.description)}
                                        </Typography>
                                        
                                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 'auto' }}>
                                            {tool.tags.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())).map((tag) => (
                                                <Chip 
                                                    key={tag}
                                                    label={GetTitle(tag)} 
                                                    size="small" 
                                                    variant={selectedTags.includes(tag) ? "filled" : "outlined"}
                                                    color={selectedTags.includes(tag) ? "primary" : "default"}
                                                    sx={{ 
                                                        fontSize: '0.7rem',
                                                        height: 20
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Link>
                    </Grid>
                ))}
            </Grid>

            {displayedPages.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                        {GetTitle("No tools match the selected filters")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {GetTitle("Try selecting different tags or clear all filters")}
                    </Typography>
                </Box>
            )}
        </Container>
    );
};

export default Analysis;
