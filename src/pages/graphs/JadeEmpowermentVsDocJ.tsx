import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Box, Container, TextField, Typography, useTheme, MenuItem, FormControl, InputLabel } from "@mui/material";
import PageTitle from "../../components/PageTitle/PageTitle.tsx";
import { GetTitle } from "../../util/stringManipulation.tsx";
import { CLASSES } from "../../data/class/class.ts";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import SPELLS from "../../data/spells/index.ts";
import TALENTS from "../../data/talents/monk/mistweaver.ts";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const modeOptions = [
  { value: "default", label: "1 JE vs. 1 DocJ", maxTargets: 13 },
  { value: "mode1", label: "2 JE vs. 3 DocJ", maxTargets: 10 },
  { value: "mode2", label: "1 JE vs. 3 DocJ", maxTargets: 6 },
  { value: "mode3", label: "2 JE vs. 1 DocJ", maxTargets: 45 },
  { value: "mode4", label: "4 JE vs. 1 DocJ", maxTargets: 180 },
];

const JadeEmpowermentVsDocJ: React.FC = () => {
  const theme = useTheme();
  const [maxTargets, setMaxTargets] = useState<number>(13);
  const [calcMode, setCalcMode] = useState<string>("default");

  const mistweaver = CLASSES.MONK.SPECS.MISTWEAVER;

  const intellect = mistweaver.intellect;
  const cjl = SPELLS.CRACKLING_JADE_LIGHTNING;
  const cracklingJadeLightningDamage = cjl.value.damage;

  const sck = SPELLS.SPINNING_CRANE_KICK;
  const spinningCraneKickDamage = sck.value.damage;

  const awakenedJadefire = TALENTS.AWAKENED_JADEFIRE;
  const ancientTeachings = TALENTS.ANCIENT_TEACHINGS;

  const awakenedJadefireArmorModifier = awakenedJadefire.custom.armorModifier;
  const ancientTeachingsArmorModifier = ancientTeachings.custom.armorModifier;

  const jadefireTeachingsTransfer = ancientTeachings.custom.transferRate;
  const awakenedJadefireTransfer = awakenedJadefire.custom.transferRate;

  const jadeEmpowerment = TALENTS.JADE_EMPOWERMENT;
  const jadeEmpowermentIncrease = jadeEmpowerment.custom.spellpowerIncrease;
  const jadeEmpowermentChain = jadeEmpowermentIncrease * jadeEmpowerment.custom.chainVal;

  const docj = TALENTS.DANCE_OF_CHI_JI;
  const danceofChijiIncrease = docj.custom.spellpowerIncrease;

  const jeSpellpowerCalc = (value: number) => (cracklingJadeLightningDamage / intellect)  * value * jadefireTeachingsTransfer * ancientTeachingsArmorModifier;
  const docjSpellpowerCalc = (value: number) => (spinningCraneKickDamage / intellect) * value * (awakenedJadefireTransfer * 3) * awakenedJadefireArmorModifier;

  const jeValues = Array.from({ length: Math.min(maxTargets, 5) }, (_, i) => i + 1);
  const docjValues = Array.from({ length: maxTargets }, (_, i) => i + 1);

  let jeSpellpowers = jeValues.map(value => jeSpellpowerCalc(jadeEmpowermentIncrease + (value - 1) * jadeEmpowermentChain));
  let docjSpellpowers = docjValues.map(value =>
    value <= 5
      ? docjSpellpowerCalc(danceofChijiIncrease) * value
      : docjSpellpowerCalc(danceofChijiIncrease) * value * Math.sqrt(5 / value)
  );

  let hasted = false
  let jeLabel = GetTitle(jadeEmpowerment.name);
  let docjLabel = GetTitle(docj.name);
  const docjPpm = hasted ? (3 + 1.3) : 3

  if (calcMode === "mode1") {
      jeSpellpowers = jeSpellpowers.map(sp => sp * 2);
      docjSpellpowers = docjSpellpowers.map(sp => sp * docjPpm);
      jeLabel += GetTitle(" (2 casts)");
      docjLabel += GetTitle(" (" + docjPpm + " procs)");
  }
  if (calcMode === "mode2") {
      jeSpellpowers = jeSpellpowers.map(sp => sp);
      docjSpellpowers = docjSpellpowers.map(sp => sp * docjPpm);
      jeLabel += GetTitle(" (1 cast)");
      docjLabel += GetTitle(" (" + docjPpm + " procs)");
  } else if (calcMode === "mode3") {
      jeSpellpowers = jeSpellpowers.map(sp => sp * 2);
      docjSpellpowers = docjSpellpowers.map(sp => sp);
      jeLabel += GetTitle(" (2 casts)");
      docjLabel += GetTitle(" (1 proc)");
  } else if (calcMode === "mode4") {
      jeSpellpowers = jeSpellpowers.map(sp => sp * 4);
      docjSpellpowers = docjSpellpowers.map(sp => sp);
      jeLabel += GetTitle(" (4 casts)");
      docjLabel += GetTitle(" (1 proc)");
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
        text: GetTitle("Jade Empowerment vs. Dance of Chi-Ji Spellpower Comparison"),
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
          text: GetTitle("Target Count"),
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

  const handleModeChange = (event: SelectChangeEvent<string>) => {
    const newMode = event.target.value;
    setCalcMode(newMode);
    const found = modeOptions.find(opt => opt.value === newMode);
    setMaxTargets(found ? found.maxTargets : 13);
  };

  return (
    <Container sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 4, alignItems: "center", justifyContent: "center" }}>
      <PageTitle title={GetTitle("JE vs. DocJ!")} />
      <Box sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center" }}>
        <Line data={chartData} options={chartOptions} />
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          width: "75%",
          justifyContent: "center",
        }}
      >
        <FormControl>
          <InputLabel id="calc-mode-label">{GetTitle("Mode")}</InputLabel>
          <Select
            labelId="calc-mode-label"
            value={calcMode}
            label={GetTitle("Mode")}
            onChange={handleModeChange}
          >
            {modeOptions.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{GetTitle(opt.label)}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label={GetTitle("Max Targets")}
          type="number"
          value={maxTargets}
          onChange={(e) => setMaxTargets(Math.max(5, parseInt(e.target.value) || 5))}
          sx={{ width: 100 }}
        />
      </Box>

      <Typography variant="body1">
        {GetTitle(
          `Target Count where ${docj.name} is better than ${jadeEmpowerment.name}: ${docjBetterThanJE ?? "N/A"}`
        )}
      </Typography>
    </Container>
  );
};

export default JadeEmpowermentVsDocJ;
