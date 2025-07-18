import React, { useState, useEffect } from "react";
import { Box, useTheme, Card, Divider, Grid, Button } from "@mui/material";
import { Refresh } from "@mui/icons-material";
import PageHeader from "../../../components/PageHeader/PageHeader.tsx";
import { GetTitle } from "../../../util/stringManipulation.tsx";
import { CLASSES } from "../../../data/class/class.ts";
import SpellButtons from "../../../components/SpellButtons/SpellButtons.tsx";
import { useRotationManager } from "../../../hooks/useRotationManager.ts";
import CurrentRotationControl from "../../../components/CurrentRotationControl/CurrentRotationControl.tsx";
import { RotationCard } from './RotationCard.tsx';
import { calculateRotationHPS } from './simulation.ts';
import { RotationResult, SimulationOptions } from './types.ts';

import { CHIJI_ABILITIES } from "../../../data/spells/monk/mistweaver.ts";

import StatsCard from "./StatsCard.tsx";
import TargetCountsCard from "./TargetCountsCard.tsx";
import TalentsCard from "./TalentsCard.tsx";
import spell from "../../../data/spells/spell.ts";
import TALENTS from "../../../data/talents/monk/mistweaver.ts";
import SHARED from "../../../data/talents/monk/shared.ts";

const ChiJiHPS: React.FC = () => {
    const theme = useTheme();
    const [rotationHPS, setRotationHPS] = useState<RotationResult[]>([]);
    const [expandedRotations, setExpandedRotations] = useState<Set<number>>(new Set());
    const [isSimulating, setIsSimulating] = useState(false);

    const mistweaver = CLASSES.MONK.SPECS.MISTWEAVER;
    const intellect = mistweaver.intellect;
    const mastery = mistweaver.mastery;

    const mistweaverTalents = new Map<spell, boolean>([
        [TALENTS.CELESTIAL_HARMONY, true],
        [TALENTS.JADE_BOND, false],
        [TALENTS.MIST_WRAP, true],
        [TALENTS.CHI_HARMONY, true],
        [TALENTS.CRANE_STYLE, true],
        [TALENTS.RAPID_DIFFUSION, true],
        [TALENTS.JADEFIRE_TEACHINGS, true],
        [TALENTS.AWAKENED_JADEFIRE, true],
    ])

    const sharedTalents = new Map<spell, boolean>([
        [SHARED.FAST_FEET, true],
        [SHARED.FEROCITY_OF_XUEN, true],
        [SHARED.CHI_PROFICIENCY, true],
        [SHARED.MARTIAL_INSTINCTS, true],
    ])
    
    const [options, setOptions] = useState<SimulationOptions>({
        intellect: intellect,
        totalHp: 1729040,
        crit: 0,
        versatility: 0,
        mastery: mastery,
        haste: 20,
        enemyCount: 1,
        allyCount: 5,
        specTalents: mistweaverTalents,
        classTalents: sharedTalents,
    });

    const {
        currentRotation,
        rotations,
        addSpellToRotation,
        removeSpellFromRotation,
        finalizeRotation,
        clearCurrentRotation,
        clearAllRotations,
        removeRotation,
        hasRotations,
    } = useRotationManager();

    const addSpellToRotationCollapse = (spell: any) => {
        addSpellToRotation(spell);
        setExpandedRotations(new Set());
    }

    useEffect(() => {
        const updateHPS = async () => {
            if (rotations.length > 0) {
                setIsSimulating(true);
                try {
                    const hpsData = await Promise.all(
                        rotations.map((rotation, index) => 
                            calculateRotationHPS(rotation.steps, index, options, mistweaver)
                        )
                    );
                    setRotationHPS(hpsData);
                } finally {
                    setIsSimulating(false);
                }
            } else {
                setRotationHPS([]);
            }
        };

        updateHPS();
    }, [rotations, options, mistweaver]);

    const handleRefresh = async () => {
        if (rotations.length > 0) {
            setIsSimulating(true);
            try {
                const hpsData = await Promise.all(
                    rotations.map((rotation, index) => 
                        calculateRotationHPS(rotation.steps, index, options, mistweaver)
                    )
                );
                setRotationHPS(hpsData);
            } finally {
                setIsSimulating(false);
            }
        }
    };

    const toggleRotationExpansion = (index: number) => {
        const newExpanded = new Set(expandedRotations);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedRotations(newExpanded);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <PageHeader 
                title={'Chi-Ji "Simulation"'} 
                subtitle={"Simulate the theoretical HPS outcome of rotations that affect Chi-Ji with tuning knobs for stats, enemy count, and talent choices"} 
            />

            <Card variant="outlined" sx={{ maxWidth: 1200, width: "95%", mx: "auto", mb: rotationHPS.length > 0 ? 0 : 3 }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: '400px' }}>
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2 }}>

                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '700', overflowY: 'auto' }}>
                            <StatsCard options={options} onOptionsChange={setOptions} />
                            <TargetCountsCard options={options} onOptionsChange={setOptions} />
                        </Box>  
                        <Divider sx={{ mx: -2, my: 2, width: "auto" }} />
                        <SpellButtons spells={CHIJI_ABILITIES} addSpellToTable={addSpellToRotationCollapse} />
                        <Divider sx={{ mx: -2, my: 2, width: "auto" }} />
                        <Box sx={{ mt: 0 }}>
                            <CurrentRotationControl
                                currentRotation={currentRotation}
                                onRemoveSpell={removeSpellFromRotation}
                                onFinalizeRotation={finalizeRotation}
                                onClearCurrentRotation={clearCurrentRotation}
                                onClearAllRotations={clearAllRotations}
                                hasRotations={hasRotations}
                            />
                        </Box>
                    </Box>
                    
                    <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
                    <Divider sx={{ display: { md: 'none' } }} />

                    <Box sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '700', overflowY: 'auto' }}>
                        <TalentsCard
                            options={options.specTalents}
                            color={mistweaver.color}
                            onChange={(talent, checked) => {
                                setOptions(prev => ({
                                    ...prev,
                                    specTalents: new Map(prev.specTalents).set(talent, checked)
                                }));
                            }}
                        />
                        <TalentsCard
                            options={options.classTalents} 
                            color={CLASSES.MONK.color}
                            onChange={(talent, checked) => {
                                setOptions(prev => ({
                                    ...prev,
                                    classTalents: new Map(prev.classTalents).set(talent, checked)
                                }));
                            }}
                        />
                        {rotationHPS.length > 0 && (
                            <Button variant="contained" startIcon={<Refresh />} onClick={handleRefresh} disabled={isSimulating} sx={{ textTransform: 'none' }}>
                                {GetTitle(isSimulating ? 'Simulating...' : 'Re-simulate')}
                            </Button>
                        )}
                    </Box>
                </Box>
            </Card>

            {rotationHPS.length > 0 && (
                <>
                    <Box sx={{ width: "100%", maxWidth: 1400, px: 2, mb: 2 }}>
                        <Grid container spacing={2}>
                            {rotationHPS.map((rotation, index) => (
                                <Grid 
                                    item 
                                    xs={12} 
                                    md={rotationHPS.length === 1 ? 12 : 6} 
                                    lg={rotationHPS.length === 1 ? 12 : rotationHPS.length === 2 ? 6 : 4} 
                                    key={index}
                                >
                                    <RotationCard
                                        rotation={rotation}
                                        index={index}
                                        expanded={expandedRotations.has(index)}
                                        onToggleExpansion={() => toggleRotationExpansion(index)}
                                        onDelete={() => removeRotation(rotations[index].id)}
                                        theme={theme}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </>
            )}
        </div>
    );
};

export default ChiJiHPS;