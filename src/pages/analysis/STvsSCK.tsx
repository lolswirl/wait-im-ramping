import React, { useState, useEffect, useCallback } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Box, Container, TextField } from "@mui/material";

import { GCD } from "../../data/spells/spell.ts";
import { GetTitle } from "../../util/stringManipulation.tsx";
import PageHeader from "../../components/PageHeader/PageHeader.tsx";

import SPELLS from "../../data/spells/index.ts";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type DamagePoint = { time: number; damage: number };
type DamageData = {
  rotationDamage: DamagePoint[];
  spinningCraneKick: DamagePoint[];
};

const DamageOverTimeGraph: React.FC = () => {
  const [timeSpent, setTimeSpent] = useState(30);
  const [targetCount, setTargetCount] = useState(1);
  const [damageData, setDamageData] = useState<DamageData>({
    rotationDamage: [],
    spinningCraneKick: []
  });

  const simulateRotations = useCallback((totalTime: number) => {
    let currentTime = 0;
    let risingSunKickCooldown = 0;
    let blackoutKickCooldown = 0;
    let totmStacks = 0;
    let cumulativeDamage = 0;
    const rotationDamage: { time: number; damage: number; name: string }[] = [];

    const risingSunKickDamage = SPELLS.RISING_SUN_KICK.value.damage;
    const tigerPalmDamage = SPELLS.TIGER_PALM.value.damage;
    const blackoutKickDamage = SPELLS.BLACKOUT_KICK.value.damage;

    const cleaveMultiplier = Math.min(targetCount, 3);

    // initial rotation
    let damage = risingSunKickDamage;
    cumulativeDamage += damage;
    rotationDamage.push({ time: currentTime, damage: cumulativeDamage, name: "rsk" });

    currentTime += GCD;

    for (let i = 1; i <= 2; i++) {
      damage = tigerPalmDamage;
      cumulativeDamage += damage;
      totmStacks += 2;
      rotationDamage.push({ time: currentTime, damage: cumulativeDamage, name: `tp ${i}` });
      currentTime += GCD;
    }

    if (blackoutKickCooldown <= 0) {
      const bokHits = (1 + totmStacks) * cleaveMultiplier;
      totmStacks = 0;
      let bokResetRsk = false;
      const totalBlackoutKickDamage = blackoutKickDamage * bokHits;
      cumulativeDamage += totalBlackoutKickDamage;

      for (let i = 0; i < bokHits; i++) {
        if (Math.random() < 0.15) bokResetRsk = true;
      }

      rotationDamage.push({ time: currentTime, damage: cumulativeDamage, name: "bok" });
      currentTime += GCD;
      blackoutKickCooldown = 1.5;

      if (bokResetRsk) risingSunKickCooldown = 0;
    }

    if (risingSunKickCooldown > 0) risingSunKickCooldown -= 1.5;
    blackoutKickCooldown -= 1.5;

    // loop rotation
    while (currentTime < totalTime) {
      if (risingSunKickCooldown <= 0) {
        damage = risingSunKickDamage;
        cumulativeDamage += damage;
        rotationDamage.push({ time: currentTime, damage: cumulativeDamage, name: "rsk" });
        currentTime += 1.5;
        risingSunKickCooldown = 12;
      }
      if (currentTime >= totalTime) break;

      for (let i = 1; i <= 2; i++) {
        damage = tigerPalmDamage;
        cumulativeDamage += damage;
        totmStacks += 2;
        rotationDamage.push({ time: currentTime, damage: cumulativeDamage, name: `tp${i}` });
        currentTime += GCD;
        if (currentTime >= totalTime) break;
      }
      if (currentTime >= totalTime) break;

      if (blackoutKickCooldown <= 0) {
        const bokHits = (1 + totmStacks) * cleaveMultiplier;
        totmStacks = 0;
        let bokResetRsk = false;
        const totalBlackoutKickDamage = blackoutKickDamage * bokHits;
        cumulativeDamage += totalBlackoutKickDamage;

        for (let i = 0; i < bokHits; i++) {
          if (Math.random() < 0.15) bokResetRsk = true;
        }

        rotationDamage.push({ time: currentTime, damage: cumulativeDamage, name: "bok" });
        currentTime += GCD;
        blackoutKickCooldown = 1.5;

        if (bokResetRsk) risingSunKickCooldown = 0;
      }

      if (risingSunKickCooldown > 0) risingSunKickCooldown -= 1.5;
      blackoutKickCooldown -= 1.5;
    }

    return rotationDamage;
  }, [targetCount]);

  const simulateSpinningCraneKick = useCallback((totalTime: number) => {
    let currentTime = 0;
    let cumulativeDamage = 0;
    const craneKickDamage: DamagePoint[] = [];

    const craneKickDamageValue = SPELLS.SPINNING_CRANE_KICK.value.damage;

    while (currentTime < totalTime) {
      const scaledDamage =
        targetCount <= 5
          ? craneKickDamageValue * targetCount
          : craneKickDamageValue * targetCount * Math.sqrt(5 / targetCount);
      cumulativeDamage += scaledDamage;
      craneKickDamage.push({ time: currentTime, damage: cumulativeDamage });
      currentTime += 1.5;
    }

    return craneKickDamage;
  }, [targetCount]);

  useEffect(() => {
    const rotations = simulateRotations(timeSpent);
    const spinningCraneKickData = simulateSpinningCraneKick(timeSpent);
    setDamageData({
      rotationDamage: rotations,
      spinningCraneKick: spinningCraneKickData,
    });
  }, [timeSpent, targetCount, simulateRotations, simulateSpinningCraneKick]);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeSpent(Number(e.target.value));
  };

  const handleTargetCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetCount(Number(e.target.value));
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
      x: { title: { display: true, text: GetTitle("Time (Seconds)") }, ticks: { autoSkip: true } },
      y: { title: { display: true, text: GetTitle("Cumulative Damage") }, beginAtZero: true },
    },
  };

  const chartData = {
    labels: [
      ...new Set([
        ...damageData.rotationDamage.map(item => item.time),
        ...damageData.spinningCraneKick.map(item => item.time),
      ])
    ],
    datasets: [
      {
        label: GetTitle("Tiger Palm, Blackout Kick, Rising Sun Kick"),
        data: damageData.rotationDamage.map(item => item.damage),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: false,
      },
      {
        label: GetTitle("Spinning Crane Kick"),
        data: damageData.spinningCraneKick.map(item => item.damage),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: false,
      }
    ]
  };

  return (
    <Container sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center", justifyContent: "center" }}>
      <PageHeader
        title={"Single Target Rotation vs. Spinning Crane Kick"}
        subtitle={"Evaluate simulated single target rotation (Tiger Palm, Blackout Kick, Rising Sun Kick + resets) damage output compared to Spinning Crane Kick"}
      />
      <Box sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center" }}>
        <Line data={chartData} options={chartOptions} />
      </Box>
      <Box sx={{ display: "flex", gap: 2, width: "75%", justifyContent: "center" }}>
        <TextField label={GetTitle("Time Spent (Seconds)")} type="number" value={timeSpent} onChange={handleTimeChange} sx={{ width: 200 }} />
        <TextField label={GetTitle("Target Count")} type="number" value={targetCount} onChange={handleTargetCountChange} sx={{ width: 200 }} />
      </Box>
    </Container>
  );
};

export default DamageOverTimeGraph;
