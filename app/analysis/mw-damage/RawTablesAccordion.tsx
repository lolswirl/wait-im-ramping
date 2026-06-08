"use client";
import React from "react";
import { Box, Card, Typography, Tab, Tabs, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import SpellButton from "@components/SpellButtons/SpellButton";
import { formatNumber, formatPercent } from "@util/stringManipulation";
import { type Player } from "@data/specs/monk/mistweaver/helpers";
import { type RotationConfig } from "./types";

type Props = {
  rotationConfigs: RotationConfig[];
  simulationParams: Player;
  showAsHealing: boolean;
  activeTab: number;
  onTabChange: (v: number) => void;
};

const RawTablesAccordion: React.FC<Props> = ({ rotationConfigs, simulationParams, showAsHealing, activeTab, onTabChange }) => {
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
            {rotationConfigs.map(config => (
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
            const rotationValues = rotationConfigs.map(config => {
              const result = config.simulateFn(500, targets, asHealing, simulationParams);
              return result.points.length > 0 ? result.points[result.points.length - 1].damage / 500 : 0;
            });
            return (
              <TableRow key={targets} hover>
                <TableCell align="center" sx={{ border: 0, py: 1, px: 1 }}>
                  <Typography variant="body2" fontWeight="bold">{targets}</Typography>
                </TableCell>
                {rotationValues.map((value, idx) => (
                  <TableCell key={rotationConfigs[idx].dataKey} align="center" sx={{ border: 0, py: 1, px: 1 }}>
                    <Typography variant="body2" sx={{ color: rotationConfigs[idx].color, fontWeight: 'bold' }}>{formatNumber(value, 2)}</Typography>
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
            {rotationConfigs.map((config1, i) =>
              rotationConfigs.slice(i + 1).map(config2 => (
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
            const rotationValues = rotationConfigs.map(config => {
              const result = config.simulateFn(500, targets, asHealing, simulationParams);
              return result.points.length > 0 ? result.points[result.points.length - 1].damage / 500 : 0;
            });
            return (
              <TableRow key={targets} hover>
                <TableCell align="center" sx={{ border: 0, py: 1, px: 1 }}>
                  <Typography variant="body2">{targets}</Typography>
                </TableCell>
                {rotationConfigs.map((config1, i) =>
                  rotationConfigs.slice(i + 1).map((config2, j) => {
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

  return (
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
        <Tabs value={activeTab} onChange={(_, v) => onTabChange(v)} sx={{ borderBottom: 1, borderColor: 'divider' }} variant="fullWidth">
          <Tab label={"DPS"} />
          <Tab label={"HPS"} />
        </Tabs>
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {renderValuesTable(showAsHealing ? 'HPS' : 'DPS', showAsHealing)}
          {renderComparisonTable(showAsHealing ? 'HPS' : 'DPS', showAsHealing)}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default RawTablesAccordion;
