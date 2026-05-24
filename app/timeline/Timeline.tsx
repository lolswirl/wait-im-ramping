"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Typography, Box, Card, Stack, Divider, useMediaQuery, useTheme } from '@mui/material';

import TimelineVisualizer from '@components/TimelineVisualizer/TimelineVisualizer';
import SpecializationSelect from '@components/SpecializationSelect/SpecializationSelect';
import SpellButtons from '@components/SpellButtons/SpellButtons';
import CurrentRotationControl from '@components/CurrentRotationControl/CurrentRotationControl';
import PageHeader from '@components/PageHeader/PageHeader';
import WarningChip from '@components/WarningChip/WarningChip';
import SwirlField from '@components/SwirlField/SwirlField';

import { useSpec } from '@context/SpecContext';

import spell from '@data/spells/spell';
import { CLASSES, specialization, getSpecializationByKey } from '@data/class';
import { getSpellById } from '@data/spells';

import { useRotationManager } from '@hooks/useRotationManager';
import { T } from '@util/T';
import { encodeShare, decodeShare } from '@util/rotationShare';

const Timeline: React.FC<{ title: string; description: string }> = ({ title, description }) => {
    const { spec, setSpec } = useSpec();
    const [spellList, setSpellList] = useState<spell[]>([]);
    const [haste, setHaste] = useState<number | "">(0);
    const skipUrlSync = useRef(false);

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
        setRotations,
        hasRotations,
        onReorderRotation,
    } = useRotationManager();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const encoded = params.get('r');
        if (!encoded) return;
        const payload = decodeShare(encoded, true);
        if (!payload) return;
        const linkedSpec = getSpecializationByKey(payload.spec!);
        if (!linkedSpec) return;
        const hydratedRotations = payload.rotations.map((ids, i) => ({
            id: crypto.randomUUID(),
            name: `Rotation ${i + 1}`,
            steps: ids.flatMap(id => {
                const s = getSpellById(id);
                return s ? [{ ...s, uuid: crypto.randomUUID() }] : [];
            }),
        }));
        skipUrlSync.current = true;
        setSpec(linkedSpec);
        setRotations(hydratedRotations);
    }, []);

    useEffect(() => {
        if (skipUrlSync.current) {
            skipUrlSync.current = false;
            return;
        }
        const params = new URLSearchParams(window.location.search);
        if (rotations.length === 0) {
            params.delete('r');
        } else {
            params.set('r', encodeShare(rotations, spec.key));
        }
        const next = params.toString() ? `?${params.toString()}` : window.location.pathname;
        window.history.replaceState(null, '', next);
    }, [rotations]);

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
                        onSelectPreset={handleSelectPreset}
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
