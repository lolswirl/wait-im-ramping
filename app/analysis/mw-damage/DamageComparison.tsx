"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Box, Container, TextField, useTheme, Card, Typography, Divider, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

import PageHeader from "@components/PageHeader/PageHeader";
import SpellButton from "@components/SpellButtons/SpellButton";

import spell from "@data/spells/spell";
import SPELLS from "@data/spells";
import TALENTS from "@data/specs/monk/mistweaver/talents";
import SHARED from "@data/specs/monk/talents";
import { CLASSES } from "@data/class";

import { GetTitle } from "@util/stringManipulation";
import WarningChip from "@components/WarningChip/WarningChip";
import {
  simulateMeleeRotation,
  simulateSpinningCraneKick,
  simulateJadeEmpowerment,
  simulateRSKWithSCK,
} from "./simulations";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type DamagePoint = { time: number; damage: number };
type DamageData = {
  melee: DamagePoint[];
  sck: DamagePoint[];
  rskSck: DamagePoint[];
  je: DamagePoint[];
};

type SimulationParams = {
  talents: Map<spell, boolean>;
  mastery: number;
};

type RotationConfig = {
  dataKey: keyof DamageData;
  spells: spell[];
  color: string;
  simulateFn: (time: number, targets: number, asHealing: boolean, params: SimulationParams) => DamagePoint[];
};

