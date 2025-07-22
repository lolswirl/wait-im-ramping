import React, { useEffect, useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, IconButton } from '@mui/material';
import spell, { calculateCastTime } from '../../data/spells/spell.ts';
import { applyBuffEffects } from '../../data/buffs/buffs.ts';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpward, ArrowDownward, DeleteTwoTone, DeleteForever } from '@mui/icons-material';
import { toRomanNumeral } from '../../util/toRomanNumeral.ts';
import { FormatIconImg, FormatIconLink } from '../../util/FormatIconImg.ts';
import { GetTitle } from "../../util/stringManipulation.tsx";
import { specialization } from '../../data/class/class.ts';
import SwirlButton from '../Buttons/SwirlButton.tsx';

interface SpellTableProps {
  spellList: spell[];
  setSpellList: React.Dispatch<React.SetStateAction<spell[]>>;
  removeSpellFromTable: (index: number) => void;
  selectedSpec: specialization;
  haste: number;
  onTotalCastTimeChange: (totalTime: number) => void;
  clearTable: () => void;
}

const SpellIcon: React.FC<{ spell: spell }> = ({ spell }) => (
  <Box sx={{ position: "relative", display: "flex", alignItems: "center", height: 32, width: 32 }}>
    <img
      src={FormatIconImg(spell.icon)}
      alt={spell.name}
      width={32}
      height={32}
      style={{ borderRadius: 4, border: "1px solid #575757", display: "block" }}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = FormatIconLink(spell.icon);
      }}
    />
    {spell.empowerLevel && (
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          right: 0,
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          color: "white",
          fontSize: "0.75rem",
          fontWeight: "bold",
          px: "4px",
          py: "1px",
          borderRadius: "4px",
          lineHeight: 1,
        }}
      >
        {toRomanNumeral(spell.empowerLevel)}
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
    <TableContainer 
      component={Paper}
      sx={
        { 
          marginTop: 1, 
          marginBottom: 1, 
          boxShadow: 3, 
          borderRadius: 2, 
          overflow: 'hidden',
          maxWidth: 600,
          width: { xs: "90%", sm: "90%", md: "100%" },
          mx: "auto",
          boxSizing: "border-box",
      }}>
      <Table>
        <TableHead>
          <TableRow sx={{ color: "white" }}>
            <TableCell><b>{GetTitle("Selected Spells")}</b></TableCell>
            <TableCell align="center"><b>{GetTitle("Cast Time (s)")}</b></TableCell>
            <TableCell align="center"><b>{GetTitle("Actions")}</b></TableCell>
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
                    <span>{GetTitle(spell.name)}</span>
                  </Box>
                </TableCell>

                <TableCell align="center">
                  {calculateCastTime(spell, haste).toFixed(2)}
                </TableCell>

                <TableCell align="center">
                  <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                    <IconButton onClick={() => moveSpell(index, 'up')} size="small" disabled={index === 0}>
                      <ArrowUpward />
                    </IconButton>
                    <IconButton onClick={() => moveSpell(index, 'down')} size="small" disabled={index === adjustedSpells.length - 1}>
                      <ArrowDownward color={index === adjustedSpells.length - 1 ? "disabled" : "inherit"} />
                    </IconButton>
                    <IconButton onClick={() => removeSpellFromTable(index)} sx={{ color: "inherit" }}>
                      <DeleteTwoTone sx={{ fill: "#d32f2f !important" }} />
                    </IconButton>
                  </Box>
                </TableCell>
              </motion.tr>
            ))}
          </AnimatePresence>

          <TableRow sx={{ backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5' }}>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}><b>{GetTitle("Total Cast Time:")}</b></TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
              <b>{timelineData.length > 0 ? timelineData[timelineData.length - 1].end.toFixed(2) : "0"}s</b>
            </TableCell>
            <TableCell>
              <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                <SwirlButton
                  color="error"
                  textColor="error"
                  onClick={clearTable}
                  startIcon={<DeleteForever />}
                >
                  {GetTitle("Clear All")}
                </SwirlButton>
              </Box>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SpellTable;
