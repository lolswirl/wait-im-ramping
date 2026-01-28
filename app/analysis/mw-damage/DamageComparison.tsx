"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Box, Container, TextField, useTheme, FormControlLabel, Checkbox, Card, Typography, Divider, Switch, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

import PageHeader from "@components/PageHeader/PageHeader";

import { GCD } from "@data/spells/spell";
import SPELLS from "@data/spells";
import TALENTS from "@data/specs/monk/mistweaver/talents";
import { CLASSES } from "@data/class";

import { GetTitle } from "@util/stringManipulation";
import WarningChip from "@components/WarningChip/WarningChip";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type DamagePoint = { time: number; damage: number };
type DamageData = {
  rotationDamage: DamagePoint[];
  spinningCraneKick: DamagePoint[];
  jadeEmpowerment: DamagePoint[];
};

const STVsSpinning: React.FC<{ title: string; description: string }> = ({ title, description }) => {
  const theme = useTheme();
  const [timeSpent, setTimeSpent] = useState(30);
  const [targetCount, setTargetCount] = useState(1);
  const [showAsHealing, setShowAsHealing] = useState(false);
  const [damageData, setDamageData] = useState<DamageData>({
    rotationDamage: [],
    spinningCraneKick: [],
    jadeEmpowerment: []
  });

  const mistweaver = CLASSES.MONK.SPECS.MISTWEAVER;
  const intellect = mistweaver.intellect;

  const cjl = SPELLS.CRACKLING_JADE_LIGHTNING;
  const cracklingJadeLightningDamage = cjl.value.damage;

  const jadeEmpowerment = TALENTS.JADE_EMPOWERMENT;
  const jadeEmpowermentIncrease = jadeEmpowerment.custom.spellpowerIncrease;
  const jadeEmpowermentChain = jadeEmpowerment.custom.chainVal;

  const wayOfTheCrane = TALENTS.WAY_OF_THE_CRANE;
  const ancientTeachings = TALENTS.ANCIENT_TEACHINGS;
  const jadefireTeachings = TALENTS.JADEFIRE_TEACHINGS;

  const wayOfTheCraneArmorModifier = wayOfTheCrane.custom.armorModifier;
  const ancientTeachingsArmorModifier = ancientTeachings.custom.armorModifier;

  const jadefireTeachingsTransfer = ancientTeachings.custom.transferRate + jadefireTeachings.custom.transferRate;
  const wayOfTheCraneTransfer = wayOfTheCrane.custom.transferRate * wayOfTheCrane.custom.targetsPerSCK;

  const simulateRotations = useCallback((totalTime: number, targets?: number, asHealing?: boolean) => {
    const useTargets = targets ?? targetCount;
    const useHealing = asHealing ?? showAsHealing;
    
    let currentTime = 0;
    let risingSunKickCooldown = 0;
    let blackoutKickCooldown = 0;
    let totmStacks = 0;
    let cumulativeDamage = 0;
    const rotationDamage: { time: number; damage: number; name: string }[] = [];

    const risingSunKickDamage = SPELLS.RISING_SUN_KICK.value.damage;
    const tigerPalmDamage = SPELLS.TIGER_PALM.value.damage;
    const blackoutKickDamage = SPELLS.BLACKOUT_KICK.value.damage;

    const cleaveMultiplier = Math.min(useTargets, 3);

    const healingConversion = useHealing ? jadefireTeachingsTransfer * ancientTeachingsArmorModifier : 1;

    // initial rotation
    let damage = risingSunKickDamage * healingConversion;
    cumulativeDamage += damage;
    rotationDamage.push({ time: currentTime, damage: cumulativeDamage, name: "rsk" });

    currentTime += GCD;

    for (let i = 1; i <= 2; i++) {
      damage = tigerPalmDamage * healingConversion;
      cumulativeDamage += damage;
      totmStacks += 2;
      rotationDamage.push({ time: currentTime, damage: cumulativeDamage, name: `tp ${i}` });
      currentTime += GCD;
    }

    if (blackoutKickCooldown <= 0) {
      const bokHits = (1 + totmStacks) * cleaveMultiplier;
      totmStacks = 0;
      let bokResetRsk = false;
      const totalBlackoutKickDamage = blackoutKickDamage * bokHits * healingConversion;
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
        damage = risingSunKickDamage * healingConversion;
        cumulativeDamage += damage;
        rotationDamage.push({ time: currentTime, damage: cumulativeDamage, name: "rsk" });
        currentTime += 1.5;
        risingSunKickCooldown = 12;
      }
      if (currentTime >= totalTime) break;

      for (let i = 1; i <= 2; i++) {
        damage = tigerPalmDamage * healingConversion;
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
        const totalBlackoutKickDamage = blackoutKickDamage * bokHits * healingConversion;
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
  }, [targetCount, showAsHealing, jadefireTeachingsTransfer, ancientTeachingsArmorModifier]);

  const simulateSpinningCraneKick = useCallback((totalTime: number, targets?: number, asHealing?: boolean) => {
    const useTargets = targets ?? targetCount;
    const useHealing = asHealing ?? showAsHealing;
    
    let currentTime = 0;
    let cumulativeDamage = 0;
    const craneKickDamage: DamagePoint[] = [];

    const craneKickDamageValue = SPELLS.SPINNING_CRANE_KICK.value.damage;

    const healingConversion = useHealing ? wayOfTheCraneTransfer * wayOfTheCraneArmorModifier : 1;

    while (currentTime < totalTime) {
      const scaledDamage =
        useTargets <= 5
          ? craneKickDamageValue * useTargets * healingConversion
          : craneKickDamageValue * useTargets * Math.sqrt(5 / useTargets) * healingConversion;
      cumulativeDamage += scaledDamage;
      craneKickDamage.push({ time: currentTime, damage: cumulativeDamage });
      currentTime += 1.5;
    }

    return craneKickDamage;
  }, [targetCount, showAsHealing, wayOfTheCraneTransfer, wayOfTheCraneArmorModifier]);

  const simulateJadeEmpowerment = useCallback((totalTime: number, targets?: number, asHealing?: boolean) => {
    const useTargets = targets ?? targetCount;
    const useHealing = asHealing ?? showAsHealing;
    
    let currentTime = 0;
    let cumulativeDamage = 0;
    const jadeEmpowermentData: DamagePoint[] = [];

    const channelDuration = cjl.castTime;
    const tickInterval = 1.5;
    const ticksPerChannel = channelDuration / tickInterval;

    // ignoring armor modifier because its nature :3
    const healingConversion = useHealing ? jadefireTeachingsTransfer : 1;

    while (currentTime < totalTime) {
      for (let tick = 0; tick < ticksPerChannel && currentTime < totalTime; tick++) {
        const effectiveTargets = Math.min(useTargets, 5);
        
        const baseDamageWithIncrease = cracklingJadeLightningDamage * (1 + jadeEmpowermentIncrease / 100);
        
        let totalDamage = baseDamageWithIncrease;
        if (effectiveTargets > 1) {
          totalDamage += baseDamageWithIncrease * jadeEmpowermentChain * (effectiveTargets - 1); // Additional targets at 25%
        }
        
        const damagePerTick = totalDamage / ticksPerChannel * healingConversion;
        
        cumulativeDamage += damagePerTick;
        jadeEmpowermentData.push({ time: currentTime, damage: cumulativeDamage });
        currentTime += tickInterval;
      }
    }

    return jadeEmpowermentData;
  }, [targetCount, cracklingJadeLightningDamage, cjl.castTime, showAsHealing, jadefireTeachingsTransfer, ancientTeachingsArmorModifier]);

  useEffect(() => {
    const rotations = simulateRotations(timeSpent);
    const spinningCraneKickData = simulateSpinningCraneKick(timeSpent);
    const jadeEmpowermentData = simulateJadeEmpowerment(timeSpent);
    setDamageData({
      rotationDamage: rotations,
      spinningCraneKick: spinningCraneKickData,
      jadeEmpowerment: jadeEmpowermentData,
    });
  }, [timeSpent, targetCount, simulateRotations, simulateSpinningCraneKick, simulateJadeEmpowerment]);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeSpent(Number(e.target.value));
  };

  const handleTargetCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetCount(Number(e.target.value));
  };

  const handleShowAsHealingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowAsHealing(e.target.checked);
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
      x: { 
        title: { display: true, text: GetTitle("Time (Seconds)") }, 
        ticks: { autoSkip: true },
        grid: {
          color: theme.custom.chart.gridColor,
        },
      },
      y: { 
        title: { display: true, text: GetTitle(showAsHealing ? "Cumulative Healing" : "Cumulative Damage") }, 
        beginAtZero: true,
        grid: {
          color: theme.custom.chart.gridColor,
        },
      },
    },
  };

  console.log(damageData);

  const rotationAverage = damageData.rotationDamage.length > 0 
    ? damageData.rotationDamage[damageData.rotationDamage.length - 1].damage / timeSpent 
    : 0;
  const sckAverage = damageData.spinningCraneKick.length > 0 
    ? damageData.spinningCraneKick[damageData.spinningCraneKick.length - 1].damage / timeSpent 
    : 0;
  const jeAverage = damageData.jadeEmpowerment.length > 0 
    ? damageData.jadeEmpowerment[damageData.jadeEmpowerment.length - 1].damage / timeSpent 
    : 0;

  const chartData = {
    labels: [
      ...new Set([
        ...damageData.rotationDamage.map(item => item.time),
        ...damageData.spinningCraneKick.map(item => item.time),
        ...damageData.jadeEmpowerment.map(item => item.time),
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
        borderColor: "rgba(42, 141, 31, 1)",
        backgroundColor: "rgba(42, 141, 31, 0.2)",
        fill: false,
      },
      {
        label: GetTitle("Jade Empowerment (Crackling Jade Lightning)"),
        data: damageData.jadeEmpowerment.map(item => item.damage),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: false,
      }
    ]
  };

  return (
    <Container sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center", justifyContent: "center" }}>
      <PageHeader
          title={title}
          subtitle={description}
        />
      
      <Card variant="outlined" sx={{ width: "100%", maxWidth: 1000 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ flex: 1, p: 2, gap: 2, display: 'flex', flexDirection: 'column' }}>
            <WarningChip message="Values may slightly shift due to the RNG of Rising Sun Kick resets" showIcon/>
            <Card variant="outlined" sx={{ 
              p: 2, 
              background: `linear-gradient(135deg, rgba(54, 162, 235, 0.1), rgba(54, 162, 235, 0.05))`, 
              borderColor: 'rgba(54, 162, 235, 0.3)'
            }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField 
                  label={GetTitle("Time Spent (Seconds)")} 
                  type="number" 
                  value={timeSpent} 
                  onChange={handleTimeChange} 
                  fullWidth
                />
                <TextField 
                  label={GetTitle("Target Count")} 
                  type="number" 
                  value={targetCount} 
                  onChange={handleTargetCountChange} 
                  fullWidth
                />
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    p: 1.5, 
                    borderRadius: 1,
                    border: `1px solid rgba(54, 162, 235, 0.3)`,
                    backgroundColor: showAsHealing ? `rgba(54, 162, 235, 0.15)` : 'transparent',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: `rgba(54, 162, 235, 0.1)`,
                      borderColor: `rgba(54, 162, 235, 0.5)`,
                    }
                  }}
                  onClick={() => setShowAsHealing(!showAsHealing)}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ 
                      fontWeight: 'bold',
                      color: showAsHealing ? `rgb(54, 162, 235)` : 'text.primary',
                      transition: 'color 0.2s ease'
                    }}>
                      {GetTitle("Show as Healing")}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {GetTitle(showAsHealing ? "Displaying healing values with conversion factors" : "Displaying raw damage values")}
                    </Typography>
                  </Box>
                  <Switch
                    checked={showAsHealing}
                    onChange={(e) => setShowAsHealing(e.target.checked)}
                    onClick={(e) => e.stopPropagation()}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: `rgb(54, 162, 235)`,
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: `rgb(54, 162, 235)`,
                      },
                    }}
                  />
                </Box>
              </Box>
            </Card>
          </Box>
          
          <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
          <Divider sx={{ display: { md: 'none' } }} />

          <Box sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Card variant="outlined" sx={{ 
              p: 1.5, 
              background: `linear-gradient(135deg, rgba(255, 99, 132, 0.1), rgba(255, 99, 132, 0.05))`, 
              borderColor: 'rgba(255, 99, 132, 0.3)'
            }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                {GetTitle("Tiger Palm, Blackout Kick, Rising Sun Kick")}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'rgba(255, 99, 132, 1)' }}>
                {rotationAverage.toFixed(2)} {GetTitle(showAsHealing ? "HPS" : "DPS")}
              </Typography>
            </Card>
            
            <Card variant="outlined" sx={{ 
              p: 1.5, 
              background: `linear-gradient(135deg, rgba(42, 141, 31, 0.1), rgba(42, 141, 31, 0.05))`, 
              borderColor: 'rgba(42, 141, 31, 0.3)'
            }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                {GetTitle("Spinning Crane Kick")}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'rgba(42, 141, 31, 1)' }}>
                {sckAverage.toFixed(2)} {GetTitle(showAsHealing ? "HPS" : "DPS")}
              </Typography>
            </Card>
            
            <Card variant="outlined" sx={{ 
              p: 1.5, 
              background: `linear-gradient(135deg, rgba(75, 192, 192, 0.1), rgba(75, 192, 192, 0.05))`, 
              borderColor: 'rgba(75, 192, 192, 0.3)'
            }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                {GetTitle("Jade Empowerment")}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'rgba(75, 192, 192, 1)' }}>
                {jeAverage.toFixed(2)} {GetTitle(showAsHealing ? "HPS" : "DPS")}
              </Typography>
            </Card>
          </Box>
        </Box>
      </Card>

      <Box sx={{ height: "500px", width: "100%", maxWidth: 1200, display: "flex", justifyContent: "center" }}>
        <Line data={chartData} options={chartOptions} />
      </Box>

      <Box sx={{ width: "100%", maxWidth: 1000, mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* dps */}
          <TableContainer component={Card} variant="outlined" sx={{ borderRadius: 1, boxShadow: 6, border: "1px solid", borderColor: "divider", overflowX: "auto" }}>
            <Box sx={{ px: 2, pt: 1.5, pb: 0.5, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem' }}>
                {GetTitle("DPS (500 seconds)")}
              </Typography>
            </Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1rem', border: 0, py: 1, px: 1 }}>{GetTitle("Targets")}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1rem', color: 'rgba(255, 99, 132, 1)', border: 0, py: 1, px: 1 }}>{GetTitle("Melee")}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1rem', color: 'rgba(42, 141, 31, 1)', border: 0, py: 1, px: 1 }}>{GetTitle("SCK")}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1rem', color: 'rgba(75, 192, 192, 1)', border: 0, py: 1, px: 1 }}>{GetTitle("JE")}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1rem', border: 0, py: 1, px: 1 }}>{GetTitle("Melee vs SCK")}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1rem', border: 0, py: 1, px: 1 }}>{GetTitle("Melee vs JE")}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1rem', border: 0, py: 1, px: 1 }}>{GetTitle("SCK vs JE")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((targets, index) => {
                  const time = 500;
                  
                  const meleeRotations = simulateRotations(time, targets, false);
                  const meleeDPS = meleeRotations.length > 0 ? meleeRotations[meleeRotations.length - 1].damage / time : 0;
                  
                  const sckData = simulateSpinningCraneKick(time, targets, false);
                  const sckDPS = sckData.length > 0 ? sckData[sckData.length - 1].damage / time : 0;
                  
                  const jeData = simulateJadeEmpowerment(time, targets, false);
                  const jeDPS = jeData.length > 0 ? jeData[jeData.length - 1].damage / time : 0;
                  
                  const meleeVsSck = ((meleeDPS - sckDPS) / sckDPS * 100).toFixed(2);
                  const meleeVsJe = ((meleeDPS - jeDPS) / jeDPS * 100).toFixed(2);
                  const sckVsJe = ((sckDPS - jeDPS) / jeDPS * 100).toFixed(2);
                  
                  return (
                    <TableRow key={targets} hover sx={{ 
                      cursor: 'pointer',
                      transition: 'box-shadow 0.2s',
                      '&:hover': {
                        boxShadow: 4,
                        backgroundColor: 'action.hover',
                      },
                    }}>
                      <TableCell align="right" sx={{ border: 0, py: 1, px: 1 }}>
                        <Typography variant="body2">{targets}</Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ border: 0, py: 1, px: 1 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 99, 132, 1)' }}>{meleeDPS.toFixed(2)}</Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ border: 0, py: 1, px: 1 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(42, 141, 31, 1)' }}>{sckDPS.toFixed(2)}</Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ border: 0, py: 1, px: 1 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(75, 192, 192, 1)' }}>{jeDPS.toFixed(2)}</Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ border: 0, py: 1, px: 1 }}>
                        <Typography variant="body2" sx={{ color: parseFloat(meleeVsSck) > 0 ? '#4ade80' : '#ef4444', fontWeight: 600 }}>{meleeVsSck}%</Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ border: 0, py: 1, px: 1 }}>
                        <Typography variant="body2" sx={{ color: parseFloat(meleeVsJe) > 0 ? '#4ade80' : '#ef4444', fontWeight: 600 }}>{meleeVsJe}%</Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ border: 0, py: 1, px: 1 }}>
                        <Typography variant="body2" sx={{ color: parseFloat(sckVsJe) > 0 ? '#4ade80' : '#ef4444', fontWeight: 600 }}>{sckVsJe}%</Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {/* hps */}
          <TableContainer component={Card} variant="outlined" sx={{ borderRadius: 1, boxShadow: 6, border: "1px solid", borderColor: "divider", overflowX: "auto" }}>
            <Box sx={{ px: 2, pt: 1.5, pb: 0.5, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem' }}>
                {GetTitle("HPS (500 seconds)")}
              </Typography>
            </Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1rem', border: 0, py: 1., px: 1 }}>{GetTitle("Targets")}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1rem', color: 'rgba(255, 99, 132, 1)', border: 0, py: 1, px: 1 }}>{GetTitle("Melee")}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1rem', color: 'rgba(42, 141, 31, 1)', border: 0, py: 1, px: 1 }}>{GetTitle("SCK")}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1rem', color: 'rgba(75, 192, 192, 1)', border: 0, py: 1, px: 1 }}>{GetTitle("JE")}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1rem', border: 0, py: 1, px: 1 }}>{GetTitle("Melee vs SCK")}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1rem', border: 0, py: 1, px: 1 }}>{GetTitle("Melee vs JE")}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1rem', border: 0, py: 1, px: 1 }}>{GetTitle("SCK vs JE")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((targets, index) => {
                  const time = 500;
                  
                  const meleeRotations = simulateRotations(time, targets, true);
                  const meleeHPS = meleeRotations.length > 0 ? meleeRotations[meleeRotations.length - 1].damage / time : 0;
                  
                  const sckData = simulateSpinningCraneKick(time, targets, true);
                  const sckHPS = sckData.length > 0 ? sckData[sckData.length - 1].damage / time : 0;
                  
                  const jeData = simulateJadeEmpowerment(time, targets, true);
                  const jeHPS = jeData.length > 0 ? jeData[jeData.length - 1].damage / time : 0;
                  
                  const meleeVsSck = ((meleeHPS - sckHPS) / sckHPS * 100).toFixed(2);
                  const meleeVsJe = ((meleeHPS - jeHPS) / jeHPS * 100).toFixed(2);
                  const sckVsJe = ((sckHPS - jeHPS) / jeHPS * 100).toFixed(2);
                  
                  return (
                    <TableRow key={targets} hover sx={{ 
                      cursor: 'pointer',
                      transition: 'box-shadow 0.2s',
                      '&:hover': {
                        boxShadow: 4,
                        backgroundColor: 'action.hover',
                      },
                    }}>
                      <TableCell align="right" sx={{ border: 0, py: 1, px: 1 }}>
                        <Typography variant="body2">{targets}</Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ border: 0, py: 1, px: 1 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 99, 132, 1)' }}>{meleeHPS.toFixed(2)}</Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ border: 0, py: 1, px: 1 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(42, 141, 31, 1)' }}>{sckHPS.toFixed(2)}</Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ border: 0, py: 1, px: 1 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(75, 192, 192, 1)' }}>{jeHPS.toFixed(2)}</Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ border: 0, py: 1, px: 1 }}>
                        <Typography variant="body2" sx={{ color: parseFloat(meleeVsSck) > 0 ? '#4ade80' : '#ef4444', fontWeight: 600 }}>{meleeVsSck}%</Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ border: 0, py: 1, px: 1 }}>
                        <Typography variant="body2" sx={{ color: parseFloat(meleeVsJe) > 0 ? '#4ade80' : '#ef4444', fontWeight: 600 }}>{meleeVsJe}%</Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ border: 0, py: 1, px: 1 }}>
                        <Typography variant="body2" sx={{ color: parseFloat(sckVsJe) > 0 ? '#4ade80' : '#ef4444', fontWeight: 600 }}>{sckVsJe}%</Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
      </Box>
    </Container>
  );
};

export default STVsSpinning;
