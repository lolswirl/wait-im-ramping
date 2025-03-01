import React from "react";
import { Box, Typography } from "@mui/material";

interface Spell {
  name: string;
  castTime: number;
  gcd: boolean;
  icon: string;
}

interface SpellTimelineProps {
  spellList?: Spell[];
}

const SpellTimeline: React.FC<SpellTimelineProps> = ({ spellList = [] }) => {
  if (!Array.isArray(spellList)) {
    console.error("Error: spellList is not an array", spellList);
    return <Typography color="error">Error: Invalid spell list</Typography>;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Spell Timeline
      </Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        {spellList.map((spell, index) => (
          <Box key={index} sx={{ textAlign: "center" }}>
            <img
              src={`https://wow.zamimg.com/images/wow/icons/large/${spell.icon}.jpg`}
              alt={spell.name}
              width={40}
              height={40}
              style={{ borderRadius: 4 }}
            />
            <Typography variant="body2">{spell.name}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default SpellTimeline;
