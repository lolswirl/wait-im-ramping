"use client";
import React, { useState, useMemo } from "react";
import {
  Box,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import SwirlTable, { SwirlColumn } from "@components/SwirlTable/SwirlTable";

import PageHeader from "@components/PageHeader/PageHeader";
import StatsCard, { Group, type StatsCardOptions } from "@components/StatsCard/StatsCard";
import ConfigPanel from "@components/ConfigPanel/ConfigPanel";
import { CONTENT_WIDTH } from "@components/Theme/tokens";
import SpecializationSelect from "@components/SpecializationSelect/SpecializationSelect";

import spell, { CATEGORY, CATEGORY_COLORS } from "@data/spells/spell";
import { formatNumber, formatPercent, pluralize } from "@util/stringManipulation";
import { CLASSES, specialization } from "@data/class";
import { Player } from "@data/shared/engine";
import { getSpecEngine } from "@data/shared/specEngines";
import TalentsCard from "@components/TalentsCard/TalentsCard";
import HeroTalentsCard from "@components/TalentsCard/HeroTalentsCard";

import SpellButton from "@components/SpellButtons/SpellButton";
import FieldCells from "@components/FieldCells/FieldCells";


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
  specKey: string,
  targetMultiplier = 1,
): { baseSpCoeff: number | null; spCoeff: number | null; absolute: number | null } => {
  const engine = getSpecEngine(specKey);

  const overridden = engine?.resolveSpellValue?.(s, player);
  if (overridden !== null && overridden !== undefined) {
    const absolute = overridden * targetMultiplier;
    return { baseSpCoeff: null, spCoeff: (absolute / player.stats.intellect) * 100, absolute };
  }

  if (s.formula !== undefined) {
    const absolute = s.formula(player.stats) * targetMultiplier;
    return { baseSpCoeff: null, spCoeff: (absolute / player.stats.intellect) * 100, absolute };
  }

  if (s.coeff !== undefined && engine !== undefined) {
    const absolute = (type === CATEGORY.DAMAGE
      ? engine.calculateSpellDamage(s, player)
      : engine.calculateSpellHealing(s, player)) * targetMultiplier;
    const rawCoeff = getRawCoeff(s, type);
    return {
      baseSpCoeff: rawCoeff !== null ? rawCoeff * 100 * targetMultiplier : null,
      spCoeff: (absolute / player.stats.intellect) * 100,
      absolute,
    };
  }

  return { baseSpCoeff: null, spCoeff: null, absolute: null };
};

const hasValue = (s: spell) =>
  s.coeff !== undefined || s.formula !== undefined || s.value?.damage !== undefined || s.value?.healing !== undefined;

const getMaxTargets = (s: spell, type: SpellType): number => {
  const th = (s as any).custom?.targetsHit;
  if (!th) return 1;
  if (typeof th === "number") return th;
  return (type === CATEGORY.DAMAGE ? th.damage : th.healing) ?? 1;
};

const expandRows = (s: spell, player: Player, specKey: string): SpellRow[] =>
  coeffTypes(s).flatMap(type => {
    const maxTargets = getMaxTargets(s, type);
    if (maxTargets > 1) {
      return [
        { spell: s, type, targets: 1, ...resolveValue(s, type, player, specKey, 1) },
        { spell: s, type, targets: maxTargets, ...resolveValue(s, type, player, specKey, maxTargets) },
      ];
    }
    return [{ spell: s, type, ...resolveValue(s, type, player, specKey, 1) }];
  });

const isDev = process.env.NODE_ENV === 'development';

const formatK = (value: number): string =>
  value >= 1000 ? `${Math.round(value / 1000)}k` : `${value}`;

