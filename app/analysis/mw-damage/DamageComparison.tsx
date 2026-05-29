"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Box, Container, Divider, TextField, useTheme, Card, Typography, Tab, Tabs, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { Refresh, EmojiEvents } from "@mui/icons-material";
import SwirlButton from "@components/Buttons/SwirlButton";

import PageHeader from "@components/PageHeader/PageHeader";
import SpellButton from "@components/SpellButtons/SpellButton";
import TalentsCard from "@components/TalentsCard/TalentsCard";
import HeroTalentsCard from "@components/TalentsCard/HeroTalentsCard";
import { Group } from "@components/StatsCard/StatsCard";

import spell from "@data/spells/spell";
import SPELLS from "@data/spells";
import TALENTS from "@data/specs/monk/mistweaver/talents";
import SHARED from "@data/specs/monk/talents";
import { CLASSES } from "@data/class";

import { T } from "@util/T";
import WarningChip from "@components/WarningChip/WarningChip";
import { RAINBOW_COLORS } from "@components/Buttons/RainbowCard";
import {
  simulateMeleeRotation,
  simulateMeleeRotationAt2Stacks,
  simulateSpinningCraneKick,
  simulateJadeEmpowerment,
  simulateRSKWithSCK,
  simulateRSKWithSCKAndBok,
} from "./simulations";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type DamagePoint = { time: number; damage: number };

type SimulationParams = {
  talents: Map<spell, boolean>;
  mastery: number;
};

type RotationConfig = {
  dataKey: string;
  label: string;
  spells: spell[];
  color: string;
  simulateFn: (time: number, targets: number, asHealing: boolean, params: SimulationParams) => DamagePoint[];
};

