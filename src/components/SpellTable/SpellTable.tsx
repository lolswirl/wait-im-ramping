"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Stack, Typography, Divider, Card } from "@mui/material";
import { ArrowUpward, ArrowDownward, DeleteTwoTone, DeleteForever } from "@mui/icons-material";

import SwirlButton from "@components/Buttons/SwirlButton";
import { GlassIconButton } from "@components/Buttons/GlassIconButton";
import SpellButton from "@components/SpellButtons/SpellButton";

import spell, { calculateEffectiveCastTime } from "@data/spells/spell";
import { applyBuffEffects } from "@data/buffs";
import { specialization } from "@data/class";

import { T } from "@util/T";
import { toRomanNumeral } from "@util/toRomanNumeral";
import WarningChip from "@components/WarningChip/WarningChip";


interface SpellTableProps {
    spellList: spell[];
    setSpellList: React.Dispatch<React.SetStateAction<spell[]>>;
    removeSpellFromTable: (index: number) => void;
    selectedSpec: specialization;
    haste: number;
    onTotalCastTimeChange: (totalTime: number) => void;
    clearTable: () => void;
}

const SpellTable: React.FC<SpellTableProps> = ({
    spellList,
    setSpellList,
    removeSpellFromTable,
    selectedSpec,
    haste,
    onTotalCastTimeChange,
    clearTable,
}) => {
    const [adjustedSpells, setAdjustedSpells] = useState<spell[]>([]);
    const [totalTime, setTotalTime] = useState(0);

    useEffect(() => {
        const fetchBuffedSpells = async () => {
            const updatedSpells = await applyBuffEffects(selectedSpec, spellList);
            setAdjustedSpells(updatedSpells);
        };
        fetchBuffedSpells();
    }, [selectedSpec, spellList]);

    useEffect(() => {
        let currentTime = 0;
        adjustedSpells.forEach((spell) => {
            const { effectiveTime } = calculateEffectiveCastTime(spell, haste);
            currentTime += effectiveTime;
        });
        setTotalTime(currentTime);
        onTotalCastTimeChange(currentTime);
    }, [adjustedSpells, haste, onTotalCastTimeChange]);

    const moveSpell = (index: number, direction: "up" | "down") => {
        setSpellList((prev) => {
            const next = [...prev];
            if (direction === "up" && index > 0)
                [next[index - 1], next[index]] = [next[index], next[index - 1]];
            if (direction === "down" && index < next.length - 1)
                [next[index], next[index + 1]] = [next[index + 1], next[index]];
            return next;
        });
    };

    if (spellList.length === 0) return null;

    return (
        <Card
            variant="outlined"
            sx={{
                maxWidth: 600,
                width: { xs: "90%", sm: "90%", md: "100%" },
                mx: "auto",
                boxSizing: "border-box",
            }}
        >
            <Stack divider={<Divider />} sx={{ pt: 1, pb: 1 }}>
                <AnimatePresence>
                    {adjustedSpells.map((spell, index) => {
                        const { effectiveTime, isGCDConstrained } = calculateEffectiveCastTime(spell, haste);

                        return (
                            <motion.div
                                key={spell.uuid}
                                layout
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Box sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    px: 2,
                                    py: 0.75,
                                    gap: 1.5,
                                }}>
                                    <Typography variant="caption" color="text.disabled" sx={{ flexShrink: 0, minWidth: 16, textAlign: 'right' }}>
                                        {index + 1}
                                    </Typography>
                                    <SpellButton selectedSpell={spell} size={32} />
                                    <Box sx={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
                                        <Typography variant="body2" noWrap>
                                            <T>{spell.name}</T> {spell.empowerLevel ? `(${toRomanNumeral(spell.empowerLevel)})` : ''}
                                        </Typography>
                                        <Typography variant="caption" color="text.disabled" sx={{ flexShrink: 0 }}>
                                            <T>
                                                {isGCDConstrained ? `GCD: ${effectiveTime.toFixed(2)}s` : `${effectiveTime.toFixed(2)}s`}
                                            </T>
                                        </Typography>
                                        <Box sx={{ flex: 1, borderBottom: '1px solid rgba(255,255,255,0.08)', alignSelf: 'center' }} />
                                    </Box>
                                    <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
                                        <GlassIconButton onClick={() => moveSpell(index, "up")} disabled={index === 0} sx={{ p: '4px' }}>
                                            <ArrowUpward sx={{ fontSize: 14 }} />
                                        </GlassIconButton>
                                        <GlassIconButton onClick={() => moveSpell(index, "down")} disabled={index === adjustedSpells.length - 1} sx={{ p: '4px' }}>
                                            <ArrowDownward sx={{ fontSize: 14 }} />
                                        </GlassIconButton>
                                        <GlassIconButton tint="danger" onClick={() => removeSpellFromTable(index)} sx={{ p: '4px' }}>
                                            <DeleteTwoTone sx={{ fontSize: 14 }} />
                                        </GlassIconButton>
                                    </Box>
                                </Box>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </Stack>

            <Divider sx={{ mx: 0 }} />

            <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 2,
                py: 1,
                backgroundColor: (theme) => theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
            }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        <T>Total</T>
                    </Typography>
                    <WarningChip message={`${totalTime.toFixed(2)}s`} />
                </Box>
                <SwirlButton
                    color="error"
                    textColor="error"
                    onClick={clearTable}
                    startIcon={<DeleteForever />}
                >
                    <T>Clear All</T>
                </SwirlButton>
            </Box>
        </Card>
    );
};

export default SpellTable;
