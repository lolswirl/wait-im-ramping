import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Box, Container, TextField, Typography, ToggleButton, ToggleButtonGroup, useTheme } from "@mui/material";
import PageTitle from "../../components/PageTitle/PageTitle.tsx";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const JadeEmpowermentVsDocJ: React.FC = () => {
  const theme = useTheme();
  const [maxTargets, setMaxTargets] = useState(13);
  const [calcMode, setCalcMode] = useState("default");

  const intellect = 17647
  const cracklingJadeLightningDamage = 19270
  const spinningCraneKickDamage = 25217
  const armorModifier = 0.7

  const jadefireTeachingsTransfer = 2.45
  const awakenedJadefireTransfer = 1.2

  const jadeEmpowermentIncrease = 2500;
  const jadeEmpowermentChain = jadeEmpowermentIncrease * 0.15;
  const danceofChijiIncrease = 400;

  const jeSpellpowerCalc = (value: number) => (cracklingJadeLightningDamage / intellect)  * value * jadefireTeachingsTransfer;
  const docjSpellpowerCalc = (value: number) => (spinningCraneKickDamage / intellect) * value * (awakenedJadefireTransfer * 3) * armorModifier;

  const jeValues = Array.from({ length: Math.min(maxTargets, 5) }, (_, i) => i + 1);
  const docjValues = Array.from({ length: maxTargets }, (_, i) => i + 1);

  let jeSpellpowers = jeValues.map(value => jeSpellpowerCalc(jadeEmpowermentIncrease + (value - 1) * jadeEmpowermentChain));
  let docjSpellpowers = docjValues.map(value =>
    value <= 5
      ? docjSpellpowerCalc(danceofChijiIncrease) * value
      : docjSpellpowerCalc(danceofChijiIncrease) * value * Math.sqrt(5 / value)
  );

  let jeLabel = "Jade Empowerment";
  let docjLabel = "Dance of Chi-Ji";

    if (calcMode === "mode1") {
        jeSpellpowers = jeSpellpowers.map(sp => sp * 2);
        docjSpellpowers = docjSpellpowers.map(sp => sp * 3);
        jeLabel += " (2 cast)";
        docjLabel += " (3 procs)";
    }
    if (calcMode === "mode2") {
        jeSpellpowers = jeSpellpowers.map(sp => sp);
        docjSpellpowers = docjSpellpowers.map(sp => sp * 3);
        jeLabel += " (1 cast)";
        docjLabel += " (3 procs)";
    } else if (calcMode === "mode3") {
        jeSpellpowers = jeSpellpowers.map(sp => sp * 2);
        docjSpellpowers = docjSpellpowers.map(sp => sp);
        jeLabel += " (2 casts)";
        docjLabel += " (1 proc)";
    } else if (calcMode === "mode4") {
        jeSpellpowers = jeSpellpowers.map(sp => sp * 4);
        docjSpellpowers = docjSpellpowers.map(sp => sp);
        jeLabel += " (4 casts)";
        docjLabel += " (1 proc)";
    }

    const docjBetterThanJE = docjValues.find(value =>
        value <= 5 ? docjSpellpowers[value - 1] > jeSpellpowers[Math.min(value - 1, 4)] : docjSpellpowers[value - 1] > jeSpellpowers[4]
    );

  const chartData = {
    labels: docjValues.map(value => `${value}`),
    datasets: [
      {
        label: jeLabel,
        data: [...jeSpellpowers, ...Array(maxTargets - 5).fill(null)],
        borderColor: "rgba(50, 162, 235, 0.6)",
        backgroundColor: "rgba(50, 162, 235, 0.2)",
        fill: false,
      },
      {
        label: docjLabel,
        data: docjSpellpowers,
        borderColor: "rgba(62, 172, 37, 0.6)",
        backgroundColor: "rgba(62, 172, 8, 0.2)",
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Spellpower vs Target Count",
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
          text: "Target Count",
        },
        grid: {
          color: theme.palette.mode === "dark" ? "#494949" : "#c4c4c4",
        },
      },
      y: {
        title: {
          display: true,
          text: "Spellpower",
        },
        beginAtZero: true,
        grid: {
          color: theme.palette.mode === "dark" ? "#494949" : "#c4c4c4",
        },
      },
    },
  };

  const handleModeChange = (event: React.MouseEvent<HTMLElement>, newMode: string | null) => {
    if (newMode !== null) {
      setCalcMode(newMode);

      // Change maxTargets based on selected mode
      if (newMode === "mode1") {
        setMaxTargets(13);
      } else if (newMode === "mode2") {
        setMaxTargets(10);
      } else if (newMode === "mode3") {
        setMaxTargets(45);
      } else if (newMode === "mode4") {
        setMaxTargets(170);
      } else {
        setMaxTargets(13);
      }
    }
  };

  return (
    <Container sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 4, alignItems: "center", justifyContent: "center" }}>
      <PageTitle title="Spellpower Comparison" />
      <Box sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center" }}>
        <Line data={chartData} options={chartOptions} />
      </Box>

      <Box sx={{ display: "flex", gap: 2, width: "75%", justifyContent: "center" }}>
        <ToggleButtonGroup value={calcMode} exclusive onChange={handleModeChange} aria-label="Calculation Mode">
          <ToggleButton value="default">1 JE vs 1 DocJ</ToggleButton>
          <ToggleButton value="mode1">2 JE vs 3 DocJ</ToggleButton>
          <ToggleButton value="mode2">1 JE vs 3 DocJ</ToggleButton>
          <ToggleButton value="mode3">2 JE vs 1 DocJ</ToggleButton>
          <ToggleButton value="mode4">4 JE vs 1 DocJ</ToggleButton>
        </ToggleButtonGroup>
        <TextField
          label="Max Targets"
          type="number"
          value={maxTargets}
          onChange={(e) => setMaxTargets(Math.max(5, parseInt(e.target.value) || 5))}
          inputProps={{ min: 5 }}
          sx={{ width: 100 }}
        />
      </Box>

      <Typography variant="body1">
        Target Count where Dance of Chi-Ji is better than Jade Empowerment: {docjBetterThanJE ?? "N/A"}
      </Typography>
    </Container>
  );
};

export default JadeEmpowermentVsDocJ;