const DamageComparison: React.FC<{ title: string; description: string }> = ({ title, description }) => {
  const theme = useTheme();
  const [timeSpent, setTimeSpent] = useState(60);
  const [targetCount, setTargetCount] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [simulationKey, setSimulationKey] = useState(0);
  const showAsHealing = activeTab === 0;
  const [damageData, setDamageData] = useState<Record<string, DamagePoint[]>>({});

  const mistweaver = CLASSES.MONK.SPECS.MISTWEAVER;
  const mwMastery = mistweaver.mastery;

  const [specTalents, setSpecTalents] = useState<Map<spell, boolean>>(new Map<spell, boolean>([
    [TALENTS.JADEFIRE_TEACHINGS, true],
    [TALENTS.RUSHING_WIND_KICK, false],
    [TALENTS.SPIRITFONT, false], // haha lol not used
    [TALENTS.MORNING_BREEZE, true], // used in keys woo
  ]));

  const [heroTalents, setHeroTalents] = useState<Map<spell, boolean>>(new Map<spell, boolean>([
    [TALENTS.TEMPLE_TRAINING, true], // bugged sck increase
    [TALENTS.YULONS_KNOWLEDGE, true], // just gonna assume this one since its in keys
    [TALENTS.MEDITATIVE_FOCUS, false],
  ]));

  const [classTalents, setClassTalents] = useState<Map<spell, boolean>>(new Map<spell, boolean>([
    [SHARED.FAST_FEET, true],
    [SHARED.FEROCITY_OF_XUEN, true],
    [SHARED.CHI_PROFICIENCY, true],
    [SHARED.MARTIAL_INSTINCTS, true],
  ]));

  const talents = useMemo(() => new Map<spell, boolean>([...specTalents, ...classTalents, ...heroTalents]), [specTalents, classTalents, heroTalents]);

  const mastery = useMemo(() => mwMastery / 100, [mwMastery]);

  const simulationParams = useMemo(() => ({ talents, mastery }), [talents, mastery]);

  const useRwk = talents.get(TALENTS.RUSHING_WIND_KICK) === true;

  const ROTATION_CONFIGS: RotationConfig[] = useMemo(() => [
    {
      dataKey: 'melee',
      label: 'TP TP BOK ' + (useRwk ? 'RWK' : 'RSK'),
      spells: [
        SPELLS.TIGER_PALM,
        SPELLS.TIGER_PALM,
        SPELLS.BLACKOUT_KICK,
        useRwk ? TALENTS.RUSHING_WIND_KICK : SPELLS.RISING_SUN_KICK
      ],
      simulateFn: simulateMeleeRotation,
    },
    {
      dataKey: 'melee2',
      label: 'TP BoK ' + (useRwk ? 'RWK' : 'RSK'),
      spells: [
        SPELLS.TIGER_PALM,
        SPELLS.BLACKOUT_KICK,
        useRwk ? TALENTS.RUSHING_WIND_KICK : SPELLS.RISING_SUN_KICK
      ],
      simulateFn: simulateMeleeRotationAt2Stacks,
    },
    {
      dataKey: 'sck',
      label: 'SCK',
      spells: [SPELLS.SPINNING_CRANE_KICK],
      simulateFn: simulateSpinningCraneKick,
    },
    {
      dataKey: 'rskSck',
      label: (useRwk ? 'RWK' : 'RSK') + ' + SCK',
      spells: [
        useRwk ? TALENTS.RUSHING_WIND_KICK : SPELLS.RISING_SUN_KICK,
        SPELLS.SPINNING_CRANE_KICK
      ],
      simulateFn: simulateRSKWithSCK,
    },
    // lower than everything, but keeping here for later
    // {
    //   dataKey: 'rskSckBok',
    //   label: (useRwk ? 'RWK' : 'RSK') + ' + SCK + BoK',
    //   spells: [
    //     useRwk ? TALENTS.RUSHING_WIND_KICK : SPELLS.RISING_SUN_KICK,
    //     SPELLS.SPINNING_CRANE_KICK,
    //     SPELLS.BLACKOUT_KICK,
    //   ],
    //   simulateFn: simulateRSKWithSCKAndBok,
    // },
    {
      dataKey: 'je',
      label: 'JE',
      spells: [TALENTS.JADE_EMPOWERMENT],
      simulateFn: simulateJadeEmpowerment,
    },
  ].map((e, i) => ({ ...e, color: RAINBOW_COLORS[i % RAINBOW_COLORS.length] })), [useRwk]);

  useEffect(() => {
    setDamageData(
      Object.fromEntries(
        ROTATION_CONFIGS.map(c => [c.dataKey, c.simulateFn(timeSpent, targetCount, showAsHealing, simulationParams)])
      )
    );
  }, [timeSpent, targetCount, showAsHealing, simulationParams, simulationKey, ROTATION_CONFIGS]);

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
        title: { display: true, text: T("Time (Seconds)") }, 
        ticks: { autoSkip: true },
        grid: {
          color: theme.custom.chart.gridColor,
        },
      },
      y: { 
        title: { display: true, text: T(showAsHealing ? "Cumulative Healing" : "Cumulative Damage") }, 
        beginAtZero: true,
        grid: {
          color: theme.custom.chart.gridColor,
        },
      },
    },
  };

  const getBackgroundColor = (color: string) => `${color}33`;
  const getBorderColor = (color: string) => `${color}66`;
  const getCardBg = (color: string) => `${color}12`;

  const renderComparisonCell = (value: string, key: string) => (
    <TableCell key={key} align="center" sx={{ border: 0, py: 1, px: 1 }}>
      <Typography variant="body2" sx={{ color: parseFloat(value) > 0 ? '#4ade80' : '#ef4444', fontWeight: 600 }}>
        {value}%
      </Typography>
    </TableCell>
  );

  const renderValuesTable = (type: 'DPS' | 'HPS', asHealing: boolean) => (
    <TableContainer component={Card} variant="outlined" sx={{ borderRadius: 1, border: "1px solid", borderColor: "divider", overflowX: "auto" }}>
      <Box sx={{ px: 2, pt: 1.5, pb: 0.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem' }}>
          <T>{type} Values (500 seconds)</T>
        </Typography>
      </Box>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ fontWeight: 'bold', border: 0, py: 1, px: 1 }}><T>Targets</T></TableCell>
            {ROTATION_CONFIGS.map(config => (
              <TableCell key={config.dataKey} align="center" sx={{ border: 0, py: 1, px: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {config.spells.map((spell, idx) => (
                      <SpellButton key={`${config.dataKey}-spell-${idx}`} selectedSpell={spell} size={24} />
                    ))}
                  </Box>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: '0.7rem', color: config.color }}>
                    <T>{config.label}</T>
                  </Typography>
                </Box>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(targets => {
            const rotationValues = ROTATION_CONFIGS.map(config => {
              const data = config.simulateFn(500, targets, asHealing, simulationParams);
              return data.length > 0 ? data[data.length - 1].damage / 500 : 0;
            });
            return (
              <TableRow key={targets} hover>
                <TableCell align="center" sx={{ border: 0, py: 1, px: 1 }}>
                  <Typography variant="body2" fontWeight="bold">{targets}</Typography>
                </TableCell>
                {rotationValues.map((value, idx) => (
                  <TableCell key={ROTATION_CONFIGS[idx].dataKey} align="center" sx={{ border: 0, py: 1, px: 1 }}>
                    <Typography variant="body2" sx={{ color: ROTATION_CONFIGS[idx].color, fontWeight: 'bold' }}>{value.toFixed(2)}</Typography>
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
    <TableContainer component={Card} variant="outlined" sx={{ borderRadius: 1, border: "1px solid", borderColor: "divider", overflowX: "auto" }}>
      <Box sx={{ px: 2, pt: 1.5, pb: 0.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem' }}>
          <T>{type} Comparisons (% Difference)</T>
        </Typography>
      </Box>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ fontWeight: 'bold', border: 0, py: 1, px: 1 }}><T>Targets</T></TableCell>
            {ROTATION_CONFIGS.map((config1, i) =>
              ROTATION_CONFIGS.slice(i + 1).map(config2 => (
                <TableCell key={`${config1.dataKey}-vs-${config2.dataKey}`} align="center" sx={{ border: 0, py: 1, px: 1 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {config1.spells.map((spell, idx) => (
                        <SpellButton key={`${config1.dataKey}-s1-${idx}`} selectedSpell={spell} size={18} />
                      ))}
                      <Typography variant="caption" sx={{ fontSize: '0.65rem' }}><T>vs</T></Typography>
                      {config2.spells.map((spell, idx) => (
                        <SpellButton key={`${config2.dataKey}-s2-${idx}`} selectedSpell={spell} size={18} />
                      ))}
                    </Box>
                    <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
                      <T>{config1.label} vs {config2.label}</T>
                    </Typography>
                  </Box>
                </TableCell>
              ))
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(targets => {
            const rotationValues = ROTATION_CONFIGS.map(config => {
              const data = config.simulateFn(500, targets, asHealing, simulationParams);
              return data.length > 0 ? data[data.length - 1].damage / 500 : 0;
            });
            return (
              <TableRow key={targets} hover>
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

  const heatmapRows = useMemo(() => {
    const time = 500;
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(targets => ({
      targets,
      dps: ROTATION_CONFIGS.map(config => {
        const data = config.simulateFn(time, targets, false, simulationParams);
        return data.length > 0 ? data[data.length - 1].damage / time : 0;
      }),
      hps: ROTATION_CONFIGS.map(config => {
        const data = config.simulateFn(time, targets, true, simulationParams);
        return data.length > 0 ? data[data.length - 1].damage / time : 0;
      }),
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simulationKey, simulationParams, ROTATION_CONFIGS]);

  const renderHeatmapTable = (type: 'DPS' | 'HPS', asHealing: boolean) => {
    const rows = heatmapRows.map(row => ({ targets: row.targets, values: asHealing ? row.hps : row.dps }));

    return (
      <TableContainer component={Card} variant="outlined" sx={{ borderRadius: 1, border: "1px solid", borderColor: "divider", overflowX: "auto" }}>
        <Box sx={{ px: 2, pt: 1.5, pb: 1.5, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem' }}>
            <T>{type} by Target Count (500 seconds)</T>
          </Typography>
          <WarningChip message="% shown is relative to the best rotation in each row" borderColor="rgba(255,255,255,0.2)" />
        </Box>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 'bold', border: 0, py: 1, px: 1.5, width: 60 }}>
                <Typography variant="caption" fontWeight="bold"><T>Targets</T></Typography>
              </TableCell>
              {ROTATION_CONFIGS.map(config => (
                <TableCell key={config.dataKey} align="center" sx={{ border: 0, py: 1, px: 1, width: 120, minWidth: 120 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {config.spells.map((spell, idx) => (
                        <SpellButton key={`${config.dataKey}-spell-${idx}`} selectedSpell={spell} size={24} />
                      ))}
                    </Box>
                    <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: '0.7rem', color: config.color }}>
                      <T>{config.label}</T>
                    </Typography>
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(({ targets, values }) => {
              const min = Math.min(...values);
              const max = Math.max(...values);
              const range = max - min || 1;
              return (
                <TableRow key={targets}>
                  <TableCell align="center" sx={{ border: 0, py: 1.25, px: 1.5 }}>
                    <Typography variant="body2" fontWeight="bold">{targets}</Typography>
                  </TableCell>
                  {values.map((value, idx) => {
                    const t = (value - min) / range;
                    const r = Math.round(239 - t * (239 - 74));
                    const g = Math.round(68 + t * (222 - 68));
                    const b = Math.round(68 + t * (128 - 68));
                    return (
                      <TableCell key={ROTATION_CONFIGS[idx].dataKey} align="center" sx={{
                        border: 0,
                        py: 1.25,
                        px: 1,
                        backgroundColor: `rgba(${r}, ${g}, ${b}, 0.18)`,
                      }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                          {value.toFixed(0)}
                        </Typography>
                        {t < 1 && (
                          <Typography variant="caption" sx={{ color: '#ef4444', lineHeight: 1, display: 'block', fontSize: '0.65rem', fontWeight: 700 }}>
                            {((value - max) / max * 100).toFixed(1)}%
                          </Typography>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const chartData = {
    labels: [...new Set(ROTATION_CONFIGS.flatMap(c => (damageData[c.dataKey] ?? []).map(p => p.time)))],
    datasets: ROTATION_CONFIGS.map(config => ({
      label: T(config.label),
      data: (damageData[config.dataKey] ?? []).map(item => item.damage),
      borderColor: config.color,
      backgroundColor: getBackgroundColor(config.color),
      fill: false,
    }))
  };

  return (
    <Container sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center", justifyContent: "center" }}>
      <PageHeader title={title} subtitle={description} marginBottom={0} />
      <WarningChip message="Values may slightly shift due to the RNG of Rising Sun Kick resets" showIcon borderColor="#ffa726" />

      <Card variant="outlined" sx={{ width: "100%", maxWidth: 1000 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              label={T("Time (Seconds)")}
              type="number"
              value={timeSpent}
              onChange={handleTimeChange}
              size="small"
              sx={{ maxWidth: 160 }}
            />
            <TextField
              label={T("Targets")}
              type="number"
              value={targetCount}
              onChange={handleTargetCountChange}
              size="small"
              sx={{ maxWidth: 100 }}
            />
            <SwirlButton
              color="success"
              textColor="success"
              onClick={() => setSimulationKey(k => k + 1)}
              startIcon={<Refresh />}
            >
              <T>Re-formulate</T>
            </SwirlButton>
          </Box>
          <Divider />
          <Box sx={{ p: 2 }}>
            <Group>
              <TalentsCard label="Spec" options={specTalents} color={mistweaver.color} onChange={(t, c) => setSpecTalents(prev => new Map(prev).set(t, c))} />
              <HeroTalentsCard label="Hero" options={heroTalents} onChange={(t, c) => setHeroTalents(prev => new Map(prev).set(t, c))} />
              <TalentsCard label="Class" options={classTalents} color={CLASSES.MONK.color} onChange={(t, c) => setClassTalents(prev => new Map(prev).set(t, c))} />
            </Group>
          </Box>
        </Box>
      </Card>

      <Card variant="outlined" sx={{ width: "100%", maxWidth: 1000 }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }} variant="fullWidth">
          <Tab label={T("HPS")} />
          <Tab label={T("DPS")} />
        </Tabs>
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {(() => {
              const avgs = ROTATION_CONFIGS.map(config => {
                const series = damageData[config.dataKey] ?? [];
                return series.length > 0 ? series[series.length - 1].damage / timeSpent : 0;
              });
              const bestAvg = Math.max(...avgs);
              return ROTATION_CONFIGS.map((config, idx) => {
                const avg = avgs[idx];
                const isBest = avg === bestAvg && bestAvg > 0;
                return (
                  <Card key={config.dataKey} variant="outlined" sx={{
                    flex: '1 1 140px',
                    px: 1.5,
                    py: 1.5,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                    position: 'relative',
                    borderColor: getBorderColor(config.color),
                    background: getCardBg(config.color),
                  }}>
                    {isBest && (
                      <EmojiEvents sx={{ position: 'absolute', top: 8, right: 8, fontSize: 16, color: '#facc15' }} />
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {config.spells.map((s, i) => (
                        <SpellButton key={i} selectedSpell={s} size={22} />
                      ))}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      <T>{config.label}</T>
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: config.color, lineHeight: 1.2 }}>
                        {avg.toFixed(2)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        <T>{showAsHealing ? 'HPS' : 'DPS'}</T>
                      </Typography>
                    </Box>
                  </Card>
                );
              });
            })()}
          </Box>
          <Box sx={{ height: "500px", width: "100%" }}>
            <Line data={chartData} options={chartOptions} />
          </Box>
        </Box>
      </Card>

      <Card variant="outlined" sx={{ width: "100%", maxWidth: 1000 }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }} variant="fullWidth">
          <Tab label={T("HPS")} />
          <Tab label={T("DPS")} />
        </Tabs>
        <Box sx={{ p: 2 }}>
          {renderHeatmapTable(showAsHealing ? 'HPS' : 'DPS', showAsHealing)}
        </Box>
      </Card>

      <Accordion
        variant="outlined"
        disableGutters
        sx={{ width: "100%", maxWidth: 1000, borderRadius: '4px', '&:before': { display: 'none' } }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem' }}>
            <T>Raw Tables</T>
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }} variant="fullWidth">
            <Tab label={T("DPS")} />
            <Tab label={T("HPS")} />
          </Tabs>
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {renderValuesTable(showAsHealing ? 'HPS' : 'DPS', showAsHealing)}
            {renderComparisonTable(showAsHealing ? 'HPS' : 'DPS', showAsHealing)}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Container>
  );
};

export default DamageComparison;
