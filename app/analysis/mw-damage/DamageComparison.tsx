"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Box, Container, Divider, TextField, useTheme, Card, Typography, Tab, Tabs, Skeleton } from "@mui/material";
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
import { formatNumber } from "@util/stringManipulation";
import WarningChip from "@components/WarningChip/WarningChip";

import { type SimResult } from "./simulations";
import { buildRotationConfigs, getBackgroundColor, getBorderColor, getCardBg } from "./types";
import BreakdownCard from "./BreakdownCard";
import HeatmapCard from "./HeatmapCard";
import RawTablesAccordion from "./RawTablesAccordion";
import ComboRankCard from "./ComboRankCard";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DamageComparison: React.FC<{ title: React.ReactNode; description: React.ReactNode }> = ({ title, description }) => {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const [timeSpent, setTimeSpent] = useState(60);
  const [targetCount, setTargetCount] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [simulationKey, setSimulationKey] = useState(0);
  const showAsHealing = activeTab === 0;
  const [damageData, setDamageData] = useState<Record<string, SimResult>>({});

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

  const [tierSet, setTierSet] = useState<Map<spell, boolean>>(mistweaver.tierSet ?? new Map<spell, boolean>());

  const talents = useMemo(() => new Map<spell, boolean>([...specTalents, ...classTalents, ...heroTalents, ...tierSet]), [specTalents, classTalents, heroTalents, tierSet]);

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
  const ROTATION_CONFIGS = useMemo(
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
              {tierSet.size > 0 && (
                <>
                  <div style={{ gridColumn: "1 / -1", height: 1, background: "rgba(255,255,255,0.12)" }} />
                  <TalentsCard label="Tier" options={tierSet} color={mistweaver.color} onChange={(t, c) => setTierSet(prev => new Map(prev).set(t, c))} />
                </>
              )}
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
          <BreakdownCard
            rotationConfigs={ROTATION_CONFIGS}
            damageData={damageData}
            showAsHealing={showAsHealing}
            timeSpent={timeSpent}
          />
        </Box>
      </Card>

      <HeatmapCard
        rotationConfigs={ROTATION_CONFIGS}
        simulationParams={simulationParams}
        simulationKey={simulationKey}
        showAsHealing={showAsHealing}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <RawTablesAccordion
        rotationConfigs={ROTATION_CONFIGS}
        simulationParams={simulationParams}
        showAsHealing={showAsHealing}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <ComboRankCard
        targetCount={targetCount}
        spellById={spellById}
      />
    </Container>
  );
};

export default DamageComparison;
