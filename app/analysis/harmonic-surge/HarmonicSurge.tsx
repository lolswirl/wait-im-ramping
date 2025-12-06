"use client";
import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Box, Container, useTheme } from "@mui/material";

import PageHeader from "@components/PageHeader/PageHeader";
import TalentsCard from "@components/TalentsCard/TalentsCard";

import spell from "@data/spells/spell";
import SPELLS from "@data/spells";
import TALENTS from "@data/specs/monk/mistweaver/talents";
import { CLASSES } from "@data/class";

import { GetTitle, pluralize } from "@util/stringManipulation";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const HarmonicSurge: React.FC<{ title: string; description: string }> = ({ title, description }) => {
    const theme = useTheme();
    
    const [selectedTalents, setSelectedTalents] = useState(
        new Map<spell, boolean>([
            [TALENTS.JADE_EMPOWERMENT, false],
            [SPELLS.CHI_JI, false],
            [TALENTS.JADE_BOND, false],
        ])
    );

    const mistweaver = CLASSES.MONK.SPECS.MISTWEAVER;
    const intellect = mistweaver.intellect;
    const mastery = mistweaver.mastery;

    const ancientTeachings = TALENTS.ANCIENT_TEACHINGS;
    const jadefireTeachings = TALENTS.JADEFIRE_TEACHINGS;
    const ancientTeachingsTransfer = ancientTeachings.custom.transferRate + jadefireTeachings.custom.transferRate;
    const ancientTeachingsArmorModifier = ancientTeachings.custom.armorModifier;

    const wayOfTheCrane = TALENTS.WAY_OF_THE_CRANE;
    const wayOfTheCraneTigerPalmHits = wayOfTheCrane.custom.tigerPalmHits;

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

    const jadeBond = TALENTS.JADE_BOND;
    const includeChiJiGusts = selectedTalents.get(SPELLS.CHI_JI);
    const chijiGustHealing = gustOfMistHealingAbsolute * (1 + (selectedTalents.get(jadeBond) ? jadeBond.custom.gustIncrease : 0));
    const chijiGustSpellpower = (chijiGustHealing / intellect) * 100;

    const tigerPalm = SPELLS.TIGER_PALM;
    const tigerPalmDamage = tigerPalm.value.damage;
    const tigerPalmHealing = (
        (tigerPalmDamage / intellect) * 100 * ancientTeachingsTransfer * ancientTeachingsArmorModifier *
        wayOfTheCraneTigerPalmHits
    );

    const blackoutKick = SPELLS.BLACKOUT_KICK;
    const blackoutKickDamage = blackoutKick.value.damage;
    
    // calc bok healing breakdown for stacked bars
    const calculateBlackoutKickBreakdown = (totmStacks: number) => {
        const bokHits = 1 + totmStacks;
        const ancientTeachingsHealing = (blackoutKickDamage / intellect) * 100 * ancientTeachingsTransfer * ancientTeachingsArmorModifier * bokHits;
        const expectedGOMProcs = bokHits * craneStyleBlackoutKickGOMChance;
        const normalGOMHealing = gustOfMistSpellpower * craneStyleBlackoutKickGOM * expectedGOMProcs;
        
        let chiJiGustHealing = 0;
        if (includeChiJiGusts) {
            const totalGusts = 6 * bokHits;
            chiJiGustHealing = chijiGustSpellpower * totalGusts;
        }
        
        return {
            ancientTeachingsHealing,
            normalGOMHealing,
            chiJiGustHealing
        };
    };

    const risingSunKick = SPELLS.RISING_SUN_KICK;
    const risingSunKickDamage = risingSunKick.value.damage;
    const risingSunKickAncientTeachingsHealing = (risingSunKickDamage / intellect) * 100 * ancientTeachingsTransfer * ancientTeachingsArmorModifier;
    const risingSunKickNormalGOMHealing = gustOfMistSpellpower * craneStyleRisingSunKickGOM;
    const risingSunKickChiJiGustHealing = includeChiJiGusts ? chijiGustSpellpower * 6 : 0;

    const cjl = SPELLS.CRACKLING_JADE_LIGHTNING;
    const cracklingJadeLightningDamage = cjl.value.damage;
    const jadeEmpowerment = TALENTS.JADE_EMPOWERMENT;
    const jadeEmpowermentIncrease = jadeEmpowerment.custom.spellpowerIncrease;
    const jadeEmpowermentChain = jadeEmpowermentIncrease * jadeEmpowerment.custom.chainVal;
    const jeSpellpowerCalc = (value: number) => (cracklingJadeLightningDamage / intellect) * value * ancientTeachingsTransfer * ancientTeachingsArmorModifier;
    const jeValues = Array.from({ length: 5 }, (_, i) => i + 1);
    let jeSpellpowers = jeValues.map(value => jeSpellpowerCalc(jadeEmpowermentIncrease + (value - 1) * jadeEmpowermentChain));

    const harmonicSurge = TALENTS.HARMONIC_SURGE;
    const harmonicSurgeHealing = harmonicSurge.value.healing;
    const harmonicSurgeTargetsHit = harmonicSurge.custom?.targetsHit;
    const harmonicSurgePureHealing = (harmonicSurgeHealing / intellect) * 100 * harmonicSurgeTargetsHit;

    type AbilityDatum = {
        label: string;
        ancientTeachings: number;
        harmonicSurge: number;
        gom: number;
        chiJi: number;
        total: number;
    };
    const abilityData: AbilityDatum[] = [];
    
    abilityData.push({
        label: GetTitle(SPELLS.TIGER_PALM.name),
        ancientTeachings: tigerPalmHealing,
        harmonicSurge: 0,
        gom: 0,
        chiJi: 0,
        total: tigerPalmHealing
    });

    for (let stacks = 0; stacks <= totmMaxStacks; stacks++) {
        const breakdown = calculateBlackoutKickBreakdown(stacks);
        const total = breakdown.ancientTeachingsHealing + breakdown.normalGOMHealing + breakdown.chiJiGustHealing;
        abilityData.push({
            label: GetTitle(`BoK (${stacks} ToTM ${pluralize(stacks, "stack")})`),
            ancientTeachings: breakdown.ancientTeachingsHealing,
            harmonicSurge: 0,
            gom: breakdown.normalGOMHealing,
            chiJi: breakdown.chiJiGustHealing,
            total: total
        });
    }

    const rskTotal = risingSunKickAncientTeachingsHealing + risingSunKickNormalGOMHealing + risingSunKickChiJiGustHealing;
    abilityData.push({
        label: GetTitle(SPELLS.RISING_SUN_KICK.name),
        ancientTeachings: risingSunKickAncientTeachingsHealing,
        harmonicSurge: 0,
        gom: risingSunKickNormalGOMHealing,
        chiJi: risingSunKickChiJiGustHealing,
        total: rskTotal
    });

    const totalHarmonicSurgeHealing = harmonicSurgePureHealing + tigerPalmHealing;
    abilityData.push({
        label: GetTitle(TALENTS.HARMONIC_SURGE.name),
        ancientTeachings: tigerPalmHealing,
        harmonicSurge: harmonicSurgePureHealing,
        gom: 0,
        chiJi: 0,
        total: totalHarmonicSurgeHealing
    });

    if (selectedTalents.get(TALENTS.JADE_EMPOWERMENT)) {
        jeSpellpowers.forEach((spellpower, index) => {
            abilityData.push({
                label: GetTitle(`JE (${index + 1} ${pluralize(index + 1, "Target")})`),
                ancientTeachings: spellpower,
                harmonicSurge: 0,
                gom: 0,
                chiJi: 0,
                total: spellpower
            });
        });
    }

    const sortedData = abilityData.sort((a, b) => a.total - b.total);
    const labels = sortedData.map(item => item.label);
    const ancientTeachingsData = sortedData.map(item => item.ancientTeachings);
    const harmonicSurgeData = sortedData.map(item => item.harmonicSurge);
    const normalGOMData = sortedData.map(item => item.gom);
    const chiJiGustData = sortedData.map(item => item.chiJi);

    const datasets = [
        {
            label: GetTitle(TALENTS.ANCIENT_TEACHINGS.name),
            data: ancientTeachingsData,
            backgroundColor: "rgba(255, 169, 32, 0.8)",
            borderColor: "rgba(255, 177, 51, 1)",
            borderWidth: 1,
        },
        {
            label: GetTitle(TALENTS.HARMONIC_SURGE.name),
            data: harmonicSurgeData,
            backgroundColor: "rgba(153, 102, 255, 0.8)",
            borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 1,
        },
        {
            label: GetTitle(TALENTS.GUST_OF_MISTS.name),
            data: normalGOMData,
            backgroundColor: "rgba(118, 201, 167, 0.8)",
            borderColor: "rgba(118, 201, 167, 1)",
            borderWidth: 1,
        },
    ];

    if (includeChiJiGusts) {
        datasets.push({
            label: GetTitle(SPELLS.CHI_JI.name),
            data: chiJiGustData,
            backgroundColor: "rgba(216, 91, 38, 0.8)",
            borderColor: "rgba(216, 91, 38, 1)",
            borderWidth: 1,
        });
    }

    const chartData = {
        labels,
        datasets,
    };

    const chartOptions = {
        responsive: true,
        scales: {
            x: {
                stacked: true,
                title: {
                    display: true,
                    text: GetTitle("Abilities"),
                },
                grid: {
                    color: theme.custom.chart.gridColor,
                },
            },
            y: {
                stacked: true,
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
        plugins: {
            tooltip: {
                mode: "index" as const,
                intersect: false,
                callbacks: {
                    label: function(context: any) {
                        const value = context.parsed.y.toFixed(2);
                        return ` ${context.dataset.label}: ${value}%`;
                    },
                    afterBody: function(context: any) {
                        const dataIndex = context[0].dataIndex;
                        let total = 0;
                        context.forEach((item: any) => {
                            total += item.parsed.y;
                        });
                        return [`${GetTitle("Total")}: ${total.toFixed(2)}%`];
                    }
                }
            },
            legend: {
                display: true,
                position: 'top' as const,
            },
        },
    };

    const handleTalentChange = (key: spell, checked: boolean) => {
        setSelectedTalents((prevTalents) => {
            const newTalents = new Map(prevTalents);
            newTalents.set(key, checked);
            return newTalents;
        });
    };

    return (
        <Container sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center", justifyContent: "center" }}>
            <PageHeader
                title={title}
                subtitle={description}
            />
            
            <Box sx={{ height: 600, width: "100%", display: "flex", justifyContent: "center" }}>
                <Bar data={chartData} options={chartOptions} />
            </Box>
            
            <TalentsCard
                options={selectedTalents}
                color={"9966ff"}
                onChange={handleTalentChange}
                xs={4}
            />
        </Container>
    );
};

export default HarmonicSurge;
