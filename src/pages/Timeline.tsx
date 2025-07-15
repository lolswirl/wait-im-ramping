import React, { useState } from 'react';
import TimelineVisualizer from '../components/TimelineVisualizer/TimelineVisualizer.tsx';
import SpecializationSelect from '../components/SpecializationSelect/SpecializationSelect.tsx';
import SpellButtons from '../components/SpellButtons/SpellButtons.tsx';
import SpellButton from '../components/SpellButtons/SpellButton.tsx';
import CurrentRotationControl from '../components/CurrentRotationControl/CurrentRotationControl.tsx';
import {Typography, FormControl, InputLabel, OutlinedInput, Box, Card, Stack, Divider, FormControlLabel, Switch, Chip } from '@mui/material';
import spell from '../data/spells/spell.ts';
import { CLASSES, specialization } from '../data/class/class.ts';
import { v4 as uuidv4 } from 'uuid';
import PageTitle from "../components/PageTitle/PageTitle.tsx";
import { GetTitle } from '../util/stringManipulation.tsx';
import { useSpec } from '../context/SpecContext.tsx';
import { useRotationManager } from '../hooks/useRotationManager.ts';

const Timeline = () => {
    const { spec, setSpec } = useSpec();
    const [spellList, setSpellList] = useState<spell[]>([]);
    const [condense, setCondense] = useState(true);

    const {
        currentRotation,
        rotations,
        addSpellToRotation,
        removeSpellFromRotation,
        finalizeRotation,
        clearCurrentRotation,
        clearAllRotations,
        setCurrentRotation,
        hasRotations
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

        if (!spec?.rotations) {
            return <Typography>No rotations available for {spec.name}</Typography>;
        }

        // rotations is an object, convert to entries array: [rotationName, spell[]]
        const rotationEntries = Object.entries(spec.rotations) as [string, spell[]][];

        const addUUIDsToRotation = (spells: spell[]) => {
            return spells.map(spell => ({
                ...spell,
                uuid: spell.uuid || uuidv4(),
            }));
        };

        // Helper function to convert hex to RGB
        const hexToRgb = (hex: string) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : { r: 54, g: 162, b: 235 }; // fallback blue
        };

        const baseColor = hexToRgb(spec.color);

        return (
            <Box sx={{ width: '100%' }}>
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
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    background: `linear-gradient(135deg, rgba(${adjustedColor.r}, ${adjustedColor.g}, ${adjustedColor.b}, 0.1), rgba(${adjustedColor.r}, ${adjustedColor.g}, ${adjustedColor.b}, 0.05))`,
                                    borderColor: `rgba(${adjustedColor.r}, ${adjustedColor.g}, ${adjustedColor.b}, 0.3)`,
                                    breakInside: 'avoid',
                                    marginBottom: index !== rotationEntries.length - 1 ? 0.5 : 0,
                                    display: 'inline-block',
                                    width: '100%',
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
            </Box>
        );
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <PageTitle title={GetTitle("Spell Timeline!")} />
            <h1 style={{ marginBottom: "0px" }}>{GetTitle("Spell Timeline!")}</h1>

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
                                    height: "auto",
                                    alignItems: "center",
                                    py: 1,
                                    width: "100%",
                                }}
                            />
                        </FormControl>
                    </Stack>

                    {spec !== CLASSES.MONK.SPECS.MISTWEAVER && (
                        <Box sx={{ mt: 2}}>
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
