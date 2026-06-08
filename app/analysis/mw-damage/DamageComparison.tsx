"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Box, Collapse, Container, Divider, TextField, useTheme, Card, Typography, Tab, Tabs, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Accordion, AccordionSummary, AccordionDetails, Skeleton } from "@mui/material";
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
import { type Player } from '@data/specs/monk/mistweaver/helpers';

import { T } from "@util/T";
import { formatNumber, formatPercent } from "@util/stringManipulation";
import WarningChip from "@components/WarningChip/WarningChip";
import AbilityBar from "@components/AbilityBar/AbilityBar";
import { RAINBOW_COLORS } from "@components/Buttons/RainbowCard";
import {
  simulateMeleeRotation,
  simulateMeleeRotationAt2Stacks,
  simulateSpinningCraneKick,
  simulateCracklingJadeLightning,
  simulateRSKWithSCK,
  simulateRSKWithSCKAndBok,
  type SimResult,
  type AbilityEntry,
} from "./simulations";
import type { ComboResultSerialized } from "./comboSim.worker";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type DamagePoint = { time: number; damage: number };

type RotationConfig = {
  dataKey: string;
  label: string;
  spells: spell[];
  color: string;
  simulateFn: (time: number, targets: number, asHealing: boolean, params: Player) => SimResult;
};

const cartesian = <T,>(arrays: T[][]): T[][] => {
  if (arrays.length === 0) return [[]];
  const [first, ...rest] = arrays;
  const restCombos = cartesian(rest);
  return first.flatMap(v => restCombos.map(combo => [v, ...combo]));
};

const buildRotationConfigs = (useRwk: boolean, talents: Map<spell, boolean>): RotationConfig[] =>
  [
    {
      dataKey: 'melee',
      label: 'TP TP BOK ' + (useRwk ? 'RWK' : 'RSK'),
      spells: [SPELLS.TIGER_PALM, SPELLS.TIGER_PALM, SPELLS.BLACKOUT_KICK, useRwk ? TALENTS.RUSHING_WIND_KICK : SPELLS.RISING_SUN_KICK],
      simulateFn: simulateMeleeRotation,
    },
    {
      dataKey: 'melee2',
      label: 'TP BoK ' + (useRwk ? 'RWK' : 'RSK'),
      spells: [SPELLS.TIGER_PALM, SPELLS.BLACKOUT_KICK, useRwk ? TALENTS.RUSHING_WIND_KICK : SPELLS.RISING_SUN_KICK],
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
      spells: [useRwk ? TALENTS.RUSHING_WIND_KICK : SPELLS.RISING_SUN_KICK, SPELLS.SPINNING_CRANE_KICK],
      simulateFn: simulateRSKWithSCK,
    },
    {
      dataKey: 'je',
      label: talents.get(TALENTS.JADE_EMPOWERMENT) ? 'CJL + JE' : 'CJL',
      spells: talents.get(TALENTS.JADE_EMPOWERMENT)
        ? [SPELLS.CRACKLING_JADE_LIGHTNING, TALENTS.JADE_EMPOWERMENT]
        : [SPELLS.CRACKLING_JADE_LIGHTNING],
      simulateFn: simulateCracklingJadeLightning,
    },
  ].map((e, i) => ({ ...e, color: RAINBOW_COLORS[i % RAINBOW_COLORS.length] }));

