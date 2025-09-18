"use client";
import React, { useState, useMemo, useCallback } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { 
    Box, 
    Container, 
    TextField, 
    Typography, 
    useTheme, 
    FormControl, 
    InputLabel,
    Card,
    Stack,
    Divider,
    IconButton,
    OutlinedInput,
    Grid
} from "@mui/material";
import { DeleteTwoTone } from "@mui/icons-material";

import PageHeader from "@components/PageHeader/PageHeader";
import SpellButton from "@components/SpellButtons/SpellButton";
import CurrentRotationControl from "@components/CurrentRotationControl/CurrentRotationControl";
import { TalentOption } from "@components/TalentsCard/TalentsCard";

import { MISTWEAVER_SPELLS } from "@data/specs/monk/mistweaver/spells";
import TALENTS from "@data/specs/monk/mistweaver/talents";
import type Spell from "@data/spells/spell";

import { useRotationManager } from "@hooks/useRotationManager";
import { GetTitle, pluralize, hexToRgb } from "@util/stringManipulation";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ROTATION_CARD_WIDTH = 600;
const MIN_INPUT_VALUE = 1;

const DEFAULT_STATS = {
    rotationResetChance: 0,
    attemptsChance: 0,
    resetsPerGCD: 0,
    totalHits: 0,
    totalGCDs: 0
};

const ProgressBar: React.FC<{
    label: string;
    value: string;
    percentage: number;
    color: string;
    rightContent?: React.ReactNode;
}> = ({ label, value, percentage, color, rightContent }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption">{GetTitle(label)}</Typography>
                <Typography variant="caption" fontWeight="bold">{value}</Typography>
            </Box>
            <Box sx={{ 
                height: 8, 
                backgroundColor: 'grey.300', 
                borderRadius: 1,
                overflow: 'hidden'
            }}>
                <Box sx={{ 
                    height: '100%', 
                    width: `${Math.min(percentage, 100)}%`,
                    backgroundColor: color,
                    transition: 'width 0.3s ease'
                }} />
            </Box>
        </Box>
        {rightContent}
    </Box>
);

const SpellInfoDisplay: React.FC<{
    awakenedJadefire: boolean;
    targets: number;
    totmResetChance: number;
}> = ({ awakenedJadefire, targets, totmResetChance }) => (
    <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'flex-start',
        gap: 1,
        p: 2,
        backgroundColor: 'background.paper',
        borderRadius: 1,
        border: 1,
        borderColor: 'divider'
    }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'medium', minWidth: 100 }}>
                {GetTitle("Tiger Palm:")}
            </Typography>
            <Typography variant="body2" color="primary.main" sx={{ fontWeight: 'bold' }}>
                {awakenedJadefire ? '2' : '1'} {GetTitle(pluralize(awakenedJadefire, 'hit'))}
            </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'medium', minWidth: 100 }}>
                {GetTitle("Blackout Kick:")}
            </Typography>
            <Typography variant="body2" color="secondary.main" sx={{ fontWeight: 'bold' }}>
                {awakenedJadefire ? Math.min(3, targets) : 1} {GetTitle(pluralize(awakenedJadefire ? Math.min(3, targets) : 1, 'hit'))}
            </Typography>
            <Typography variant="caption" color="text.secondary">
                ({targets} {GetTitle(pluralize(targets, "target"))})
            </Typography>
        </Box>
        
        <Divider sx={{ width: '100%', my: 1 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'medium', minWidth: 100 }}>
                {GetTitle("Reset Chance:")}
            </Typography>
            <Typography variant="body2" color="warning.main" sx={{ fontWeight: 'bold' }}>
                {(totmResetChance * 100)}% {GetTitle("per blackout kick")}
            </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'medium', minWidth: 100 }}>
                {GetTitle("Formula:")}
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.9em' }}>
                1 - (reset %)<sup>boks</sup>
            </Typography>
        </Box>
    </Box>
);

const cardSx = {
    maxWidth: ROTATION_CARD_WIDTH,
    width: { xs: "90%", sm: "90%", md: "100%" },
    mx: "auto",
    p: 2,
    boxSizing: "border-box",
};

const rotationItemSx = (isDark: boolean) => ({
    p: 2, 
    border: 1, 
    borderColor: 'divider', 
    borderRadius: 1,
    backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5'
});

const createChartData = (rotations: any[], calculateRotationStats: Function) => ({
    labels: rotations.map(r => r.name),
    datasets: [
        {
            label: GetTitle("Reset Chance (%)"),
            data: rotations.map(r => calculateRotationStats(r.steps).rotationResetChance),
            borderColor: "rgba(255, 99, 132, 0.6)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            fill: false,
            yAxisID: 'y',
        },
        {
            label: GetTitle("Resets per GCD"),
            data: rotations.map(r => calculateRotationStats(r.steps).resetsPerGCD),
            borderColor: "rgba(54, 162, 235, 0.6)",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            fill: false,
            yAxisID: 'y1',
        },
    ],
});

