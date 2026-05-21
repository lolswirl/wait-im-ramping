"use client";
import React from 'react';
import { Box, Card, Typography } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

import SpellButton from '@components/SpellButtons/SpellButton';
import { specialization } from '@data/class';
import spell from '@data/spells/spell';
import { hexToRgb } from '@util/stringManipulation';
import T from '@util/T';

interface PresetSpellsProps {
    spec: specialization | null;
    onSelectRotation: (spells: spell[]) => void;
}

const addUUIDsToRotation = (spells: spell[]): spell[] =>
    spells.map(s => ({ ...s, uuid: s.uuid || uuidv4() }));

const PresetSpells: React.FC<PresetSpellsProps> = ({ spec, onSelectRotation }) => {
    if (!spec) return null;

    const rotationEntries = Object.entries(spec.rotations || {}) as [string, spell[]][];
    const baseColor = hexToRgb(spec.color);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {rotationEntries.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }} variant="body2">
                    <T>No rotations available for {spec.name}</T>
                </Typography>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                    {rotationEntries.map(([, spells], index) => {
                        const darknessFactor = 0.8 - (index * 0.1);
                        const c = {
                            r: Math.max(0, Math.floor(baseColor.r * darknessFactor)),
                            g: Math.max(0, Math.floor(baseColor.g * darknessFactor)),
                            b: Math.max(0, Math.floor(baseColor.b * darknessFactor)),
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
                                    background: `linear-gradient(135deg, rgba(${c.r},${c.g},${c.b},0.1), rgba(${c.r},${c.g},${c.b},0.05))`,
                                    borderColor: `rgba(${c.r},${c.g},${c.b},0.3)`,
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: 4,
                                        borderColor: `rgba(${c.r},${c.g},${c.b},0.5)`,
                                        background: `linear-gradient(135deg, rgba(${c.r},${c.g},${c.b},0.15), rgba(${c.r},${c.g},${c.b},0.08))`,
                                    },
                                }}
                                onClick={() => onSelectRotation(addUUIDsToRotation(spells))}
                            >
                                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center' }}>
                                    {spells.map((spell, i) => (
                                        <SpellButton key={spell.uuid || i} selectedSpell={spell} action={() => void 0}/>
                                    ))}
                                </Box>
                            </Card>
                        );
                    })}
                </Box>
            )}
        </Box>
    );
};

export default PresetSpells;
