"use client";
import React, { useState } from 'react';
import {Typography, FormControl, InputLabel, OutlinedInput, Box, Card, Stack, Divider, FormControlLabel, Switch, Chip, IconButton, Collapse, CardHeader, CardContent } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';

import TimelineVisualizer from '@components/TimelineVisualizer/TimelineVisualizer';
import SpecializationSelect from '@components/SpecializationSelect/SpecializationSelect';
import SpellButtons from '@components/SpellButtons/SpellButtons';
import SpellButton from '@components/SpellButtons/SpellButton';
import CurrentRotationControl from '@components/CurrentRotationControl/CurrentRotationControl';
import PageHeader from '@components/PageHeader/PageHeader';

import { useSpec } from '@context/SpecContext';

import spell from '@data/spells/spell';
import { CLASSES, specialization } from '@data/class';

import { useRotationManager } from '@hooks/useRotationManager';
import { GetTitle, hexToRgb } from '@util/stringManipulation';

const Timeline: React.FC<{ title: string; description: string }> = ({ title, description }) => {
    const { spec, setSpec } = useSpec();
    const [spellList, setSpellList] = useState<spell[]>([]);
    const [condense, setCondense] = useState(true);
    const [prebuiltExpanded, setPrebuiltExpanded] = useState(false);

    const {
        currentRotation,
        rotations,
        addSpellToRotation,
        removeSpellFromRotation,
        finalizeRotation,
        clearCurrentRotation,
        clearAllRotations,
        setCurrentRotation,
        hasRotations,
        onReorderRotation,
    } = useRotationManager();

    const handleSetCondense = (value: boolean) => {
        setCondense(value);
    };

    const handleSpecChange = (newSpec: specialization) => {
        if (spellList.length === 0) {
          setSpec(newSpec);
        } else {
          clearTable();
          setSpec(newSpec);
          console.warn("You cannot change specialization while spells are in the table. Table cleared.");
        }
        clearCurrentRotation();
        clearAllRotations();
    };

    const clearTable = () => {
        setSpellList([]);
    };

    const PrebuiltRotations = () => {
        if (!spec) return null;

        const rotationEntries = Object.entries(spec.rotations || {}) as [string, spell[]][];

        const addUUIDsToRotation = (spells: spell[]) => {
            return spells.map(spell => ({
                ...spell,
                uuid: spell.uuid || uuidv4(),
            }));
        };

        const baseColor = hexToRgb(spec.color);

        return (
            <Box sx={{ width: '100%' }}>
                <Box 
                    sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        width: '100%',
                        cursor: 'pointer',
                        userSelect: 'none',
                        py: 1,
                        px: 1.5,
                        mb: prebuiltExpanded ? 1 : 0,
                        borderRadius: 1,
                        border: '1px solid',
                        transition: 'all 0.2s ease',
                        backgroundColor: 'primary',
                        borderColor: 'divider',
                        '&:hover': {
                            backgroundColor: 'action.selected',
                            borderColor: 'primary.main',
                            boxShadow: 1,
                        }
                    }}
                    onClick={() => setPrebuiltExpanded(!prebuiltExpanded)}
                >
                    <Typography 
                        variant="body1"
                    >
                        {GetTitle("Prebuilt Rotations")}
                    </Typography>
                    <ExpandMore
                        sx={{
                            transform: prebuiltExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                            transition: 'transform 0.2s ease',
                            color: 'action.active'
                        }}
                    />
                </Box>
                
                <Collapse in={prebuiltExpanded}>
                    <Box sx={{ px: 0, pb: 0 }}>
                        {rotationEntries.length === 0 ? (
                            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                                No rotations available for {spec.name}
                            </Typography>
                        ) : (
                            <Box
                                sx={{
                                    columnCount: { xs: 1, sm: 1, md: 1 },
                                    columnGap: 1.5,
                                    columnFill: 'balance',
                            }}
                            >
                                {rotationEntries.map(([rotationName, spells], index) => {
                                    const darknessFactor = 0.8 - (index * 0.1);
                                    const adjustedColor = {
                                        r: Math.max(0, Math.floor(baseColor.r * darknessFactor)),
                                        g: Math.max(0, Math.floor(baseColor.g * darknessFactor)),
                                        b: Math.max(0, Math.floor(baseColor.b * darknessFactor))
                                    };

                                    return (
                                        <Card 
                                            key={index}
                                            variant="outlined" 
                                            sx={{ 
                                                p: 1,
                                                px: 2,
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                background: `linear-gradient(135deg, rgba(${adjustedColor.r}, ${adjustedColor.g}, ${adjustedColor.b}, 0.1), rgba(${adjustedColor.r}, ${adjustedColor.g}, ${adjustedColor.b}, 0.05))`,
                                                borderColor: `rgba(${adjustedColor.r}, ${adjustedColor.g}, ${adjustedColor.b}, 0.3)`,
                                                breakInside: 'avoid',
                                                marginBottom: index !== rotationEntries.length - 1 ? 0.5 : 0,
                                                display: 'inline-block',
                                                width: '100%',
                                                boxSizing: 'border-box',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: 4,
                                                    borderColor: `rgba(${adjustedColor.r}, ${adjustedColor.g}, ${adjustedColor.b}, 0.5)`,
                                                    background: `linear-gradient(135deg, rgba(${adjustedColor.r}, ${adjustedColor.g}, ${adjustedColor.b}, 0.15), rgba(${adjustedColor.r}, ${adjustedColor.g}, ${adjustedColor.b}, 0.08))`,
                                                }
                                            }}
                                            onClick={() => setCurrentRotation(addUUIDsToRotation(spells))}
                                        >
                                            <Box sx={{ 
                                                display: 'flex', 
                                                gap: 0.5, 
                                                flexWrap: 'wrap',
                                                justifyContent: 'center'
                                            }}>
                                                {spells.map((spell, i) => (
                                                    <SpellButton 
                                                        key={spell.uuid || i} 
                                                        selectedSpell={spell} 
                                                        action={() => {}}
                                                    />
                                                ))}
                                            </Box>
                                        </Card>
                                    );
                                })}
                            </Box>
                        )}
                    </Box>
                </Collapse>
            </Box>
        );
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <PageHeader 
                title={title} 
                subtitle={description} 
            />
            
            {/* warn for horizontal mode on mobile */}
            <Box sx={{ display: { xs: "block", md: "none" }, mb: 2, px: 2, textAlign: "center" }}>
                <Typography variant="body2" color="textSecondary">
                    {GetTitle("For the best experience, rotate your device to")}{" "}
                    <b>{GetTitle("horizontal (landscape)")}</b>{" "}
                    {GetTitle("mode.")}
                </Typography>
            </Box>

            <Card variant="outlined"
                sx={{
                    overflowX: { xs: 'auto', md: 'visible' },
                    maxWidth: { xs: '90%', sm: '90%', md: 600 },
                    width: { xs: "90%", sm: "90%", md: "100%" },
                    mx: "auto",
                    mb: { xs: 2, sm: 3 },
                    boxSizing: "border-box",
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', p: 2, }}>
                    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <SpecializationSelect selectedSpec={spec} onSpecChange={handleSpecChange} />
                        <FormControl
                            variant="outlined"
                            sx={{
                                minWidth: 120,
                                maxWidth: 250,
                                ml: 2,
                            }}
                        >
                            <InputLabel shrink htmlFor="options-outlined">
                                {GetTitle("Options")}
                            </InputLabel>
                            <OutlinedInput
                                id="options-outlined"
                                label={GetTitle("Options")}
                                notched
                                readOnly
                                inputComponent="span"
                                inputProps={{
                                    style: {
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                        width: "100%",
                                        minHeight: 44,
                                        padding: 0,
                                    },
                                    children: (
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={condense}
                                                    onChange={(e) => handleSetCondense(e.target.checked)}
                                                    color="primary"
                                                    size="small"
                                                />
                                            }
                                            label={GetTitle("Condensed")}
                                            sx={{ ml: 1 }}
                                        />
                                    ),
                                }}
                                sx={{
                                    height: 45,
                                    alignItems: "center",
                                    py: 1,
                                    width: "100%",
                                }}
                            />
                        </FormControl>
                    </Stack>

                    {spec !== CLASSES.MONK.SPECS.MISTWEAVER && (
                        <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'center' }}>
                            <Chip 
                                label={GetTitle("This spec has limited support for cast time reductions and haste buff gains")} 
                                color="warning" 
                                size="small"
                                variant="outlined"
                                sx={{ 
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    px: 1.5,
                                    py: 0.5,
                                    '& .MuiChip-label': {
                                        px: 1
                                    },
                                    borderColor: 'warning.main',
                                    backgroundColor: 'rgba(255, 152, 0, 0.08)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 152, 0, 0.12)',
                                    }
                                }}
                            />
                        </Box>
                    )}

                    <Divider sx={{ mx: -2, my: 2, width: "auto" }} />

                    <SpellButtons selectedSpec={spec} addSpellToTable={addSpellToRotation} />
                    
                    <Divider sx={{ mx: -2, my: 2, width: "auto" }} />

                    <PrebuiltRotations />

                    <Divider sx={{ mx: -2, my: 2, width: "auto" }} />

                    <Box sx={{ mt: 0 }}>
                        {spec && (
                            <CurrentRotationControl
                                currentRotation={currentRotation}
                                onRemoveSpell={removeSpellFromRotation}
                                onFinalizeRotation={finalizeRotation}
                                onClearCurrentRotation={clearCurrentRotation}
                                onClearAllRotations={clearAllRotations}
                                hasRotations={hasRotations}
                                onReorderRotation={onReorderRotation}
                            />
                        )}
                    </Box>
                </Box>
            </Card>

            <TimelineVisualizer 
                selectedSpec={spec} 
                condense={condense} 
                rotations={rotations.map(rotation => rotation.steps)} 
            />
        </div>
    );
};

export default Timeline;