const createChartOptions = (theme: any, rotations: any[], calculateRotationStats: Function) => ({
    responsive: true,
    plugins: {
        tooltip: {
            mode: "index" as const,
            intersect: false,
            callbacks: {
                label: function(context: any) {
                    const rotationIndex = context.dataIndex;
                    const rotation = rotations[rotationIndex];
                    const stats = calculateRotationStats(rotation.steps);
                    
                    if (context.datasetIndex === 0) {
                        return ` ${context.dataset.label}: ${stats.rotationResetChance.toFixed(1)}%`;
                    } else {
                        return ` ${context.dataset.label}: ${stats.resetsPerGCD.toFixed(3)}`;
                    }
                }
            }
        },
        legend: {
            position: 'top' as const,
        },
    },
    scales: {
        x: {
            title: {
                display: true,
                text: GetTitle("Rotations"),
            },
            grid: {
                color: theme.custom.chart.gridColor,
            },
        },
        y: {
            type: 'linear' as const,
            display: true,
            position: 'left' as const,
            title: {
                display: true,
                text: GetTitle("Reset Chance (%)"),
            },
            beginAtZero: true,
            max: 100,
            grid: {
                color: theme.custom.chart.gridColor,
            },
        },
        y1: {
            type: 'linear' as const,
            display: true,
            position: 'right' as const,
            title: {
                display: true,
                text: GetTitle("Resets per GCD"),
            },
            beginAtZero: true,
            grid: {
                drawOnChartArea: false,
            },
        },
    },
});