const DamageComparison: React.FC<{ title: React.ReactNode; description: React.ReactNode }> = ({ title, description }) => {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const [timeSpent, setTimeSpent] = useState(60);
  const [targetCount, setTargetCount] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [breakdownTab, setBreakdownTab] = useState(0);
  const [simulationKey, setSimulationKey] = useState(0);
  const showAsHealing = activeTab === 0;
  const [damageData, setDamageData] = useState<Record<string, SimResult>>({});

  const [comboResults, setComboResults] = useState<ComboResultSerialized[] | null>(null);
  const [comboAsHealing, setComboAsHealing] = useState(true);
  const workerRef = React.useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current?.terminate();
    setComboResults(null);
    const worker = new Worker(new URL('./comboSim.worker.ts', import.meta.url));
    workerRef.current = worker;
    worker.onmessage = (e: MessageEvent<{ type: 'progress'; pct: number } | { type: 'done'; results: ComboResultSerialized[] }>) => {
      if (e.data.type === 'done') {
        setComboResults(e.data.results);
        worker.terminate();
        workerRef.current = null;
      }
    };
    worker.postMessage({ targetCount, asHealing: comboAsHealing });
    return () => { worker.terminate(); };
  }, [targetCount, comboAsHealing]);

  const mistweaver = CLASSES.MONK.SPECS.MISTWEAVER;

  const [specTalents, setSpecTalents] = useState<Map<spell, boolean>>(new Map<spell, boolean>([
    [TALENTS.JADEFIRE_TEACHINGS, true],
    [TALENTS.RUSHING_WIND_KICK, false],
    [TALENTS.WAY_OF_THE_CRANE, true],
    [TALENTS.SPIRITFONT, false], // haha lol not used
    [TALENTS.MORNING_BREEZE, true], // used in keys woo
    [TALENTS.JADE_EMPOWERMENT, false],
  ]));

  const [heroTalents, setHeroTalents] = useState<Map<spell, boolean>>(new Map<spell, boolean>([
    [TALENTS.TEMPLE_TRAINING, true], // bugged sck increase
    [TALENTS.YULONS_KNOWLEDGE, true], // just gonna assume this one since its in keys
    [TALENTS.MEDITATIVE_FOCUS, false],
    [TALENTS.HARMONIC_SURGE, false],
  ]));

  const [classTalents, setClassTalents] = useState<Map<spell, boolean>>(new Map<spell, boolean>([
    [SHARED.FAST_FEET, true],
    [SHARED.FEROCITY_OF_XUEN, true],
    [SHARED.CHI_PROFICIENCY, true],
    [SHARED.MARTIAL_INSTINCTS, true],
  ]));

  const talents = useMemo(() => new Map<spell, boolean>([...specTalents, ...classTalents, ...heroTalents]), [specTalents, classTalents, heroTalents]);

  const spellById = useMemo<Map<number, spell>>(() => {
    const all: spell[] = [
      ...Object.values(SPELLS),
      ...Object.values(TALENTS),
      ...Object.values(SHARED),
    ];
    return new Map(all.map(s => [s.id, s]));
  }, []);

  const simulationParams = useMemo(() => ({ talents, stats: mistweaver.stats, corePassives: mistweaver.corePassives }), [talents, mistweaver.stats]);

  const useRwk = talents.get(TALENTS.RUSHING_WIND_KICK) === true;

  const useJe = talents.get(TALENTS.JADE_EMPOWERMENT) === true;
  const ROTATION_CONFIGS: RotationConfig[] = useMemo(
    () => buildRotationConfigs(useRwk, talents),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [useRwk, useJe]
  );

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
        <Typography variant="body2" sx={{ fontWeight: 600, letterSpacing: '0.5px', fontSize: '0.75rem' }}>
          {type} Values (500 seconds)
        </Typography>
      </Box>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ fontWeight: 'bold', border: 0, py: 1, px: 1 }}>Targets</TableCell>
            {ROTATION_CONFIGS.map(config => (
              <TableCell key={config.dataKey} align="center" sx={{ border: 0, py: 1, px: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {config.spells.map((spell, idx) => (
                      <SpellButton key={`${config.dataKey}-spell-${idx}`} selectedSpell={spell} size={24} />
                    ))}
                  </Box>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: '0.7rem', color: config.color }}>
                    {config.label}
                  </Typography>
                </Box>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(targets => {
            const rotationValues = ROTATION_CONFIGS.map(config => {
              const result = config.simulateFn(500, targets, asHealing, simulationParams);
              return result.points.length > 0 ? result.points[result.points.length - 1].damage / 500 : 0;
            });
            return (
              <TableRow key={targets} hover>
                <TableCell align="center" sx={{ border: 0, py: 1, px: 1 }}>
                  <Typography variant="body2" fontWeight="bold">{targets}</Typography>
                </TableCell>
                {rotationValues.map((value, idx) => (
                  <TableCell key={ROTATION_CONFIGS[idx].dataKey} align="center" sx={{ border: 0, py: 1, px: 1 }}>
                    <Typography variant="body2" sx={{ color: ROTATION_CONFIGS[idx].color, fontWeight: 'bold' }}>{formatNumber(value, 2)}</Typography>
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
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', letterSpacing: '0.5px', fontSize: '0.75rem' }}>
          {type} Comparisons (% Difference)
        </Typography>
      </Box>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ fontWeight: 'bold', border: 0, py: 1, px: 1 }}>Targets</TableCell>
            {ROTATION_CONFIGS.map((config1, i) =>
              ROTATION_CONFIGS.slice(i + 1).map(config2 => (
                <TableCell key={`${config1.dataKey}-vs-${config2.dataKey}`} align="center" sx={{ border: 0, py: 1, px: 1 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {config1.spells.map((spell, idx) => (
                        <SpellButton key={`${config1.dataKey}-s1-${idx}`} selectedSpell={spell} size={18} />
                      ))}
                      <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>vs</Typography>
                      {config2.spells.map((spell, idx) => (
                        <SpellButton key={`${config2.dataKey}-s2-${idx}`} selectedSpell={spell} size={18} />
                      ))}
                    </Box>
                    <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
                      {config1.label} vs {config2.label}
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
              const result = config.simulateFn(500, targets, asHealing, simulationParams);
              return result.points.length > 0 ? result.points[result.points.length - 1].damage / 500 : 0;
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
        const result = config.simulateFn(time, targets, false, simulationParams);
        return result.points.length > 0 ? result.points[result.points.length - 1].damage / time : 0;
      }),
      hps: ROTATION_CONFIGS.map(config => {
        const result = config.simulateFn(time, targets, true, simulationParams);
        return result.points.length > 0 ? result.points[result.points.length - 1].damage / time : 0;
      }),
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simulationKey, simulationParams, ROTATION_CONFIGS]);

  const renderHeatmapTable = (type: 'DPS' | 'HPS', asHealing: boolean) => {
    const rows = heatmapRows.map(row => ({ targets: row.targets, values: asHealing ? row.hps : row.dps }));

    return (
      <TableContainer component={Card} variant="outlined" sx={{ borderRadius: 1, border: "1px solid", borderColor: "divider", overflowX: "auto" }}>
        <Box sx={{ px: 2, pt: 1.5, pb: 1.5, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, letterSpacing: '0.5px', fontSize: '0.75rem' }}>
            {type} by Target Count (500 seconds)
          </Typography>
          <WarningChip message="% shown is relative to the best rotation in each row" borderColor="rgba(255,255,255,0.2)" />
        </Box>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 'bold', border: 0, py: 1, px: 1.5, width: 60 }}>
                <Typography variant="caption" fontWeight="bold">Targets</Typography>
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
                      {config.label}
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
                          {formatNumber(value)}
                        </Typography>
                        {t < 1 && (
                          <Typography variant="caption" sx={{ color: '#ef4444', lineHeight: 1, display: 'block', fontSize: '0.65rem', fontWeight: 700 }}>
                            {formatPercent((value - max) / max * 100, 1)}
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

  const [expandedAbilities, setExpandedAbilities] = useState<Set<number>>(new Set());
  const toggleAbility = (id: number) => setExpandedAbilities(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const renderAbilityRow = (spellObj: spell, total: number, denominator: number, color: string, indent = false, hasSub = false, isExpanded = false) => {
    const dps = total / timeSpent;
    const pct = denominator > 0 ? total / denominator : 0;
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pl: indent ? 5.5 : 0 }}>
        <SpellButton selectedSpell={spellObj} size={indent ? 22 : 28} />
        <AbilityBar
          pct={pct}
          color={color}
          dimmed={indent}
          label={spellObj.name}
          sublabel={`${formatNumber(dps, 2)} ${showAsHealing ? 'HPS' : 'DPS'}`}
          labelSuffix={hasSub && (
            <ExpandMore sx={{ fontSize: 14, color: 'text.disabled', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'none' }} />
          )}
        />
      </Box>
    );
  };

  const renderBreakdown = () => {
    const config = ROTATION_CONFIGS[breakdownTab];
    if (!config) return null;
    const result = damageData[config.dataKey];
    if (!result) return null;
    const totalDamage = result.points.length > 0 ? result.points[result.points.length - 1].damage : 0;
    const totalDps = totalDamage / timeSpent;
    const entries = [...result.perAbility.entries()].sort((a, b) => b[1].total - a[1].total);
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {entries.map(([spellObj, entry]) => {
          const hasSub = entry.sub && entry.sub.size > 1;
          const isExpanded = expandedAbilities.has(spellObj.id);
          return (
            <Box key={spellObj.id}>
              <Box
                onClick={hasSub ? () => toggleAbility(spellObj.id) : undefined}
                sx={{ cursor: hasSub ? 'pointer' : 'default' }}
              >
                {renderAbilityRow(spellObj, entry.total, totalDamage, config.color, false, hasSub, isExpanded)}
              </Box>
              {hasSub && (
                <Collapse in={isExpanded}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                    {[...entry.sub!.entries()]
                      .sort((a, b) => b[1] - a[1])
                      .map(([subSpell, subTotal]) =>
                        <Box key={subSpell.id}>{renderAbilityRow(subSpell, subTotal, entry.total, config.color, true)}</Box>
                      )}
                  </Box>
                </Collapse>
              )}
            </Box>
          );
        })}
        <Divider />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Total: <Typography component="span" variant="caption" sx={{ color: config.color, fontWeight: 700 }}>{formatNumber(totalDps, 2)} {showAsHealing ? 'HPS' : 'DPS'}</Typography>
          </Typography>
        </Box>
      </Box>
    );
  };

  const chartData = {
    labels: [...new Set(ROTATION_CONFIGS.flatMap(c => (damageData[c.dataKey]?.points ?? []).map(p => p.time)))],
    datasets: ROTATION_CONFIGS.map(config => ({
      label: T(config.label),
      data: (damageData[config.dataKey]?.points ?? []).map(item => item.damage),
      borderColor: config.color,
      backgroundColor: getBackgroundColor(config.color),
      fill: false,
    }))
  };

  if (!mounted) return (
    <Container sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center", justifyContent: "center" }}>
      <PageHeader title={title} subtitle={description} marginBottom={0} />
      {/* controls card */}
      <Card variant="outlined" sx={{ width: "100%", maxWidth: 1000, p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
          <Skeleton variant="rounded" width={160} height={40} />
          <Skeleton variant="rounded" width={100} height={40} />
          <Skeleton variant="rounded" width={140} height={40} />
        </Box>
        <Divider />
        <Box sx={{ pt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Skeleton variant="rounded" width={180} height={80} />
          <Skeleton variant="rounded" width={180} height={80} />
          <Skeleton variant="rounded" width={180} height={80} />
        </Box>
      </Card>
      {/* stat cards + chart */}
      <Card variant="outlined" sx={{ width: "100%", maxWidth: 1000, p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          {[...Array(5)].map((_, i) => <Skeleton key={i} variant="rounded" sx={{ flex: '1 1 140px' }} height={80} />)}
        </Box>
        <Skeleton variant="rounded" width="100%" height={500} />
      </Card>
      {/* heatmap */}
      <Card variant="outlined" sx={{ width: "100%", maxWidth: 1000, p: 2 }}>
        <Skeleton variant="rounded" width="100%" height={320} />
      </Card>
    </Container>
  );

  return (
    <Container sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center", justifyContent: "center" }}>
      <PageHeader title={title} subtitle={description} marginBottom={0} />
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
              Re-formulate
            </SwirlButton>
            <Box sx={{ flexGrow: 1 }} />
            <WarningChip message="Values may slightly shift due to the RNG of Rising Sun Kick resets" showIcon borderColor="#ffa726" />
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
          <Tab label={"HPS"} />
          <Tab label={"DPS"} />
        </Tabs>
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {(() => {
              const avgs = ROTATION_CONFIGS.map(config => {
                const result = damageData[config.dataKey];
                return result && result.points.length > 0 ? result.points[result.points.length - 1].damage / timeSpent : 0;
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
                      {config.label}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: config.color, lineHeight: 1.2 }}>
                        {formatNumber(avg, 2)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {showAsHealing ? 'HPS' : 'DPS'}
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
          <Card variant="outlined" sx={{ borderColor: 'divider' }}>
            <Tabs
              value={breakdownTab}
              onChange={(_, v) => setBreakdownTab(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              {ROTATION_CONFIGS.map((config, idx) => (
                <Tab
                  key={config.dataKey}
                  value={idx}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, pointerEvents: 'none' }}>
                      {config.spells.map((s, i) => (
                        <SpellButton key={i} selectedSpell={s} size={18} />
                      ))}
                    </Box>
                  }
                />
              ))}
            </Tabs>
            <Box sx={{ p: 2 }}>
              {renderBreakdown()}
            </Box>
          </Card>
        </Box>
      </Card>

      <Card variant="outlined" sx={{ width: "100%", maxWidth: 1000 }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }} variant="fullWidth">
          <Tab label={"HPS"} />
          <Tab label={"DPS"} />
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
          <Typography variant="body2" sx={{ fontWeight: 600, letterSpacing: '0.5px', fontSize: '0.75rem' }}>
            Raw Tables
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }} variant="fullWidth">
            <Tab label={"DPS"} />
            <Tab label={"HPS"} />
          </Tabs>
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {renderValuesTable(showAsHealing ? 'HPS' : 'DPS', showAsHealing)}
            {renderComparisonTable(showAsHealing ? 'HPS' : 'DPS', showAsHealing)}
          </Box>
        </AccordionDetails>
      </Accordion>
      <Card variant="outlined" sx={{ width: "100%", maxWidth: 1000 }}>
          <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 2 }}>
            <Tabs value={comboAsHealing ? 0 : 1} onChange={(_, v) => setComboAsHealing(v === 0)}>
              <Tab label="HPS" />
              <Tab label="DPS" />
            </Tabs>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              All Combos · {targetCount} target{targetCount !== 1 ? 's' : ''}, 500s{comboResults === null ? ' · loading…' : ` · ${comboResults.length} combinations`}
            </Typography>
          </Box>
          <Box sx={{ maxHeight: 480, overflowY: 'auto' }}>
            {comboResults === null ? (
              <Table size="small"><TableBody>
                {[...Array(14)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell sx={{ border: 0, py: 0.75, px: 1.5, width: 36 }}><Skeleton variant="text" width={24} /></TableCell>
                    <TableCell sx={{ border: 0, py: 0.75, px: 1 }}><Box sx={{ display: 'flex', gap: 0.5 }}>{[...Array(5)].map((_, j) => <Skeleton key={j} variant="rounded" width={22} height={22} />)}</Box></TableCell>
                    <TableCell sx={{ border: 0, py: 0.75, px: 1 }}><Box sx={{ display: 'flex', gap: 0.5 }}>{[...Array(3)].map((_, j) => <Skeleton key={j} variant="rounded" width={18} height={18} />)}</Box></TableCell>
                    <TableCell align="right" sx={{ border: 0, py: 0.75, px: 1.5 }}><Skeleton variant="text" width={48} sx={{ ml: 'auto' }} /></TableCell>
                  </TableRow>
                ))}
              </TableBody></Table>
            ) : <Table size="small">
              <TableBody>
                {comboResults.map((r, idx) => {
                  const isTop = idx === 0;
                  const pct = comboResults[0].value > 0 ? r.value / comboResults[0].value : 0;
                  const activeTalentSpells = r.talentIds.map(id => spellById.get(id)).filter((s): s is spell => s !== undefined);
                  return (
                    <TableRow key={idx} sx={{ bgcolor: isTop ? 'rgba(250,204,21,0.06)' : undefined }}>
                      <TableCell sx={{ border: 0, py: 0.75, px: 1.5, width: 36, color: isTop ? '#facc15' : 'text.disabled', fontWeight: 700, fontSize: '0.75rem' }}>
                        #{idx + 1}
                      </TableCell>
                      <TableCell sx={{ border: 0, py: 0.75, px: 1 }}>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', pointerEvents: 'none' }}>
                          {activeTalentSpells.map(t => (
                            <SpellButton key={t.id} selectedSpell={t} size={22} />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ border: 0, py: 0.75, px: 1, whiteSpace: 'nowrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, pointerEvents: 'none' }}>
                          {r.rotationSpellIds.map((id, i) => {
                            const s = spellById.get(id);
                            return s ? <SpellButton key={i} selectedSpell={s} size={18} /> : null;
                          })}
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ border: 0, py: 0.75, px: 1.5, whiteSpace: 'nowrap' }}>
                        <Typography variant="caption" sx={{ color: r.rotationColor, fontWeight: 700 }}>
                          {formatNumber(r.value, 2)}
                        </Typography>
                        {!isTop && (
                          <Typography variant="caption" sx={{ color: '#ef4444', ml: 0.75 }}>
                            {formatPercent((pct - 1) * 100, 1)}
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>}
          </Box>
        </Card>
    </Container>
  );
};

export default DamageComparison;
