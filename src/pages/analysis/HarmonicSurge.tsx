import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Box, Container, useTheme, FormControlLabel, Switch, Typography } from "@mui/material";
import PageHeader from "../../components/PageHeader/PageHeader.tsx";
import { GetTitle, pluralize } from "../../util/stringManipulation.tsx";
import SPELLS from "../../data/spells/index.ts";
import TALENTS from "../../data/talents/monk/mistweaver.ts";

import { CLASSES } from "../../data/class/class.ts";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const HarmonicSurge: React.FC = () => {
    const theme = useTheme();
    const [includeJadeEmpowerment, setIncludeJadeEmpowerment] = useState(false);

    const mistweaver = CLASSES.MONK.SPECS.MISTWEAVER;
    const intellect = mistweaver.intellect;
    const mastery = mistweaver.mastery;

    const ancientTeachings = TALENTS.ANCIENT_TEACHINGS;
    const jadefireTeachings = TALENTS.JADEFIRE_TEACHINGS;
    const ancientTeachingsTransfer = ancientTeachings.custom.transferRate + jadefireTeachings.custom.transferRate;
    const ancientTeachingsArmorModifier = ancientTeachings.custom.armorModifier;

    const awakenedJadefire = TALENTS.AWAKENED_JADEFIRE;
    const awakenedJadefireTigerPalmHits = awakenedJadefire.custom.tigerPalmHits;

    const craneStyle = TALENTS.CRANE_STYLE;
    const craneStyleRisingSunKickGOM = craneStyle.custom.risingSunKickGOM;
    const craneStyleBlackoutKickGOM = craneStyle.custom.blackoutKickGOM;
    const craneStyleBlackoutKickGOMChance = craneStyle.custom.gomChance;

    const teachingsOfTheMonastery = TALENTS.TEACHINGS_OF_THE_MONASTERY;
    const totmMaxStacks = teachingsOfTheMonastery.custom.maxStacks;

    const gustOfMists = TALENTS.GUST_OF_MISTS;
    const gustOfMistsMasteryCoeff = gustOfMists.custom.multiplier;

    const baseMastery = gustOfMistsMasteryCoeff / 100 * 8;
    const masteryFromRating = mastery / 180 * gustOfMistsMasteryCoeff / 100;
    const totalMasteryMultiplier = 1 + (baseMastery + masteryFromRating);
    const gustOfMistHealingAbsolute = (0.1 + totalMasteryMultiplier) * intellect;
    const gustOfMistSpellpower = (gustOfMistHealingAbsolute / intellect) * 100;

    const tigerPalm = SPELLS.TIGER_PALM;
    const tigerPalmDamage = tigerPalm.value.damage;
    const tigerPalmHealing = (
        (tigerPalmDamage / intellect) * 100 * ancientTeachingsTransfer * ancientTeachingsArmorModifier *
        awakenedJadefireTigerPalmHits
    );

    const blackoutKick = SPELLS.BLACKOUT_KICK;
    const blackoutKickDamage = blackoutKick.value.damage;
    
    // calc bok healing for totm stacks
    const calculateBlackoutKickHealing = (totmStacks: number) => {
        const bokHits = 1 + totmStacks;
        const ancientTeachingsHealing = (blackoutKickDamage / intellect) * 100 * ancientTeachingsTransfer * ancientTeachingsArmorModifier * bokHits;
        const expectedGOMProcs = bokHits * craneStyleBlackoutKickGOMChance;
        const gomHealing = gustOfMistSpellpower * craneStyleBlackoutKickGOM * expectedGOMProcs;
        return ancientTeachingsHealing + gomHealing;
    };

    // calc bok healing breakdown for tooltips
    const calculateBlackoutKickBreakdown = (totmStacks: number) => {
        const bokHits = 1 + totmStacks;
        const ancientTeachingsHealing = (blackoutKickDamage / intellect) * 100 * ancientTeachingsTransfer * ancientTeachingsArmorModifier * bokHits;
        const expectedGOMProcs = bokHits * craneStyleBlackoutKickGOMChance;
        const gomHealing = gustOfMistSpellpower * craneStyleBlackoutKickGOM * expectedGOMProcs;
        const totalHealing = ancientTeachingsHealing + gomHealing;
        return {
            totalHealing,
            ancientTeachingsHealing,
            gomHealing,
            gomPercentage: totalHealing > 0 ? (gomHealing / totalHealing) * 100 : 0
        };
    };

    const risingSunKick = SPELLS.RISING_SUN_KICK;
    const risingSunKickDamage = risingSunKick.value.damage;
    const risingSunKickancientTeachingsHealing = (risingSunKickDamage / intellect) * 100 * ancientTeachingsTransfer * ancientTeachingsArmorModifier;
    const risingSunKickGOMHealing = gustOfMistSpellpower * craneStyleRisingSunKickGOM;
    const risingSunKickHealing = risingSunKickancientTeachingsHealing + risingSunKickGOMHealing;
    
    // calc rsk healing breakdown for tooltips
    const risingSunKickBreakdown = {
        totalHealing: risingSunKickHealing,
        ancientTeachingsHealing: risingSunKickancientTeachingsHealing,
        gomHealing: risingSunKickGOMHealing,
        gomPercentage: risingSunKickHealing > 0 ? (risingSunKickGOMHealing / risingSunKickHealing) * 100 : 0
    };

    const cjl = SPELLS.CRACKLING_JADE_LIGHTNING;
    const cracklingJadeLightningDamage = cjl.value.damage;
    const jadeEmpowerment = TALENTS.JADE_EMPOWERMENT;
    const jadeEmpowermentIncrease = jadeEmpowerment.custom.spellpowerIncrease;
    const jadeEmpowermentChain = jadeEmpowermentIncrease * jadeEmpowerment.custom.chainVal;
    const jeSpellpowerCalc = (value: number) => (cracklingJadeLightningDamage / intellect)  * value * ancientTeachingsTransfer * ancientTeachingsArmorModifier;
    const jeValues = Array.from({ length: 5 }, (_, i) => i + 1);
    let jeSpellpowers = jeValues.map(value => jeSpellpowerCalc(jadeEmpowermentIncrease + (value - 1) * jadeEmpowermentChain));

    const harmonicSurge = TALENTS.HARMONIC_SURGE;
    const harmonicSurgeHealing = harmonicSurge.value.healing;
    const harmonicSurgeTargetsHit = harmonicSurge.custom?.targetsHit;
    const totalHarmonicSurgeHealing = (
        (harmonicSurgeHealing / intellect) * 100 * harmonicSurgeTargetsHit +
        tigerPalmHealing
    );

    // create data for blackout kick with 0-4 totm stacks
    const bokStackData: Array<{label: string; value: number; color: string}> = [];
    for (let stacks = 0; stacks <= totmMaxStacks; stacks++) {
        bokStackData.push({
            label: GetTitle(`BoK (${stacks} ToTM ${pluralize(stacks, "stack")})`),
            value: calculateBlackoutKickHealing(stacks),
            color: `rgba(${54 + stacks * 40}, 162, 235, 0.8)`,
        });
    }

    const healingData = [
        {
            label: GetTitle("Tiger Palm"),
            value: tigerPalmHealing,
            color: "rgba(255, 99, 132, 0.8)",
        },
        ...bokStackData,
        {
            label: GetTitle("Rising Sun Kick"),
            value: risingSunKickHealing,
            color: "rgba(255, 206, 86, 0.8)",
        },
        {
            label: GetTitle("Harmonic Surge"),
            value: totalHarmonicSurgeHealing,
            color: "rgba(153, 102, 255, 0.8)",
        },
        ...(includeJadeEmpowerment ? jeValues.map((value, index) => ({
            label: GetTitle(`JE (${index + 1} ${pluralize(value, "Target")})`),
            value: jeSpellpowers[index],
            color: `rgba(54, 162, 235, ${0.8 - index * 0.1})`,
        })) : []),
    ];

    // sort from lowest to highest %spellpower
    const sortedHealingData = healingData.sort((a, b) => a.value - b.value);

    const chartData = {
        labels: sortedHealingData.map(item => item.label),
        datasets: [
            {
                label: GetTitle("Spellpower"),
                data: sortedHealingData.map(item => item.value),
                backgroundColor: sortedHealingData.map(item => item.color),
                borderColor: sortedHealingData.map(item => item.color.replace('0.8', '1')),
                borderWidth: 2,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            tooltip: {
                mode: "index" as const,
                intersect: false,
                callbacks: {
                    label: function(context: any) {
                        const abilityName = context.label;
                        let additionalInfo = "";
                        
                        if (abilityName.includes(GetTitle("BoK"))) {
                            const stacksMatch = abilityName.match(/\((\d+) totm stacks\)/);
                            if (stacksMatch) {
                                const stacks = parseInt(stacksMatch[1]);
                                const breakdown = calculateBlackoutKickBreakdown(stacks);
                                additionalInfo = ` (GOM: ${breakdown.gomPercentage.toFixed(1)}%)`;
                            }
                        }
                        else if (abilityName.includes(GetTitle("Rising Sun Kick"))) {
                            additionalInfo = ` (GOM: ${risingSunKickBreakdown.gomPercentage.toFixed(1)}%)`;
                        }
                        
                        return ` ${context.dataset.label}: ${context.parsed.y.toFixed(2)}%${additionalInfo}`;
                    }
                }
            },
            legend: {
                display: false,
                position: 'top' as const,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: GetTitle("Abilities"),
                },
                grid: {
                    color: theme.custom.chart.gridColor,
                },
            },
            y: {
                title: {
                    display: true,
                    text: GetTitle("Spellpower (%)"),
                },
                beginAtZero: true,
                grid: {
                    color: theme.custom.chart.gridColor,  
                },
            },
        },
    };

    return (
        <Container sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center", justifyContent: "center" }}>
            <PageHeader
                title={"Harmonic Surge!"}
                subtitle={"Analyze Harmonic Surge's spellpower output compared to the other Ancient Teachings abilities"}
            />
            
            <Box sx={{ height: 600, width: "100%", display: "flex", justifyContent: "center" }}>
                <Bar data={chartData} options={chartOptions} />
            </Box>
            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    width: "75%",
                    justifyContent: "center",
                }}
                >
                <FormControlLabel
                    control={
                        <Switch
                            checked={includeJadeEmpowerment}
                            onChange={(e) => setIncludeJadeEmpowerment(e.target.checked)}
                            color="primary"
                            size="small"
                        />
                    }
                    label={
                        <Typography variant="body1">
                            {GetTitle("Include Jade Empowerment")}
                        </Typography>
                    }
                />
            </Box>
        </Container>
    );
};

export default HarmonicSurge;
