"use client";
import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Box, Container, useTheme, Card, Divider, Typography } from "@mui/material";

import PageHeader from "@components/PageHeader/PageHeader";
import TalentsCard from "@components/TalentsCard/TalentsCard";
import RadioOption from "@components/RadioOption/RadioOption";

import spell from "@data/spells/spell";
import SPELLS from "@data/spells";
import TALENTS from "@data/specs/monk/mistweaver/talents";
import SHARED from "@data/specs/monk/talents";
import { CLASSES } from "@data/class";
import {
  calculateAncientTeachingsHealing,
  calculateSpellDamage,
  calculateSpellHealing,
} from "@data/specs/monk/mistweaver/helpers";

import { GetTitle } from "@util/stringManipulation";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type CalcMode = "totalHealing" | "healingPerTarget" | "damage";

const modeOptions: { value: CalcMode; label: string}[] = [
  { value: "totalHealing", label: "Total Healing" },
  { value: "healingPerTarget", label: "Healing Per Target" },
  { value: "damage", label: "Raw Damage" },
];

const RushingWindKickComparison: React.FC<{ title: string; description: string }> = ({ title, description }) => {
  const theme = useTheme();
  const [calcMode, setCalcMode] = useState<CalcMode>("totalHealing");

  const mistweaver = CLASSES.MONK.SPECS.MISTWEAVER;

  const allTalents = new Map<spell, boolean>([
    [TALENTS.YULONS_KNOWLEDGE, true],
    [TALENTS.JADEFIRE_TEACHINGS, true],
    [TALENTS.MORNING_BREEZE, false],
    [SHARED.FAST_FEET, true],
    [SHARED.FEROCITY_OF_XUEN, true],
    [SHARED.CHI_PROFICIENCY, true],
    [SHARED.MARTIAL_INSTINCTS, true],
  ]);

  const [talents, setTalents] = useState(allTalents);
  const [mastery, setMastery] = useState<number>(mistweaver.mastery / 100);

  const rsk = SPELLS.RISING_SUN_KICK;
  const rwk = TALENTS.RUSHING_WIND_KICK;

  const targetValues = Array.from({ length: 5 }, (_, i) => i + 1);

  const rskBaseDamage = calculateSpellDamage(rsk, talents, mastery);
  const rskBaseHealing = calculateAncientTeachingsHealing(rskBaseDamage, talents);

  const rwkBaseDamage = calculateSpellDamage(rwk, talents, mastery);
  const rwkDirectHealing = calculateSpellHealing(rwk, talents, mastery);
  const rwkDamageHealing = calculateAncientTeachingsHealing(rwkBaseDamage, talents, false);

  const rwkMaxDamageTargets = rwk.custom.maxDamageTargets;
  const rwkMaxHealingTargets = rwk.custom.maxHealingTargets;
  const rwkDamageIncreasePerTarget = rwk.custom.damageIncrease;

  let rskValues: number[] = [];
  let rwkValues: number[] = [];
  let yAxisLabel = "";

  if (calcMode === "totalHealing") {
    rskValues = targetValues.map(targets => rskBaseHealing);
    
    rwkValues = targetValues.map(targets => {
      const effectiveTargets = Math.min(targets, rwkMaxHealingTargets);
      const directHealing = rwkDirectHealing * effectiveTargets;
      const effectiveDamageTargets = Math.min(targets, rwkMaxDamageTargets);
      const damageBonus = 1 + (rwkDamageIncreasePerTarget * effectiveDamageTargets);
      const damageHealing = rwkDamageHealing * damageBonus;
      return directHealing + damageHealing;
    });
    
    yAxisLabel = GetTitle("Total Healing");
  } else if (calcMode === "healingPerTarget") {
    rskValues = targetValues.map(targets => {
      const effectiveTargets = Math.min(targets, 5);
      return rskBaseHealing / effectiveTargets;
    });
    
    rwkValues = targetValues.map(targets => {
      const effectiveTargets = Math.min(targets, rwkMaxHealingTargets);
      const directHealing = rwkDirectHealing * effectiveTargets;
      const effectiveDamageTargets = Math.min(targets, rwkMaxDamageTargets);
      const damageBonus = 1 + (rwkDamageIncreasePerTarget * effectiveDamageTargets);
      const damageHealing = rwkDamageHealing * damageBonus;
      const totalHealing = directHealing + damageHealing;
      return totalHealing / targets;
    });
    
    yAxisLabel = GetTitle("Healing Per Target");
  } else if (calcMode === "damage") {
    rskValues = targetValues.map(targets => rskBaseDamage);
    
    rwkValues = targetValues.map(targets => {
      const effectiveTargets = Math.min(targets, rwkMaxDamageTargets);
      const damageBonus = 1 + (rwkDamageIncreasePerTarget * effectiveTargets);
      return rwkBaseDamage * damageBonus;
    });
    
    yAxisLabel = GetTitle("Raw Damage");
  }

  const chartData = {
    labels: targetValues.map(value => `${value}`),
    datasets: [
      {
        label: GetTitle(rsk.name),
        data: rskValues,
        borderColor: "rgb(249, 85, 3)",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        fill: false,
      },
      {
        label: GetTitle(rwk.name),
        data: rwkValues,
        borderColor: "rgb(185, 234, 246)",
        backgroundColor: "rgba(103, 178, 227, 0.2)",
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
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
          color: theme.custom.chart.gridColor,
        },
      },
      y: {
        title: {
          display: true,
          text: yAxisLabel,
        },
        beginAtZero: true,
        grid: {
          color: theme.custom.chart.gridColor,
        },
      },
    },
  };

  const handleModeChange = (value: CalcMode) => {
    setCalcMode(value);
  };

  const handleTalentChange = (talent: spell, checked: boolean) => {
    setTalents(new Map(talents).set(talent, checked));
  };

  const specTalentSubset = new Map<spell, boolean>([
    [TALENTS.YULONS_KNOWLEDGE, talents.get(TALENTS.YULONS_KNOWLEDGE) ?? false],
    [TALENTS.JADEFIRE_TEACHINGS, talents.get(TALENTS.JADEFIRE_TEACHINGS) ?? false],
    [TALENTS.MORNING_BREEZE, talents.get(TALENTS.MORNING_BREEZE) ?? false],
  ]);

  const classTalentSubset = new Map<spell, boolean>([
    [SHARED.FAST_FEET, talents.get(SHARED.FAST_FEET) ?? false],
    [SHARED.FEROCITY_OF_XUEN, talents.get(SHARED.FEROCITY_OF_XUEN) ?? false],
    [SHARED.CHI_PROFICIENCY, talents.get(SHARED.CHI_PROFICIENCY) ?? false],
    [SHARED.MARTIAL_INSTINCTS, talents.get(SHARED.MARTIAL_INSTINCTS) ?? false],
  ]);

  return (
    <Container sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center", justifyContent: "center" }}>
      <PageHeader
        title={title}
        subtitle={description}
      />
      
      <Card variant="outlined" sx={{ width: "100%", maxWidth: 1200 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ flex: 1, p: 2 }}>
            <Card variant="outlined" sx={{ 
              p: 2, 
              background: `linear-gradient(135deg, rgba(54, 162, 235, 0.1), rgba(54, 162, 235, 0.05))`, 
              borderColor: 'rgba(54, 162, 235, 0.3)' 
            }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'rgb(54, 162, 235)', mb: 2 }}>
                {GetTitle("Mode")}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {modeOptions.map(opt => (
                  <RadioOption
                    key={opt.value}
                    value={opt.value}
                    currentValue={calcMode}
                    onChange={handleModeChange}
                    title={GetTitle(opt.label)}
                  />
                ))}
              </Box>
            </Card>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
          <Divider sx={{ display: { md: 'none' } }} />

          <Box sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TalentsCard
              options={specTalentSubset}
              color={mistweaver.color}
              onChange={handleTalentChange}
            />
            <TalentsCard
              options={classTalentSubset} 
              color={CLASSES.MONK.color}
              onChange={handleTalentChange}
            />
          </Box>
        </Box>
      </Card>

      <Box sx={{ width: "100%", maxWidth: 1200 }}>
        <Line data={chartData} options={chartOptions} />
      </Box>
    </Container>
  );
};

export default RushingWindKickComparison;
