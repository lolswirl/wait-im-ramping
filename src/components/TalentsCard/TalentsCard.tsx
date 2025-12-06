import React from 'react';
import { Card, Grid, Box, Checkbox, Typography } from '@mui/material';
import SpellButton from '@components/SpellButtons/SpellButton';
import spell from '@data/spells/spell';
import { GetTitle, hexToRgb } from '@util/stringManipulation';

export interface TalentItem {
  key: string;
  talent: spell;
}

interface TalentsCardProps {
  options: Map<spell, boolean>;
  color: string;
  onChange: (key: spell, checked: boolean) => void;
  xs?: number;
}

export interface TalentOptionProps {
  talent: spell;
  isChecked: boolean;
  onChange: (talent: spell, checked: boolean) => void;
  rgb: { r: number; g: number; b: number };
  xs?: number;
}

export const TalentOption: React.FC<TalentOptionProps> = ({ 
  talent, 
  isChecked, 
  onChange, 
  rgb, 
  xs = 6 
}) => {
    return (
        <Grid size={{ xs: xs }}>
            <Box 
                sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    p: 1, 
                    borderRadius: 1,
                    border: `1px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`,
                    backgroundColor: isChecked ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)` : 'transparent',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    '&:hover': {
                        backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.05)`,
                        borderColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4)`,
                    }
                }}
                onClick={() => onChange(talent, !isChecked)}
            >
                <Checkbox
                    checked={isChecked}
                    onChange={(e) => onChange(talent, e.target.checked)}
                    onClick={(e) => e.stopPropagation()}
                    sx={{
                        color: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6)`,
                        '&.Mui-checked': { color: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
                        '&:hover': { backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)` },
                    }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                    <SpellButton selectedSpell={talent} action={() => {}} />
                    <Typography variant="body2" sx={{ 
                        fontWeight: 'bold',
                        color: isChecked ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : 'text.primary',
                        transition: 'color 0.2s ease'
                    }}>
                        {GetTitle(talent.name)}
                    </Typography>
                </Box>
            </Box>
        </Grid>
    );
};

const TalentsCard: React.FC<TalentsCardProps> = ({ options, color, onChange, xs }) => {
    if (!xs) xs = 6;
    const rgb = hexToRgb(color);

    return (
        <Card variant="outlined" sx={{ 
            p: 2,
            width: '100%',
            maxWidth: '700px',
            background: `linear-gradient(135deg, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1), rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.05))`, 
            borderColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`
        }}>
            <Grid container spacing={1}>
                {Array.from(options.entries()).map(([talent, isChecked]) => (
                    <TalentOption 
                        key={talent.name} 
                        talent={talent}
                        isChecked={isChecked}
                        onChange={onChange}
                        rgb={rgb}
                        xs={xs}
                    />
                ))}
            </Grid>
        </Card>
    );
};

export default TalentsCard;