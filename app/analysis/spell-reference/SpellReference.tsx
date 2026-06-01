"use client";
import React, { useState, useMemo } from "react";
import {
  Card,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import PageHeader from "@components/PageHeader/PageHeader";
import StatsCard, { Group, StatsCardOptions } from "@components/StatsCard/StatsCard";
import SpecializationSelect from "@components/SpecializationSelect/SpecializationSelect";

import spell, { CATEGORY } from "@data/spells/spell";
import { CLASSES, specialization } from "@data/class";
import { calculateSpellDamage, calculateSpellHealing, Player } from "@data/specs/monk/mistweaver/helpers";
import TalentsCard from "@components/TalentsCard/TalentsCard";
import HeroTalentsCard from "@components/TalentsCard/HeroTalentsCard";

import SpellButton from "@components/SpellButtons/SpellButton";

import { T } from "@util/T";
import WarningChip from "@components/WarningChip/WarningChip";

const headerSx = {
  fontWeight: "bold",
  border: 0,
  py: 1,
  px: 1.5,
  fontSize: "0.75rem",
  letterSpacing: "0.5px",
};

const cellSx = { border: 0, py: 1, px: 1.5 };

type SpellRow = {
  spell: spell;
  type: "damage" | "healing";
  baseSpCoeff: number | null;
  spCoeff: number | null;
  absolute: number | null;
};

const coeffTypes = (s: spell): ("damage" | "healing")[] => {
  if (s.coeff === undefined) {
    const types: ("damage" | "healing")[] = [];
    if (s.value?.damage !== undefined) types.push("damage");
    if (s.value?.healing !== undefined) types.push("healing");
    return types;
  }
  if (typeof s.coeff === "number") {
    return [s.category === CATEGORY.DAMAGE ? "damage" : "healing"];
  }
  const types: ("damage" | "healing")[] = [];
  if (s.coeff.damage !== undefined) types.push("damage");
  if (s.coeff.healing !== undefined) types.push("healing");
  return types;
};

const getRawCoeff = (s: spell, type: "damage" | "healing"): number | null => {
  if (s.coeff === undefined) return null;
  if (typeof s.coeff === "number") return s.coeff;
  return s.coeff[type] ?? null;
};

const resolveValue = (
  s: spell,
  type: "damage" | "healing",
  player: Player
): { baseSpCoeff: number | null; spCoeff: number | null; absolute: number | null } => {
  if (s.coeff !== undefined) {
    const absolute = type === "damage"
      ? calculateSpellDamage(s, player)
      : calculateSpellHealing(s, player);
    const rawCoeff = getRawCoeff(s, type);
    return {
      baseSpCoeff: rawCoeff !== null ? rawCoeff * 100 : null,
      spCoeff: (absolute / player.stats.intellect) * 100,
      absolute,
    };
  }
  const raw = type === "damage" ? s.value?.damage : s.value?.healing;
  return { baseSpCoeff: null, spCoeff: null, absolute: raw ?? null };
};

const hasValue = (s: spell) =>
  s.coeff !== undefined || s.value?.damage !== undefined || s.value?.healing !== undefined;

const expandRows = (s: spell, player: Player): SpellRow[] =>
  coeffTypes(s).map(type => ({ spell: s, type, ...resolveValue(s, type, player) }));

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
  }, [spec, stats.intellect, talents]);

  return (
    <Container sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
      <PageHeader title={title} subtitle={description} marginBottom={0} />

      <Card variant="outlined" sx={{ width: "100%", maxWidth: 1000, p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        <WarningChip message="Work in Progress. Some data might be incorrect." showIcon color="warning"/>
        <SpecializationSelect selectedSpec={spec} onSpecChange={handleSpecChange} />
        <Group>
          <StatsCard options={stats} onOptionsChange={setStats} />
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
      </Card>

      <Card variant="outlined" sx={{ width: "100%", maxWidth: 1000 }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={headerSx}><T>Spell</T></TableCell>
                <TableCell sx={headerSx}><T>Type</T></TableCell>
                <TableCell align="right" sx={headerSx}><T>Base SP%</T></TableCell>
                <TableCell align="right" sx={headerSx}><T>Effective SP%</T></TableCell>
                <TableCell align="right" sx={headerSx}>
                  <T>Value at {stats.intellect.toLocaleString()} Int</T>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(({ spell, type, baseSpCoeff, spCoeff, absolute }) => (
                <TableRow key={`${spell.id}-${type}`} hover sx={{ "&:last-child td": { border: 0 } }}>
                  <TableCell sx={{ ...cellSx, display: "flex", alignItems: "center", gap: 1 }}>
                    <SpellButton selectedSpell={spell} size={32} />
                    <Typography variant="body2" fontWeight="bold">
                      <T>
                        {spell.name}
                      </T>
                    </Typography>
                  </TableCell>
                  <TableCell sx={cellSx}>
                    <Typography
                      variant="caption"
                      sx={{ color: type === "damage" ? "#f87171" : "#4ade80" }}
                    >
                      <T>
                        {type === "damage" ? "Damage" : "Healing"}
                      </T>
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={cellSx}>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      {baseSpCoeff !== null ? `${baseSpCoeff.toFixed(2)}%` : "—"}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={cellSx}>
                    <Typography variant="body2">
                      {spCoeff !== null ? `${spCoeff.toFixed(2)}%` : "—"}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={cellSx}>
                    <Typography variant="body2" fontWeight="bold">
                      {absolute!.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Container>
  );
};

export default SpellReference;
