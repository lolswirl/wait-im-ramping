"use client";
import React, { useState, useMemo } from "react";
import {
  Box,
  Card,
  Container,
  Divider,
  Typography,
} from "@mui/material";
import SwirlTable, { SwirlColumn } from "@components/SwirlTable/SwirlTable";

import PageHeader from "@components/PageHeader/PageHeader";
import StatsCard, { Group, StatsCardOptions } from "@components/StatsCard/StatsCard";
import SpecializationSelect from "@components/SpecializationSelect/SpecializationSelect";

import spell, { CATEGORY, CATEGORY_COLORS } from "@data/spells/spell";
import { formatNumber, formatPercent, pluralize } from "@util/stringManipulation";
import { CLASSES, specialization } from "@data/class";
import { calculateSpellDamage, calculateSpellHealing, Player } from "@data/specs/monk/mistweaver/helpers";
import TalentsCard from "@components/TalentsCard/TalentsCard";
import HeroTalentsCard from "@components/TalentsCard/HeroTalentsCard";

import SpellButton from "@components/SpellButtons/SpellButton";

import WarningChip from "@components/WarningChip/WarningChip";


type SpellRow = {
  spell: spell;
  type: SpellType;
  baseSpCoeff: number | null;
  spCoeff: number | null;
  absolute: number | null;
  targets?: number;
};

type SpellType = typeof CATEGORY.DAMAGE | typeof CATEGORY.HEALING;

const coeffTypes = (s: spell): SpellType[] => {
  if (s.formula !== undefined) {
    return [s.category === CATEGORY.DAMAGE ? CATEGORY.DAMAGE : CATEGORY.HEALING];
  }
  if (s.coeff === undefined) {
    const types: SpellType[] = [];
    if (s.value?.damage !== undefined) types.push(CATEGORY.DAMAGE);
    if (s.value?.healing !== undefined) types.push(CATEGORY.HEALING);
    return types;
  }
  if (typeof s.coeff === "number") {
    return [s.category === CATEGORY.DAMAGE ? CATEGORY.DAMAGE : CATEGORY.HEALING];
  }
  const types: SpellType[] = [];
  if (s.coeff.damage !== undefined) types.push(CATEGORY.DAMAGE);
  if (s.coeff.healing !== undefined) types.push(CATEGORY.HEALING);
  return types;
};

const getRawCoeff = (s: spell, type: SpellType): number | null => {
  if (s.coeff === undefined) return null;
  if (typeof s.coeff === "number") return s.coeff;
  return (type === CATEGORY.DAMAGE ? s.coeff.damage : s.coeff.healing) ?? null;
};

const resolveValue = (
  s: spell,
  type: SpellType,
  player: Player,
  targetMultiplier = 1,
): { baseSpCoeff: number | null; spCoeff: number | null; absolute: number | null } => {
  if (s.formula !== undefined) {
    const absolute = s.formula(player.stats) * targetMultiplier;
    return { baseSpCoeff: null, spCoeff: (absolute / player.stats.intellect) * 100, absolute };
  }
  if (s.coeff !== undefined) {
    const absolute = (type === CATEGORY.DAMAGE
      ? calculateSpellDamage(s, player)
      : calculateSpellHealing(s, player)) * targetMultiplier;
    const rawCoeff = getRawCoeff(s, type);
    return {
      baseSpCoeff: rawCoeff !== null ? rawCoeff * 100 * targetMultiplier : null,
      spCoeff: (absolute / player.stats.intellect) * 100,
      absolute,
    };
  }
  const raw = type === CATEGORY.DAMAGE ? s.value?.damage : s.value?.healing;
  return { baseSpCoeff: null, spCoeff: null, absolute: raw ?? null };
};

const hasValue = (s: spell) =>
  s.coeff !== undefined || s.formula !== undefined || s.value?.damage !== undefined || s.value?.healing !== undefined;

const getMaxTargets = (s: spell, type: SpellType): number => {
  const th = (s as any).custom?.targetsHit;
  if (!th) return 1;
  if (typeof th === "number") return th;
  return (type === CATEGORY.DAMAGE ? th.damage : th.healing) ?? 1;
};

const expandRows = (s: spell, player: Player): SpellRow[] =>
  coeffTypes(s).flatMap(type => {
    const maxTargets = getMaxTargets(s, type);
    if (maxTargets > 1) {
      return [
        { spell: s, type, targets: 1, ...resolveValue(s, type, player, 1) },
        { spell: s, type, targets: maxTargets, ...resolveValue(s, type, player, maxTargets) },
      ];
    }
    return [{ spell: s, type, ...resolveValue(s, type, player, 1) }];
  });

