import React, { useEffect, useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, IconButton } from '@mui/material';
import { spell } from '../../data/spell.ts';
import { applyBuffEffects } from '../../data/buffs.ts';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import DeleteIcon from "@mui/icons-material/Delete";
import { toRoman } from '../../util/toRoman.ts';

interface SpellTableProps {
  spellList: spell[];
  setSpellList: React.Dispatch<React.SetStateAction<spell[]>>;
  removeSpellFromTable: (index: number) => void;
  selectedSpec: string;
  haste: number;
  onTotalCastTimeChange: (totalTime: number) => void;
  clearTable: () => void;
}

const calculateCastTime = (spell: spell, haste: number): number => {
  const baseCastTime = spell.castTime === 0 ? (spell.gcd === false ? 0 : 1.5) : spell.castTime;
  const castTimeWithHaste = baseCastTime / (1 + haste / 100);
  return spell.empowerLevel ? castTimeWithHaste * (spell.empowerLevel / 5) : castTimeWithHaste;
};

const SpellIcon: React.FC<{ spell: spell }> = ({ spell }) => (
  <Box position="relative" display="inline-block">
    <img
      src={`https://wow.zamimg.com/images/wow/icons/large/${spell.icon}.jpg`}
      alt={spell.name}
      width={32}
      height={32}
      style={{ borderRadius: 4, border: "1px solid #575757" }}
    />
    {spell.empowerLevel && (
      <Box
        style={{
          position: "absolute",
          bottom: -2,
          right: -2,
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          color: "white",
          fontSize: "0.75rem",
          fontWeight: "bold",
          padding: "2px 4px",
          borderRadius: "4px",
        }}
      >
        {toRoman(spell.empowerLevel)}
      </Box>
    )}
  </Box>
);

const SpellTable: React.FC<SpellTableProps> = ({ spellList, setSpellList, removeSpellFromTable, selectedSpec, haste, onTotalCastTimeChange, clearTable }) => {
  const [adjustedSpells, setAdjustedSpells] = useState<spell[]>([]);
  const [timelineData, setTimelineData] = useState<{ name: string; start: number; end: number }[]>([]);

  useEffect(() => {
    const fetchBuffedSpells = async () => {
      const updatedSpells = await applyBuffEffects(selectedSpec, spellList);
      setAdjustedSpells(updatedSpells);
    };
    fetchBuffedSpells();
  }, [selectedSpec, spellList]);

  useEffect(() => {
    let currentTime = 0;
    const newTimeline = adjustedSpells.map(spell => {
      const castTime = calculateCastTime(spell, haste);
      const event = { name: spell.name, start: currentTime, end: currentTime + castTime };
      currentTime += castTime;
      return event;
    });

    setTimelineData(newTimeline);
    onTotalCastTimeChange(newTimeline.length > 0 ? newTimeline[newTimeline.length - 1].end : 0);
  }, [adjustedSpells, haste, onTotalCastTimeChange]);

  // Move spell up/down
  const moveSpell = (index: number, direction: 'up' | 'down') => {
    setSpellList((prevList) => {
      const newList = [...prevList];
      if (direction === 'up' && index > 0) [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
      if (direction === 'down' && index < newList.length - 1) [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
      return newList;
    });
  };

  if (spellList.length === 0) return null;

  return (
    <TableContainer component={Paper} sx={{ marginTop: 1, marginBottom: 1, boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
      <Table>
        <TableHead>
          <TableRow sx={{ color: "white" }}>
            <TableCell><b>Selected Spells</b></TableCell>
            <TableCell align="center"><b>Cast Time (s)</b></TableCell>
            <TableCell align="center"><b>Actions</b></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          <AnimatePresence>
            {adjustedSpells.map((spell, index) => (
              <motion.tr
                key={spell.uuid}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <SpellIcon spell={spell} />
                    <span>{spell.name}</span>
                  </Box>
                </TableCell>

                <TableCell align="center">
                  {calculateCastTime(spell, haste).toFixed(2)}
                </TableCell>

                <TableCell align="center">
                  <Box display="flex" gap={1}>
                    <IconButton onClick={() => moveSpell(index, 'up')} size="small" disabled={index === 0}>
                      <ArrowUpward />
                    </IconButton>
                    <IconButton onClick={() => moveSpell(index, 'down')} size="small" disabled={index === adjustedSpells.length - 1}>
                      <ArrowDownward color={index === adjustedSpells.length - 1 ? "disabled" : "inherit"} />
                    </IconButton>
                    <IconButton onClick={() => removeSpellFromTable(index)} sx={{ color: "inherit" }}>
                      <DeleteIcon sx={{ fill: "#d32f2f !important" }} />
                    </IconButton>
                  </Box>
                </TableCell>
              </motion.tr>
            ))}
          </AnimatePresence>

          <TableRow>
            <TableCell><b>Total Cast Time:</b></TableCell>
            <TableCell align="center">
              <b>{timelineData.length > 0 ? timelineData[timelineData.length - 1].end.toFixed(2) : "0"}s</b>
            </TableCell>
            <TableCell>
              <Button 
                variant="contained" 
                color="error" 
                onClick={clearTable}
              >
                Clear Spells
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SpellTable;
