import React from 'react';
import { Card, Box, Typography, IconButton, Collapse, LinearProgress, Chip } from '@mui/material';
import { ExpandMore, ExpandLess, DeleteTwoTone } from '@mui/icons-material';
import { RotationResult } from './types';
import SpellButton from "../../../components/SpellButtons/SpellButton";
import { GetTitle } from "../../../util/stringManipulation";
import TALENTS from "../../../data/talents/monk/mistweaver";
import SPELLS from "../../../data/spells/index";

interface RotationCardProps {
    rotation: RotationResult;
    index: number;
    expanded: boolean;
    onToggleExpansion: () => void;
    onDelete: () => void;
    theme: any;
}

export const RotationCard: React.FC<RotationCardProps> = ({ 
    rotation, 
    index, 
    expanded, 
    onToggleExpansion, 
    onDelete,
    theme 
}) => {
    return (
        <Card 
            variant="outlined"
            sx={{ 
                p: 2,
                width: '100%',
                maxWidth: 650,
                mx: 'auto',
                background: `linear-gradient(135deg, rgba(${54 + index * 40}, 162, 235, 0.1), rgba(${54 + index * 40}, 162, 235, 0.05))`,
                borderColor: `rgba(${54 + index * 40}, 162, 235, 0.3)`,
                transition: 'all 0.3s ease',
                position: 'relative',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4,
                    borderColor: `rgba(${54 + index * 40}, 162, 235, 0.5)`,
                }
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {rotation.spells.map((spell, spellIndex) => (
                        <SpellButton
                            key={`${spell.id}-${spellIndex}`}
                            selectedSpell={spell}
                            action={() => {}}
                        />
                    ))}
                </Box>
                <IconButton
                    size="small"
                    onClick={onDelete}
                    color="error"
                >
                    <DeleteTwoTone fontSize="small" />
                </IconButton>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                    {Math.round(rotation.hps).toLocaleString()} {GetTitle("HPS")}
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 1 }}>
                    <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                            {GetTitle("Duration")}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {rotation.duration.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}s
                        </Typography>
                    </Box>
                    
                    <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                            {GetTitle("Total Healing")}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {Math.round(rotation.totalHealing).toLocaleString()}
                        </Typography>
                    </Box>
                    
                    <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                            {GetTitle("Spells Cast")}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {rotation.spells.length.toLocaleString()}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Box sx={{ mt: 2 }}>
                <IconButton
                    onClick={onToggleExpansion}
                    sx={{ 
                        width: '100%', 
                        justifyContent: 'space-between',
                        bgcolor: 'rgba(255,255,255,0.05)',
                        borderRadius: 2,
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                    }}
                >
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {GetTitle("Breakdown")}
                    </Typography>
                    {expanded ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
                
                <Collapse in={expanded}>
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2 }}>
                        {rotation.breakdown.map((item, breakdownIndex) => (
                            <Box key={breakdownIndex} sx={{ mb: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <SpellButton
                                            selectedSpell={
                                                rotation.spells.find(spell => spell.name === item.spellName) || 
                                                SPELLS.RENEWING_MIST || 
                                                rotation.spells[0]
                                            }
                                            action={() => {}}
                                        />
                                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                            {GetTitle(item.spellName)}
                                        </Typography>
                                    </Box>
                                    <Chip 
                                        label={`${item.percentage.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`} 
                                        size="small" 
                                        color="primary" 
                                        variant="outlined"
                                    />
                                </Box>
                                
                                <Box sx={{ mb: 1.5 }}>
                                    <LinearProgress
                                        variant="determinate"
                                        value={item.percentage}
                                        sx={{
                                            height: 8,
                                            borderRadius: 4,
                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: `rgba(${54 + index * 40}, 162, 235, 0.8)`
                                            }
                                        }}
                                    />
                                </Box>
                                
                                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 1 }}>
                                    {(() => {
                                        const healingSources = [
                                            { key: 'chiCocoons', title: 'Chi Cocoon', color: 'rgb(76, 175, 76)', value: item.sources.chiCocoons },
                                            { key: 'baseHealing', title: 'Base', color: 'rgb(76, 175, 76)', value: item.sources.baseHealing },
                                            { key: 'chiJiGusts', title: 'Chi-Ji Gusts', color: 'rgb(255, 152, 0)', value: item.sources.chiJiGusts },
                                            { key: 'ancientTeachings', title: TALENTS.ANCIENT_TEACHINGS.name, color: 'rgb(156, 39, 176)', value: item.sources.ancientTeachings },
                                            { key: 'awakenedJadefire', title: TALENTS.AWAKENED_JADEFIRE.name, color: 'rgb(156, 39, 176)', value: item.sources.awakenedJadefire },
                                            { key: 'envelopingBreath', title: "Enveloping Breath", color: 'rgb(255, 193, 7)', value: item.sources.envelopingBreath },
                                            { key: 'rapidDiffusion', title: "Rapid Diffusion", color: 'rgb(255, 87, 34)', value: item.sources.rapidDiffusion },
                                            { key: 'gustOfMists', title: TALENTS.GUST_OF_MISTS.name, color: 'rgb(33, 150, 243)', value: item.sources.gustOfMists },
                                        ];

                                        return healingSources
                                            .filter(source => source.value > 0)
                                            .map(source => (
                                                <Box 
                                                    key={source.key}
                                                    sx={{ 
                                                        p: 1, 
                                                        bgcolor: `${source.color.replace('rgb', 'rgba').replace(')', ', 0.1)')}`, 
                                                        borderRadius: 1,
                                                        border: `1px solid ${source.color.replace('rgb', 'rgba').replace(')', ', 0.3)')}`
                                                    }}
                                                >
                                                    <Typography variant="caption" sx={{ color: source.color, fontWeight: 'bold' }}>
                                                        {GetTitle(source.title)}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                        {Math.round(source.value).toLocaleString()}
                                                    </Typography>
                                                </Box>
                                            ));
                                    })()}
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Collapse>
            </Box>
        </Card>
    );
};