"use client";
import React, { useState } from 'react';
import { Typography, Box, Card, Stack, Divider, Dialog, DialogContent, Fade, useMediaQuery, useTheme } from '@mui/material';

import TimelineVisualizer from '@components/TimelineVisualizer/TimelineVisualizer';
import SpecializationSelect from '@components/SpecializationSelect/SpecializationSelect';
import SpellButtons from '@components/SpellButtons/SpellButtons';
import CurrentRotationControl from '@components/CurrentRotationControl/CurrentRotationControl';
import PageHeader from '@components/PageHeader/PageHeader';
import PresetSpells from '@components/PresetSpells/PresetSpells';
import WarningChip from '@components/WarningChip/WarningChip';
import SwirlField from '@components/SwirlField/SwirlField';
import { RAINBOW_GRADIENT } from '@components/Buttons/RainbowCard';

import { useSpec } from '@context/SpecContext';

import spell from '@data/spells/spell';
import { CLASSES, specialization } from '@data/class';

import { useRotationManager } from '@hooks/useRotationManager';
import { T } from '@util/T';

const Timeline: React.FC<{ title: string; description: string }> = ({ title, description }) => {
    const { spec, setSpec } = useSpec();
    const [spellList, setSpellList] = useState<spell[]>([]);
    const [haste, setHaste] = useState<number | "">(0);
    const [presetOpen, setPresetOpen] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const {
        currentRotation,
        rotations,
        addSpellToRotation,
        removeSpellFromRotation,
        finalizeRotation,
        clearCurrentRotation,
        clearAllRotations,
        removeRotation,
        moveRotationUp,
        moveRotationDown,
        setCurrentRotation,
        hasRotations,
        onReorderRotation,
    } = useRotationManager();

    const handleSpecChange = (newSpec: specialization) => {
        if (spellList.length > 0) {
            setSpellList([]);
            console.warn("You cannot change specialization while spells are in the table. Table cleared.");
        }
        setSpec(newSpec);
        clearCurrentRotation();
        clearAllRotations();
    };

    const handleSelectPreset = (spells: spell[]) => {
        setCurrentRotation(spells);
        setPresetOpen(false);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <PageHeader title={title} subtitle={description} />

            {isMobile && (
                <Box sx={{ mb: 2, px: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="textSecondary">
                        <T>
                            For the best experience, rotate your device to <b>horizontal (landscape)</b> mode.
                        </T>
                    </Typography>
                </Box>
            )}

            <Card
                variant="outlined"
                sx={{
                    overflowX: { xs: 'auto', md: 'visible' },
                    maxWidth: { xs: '90%', sm: '90%', md: 600 },
                    width: { xs: '90%', sm: '90%', md: '100%' },
                    mx: 'auto',
                    mb: { xs: 2, sm: 3 },
                    boxSizing: 'border-box',
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', p: 2 }}>
                    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <SpecializationSelect selectedSpec={spec} onSpecChange={handleSpecChange} />
                        <SwirlField label="Haste" value={haste} onChange={setHaste} suffix="%" />
                    </Stack>

                    {spec !== CLASSES.MONK.SPECS.MISTWEAVER && (
                        <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'center' }}>
                            <WarningChip
                                message="This spec has limited support for cast time reductions and haste buff gains"
                                showIcon
                                borderColor="#ffa726"
                            />
                        </Box>
                    )}

                    <Divider sx={{ mx: -2, my: 2, width: 'auto' }} />

                    <SpellButtons
                        selectedSpec={spec}
                        addSpellToTable={addSpellToRotation}
                        appendSlot={spec && (
                            <Box
                                onClick={() => setPresetOpen(true)}
                                sx={{
                                    width: 89,
                                    height: 42,
                                    borderRadius: '4px',
                                    border: '1px solid transparent',
                                    background: (theme) => `linear-gradient(${theme.palette.background.paper}, ${theme.palette.background.paper}) padding-box, ${theme.palette.divider} border-box`,
                                    boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'transform 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        background: (theme) => `linear-gradient(${theme.palette.background.paper}, ${theme.palette.background.paper}) padding-box, ${RAINBOW_GRADIENT} border-box`,
                                    },
                                }}
                            >
                                <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', lineHeight: 1.2 }}>
                                    <T>Preset Spells</T>
                                </Typography>
                            </Box>
                        )}
                    />

                    <Divider sx={{ mx: -2, my: 2, width: 'auto' }} />

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
            </Card>

            <Dialog
                open={presetOpen}
                onClose={() => setPresetOpen(false)}
                maxWidth="sm"
                fullWidth
                slots={{ transition: Fade }}
                slotProps={{
                    transition: { timeout: 200 },
                    paper: {
                        elevation: 8,
                        sx: {
                            borderRadius: 1,
                            width: 'auto',
                            backgroundColor: 'rgba(26, 26, 26, 0.2)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
                            overflow: 'hidden',
                        },
                    },
                    backdrop: {
                        sx: {
                            backgroundColor: 'rgba(0, 0, 0, 0.4)',
                            backdropFilter: 'blur(4px)',
                        },
                    },
                }}
            >
                <DialogContent sx={{ p: 2, backgroundColor: 'rgba(18, 18, 18, 0.6)' }}>
                    <PresetSpells spec={spec} onSelectRotation={handleSelectPreset} />
                </DialogContent>
            </Dialog>

            <TimelineVisualizer
                selectedSpec={spec}
                haste={haste === "" ? 0 : haste}
                rotations={rotations}
                onRemoveRotation={removeRotation}
                onMoveRotationUp={moveRotationUp}
                onMoveRotationDown={moveRotationDown}
            />
        </div>
    );
};

export default Timeline;
