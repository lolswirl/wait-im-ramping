"use client";
import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Box, Container, useTheme } from "@mui/material";

import PageHeader from "@components/PageHeader/PageHeader";
import TalentsCard from "@components/TalentsCard/TalentsCard";
import spell, { calcSpellpower } from "@data/spells/spell";
import SPELLS from "@data/spells";
import TALENTS from "@data/specs/monk/mistweaver/talents";
import { CLASSES } from "@data/class";
import { GetTitle, pluralize } from "@util/stringManipulation";

import calculateUnityWithin from "./UnityWithin";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Conduit: React.FC<{ title: string; description: string }> = ({
    title,
    description,
}) => {
    const theme = useTheme();

    const [selectedTalents, setSelectedTalents] = useState(
        new Map<spell, boolean>([
            [SPELLS.SHEILUNS_GIFT, false],
            [TALENTS.JADE_EMPOWERMENT, false],
            [TALENTS.UNITY_WITHIN, false],
        ])
    );

    const colorMap = {
        jade: {
            backgroundColor: "rgba(54, 162, 235, 0.8)",
            borderColor: "rgba(54, 162, 235, 1)",
        },
        sheilun: {
            backgroundColor: "rgba(255, 99, 132, 0.8)",
            borderColor: "rgba(255, 99, 132, 1)",
        },
        conduit: {
            backgroundColor: "rgba(75, 192, 192, 0.8)",
            borderColor: "rgba(75, 192, 192, 1)",
        },
        unity: {
            backgroundColor: "rgba(250, 247, 153, 0.8)",
            borderColor: "rgba(250, 247, 153, 1)",
        },
    };

    const mistweaver = CLASSES.MONK.SPECS.MISTWEAVER;
    const intellect = mistweaver.intellect;

    const celestialConduit = SPELLS.CELESTIAL_CONDUIT;
    const conduitValues = Array.from(
        { length: celestialConduit.custom?.maxTargets },
        (_, i) => i + 1
    );

    const conduitSpellpower = calcSpellpower(celestialConduit.value.healing, intellect);
    const conduitSpellpowerCalc = (targets: number) =>
        conduitSpellpower * (1 + celestialConduit.custom.multiplier * targets);
    const conduitSpellpowers = conduitValues.map(conduitSpellpowerCalc);

    const unityWithinSpellpowerCalc = (targets: number) =>
        selectedTalents.get(TALENTS.UNITY_WITHIN)
            ? calculateUnityWithin(
                  intellect,
                  targets,
                  selectedTalents.get(TALENTS.UNITY_WITHIN)!
              ).spellpower
            : 0;
    const unityWithinSpellpowers = conduitValues.map(unityWithinSpellpowerCalc);

    const sheilunHealingPerStack = SPELLS.SHEILUNS_GIFT.value.healing;
    const sheilunTargetsHit = TALENTS.LEGACY_OF_WISDOM.custom?.targetsHit;
    const sheilunSpellpowerPerStack = calcSpellpower(sheilunHealingPerStack, intellect) * sheilunTargetsHit;

    const cracklingJadeLightningDamage =
        SPELLS.CRACKLING_JADE_LIGHTNING.value.damage;

    const ancientTeachings = TALENTS.ANCIENT_TEACHINGS;
    const jadefireTeachings = TALENTS.JADEFIRE_TEACHINGS;
    const ancientTeachingsTransfer =
        ancientTeachings.custom?.transferRate +
        jadefireTeachings.custom?.transferRate;
    const ancientTeachingsArmorModifier =
        ancientTeachings.custom?.armorModifier;

    const jadeEmpowerment = TALENTS.JADE_EMPOWERMENT;
    const jadeEmpowermentIncrease = jadeEmpowerment.custom?.spellpowerIncrease;
    const jadeEmpowermentChain =
        jadeEmpowermentIncrease * jadeEmpowerment.custom?.chainVal;

    const jeSpellpowerCalc = (value: number) =>
        (cracklingJadeLightningDamage / intellect) *
        value *
        ancientTeachingsTransfer *
        ancientTeachingsArmorModifier;
    const jeValues = Array.from(
        { length: 5 },
        (_, i) => jadeEmpowermentIncrease + i * jadeEmpowermentChain
    );
    const jeSpellpowers = jeValues.map((value) => jeSpellpowerCalc(value));

    const xValues = Array.from({ length: 10 }, (_, i) => i + 1);
    const sheilunSpellpowers = xValues.map(
        (i) => sheilunSpellpowerPerStack * i
    );

    const allAbilities = [
        ...conduitValues.map((value, index) => ({
            label: GetTitle(`CC ${value} ` + pluralize(value, "Target")),
            conduitValue: conduitSpellpowers[index],
            unityValue: unityWithinSpellpowers[index],
            totalValue:
                conduitSpellpowers[index] + unityWithinSpellpowers[index],
            type: "conduit" as const,
        })),
        ...(selectedTalents.get(SPELLS.SHEILUNS_GIFT)
            ? xValues.map((value, index) => ({
                  label: GetTitle(`SG ${value} ` + pluralize(value, "Stack")),
                  totalValue: sheilunSpellpowers[index],
                  type: "sheilun" as const,
              }))
            : []),
        ...(selectedTalents.get(TALENTS.JADE_EMPOWERMENT)
            ? jeValues.map((_, index) => ({
                  label: GetTitle(
                      `JE ${index + 1} ` + pluralize(index + 1, "Target")
                  ),
                  totalValue: jeSpellpowers[index],
                  type: "jade" as const,
              }))
            : []),
    ];

    const sortedAbilities = allAbilities.sort(
        (a, b) => a.totalValue - b.totalValue
    );

    const chartData = {
        labels: sortedAbilities.map((ability) => ability.label),
        datasets: [
            {
                label: GetTitle(" Spellpower"),
                data: sortedAbilities.map((ability) =>
                    ability.type === "conduit"
                        ? ability.conduitValue
                        : ability.totalValue
                ),
                backgroundColor: sortedAbilities.map(
                    (ability) =>
                        colorMap[ability.type as keyof typeof colorMap]
                            .backgroundColor
                ),
                borderColor: sortedAbilities.map(
                    (ability) =>
                        colorMap[ability.type as keyof typeof colorMap]
                            .borderColor
                ),
                borderWidth: 2,
            },
            ...(selectedTalents.get(TALENTS.UNITY_WITHIN)
                ? [
                      {
                          label: GetTitle(" Unity Within"),
                          data: sortedAbilities.map((ability) =>
                              ability.type === "conduit"
                                  ? ability.unityValue
                                  : 0
                          ),
                          backgroundColor: colorMap.unity.backgroundColor,
                          borderColor: colorMap.unity.borderColor,
                          borderWidth: 2,
                      },
                  ]
                : []),
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            tooltip: {
                mode: "index" as const,
                intersect: false,
                callbacks: {
                    afterBody: function (context: any) {
                        // fill in total sp% for conduit + unity within
                        const index = context[0].dataIndex;
                        const ability = sortedAbilities[index];

                        if (
                            ability.type === "conduit" &&
                            ability.unityValue > 0
                        ) {
                            return GetTitle(
                                `Total: ${ability.totalValue.toFixed(1)}%`
                            );
                        }

                        return [];
                    },
                    label: function (context: any) {
                        // dont show unity within tooltip value if its not conduit!!!
                        const ability = sortedAbilities[context.dataIndex];

                        if (
                            context.dataset.label.includes(
                                GetTitle("Unity Within")
                            ) &&
                            ability.type !== "conduit"
                        ) {
                            return [];
                        }

                        return `${
                            context.dataset.label
                        }: ${context.parsed.y.toFixed(1)}%`;
                    },
                },
            },
            legend: {
                display: false,
                position: "top" as const,
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
                stacked: true,
            },
            y: {
                title: {
                    display: true,
                    text: GetTitle("Spellpower"),
                },
                beginAtZero: true,
                grid: {
                    color: theme.custom.chart.gridColor,
                },
                stacked: true,
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
        <Container
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <PageHeader title={title} subtitle={description} />
            <Box
                sx={{
                    height: 600,
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Bar data={chartData} options={chartOptions} />
            </Box>
            <TalentsCard
                options={selectedTalents}
                color={"4bc0c0"}
                onChange={handleTalentChange}
                xs={4}
            />
        </Container>
    );
};

export default Conduit;