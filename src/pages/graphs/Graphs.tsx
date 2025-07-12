import React, { useState, useMemo } from "react";
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
import { useNavigate } from "react-router-dom";
import { graphPages } from "./GraphPages.tsx";
import { getCapsMode, GetTitle } from "../../util/stringManipulation.tsx";
import PageTitle from "../../components/PageTitle/PageTitle.tsx";

const title = "Graphs & Analysis Tools";

const Graphs = () => {
    const navigate = useNavigate();
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    
    const filteredGraphPages = graphPages.filter(
        (graph) => graph.label.toLowerCase() !== "graphs"
    );

    const allTags = useMemo(() => {
        const tags = new Set<string>();
        filteredGraphPages.forEach(graph => {
            graph.tags.forEach(tag => tags.add(tag));
        });
        return Array.from(tags).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    }, [filteredGraphPages]);

    const displayedPages = useMemo(() => {
        let filtered = filteredGraphPages;
        
        if (selectedTags.length > 0) {
            filtered = filtered.filter(graph => 
                selectedTags.every(selectedTag => graph.tags.includes(selectedTag))
            );
        }
        
        return filtered.sort((a, b) => 
            new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
        );
    }, [filteredGraphPages, selectedTags]);

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
        <Container sx={{ mt: 2, mb: 4 }}>
            <PageTitle title={GetTitle(title)} />
            <h1 style={{ marginBottom: "0px" }}>
                {GetTitle(title)}
            </h1>
            
            <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3, maxWidth: 700, mx: 'auto' }}>
                {GetTitle("Interactive graphs & tools for analyzing healing and damage mechanics, rotation optimizations, probability simulations, and more!")}
            </Typography>

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
                                {GetTitle(`${displayedPages.length} of ${filteredGraphPages.length} tools`)}
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
                {displayedPages.map((graph) => {
                    
                    return (
                        <Grid item xs={12} sm={6} md={4} key={graph.path}>
                            <Card 
                                variant="outlined" 
                                sx={{ 
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        boxShadow: 6,
                                        transform: 'translateY(-4px)',
                                        borderColor: 'primary.main'
                                    }
                                }}
                            >
                                <CardActionArea 
                                    onClick={() => navigate(graph.path)}
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
                                            backgroundImage: `url(${graph.preview})`,
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
                                            {formatDate(graph.createdDate)}
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
                                            {GetTitle(graph.label)}
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
                                            {GetTitle(graph.description)}
                                        </Typography>
                                        
                                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 'auto' }}>
                                            {graph.tags.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())).map((tag) => (
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
                        </Grid>
                    );
                })}
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

export default Graphs;
