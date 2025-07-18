import React from 'react';
import { Card, Grid, Box, Checkbox, Typography } from '@mui/material';
import SpellButton from '../../../components/SpellButtons/SpellButton.tsx';
import spell from '../../../data/spells/spell.ts';
import { GetTitle, hexToRgb } from '../../../util/stringManipulation.tsx';

export interface TalentItem {
  key: string;
  talent: spell;
}

interface TalentsCardProps {
  options: Map<spell, boolean>;
  color: string;
  onChange: (key: spell, checked: boolean) => void;
}

const TalentsCard: React.FC<TalentsCardProps> = ({ options, color, onChange }) => {

    const rgb = hexToRgb(color);

    const TalentOption: React.FC<{ talent: spell }> = ({ talent }) => {
        const isChecked = !!options.get(talent);

        return (
            <Grid item xs={6}>
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

    return (
        <Card variant="outlined" sx={{ 
            p: 2, 
            background: `linear-gradient(135deg, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1), rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.05))`, 
            borderColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`
        }}>
            <Grid container spacing={1}>
                {Array.from(options.entries()).map(([talent, isChecked]) => (
                    <TalentOption key={talent.name} talent={talent} />
                ))}
            </Grid>
        </Card>
    );
};

export default TalentsCard;