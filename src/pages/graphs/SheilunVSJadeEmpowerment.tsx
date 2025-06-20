import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Box, Container, useTheme } from "@mui/material";
import PageTitle from "../../components/PageTitle/PageTitle.tsx";
import { GetTitle } from "../../util/stringManipulation.tsx";
import SPELLS from "../../data/spells/index.ts";
import TALENTS from "../../data/talents/monk/mistweaver.ts";

import { CLASSES } from "../../data/class/class.ts";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SheilunVSJadeEmpowerment: React.FC = () => {
  const theme = useTheme();

  const mistweaver = CLASSES.MONK.SPECS.MISTWEAVER;
  const intellect = mistweaver.intellect;

  const sheilunHealingPerStack = SPELLS.SHEILUNS_GIFT.value.healing;
  const sheilunTargetsHit = TALENTS.LEGACY_OF_WISDOM.custom?.targetsHit;
  const sheilunSpellpowerPerStack = (sheilunHealingPerStack / intellect) * 100 * sheilunTargetsHit;

  const cracklingJadeLightningDamage = SPELLS.CRACKLING_JADE_LIGHTNING.value.damage;

  const ancientTeachings = TALENTS.ANCIENT_TEACHINGS;
  const ancientTeachingsTransfer = ancientTeachings.custom?.transferRate;
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

  const chartData = {
    labels: xValues.map(value => `${value}`),
    datasets: [
      {
        label: GetTitle("Sheilun's Gift"),
        data: sheilunSpellpowers,
        borderColor: "rgba(255, 99, 132, 0.6)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: false,
      },
      ...jeValues.map((value, index) => ({
        label: GetTitle(`JE ${index + 1} Target`),
        data: Array(xValues.length).fill(jeSpellpowers[index]),
        borderColor: `rgba(${50 + index * 40}, 162, 235, 0.6)`,
        backgroundColor: `rgba(${50 + index * 40}, 162, 235, 0.2)`,
        fill: false,
      })),
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
    },
    scales: {
      x: {
        title: {
          display: true,
          text: GetTitle("Sheilun's Gift Stacks"),
        },
        grid: {
          color: theme.palette.mode === "dark" ? "#494949" : "#c4c4c4",
        },
      },
      y: {
        title: {
          display: true,
          text: GetTitle("Spellpower"),
        },
        beginAtZero: true,
        grid: {
          color: theme.palette.mode === "dark" ? "#494949" : "#c4c4c4",
        },
      },
    },
  };

  return (
    <Container sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 4, alignItems: "center", justifyContent: "center" }}>
      <PageTitle title={GetTitle("JE vs. SG!")} />
      <Box sx={{ height: 600, width: "100%", display: "flex", justifyContent: "center" }}>
        <Line data={chartData} options={chartOptions} />
      </Box>
    </Container>
  );
};

export default SheilunVSJadeEmpowerment;