const SpellReference: React.FC<{ title: React.ReactNode; description: React.ReactNode }> = ({ title, description }) => {
  const [spec, setSpec] = useState<specialization>(CLASSES.MONK.SPECS.MISTWEAVER);
  const [stats, setStats] = useState<StatsCardOptions>({ ...spec.stats });
  const [specTalents, setSpecTalents] = useState(spec.defaultTalents?.spec ?? new Map<spell, boolean>());
  const [heroTalents, setHeroTalents] = useState(spec.defaultTalents?.hero ?? new Map<spell, boolean>());
  const [classTalents, setClassTalents] = useState(spec.defaultTalents?.class ?? new Map<spell, boolean>());

  const talents = useMemo(
    () => new Map<spell, boolean>([...specTalents, ...heroTalents, ...classTalents]),
    [specTalents, heroTalents, classTalents]
  );

  const handleSpecChange = (newSpec: specialization) => {
    setSpec(newSpec);
    setStats({ ...newSpec.stats });
    setSpecTalents(newSpec.defaultTalents?.spec ?? new Map());
    setHeroTalents(newSpec.defaultTalents?.hero ?? new Map());
    setClassTalents(newSpec.defaultTalents?.class ?? new Map());
  };

  const rows = useMemo(() => {
    const allSpells = [
      ...Object.values(spec.spells),
      ...Object.values(spec.talents ?? {}),
    ].filter(hasValue);

    const player: Player = { stats, talents, corePassives: spec.corePassives ?? [] };
    return allSpells.flatMap(s => expandRows(s, player));
  }, [spec, stats.intellect, stats.haste, stats.crit, stats.versatility, stats.mastery, stats.totalHp, talents]);

  return (
    <Container sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
      <PageHeader title={title} subtitle={description} marginBottom={0} />

      <Card variant="outlined" sx={{ width: "100%", maxWidth: 1000, display: "flex", flexDirection: { xs: "column", md: "row" } }}>
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2, flex: "0 0 auto", width: 300 }}>
          <WarningChip message="Work in Progress. Some data might be incorrect." showIcon borderColor='#ffa726' />
          <Box sx={{ width: "fit-content" }}>
            <SpecializationSelect selectedSpec={spec} onSpecChange={handleSpecChange} />
          </Box>
          <Group>
            <StatsCard options={stats} onOptionsChange={setStats} />
          </Group>
        </Box>
        {(specTalents.size > 0 || heroTalents.size > 0 || classTalents.size > 0) && (
          <>
            <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", md: "block" } }} />
            <Divider sx={{ display: { md: "none" } }} />
            <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
              <Group>
                {specTalents.size > 0 && (
                  <TalentsCard
                    label="Spec"
                    options={specTalents}
                    color={spec.color}
                    onChange={(t, c) => setSpecTalents(prev => new Map(prev).set(t, c))}
                  />
                )}
                {heroTalents.size > 0 && (
                  <HeroTalentsCard
                    options={heroTalents}
                    onChange={(t, c) => setHeroTalents(prev => new Map(prev).set(t, c))}
                  />
                )}
                {classTalents.size > 0 && (
                  <TalentsCard
                    label="Class"
                    options={classTalents}
                    color={spec.color}
                    onChange={(t, c) => setClassTalents(prev => new Map(prev).set(t, c))}
                  />
                )}
              </Group>
            </Box>
          </>
        )}
      </Card>

      <Box sx={{ width: "100%", maxWidth: 1000 }}>
        <SwirlTable
          rows={rows}
          rowKey={(row, i) => `${row.spell.id}-${row.type}-${row.targets ?? i}`}
          columns={[
            {
              key: "spell",
              label: "Spell",
              width: "2fr",
              sortValue: row => row.spell.name,
              render: row => (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <SpellButton selectedSpell={row.spell} size={30} />
                  <Box>
                    <Typography variant="body2" fontWeight="bold">{row.spell.name}</Typography>
                    {row.targets !== undefined && (
                      <Typography variant="caption" color="text.disabled">{row.targets} {pluralize(row.targets, "target")}</Typography>
                    )}
                  </Box>
                </Box>
              ),
            },
            {
              key: "type",
              label: "Type",
              width: "1fr",
              align: "center",
              sortValue: row => row.type,
              render: row => (
                <Typography variant="caption" sx={{ color: CATEGORY_COLORS[row.type as keyof typeof CATEGORY_COLORS] ?? "#ffffff" }}>
                  {row.type}
                </Typography>
              ),
            },
            {
              key: "baseSp",
              label: "Base SP%",
              width: "1fr",
              align: "right",
              sortValue: row => row.baseSpCoeff ?? -1,
              render: row => (
                <Typography variant="body2" color="text.secondary">
                  {row.baseSpCoeff !== null ? formatPercent(row.baseSpCoeff) : "—"}
                </Typography>
              ),
            },
            {
              key: "effectiveSp",
              label: "Effective SP%",
              width: "1fr",
              align: "right",
              sortValue: row => row.spCoeff ?? -1,
              render: row => (
                <Typography variant="body2">
                  {row.spCoeff !== null ? formatPercent(row.spCoeff) : "—"}
                </Typography>
              ),
            },
            {
              key: "absolute",
              label: `Throughput`,
              width: "1fr",
              align: "right",
              sortValue: row => row.absolute ?? -1,
              render: row => (
                <Typography variant="body2" fontWeight="bold">
                  {formatNumber(row.absolute!)}
                </Typography>
              ),
            },
          ] as SwirlColumn<SpellRow>[]}
          accentColor={row => CATEGORY_COLORS[row.type as keyof typeof CATEGORY_COLORS] ?? "#ffffff"}
        />
      </Box>
    </Container>
  );
};

export default SpellReference;
