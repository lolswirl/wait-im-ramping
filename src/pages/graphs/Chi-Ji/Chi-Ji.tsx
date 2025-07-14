import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Box, useTheme, Typography, Card, Divider, TextField, Grid, Checkbox, Button } from "@mui/material";
import { Refresh } from "@mui/icons-material";
import PageTitle from "../../../components/PageTitle/PageTitle.tsx";
import { GetTitle } from "../../../util/stringManipulation.tsx";
import { CLASSES } from "../../../data/class/class.ts";
import SpellButtons from "../../../components/SpellButtons/SpellButtons.tsx";
import { useRotationManager } from "../../../hooks/useRotationManager.ts";
import CurrentRotationControl from "../../../components/CurrentRotationControl/CurrentRotationControl.tsx";
import { RotationCard } from './RotationCard.tsx';
import { calculateRotationHPS } from './simulation.ts';
import { RotationResult, SimulationOptions } from './types.ts';

import StatsCard from "./StatsCard.tsx";
import TargetCountsCard from "./TargetCountsCard.tsx";
import TalentsCard from "./TalentsCard.tsx";

const ChiJiHPS: React.FC = () => {
    const theme = useTheme();
    const [rotationHPS, setRotationHPS] = useState<RotationResult[]>([]);
    const [expandedRotations, setExpandedRotations] = useState<Set<number>>(new Set());
    const [isSimulating, setIsSimulating] = useState(false);

    const mistweaver = CLASSES.MONK.SPECS.MISTWEAVER;
    const intellect = mistweaver.intellect;
    const mastery = mistweaver.mastery;
    
    const [options, setOptions] = useState<SimulationOptions>({
        intellect: intellect,
        totalHp: 1729040,
        crit: 0,
        versatility: 0,
        mastery: mastery,
        haste: 20,
        enemyCount: 1,
        allyCount: 5,
        celestialHarmony: true,
        jadeBond: false,
        mistWrap: true,
        chiHarmony: true,
        craneStyle: true,
        jadefireTeachings: true,
        awakenedJadefire: true,
    });

    const {
        currentRotation,
        rotations,
        addSpellToRotation,
        removeSpellFromRotation,
        finalizeRotation,
        clearCurrentRotation,
        clearAllRotations,
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
    }, [rotations, options]);

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

    const chartData = {
        labels: rotationHPS.map((rotation, index) => GetTitle(`${index + 1}`)),
        datasets: [{
            label: "HPS",
            data: rotationHPS.map(rotation => rotation.hps),
            backgroundColor: rotationHPS.map((_, index) => `rgba(${54 + index * 40}, 162, 235, 0.8)`),
            borderColor: rotationHPS.map((_, index) => `rgba(${54 + index * 40}, 162, 235, 1)`),
            borderWidth: 2,
        }],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            title: { display: true, text: GetTitle("Chi-Ji HPS Comparison") },
            tooltip: {
                mode: "index" as const,
                intersect: false,
                callbacks: {
                    label: function(context: any) {
                        const rotationData = rotationHPS[context.dataIndex];
                        return [
                            `HPS: ${context.parsed.y.toLocaleString()}`,
                            `Total Healing: ${rotationData.totalHealing.toLocaleString()}`,
                            `Duration: ${rotationData.duration.toFixed(1)}s`,
                            `Spells Cast: ${rotationData.spells.length}`
                        ];
                    }
                }
            },
            legend: { display: false },
        },
        scales: {
            x: { title: { display: true, text: GetTitle("Rotations") } },
            y: { title: { display: true, text: GetTitle("HPS") }, beginAtZero: true },
        },
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <PageTitle title={GetTitle("Chi-Ji HPS!")} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0 }}>
                <h1 style={{ marginBottom: "0px" }}>{GetTitle("Chi-Ji HPS")}</h1>
            </Box>

            <Card variant="outlined" sx={{ maxWidth: 1200, width: "100%", mx: "auto" }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: '400px' }}>
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
                        <SpellButtons selectedSpec={mistweaver} addSpellToTable={addSpellToRotationCollapse} />
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

                    <Box sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '700', overflowY: 'auto' }}>
                        <StatsCard options={options} onOptionsChange={setOptions} />
                        <TargetCountsCard options={options} onOptionsChange={setOptions} />
                        <TalentsCard options={options} onOptionsChange={setOptions} />
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
                    <Box sx={{ width: "100%", maxWidth: 1400, px: 2 }}>
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
                                        theme={theme}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                    <Box sx={{ height: 400, width: 600, display: "flex", justifyContent: "center", mb: 3 }}>
                        <Bar data={chartData} options={chartOptions} />
                    </Box>
                </>
            )}
        </div>
    );
};

export default ChiJiHPS;