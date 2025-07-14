import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Box, Container, useTheme } from "@mui/material";
import PageTitle from "../../components/PageTitle/PageTitle.tsx";
import { GetTitle } from "../../util/stringManipulation.tsx";
import SPELLS from "../../data/spells/index.ts";
import TALENTS from "../../data/talents/monk/mistweaver.ts";

import { CLASSES } from "../../data/class/class.ts";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SheilunVSJadeEmpowerment: React.FC = () => {
  const theme = useTheme();

  const mistweaver = CLASSES.MONK.SPECS.MISTWEAVER;
  const intellect = mistweaver.intellect;

  const sheilunHealingPerStack = SPELLS.SHEILUNS_GIFT.value.healing;
  const sheilunTargetsHit = TALENTS.LEGACY_OF_WISDOM.custom?.targetsHit;
  const sheilunSpellpowerPerStack = (sheilunHealingPerStack / intellect) * 100 * sheilunTargetsHit;

  const cracklingJadeLightningDamage = SPELLS.CRACKLING_JADE_LIGHTNING.value.damage;

  const ancientTeachings = TALENTS.ANCIENT_TEACHINGS;
  const jadefireTeachings = TALENTS.JADEFIRE_TEACHINGS;
  const ancientTeachingsTransfer = ancientTeachings.custom?.transferRate + jadefireTeachings.custom?.transferRate;
  const ancientTeachingsArmorModifier = ancientTeachings.custom?.armorModifier;

  const jadeEmpowerment = TALENTS.JADE_EMPOWERMENT;
  const jadeEmpowermentIncrease = jadeEmpowerment.custom?.spellpowerIncrease;
  const jadeEmpowermentChain = jadeEmpowermentIncrease * jadeEmpowerment.custom?.chainVal;

  const jeSpellpowerCalc = (value: number) => 
    (cracklingJadeLightningDamage / intellect) * value * 
    ancientTeachingsTransfer * ancientTeachingsArmorModifier;
  const jeValues = Array.from({ length: 5 }, (_, i) => jadeEmpowermentIncrease + i * jadeEmpowermentChain);
  const jeSpellpowers = jeValues.map(value => jeSpellpowerCalc(value));

  const xValues = Array.from({ length: 10 }, (_, i) => i + 1);
  const sheilunSpellpowers = xValues.map(i => sheilunSpellpowerPerStack * i);

  // Create combined data with all abilities
  const allAbilities = [
    ...xValues.map((value, index) => ({
      label: `SG ${value} Stack${value > 1 ? 's' : ''}`,
      value: sheilunSpellpowers[index],
      type: 'sheilun'
    })),
    ...jeValues.map((_, index) => ({
      label: `JE ${index + 1} Target${index > 0 ? 's' : ''}`,
      value: jeSpellpowers[index],
      type: 'jade'
    }))
  ];

  // Sort by spellpower value (lowest to highest)
  const sortedAbilities = allAbilities.sort((a, b) => a.value - b.value);

  const chartData = {
    labels: sortedAbilities.map(ability => ability.label),
    datasets: [
      {
        label: GetTitle(" Spellpower"),
        data: sortedAbilities.map(ability => ability.value),
        backgroundColor: sortedAbilities.map(ability => 
          ability.type === 'sheilun' 
            ? "rgba(255, 99, 132, 0.8)" 
            : "rgba(54, 162, 235, 0.8)"
        ),
        borderColor: sortedAbilities.map(ability => 
          ability.type === 'sheilun' 
            ? "rgba(255, 99, 132, 1)" 
            : "rgba(54, 162, 235, 1)"
        ),
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: GetTitle("Sheilun's Gift vs. Jade Empowerment Spellpower Comparison"),
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
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
          text: GetTitle("Spellpower"),
        },
        beginAtZero: true,
        grid: {
          color: theme.custom.chart.gridColor,
        },
      },
    },
  };

  return (
    <Container sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 4, alignItems: "center", justifyContent: "center" }}>
      <PageTitle title={GetTitle("JE vs. SG!")} />
      <Box sx={{ height: 600, width: "100%", display: "flex", justifyContent: "center" }}>
        <Bar data={chartData} options={chartOptions} />
      </Box>
    </Container>
  );
};

export default SheilunVSJadeEmpowerment;