const RisingSunKickResets: React.FC<{ title: string; description: string }> = ({ title, description }) => {
    const theme = useTheme();
    const [attempts, setAttempts] = useState<number>(1);
    const [targets, setTargets] = useState<number>(1);
    
    const [selectedTalents, setSelectedTalents] = useState(new Map([[TALENTS.AWAKENED_JADEFIRE, false]]));
    const awakenedJadefire = selectedTalents.get(TALENTS.AWAKENED_JADEFIRE) || false;
    
    const totm = TALENTS.TEACHINGS_OF_THE_MONASTERY;
    const totmResetChance = totm.custom.resetChance;
    
    // Get RGB values for TalentOption
    const rgb = hexToRgb("4ea55c");
    
    const generateRotationName = (steps: Spell[]) => {
        if (steps.length === 0) return GetTitle("Empty Rotation");
        return steps.map(step => {
            if (step.id === MISTWEAVER_SPELLS.TIGER_PALM.id) {
                return GetTitle('TP');
            } else if (step.id === MISTWEAVER_SPELLS.BLACKOUT_KICK.id) {
                return GetTitle('BOK');
            }
            return GetTitle(step.name);
        }).join(' → ');
    };

    const validateSpell = (spell: Spell) => {
        return spell.id === MISTWEAVER_SPELLS.TIGER_PALM.id || 
               spell.id === MISTWEAVER_SPELLS.BLACKOUT_KICK.id;
    };

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
        onReorderRotation,
    } = useRotationManager({
        generateRotationName,
        validateSpell
    });
    
    const calculateRotationStats = useCallback((steps: Spell[]) => {
        let totalHits = 0;
        let totalGCDs = steps.length;
        
        if (steps.length === 0) {
            return DEFAULT_STATS;
        }
        
        let totmStacks = 0;
        steps.forEach(step => {
            if (step.id === MISTWEAVER_SPELLS.TIGER_PALM.id) {
                const stacksToAdd = awakenedJadefire ? 2 : 1;
                totmStacks = Math.min(totmStacks + stacksToAdd, totm.custom.maxStacks);
            } else if (step.id === MISTWEAVER_SPELLS.BLACKOUT_KICK.id) {
                const totalBokHits = 1 + totmStacks;
                const hitsPerTarget = awakenedJadefire ? Math.min(3, targets) : 1;
                totalHits += totalBokHits * hitsPerTarget;
                totmStacks = 0;
            }
        });
        
        const noResetChance = Math.pow(1 - totmResetChance, totalHits);
        const atLeastOneResetChance = 1 - noResetChance;
        const resetsPerGCD = atLeastOneResetChance / totalGCDs;
        const attemptsChance = (1 - Math.pow(1 - atLeastOneResetChance, attempts));
        
        return {
            rotationResetChance: atLeastOneResetChance * 100,
            attemptsChance,
            resetsPerGCD,
            totalHits,
            totalGCDs
        };
    }, [awakenedJadefire, targets, attempts, totm.custom.maxStacks, totmResetChance]);
    
    const chartData = useMemo(() => 
        createChartData(rotations, calculateRotationStats), 
        [rotations, calculateRotationStats]
    );

    const chartOptions = useMemo(() => 
        createChartOptions(theme, rotations, calculateRotationStats), 
        [theme, rotations, calculateRotationStats]
    );

    const handleTalentChange = (key: Spell, checked: boolean) => {
        setSelectedTalents(prevTalents => {
            const newTalents = new Map(prevTalents);
            newTalents.set(key, checked);
            return newTalents;
        });
    };
    
    return (
        <Container sx={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", justifyContent: "center" }}>
            <PageHeader
                title={title}
                subtitle={description}
            />
            
            <Card variant="outlined" sx={cardSx}>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <SpellInfoDisplay 
                        awakenedJadefire={awakenedJadefire}
                        targets={targets}
                        totmResetChance={totmResetChance}
                    />

                    <Box sx={{  
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: 1.6,
                        width: '45%',
                        alignItems: 'stretch'
                    }}>
                        <TextField
                            label={GetTitle("Reset Attempts")}
                            type="number"
                            value={attempts}
                            onChange={(e) => setAttempts(Math.max(MIN_INPUT_VALUE, parseInt(e.target.value) || MIN_INPUT_VALUE))}
                            size="small"
                            fullWidth
                        />
                        <TextField
                            label={GetTitle("# of Targets")}
                            type="number"
                            value={targets}
                            onChange={(e) => setTargets(Math.max(MIN_INPUT_VALUE, parseInt(e.target.value) || MIN_INPUT_VALUE))}
                            size="small"
                            fullWidth
                        />
                        <TalentOption
                            talent={TALENTS.AWAKENED_JADEFIRE}
                            isChecked={awakenedJadefire}
                            onChange={handleTalentChange}
                            rgb={rgb}
                            xs={12}
                        />
                    </Box>
                </Stack>
                
                <Divider sx={{ mx: -2, my: 2, width: "auto" }} />

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div
                        style={{
                            display: 'flex',
                            gap: 5,
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <SpellButton
                            selectedSpell={MISTWEAVER_SPELLS.TIGER_PALM}
                            action={() => addSpellToRotation(MISTWEAVER_SPELLS.TIGER_PALM, 0)}
                        />
                        <SpellButton
                            selectedSpell={MISTWEAVER_SPELLS.BLACKOUT_KICK}
                            action={() => addSpellToRotation(MISTWEAVER_SPELLS.BLACKOUT_KICK, 0)}
                        />
                    </div>
                </div>
                
                <Divider sx={{ mx: -2, my: 2, width: "auto" }} />
                
                <CurrentRotationControl
                    currentRotation={currentRotation}
                    onRemoveSpell={removeSpellFromRotation}
                    onFinalizeRotation={finalizeRotation}
                    onClearCurrentRotation={clearCurrentRotation}
                    onClearAllRotations={clearAllRotations}
                    hasRotations={hasRotations}
                    onReorderRotation={onReorderRotation}
                />
            </Card>
            
            {rotations.length > 0 && (
                <Card variant="outlined" sx={cardSx}>
                    <Stack spacing={2}>
                        {rotations.map((rotation) => {
                            const stats = calculateRotationStats(rotation.steps);
                            return (
                                <Box key={rotation.id} sx={rotationItemSx(theme.palette.mode === 'dark')}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                                            {rotation.steps.map((step) => (
                                                <SpellButton
                                                    key={step.uuid}
                                                    selectedSpell={step}
                                                    action={() => {}}
                                                />
                                            ))}
                                        </Box>
                                        <IconButton
                                            size="small"
                                            onClick={() => removeRotation(rotation.id)}
                                            color="error"
                                        >
                                            <DeleteTwoTone fontSize="small" />
                                        </IconButton>
                                    </Box>
                                     
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        <ProgressBar
                                            label="Reset Chance"
                                            value={`${stats.rotationResetChance.toFixed(0)}%`}
                                            percentage={stats.rotationResetChance}
                                            color="primary.main"
                                            rightContent={
                                                <Typography variant="body2" sx={{ minWidth: 80, textAlign: 'right' }}>
                                                    {stats.totalHits} {GetTitle(pluralize(stats.totalHits, "BoK"))}
                                                </Typography>
                                            }
                                        />
                                        
                                        <ProgressBar
                                            label="Resets per GCD"
                                            value={stats.resetsPerGCD.toFixed(3)}
                                            percentage={stats.resetsPerGCD * 100}
                                            color="secondary.main"
                                            rightContent={
                                                <Typography variant="body2" sx={{ minWidth: 80, textAlign: 'right' }}>
                                                    {stats.totalGCDs} {GetTitle(pluralize(stats.totalGCDs, "GCD"))}
                                                </Typography>
                                            }
                                        />
                                        
                                        <ProgressBar
                                            label={`Chance of reset after ${attempts} ${pluralize(attempts, "Attempt")}`}
                                            value={`${(stats.attemptsChance * 100).toFixed(0)}%`}
                                            percentage={stats.attemptsChance * 100}
                                            color="success.main"
                                        />
                                    </Box>
                                </Box>
                            );
                        })}
                    </Stack>
                </Card>
            )}
            
            {rotations.length > 0 && (
                <Box sx={{ height: 400, width: "100%", display: "flex", justifyContent: "center", mb: { xs: 4, sm: 6 } }}>
                    <Line data={chartData} options={chartOptions} />
                </Box>
            )}
            
        </Container>
    );
};

export default RisingSunKickResets;