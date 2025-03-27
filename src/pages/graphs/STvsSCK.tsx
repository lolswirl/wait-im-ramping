import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Box, Container, TextField, Typography } from "@mui/material";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DamageOverTimeGraph: React.FC = () => {
  const [timeSpent, setTimeSpent] = useState(30); // Default time spent is 30 seconds
  const [targetCount, setTargetCount] = useState(1);
  const [damageData, setDamageData] = useState({
    rotationDamage: [], // Ensure this is always an empty array initially
    spinningCraneKick: [] // Ensure this is always an empty array initially
  });

  useEffect(() => {
    const rotations = simulateRotations(timeSpent);
    const spinningCraneKickData = simulateSpinningCraneKick(timeSpent);
    const chartData = processData(rotations, spinningCraneKickData);
    setDamageData(chartData);
  }, [timeSpent, targetCount]);

  const simulateRotations = (totalTime: number) => {
    let currentTime = 0;
    let risingSunKickCooldown = 0;
    let blackoutKickCooldown = 0;
    let totmStacks = 0; // Teachings of the Monastery stacks
    let cumulativeDamage = 0;
    let rotationDamage = [];
  
    const risingSunKickDamage = 73532;
    const tigerPalmDamage = 17234;
    const blackoutKickDamage = 28198;
  
    let bokHits = (1 + totmStacks); // Blackout Kick hits count based on TotM stacks
    let cleaveMultiplier = Math.min(targetCount, 3);
  
    // At time 0, we should already have Rising Sun Kick and Tiger Palm hitting
    let damage = risingSunKickDamage;
    cumulativeDamage += damage;
    rotationDamage.push({ time: currentTime, damage: cumulativeDamage, name: "rsk" });
  
    currentTime += 1.5; // Global cooldown after Rising Sun Kick
  
    damage = tigerPalmDamage;
    cumulativeDamage += damage;
    totmStacks += 2; // Each Tiger Palm gives 2 stacks of ToTM
    rotationDamage.push({ time: currentTime, damage: cumulativeDamage, name: "tp 1" });
  
    currentTime += 1.5; // Global cooldown after first Tiger Palm
  
    damage = tigerPalmDamage;
    cumulativeDamage += damage;
    totmStacks += 2; // Each Tiger Palm gives 2 stacks of ToTM
    rotationDamage.push({ time: currentTime, damage: cumulativeDamage, name: "tp 2" });
    currentTime += 1.5;
  
    if (blackoutKickCooldown <= 0) {
      bokHits = (1 + totmStacks) * cleaveMultiplier; // Update Blackout Kick hits based on TotM
      totmStacks = 0; // Consume all ToTM stacks when Blackout Kick is used
  
      let bokResetRsk = false; // Whether Blackout Kick resets Rising Sun Kick's cooldown
      const totalBlackoutKickDamage = blackoutKickDamage * bokHits; // Cleave total damage
      cumulativeDamage += totalBlackoutKickDamage;
  
      // Check if Blackout Kick resets Rising Sun Kick cooldown
      for (let i = 0; i < bokHits; i++) {
        if (Math.random() < 0.15) {
          bokResetRsk = true;
        }
      }
  
      rotationDamage.push({ time: currentTime, damage: cumulativeDamage, name: "bok" });
      currentTime += 1.5; // The entire Blackout Kick happens at once (same as 1 cast)
      blackoutKickCooldown = 1.5; // Set Blackout Kick cooldown
  
      if (bokResetRsk) {
        risingSunKickCooldown = 0; // Reset Rising Sun Kick cooldown immediately
      }
    }
  
    if (risingSunKickCooldown > 0 ) {
        risingSunKickCooldown -= 1.5;
    }
    blackoutKickCooldown -= 1.5;
  
    // Continue the rotation until total time is reached
    while (currentTime < totalTime) {
      if (risingSunKickCooldown <= 0) {
        damage = risingSunKickDamage;
        cumulativeDamage += damage;
        rotationDamage.push({ time: currentTime, damage: cumulativeDamage, name: "rsk" });
        currentTime += 1.5; // Rising Sun Kick takes 1.5 seconds
        risingSunKickCooldown = 12;
      }
  
      if (currentTime >= totalTime) break;
  
      damage = tigerPalmDamage;
      cumulativeDamage += damage;
      totmStacks += 2;
      rotationDamage.push({ time: currentTime, damage: cumulativeDamage, name: "tp1" });
      currentTime += 1.5;
  
      if (currentTime >= totalTime) break;
  
      damage = tigerPalmDamage;
      cumulativeDamage += damage;
      totmStacks += 2;
      rotationDamage.push({ time: currentTime, damage: cumulativeDamage, name: "tp2" });
      currentTime += 1.5;
  
      if (currentTime >= totalTime) break;
  
      if (blackoutKickCooldown <= 0) {
        bokHits = (1 + totmStacks) * cleaveMultiplier;
        totmStacks = 0;
  
        let bokResetRsk = false;
        const totalBlackoutKickDamage = blackoutKickDamage * bokHits;
        cumulativeDamage += totalBlackoutKickDamage;
  
        for (let i = 0; i < bokHits; i++) {
          if (Math.random() < 0.15) {
            bokResetRsk = true;
          }
        }
  
        rotationDamage.push({ time: currentTime, damage: cumulativeDamage, name: "bok" });
        currentTime += 1.5;
        blackoutKickCooldown = 1.5;
  
        if (bokResetRsk) {
          risingSunKickCooldown = 0;
        }
      }

      if (risingSunKickCooldown > 0) risingSunKickCooldown -= 1.5;
      blackoutKickCooldown -= 1.5;
    }

    return rotationDamage;
  };
  
  const simulateSpinningCraneKick = (totalTime: number) => {
    let currentTime = 0;
    let cumulativeDamage = 0;
    let craneKickDamage = [];
    const craneKickDamageValue = 29425;

    while (currentTime < totalTime) {
      const scaledDamage = targetCount <= 5
      ? craneKickDamageValue * targetCount
      : craneKickDamageValue * targetCount * Math.sqrt(5 / targetCount);
      cumulativeDamage += scaledDamage;
      craneKickDamage.push({ time: currentTime, damage: cumulativeDamage });
      currentTime += 1.5;  // 1.5s channel + 1.5s global cooldown
    }

    return craneKickDamage;
  };

  const processData = (rotationData: { time: number; damage: number }[], craneKickData: { time: number; damage: number }[]) => {
    return {
      rotationDamage: rotationData,
      spinningCraneKick: craneKickData,
    };
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeSpent(Number(e.target.value));
  };

  const handleTargetCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetCount(Number(e.target.value));
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: { display: true, text: "Cumulative Damage over Time" },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { title: { display: true, text: "Time (Seconds)" }, ticks: { autoSkip: true } },
      y: { title: { display: true, text: "Cumulative Damage" }, beginAtZero: true },
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
        label: "Rotation Damage (RSK, Tiger Palm, Blackout Kick)",
        data: damageData.rotationDamage.map(item => item.damage),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: false,
      },
      {
        label: "Spinning Crane Kick",
        data: damageData.spinningCraneKick.map(item => item.damage),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: false,
      }
    ]
  };

  return (
    <Container sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 4, alignItems: "center", justifyContent: "center" }}>
      <Typography variant="h4" gutterBottom>
        Cumulative Damage Over Time - Ability Rotation
      </Typography>
      <Box sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center" }}>
        <Line data={chartData} options={chartOptions} />
      </Box>

      <Box sx={{ display: "flex", gap: 2, width: "75%", justifyContent: "center" }}>
        <TextField label="Time Spent (Seconds)" type="number" value={timeSpent} onChange={handleTimeChange} sx={{ width: 200 }} />
        <TextField label="Target Count" type="number" value={targetCount} onChange={handleTargetCountChange} sx={{ width: 200 }} />
      </Box>
    </Container>
  );
};

export default DamageOverTimeGraph;