const SpellReference: React.FC<{ title: React.ReactNode; description: React.ReactNode }> = ({ title, description }) => {
  const [spec, setSpec] = useState<specialization>(CLASSES.MONK.SPECS.MISTWEAVER);
  const [stats, setStats] = useState<StatsCardOptions>({ ...spec.stats });
  const [specTalents, setSpecTalents] = useState(spec.defaultTalents?.spec ?? new Map<spell, boolean>());
  const [heroTalents, setHeroTalents] = useState(spec.defaultTalents?.hero ?? new Map<spell, boolean>());
  const [classTalents, setClassTalents] = useState(spec.defaultTalents?.class ?? new Map<spell, boolean>());
  const [tierSet, setTierSet] = useState(spec.tierSet ?? new Map<spell, boolean>());

  const talents = useMemo(
    () => new Map<spell, boolean>([...specTalents, ...heroTalents, ...classTalents, ...tierSet]),
    [specTalents, heroTalents, classTalents, tierSet]
  );

  const handleSpecChange = (newSpec: specialization) => {
    setSpec(newSpec);
    setStats({ ...newSpec.stats });
    setSpecTalents(newSpec.defaultTalents?.spec ?? new Map());
    setHeroTalents(newSpec.defaultTalents?.hero ?? new Map());
    setClassTalents(newSpec.defaultTalents?.class ?? new Map());
    setTierSet(newSpec.tierSet ?? new Map());
  };

  const allSpells = useMemo(() => [
    ...Object.values(spec.spells),
    ...Object.values(spec.talents ?? {}),
  ].filter(hasValue), [spec]);

  const rows = useMemo(() => {
    const player: Player = { stats, talents, corePassives: spec.corePassives ?? [] };
    return allSpells.flatMap(s => expandRows(s, player, spec.key));
  }, [spec, allSpells, stats.intellect, stats.haste, stats.crit, stats.versatility, stats.mastery, stats.totalHp, talents]);

  return (
    <Container sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "center" }}>
      <PageHeader title={title} subtitle={description} marginBottom={0} />

      <ConfigPanel
        sx={{ maxWidth: CONTENT_WIDTH.wide }}
        accent={spec.color}
        onReset={() => handleSpecChange(spec)}
        sections={[
          {
            key: "spec",
            title: "spec",
            summary: spec.name.toLowerCase(),
            content: <SpecializationSelect short withLabel selectedSpec={spec} onSpecChange={handleSpecChange} />,
          },
          {
            key: "stats",
            title: "stats",
            summary: [
              `${stats.intellect.toLocaleString()} int`,
              `${formatK(stats.totalHp ?? 0)} hp`,
              `${stats.mastery}% mast`,
              ...(stats.haste > 0 || stats.crit > 0 || stats.versatility > 0
                ? [`${stats.haste}h ${stats.crit}c ${stats.versatility}v`]
                : []),
            ].join(" · "),
            content: <StatsCard options={stats} onOptionsChange={setStats} spec={spec} />,
          },
          ...(specTalents.size > 0 || heroTalents.size > 0 || classTalents.size > 0 || tierSet.size > 0 ? [{
            key: "talents",
            title: "talents",
            summary: `${[...talents.values()].filter(Boolean).length} active`,
            defaultOpen: true,
            content: (
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
                {tierSet.size > 0 && (
                  <>
                    {(specTalents.size > 0 || heroTalents.size > 0 || classTalents.size > 0) && (
                      <div style={{ gridColumn: "1 / -1", height: 1, background: "rgba(255,255,255,0.12)" }} />
                    )}
                    <TalentsCard
                      label="Tier"
                      options={tierSet}
                      color={spec.color}
                      onChange={(t, c) => setTierSet(prev => new Map(prev).set(t, c))}
                    />
                  </>
                )}
              </Group>
            ),
          }] : []),
          // ...(isDev ? [{
          //   key: "nerf",
          //   title: "nerf sim",
          //   summary: `${nerfPercent}%`,
          //   content: (
          //     <FieldCells
          //       fields={[{ key: "nerfPercent", label: "Nerf Percent", min: -100, adornment: "%" }]}
          //       options={{ nerfPercent }}
          //       onOptionsChange={newOptions => setNerfPercent(newOptions.nerfPercent ?? 0)}
          //     />
          //   ),
          // }] : []),
        ]}
      />

      <Box sx={{ width: "100%", maxWidth: CONTENT_WIDTH.wide }}>
        <SwirlTable
          rows={rows}
          rowKey={(row, i) => `${row.spell.id}-${row.type}-${row.targets ?? i}`}
          columns={[
            {
              key: "spell",
              label: "Spell",
              width: "2fr",
              sortValue: row => row.spell.display?.name ?? row.spell.name,
              render: row => (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <SpellButton selectedSpell={{ ...row.spell, icon: row.spell.display?.icon ?? row.spell.icon }} size={30} />
                  <Box>
                    <Typography variant="body2" fontWeight="bold">{row.spell.display?.name ?? row.spell.name}</Typography>
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
              render: row => {
                const typeColor = CATEGORY_COLORS[row.type as keyof typeof CATEGORY_COLORS] ?? "#ffffff";
                return (
                  <Box sx={{
                    display: "inline-flex",
                    px: 1,
                    py: 0.25,
                    borderRadius: 1,
                    border: `1px solid ${typeColor}66`,
                    backgroundColor: typeColor + "14",
                  }}>
                    <Typography variant="caption" sx={{ color: typeColor, fontWeight: 600 }}>
                      {row.type}
                    </Typography>
                  </Box>
                );
              },
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
          // ...(isDev ? [{
          //   key: "nerf",
          //   label: `After (${nerfPercent > 0 ? "+" : ""}${nerfPercent}%)`,
          //   width: "1fr",
          //   align: "right" as const,
          //   sortValue: (row: SpellRow) => (row.absolute ?? -1) * (1 + nerfPercent / 100),
          //   render: (row: SpellRow) => {
          //     if (row.absolute === null) return <Typography variant="body2" color="text.disabled">—</Typography>;
          //     const adjusted = row.absolute * (1 + nerfPercent / 100);
          //     return (
          //       <Box sx={{ textAlign: "right" }}>
          //         <Typography variant="body2" fontWeight="bold">{formatNumber(adjusted)}</Typography>
          //         <Typography variant="caption" color={nerfPercent < 0 ? "error.main" : "success.main"}>
          //           {nerfPercent > 0 ? "+" : ""}{nerfPercent.toFixed(1)}%
          //         </Typography>
          //       </Box>
          //     );
          //   },
          // }] : []),
          ] as SwirlColumn<SpellRow>[]}
          accentColor={row => CATEGORY_COLORS[row.type as keyof typeof CATEGORY_COLORS] ?? "#ffffff"}
        />
      </Box>
    </Container>
  );
};

export default SpellReference;