const DamageComparison: React.FC<{ title: string; description: string }> = ({ title, description }) => {
  const theme = useTheme();
  const [timeSpent, setTimeSpent] = useState(30);
  const [targetCount, setTargetCount] = useState(1);
  const [showAsHealing, setShowAsHealing] = useState(false);
  const [damageData, setDamageData] = useState<DamageData>({
    melee: [],
    sck: [],
    rskSck: [],
    je: [],
  });

  const mistweaver = CLASSES.MONK.SPECS.MISTWEAVER;

  const talents = useMemo(() => new Map<spell, boolean>([
    [TALENTS.JADEFIRE_TEACHINGS, true],
    [TALENTS.YULONS_KNOWLEDGE, true],
    [TALENTS.SPIRITFONT, true],
    [SHARED.FAST_FEET, true],
    [SHARED.FEROCITY_OF_XUEN, true],
    [SHARED.CHI_PROFICIENCY, true],
    [SHARED.MARTIAL_INSTINCTS, true],
  ]), []);

  const mastery = useMemo(() => mistweaver.mastery / 100, [mistweaver.mastery]);

  const simulationParams = useMemo(() => ({ talents, mastery }), [talents, mastery]);

  useEffect(() => {
    const rotations = simulateMeleeRotation(timeSpent, targetCount, showAsHealing, simulationParams);
    const spinningCraneKickData = simulateSpinningCraneKick(timeSpent, targetCount, showAsHealing, simulationParams);
    const jadeEmpowermentData = simulateJadeEmpowerment(timeSpent, targetCount, showAsHealing, simulationParams);
    const rskWithSckData = simulateRSKWithSCK(timeSpent, targetCount, showAsHealing, simulationParams);
    setDamageData({
      melee: rotations,
      sck: spinningCraneKickData,
      rskSck: rskWithSckData,
      je: jadeEmpowermentData,
    });
  }, [timeSpent, targetCount, showAsHealing, simulationParams]);

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

  const rotationAverage = damageData.melee.length > 0 
    ? damageData.melee[damageData.melee.length - 1].damage / timeSpent 
    : 0;
  const sckAverage = damageData.sck.length > 0 
    ? damageData.sck[damageData.sck.length - 1].damage / timeSpent 
    : 0;
  const jeAverage = damageData.je.length > 0 
    ? damageData.je[damageData.je.length - 1].damage / timeSpent 
    : 0;
  const rskSckAverage = damageData.rskSck.length > 0 
    ? damageData.rskSck[damageData.rskSck.length - 1].damage / timeSpent 
    : 0;

  const getLabel = (dataKey: keyof DamageData): string => {
    const labelMap: Record<keyof DamageData, string> = {
      melee: 'Melee',
      sck: 'SCK',
      rskSck: 'RSK+SCK',
      je: 'JE',
    };
    return labelMap[dataKey];
  };

  const ROTATION_CONFIGS: RotationConfig[] = useMemo(() => [
    {
      dataKey: 'melee',
      spells: [SPELLS.TIGER_PALM, SPELLS.BLACKOUT_KICK, SPELLS.RISING_SUN_KICK],
      color: 'rgba(255, 99, 132, 1)',
      simulateFn: simulateMeleeRotation,
    },
    {
      dataKey: 'sck',
      spells: [SPELLS.SPINNING_CRANE_KICK],
      color: 'rgba(42, 141, 31, 1)',
      simulateFn: simulateSpinningCraneKick,
    },
    {
      dataKey: 'rskSck',
      spells: [SPELLS.RISING_SUN_KICK, SPELLS.SPINNING_CRANE_KICK],
      color: 'rgba(153, 102, 255, 1)',
      simulateFn: simulateRSKWithSCK,
    },
    {
      dataKey: 'je',
      spells: [TALENTS.JADE_EMPOWERMENT],
      color: 'rgba(75, 192, 192, 1)',
      simulateFn: simulateJadeEmpowerment,
    },
  ], []);

  // convert color alpha to 0.2
  const getBackgroundColor = (color: string) => color.replace(/, 1\)$/, ', 0.2)');

  const renderComparisonCell = (value: string, key: string) => (
    <TableCell key={key} align="center" sx={{ border: 0, py: 1, px: 1 }}>
      <Typography 
        variant="body2"
        sx={{ 
          color: parseFloat(value) > 0 ? '#4ade80' : '#ef4444',
          fontWeight: 600
        }}
      >
        {value}%
      </Typography>
    </TableCell>
  );

  const renderValuesTable = (type: 'DPS' | 'HPS', asHealing: boolean) => (
    <TableContainer component={Card} variant="outlined" sx={{ borderRadius: 1, boxShadow: 6, border: "1px solid", borderColor: "divider", overflowX: "auto" }}>
      <Box sx={{ px: 2, pt: 1.5, pb: 0.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem' }}>
          {GetTitle(`${type} Values (500 seconds)`)}
        </Typography>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1rem', border: 0, py: 1, px: 1 }}>{GetTitle("Targets")}</TableCell>
            {ROTATION_CONFIGS.map(config => (
              <TableCell key={config.dataKey} align="center" sx={{ border: 0, py: 1, px: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {config.spells.map((spell, idx) => (
                      <SpellButton key={`${config.dataKey}-spell-${idx}`} selectedSpell={spell} size={28} />
                    ))}
                  </Box>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}>
                    {GetTitle(getLabel(config.dataKey))}
                  </Typography>
                </Box>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((targets) => {
            const time = 500;
            const rotationValues = ROTATION_CONFIGS.map(config => {
              const data = config.simulateFn(time, targets, asHealing, simulationParams);
              return data.length > 0 ? data[data.length - 1].damage / time : 0;
            });
            
            return (
              <TableRow key={targets} hover sx={{ 
                cursor: 'pointer',
                transition: 'box-shadow 0.2s',
                '&:hover': {
                  boxShadow: 4,
                  backgroundColor: 'action.hover',
                },
              }}>
                <TableCell align="center" sx={{ border: 0, py: 1, px: 1 }}>
                  <Typography variant="body2">{targets}</Typography>
                </TableCell>
                {rotationValues.map((value, idx) => (
                  <TableCell key={ROTATION_CONFIGS[idx].dataKey} align="center" sx={{ border: 0, py: 1, px: 1 }}>
                    <Typography variant="body2" sx={{ color: ROTATION_CONFIGS[idx].color }}>{value.toFixed(2)}</Typography>
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderComparisonTable = (type: 'DPS' | 'HPS', asHealing: boolean) => (
    <TableContainer component={Card} variant="outlined" sx={{ borderRadius: 1, boxShadow: 6, border: "1px solid", borderColor: "divider", overflowX: "auto" }}>
      <Box sx={{ px: 2, pt: 1.5, pb: 0.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem' }}>
          {GetTitle(`${type} Comparisons (% Difference)`)}
        </Typography>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1rem', border: 0, py: 1, px: 1 }}>{GetTitle("Targets")}</TableCell>
            {ROTATION_CONFIGS.map((config1, i) => 
              ROTATION_CONFIGS.slice(i + 1).map(config2 => (
                <TableCell key={`${config1.dataKey}-vs-${config2.dataKey}`} align="center" sx={{ border: 0, py: 1, px: 1 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {config1.spells.map((spell, idx) => (
                        <SpellButton key={`${config1.dataKey}-spell1-${idx}`} selectedSpell={spell} size={20} />
                      ))}
                      <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>vs</Typography>
                      {config2.spells.map((spell, idx) => (
                        <SpellButton key={`${config2.dataKey}-spell2-${idx}`} selectedSpell={spell} size={20} />
                      ))}
                    </Box>
                    <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
                      {GetTitle(`${getLabel(config1.dataKey)} vs ${getLabel(config2.dataKey)}`)}
                    </Typography>
                  </Box>
                </TableCell>
              ))
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((targets) => {
            const time = 500;
            const rotationValues = ROTATION_CONFIGS.map(config => {
              const data = config.simulateFn(time, targets, asHealing, simulationParams);
              return data.length > 0 ? data[data.length - 1].damage / time : 0;
            });
            
            return (
              <TableRow key={targets} hover sx={{ 
                cursor: 'pointer',
                transition: 'box-shadow 0.2s',
                '&:hover': {
                  boxShadow: 4,
                  backgroundColor: 'action.hover',
                },
              }}>
                <TableCell align="center" sx={{ border: 0, py: 1, px: 1 }}>
                  <Typography variant="body2">{targets}</Typography>
                </TableCell>
                {ROTATION_CONFIGS.map((config1, i) => 
                  ROTATION_CONFIGS.slice(i + 1).map((config2, j) => {
                    const value1 = rotationValues[i];
                    const value2 = rotationValues[i + j + 1];
                    const comparison = ((value1 - value2) / value2 * 100).toFixed(2);
                    return renderComparisonCell(comparison, `${type.toLowerCase()}-${targets}-${config1.dataKey}-vs-${config2.dataKey}`);
                  })
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const chartData = {
    labels: [
      ...new Set([
        ...damageData.melee.map(item => item.time),
        ...damageData.sck.map(item => item.time),
        ...damageData.rskSck.map(item => item.time),
        ...damageData.je.map(item => item.time),
      ])
    ],
    datasets: ROTATION_CONFIGS.map(config => ({
      label: GetTitle(config.spells.map(s => s.name).join(', ')),
      data: damageData[config.dataKey].map(item => item.damage),
      borderColor: config.color,
      backgroundColor: getBackgroundColor(config.color),
      fill: false,
    }))
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
                {GetTitle(`${SPELLS.TIGER_PALM.name}, ${SPELLS.BLACKOUT_KICK.name}, ${SPELLS.RISING_SUN_KICK.name}`) }
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
                {GetTitle(SPELLS.SPINNING_CRANE_KICK.name)}
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
                {GetTitle(TALENTS.JADE_EMPOWERMENT.name)}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'rgba(75, 192, 192, 1)' }}>
                {jeAverage.toFixed(2)} {GetTitle(showAsHealing ? "HPS" : "DPS")}
              </Typography>
            </Card>
            
            <Card variant="outlined" sx={{ 
              p: 1.5, 
              background: `linear-gradient(135deg, rgba(153, 102, 255, 0.1), rgba(153, 102, 255, 0.05))`, 
              borderColor: 'rgba(153, 102, 255, 0.3)'
            }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                {GetTitle(`${SPELLS.RISING_SUN_KICK.name} + ${SPELLS.SPINNING_CRANE_KICK.name}`)}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'rgba(153, 102, 255, 1)' }}>
                {rskSckAverage.toFixed(2)} {GetTitle(showAsHealing ? "HPS" : "DPS")}
              </Typography>
            </Card> 
          </Box>
        </Box>
      </Card>

      <Box sx={{ height: "500px", width: "100%", maxWidth: 1200, display: "flex", justifyContent: "center" }}>
        <Line data={chartData} options={chartOptions} />
      </Box>

      <Box sx={{ width: "100%", maxWidth: 1000, mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {renderValuesTable('DPS', false)}
          {renderComparisonTable('DPS', false)}
          {renderValuesTable('HPS', true)}
          {renderComparisonTable('HPS', true)}
      </Box>
    </Container>
  );
};

export default DamageComparison;
