import React from 'react';
import { Card, Grid, Box, Checkbox, Typography } from '@mui/material';
import { GetTitle } from '../../../util/stringManipulation.tsx';
import TALENTS from "../../../data/talents/monk/mistweaver.ts";
import SpellButton from '../../../components/SpellButtons/SpellButton.tsx';
import spell from '../../../data/spells/spell.ts';

interface TalentsCardProps {
    options: {
        celestialHarmony: boolean;
        jadeBond: boolean;
        mistWrap: boolean;
        chiHarmony: boolean;
        craneStyle: boolean;
        jadefireTeachings: boolean;
        awakenedJadefire: boolean;
    };
    onOptionsChange: (newOptions: any) => void;
}

interface TalentConfig {
    key: keyof TalentsCardProps['options'];
    talent: spell;
}

const TalentsCard: React.FC<TalentsCardProps> = ({ options, onOptionsChange }) => {
    const handleChange = (field: string, value: boolean) => {
        onOptionsChange(prev => ({ ...prev, [field]: value }));
    };

    const talents: TalentConfig[] = [
        { 
            key: 'celestialHarmony',
            talent: TALENTS.CELESTIAL_HARMONY
        },
        { 
            key: 'jadeBond', 
            talent: TALENTS.JADE_BOND 
        },
        {
            key: 'mistWrap',
            talent: TALENTS.MIST_WRAP
        },
        {
            key: 'chiHarmony',
            talent: TALENTS.CHI_HARMONY
        },
        { 
            key: 'craneStyle', 
            talent: TALENTS.CRANE_STYLE 
        },
        { 
            key: 'jadefireTeachings', 
            talent: TALENTS.JADEFIRE_TEACHINGS 
        },
        { 
            key: 'awakenedJadefire', 
            talent: TALENTS.AWAKENED_JADEFIRE 
        },
    ];

    const TalentOption: React.FC<{ config: TalentConfig }> = ({ config }) => {
        const { key, talent } = config;
        const isChecked = options[key];

        return (
            <Grid item xs={6}>
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    p: 1, 
                    borderRadius: 1,
                    border: '1px solid rgba(76, 175, 80, 0.2)',
                    backgroundColor: isChecked ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    '&:hover': {
                        backgroundColor: 'rgba(76, 175, 80, 0.05)',
                        borderColor: 'rgba(76, 175, 80, 0.4)',
                    }
                }}
                onClick={() => handleChange(key, !isChecked)}
                >
                    <Checkbox
                        checked={isChecked}
                        onChange={(e) => handleChange(key, e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                            color: 'rgba(76, 175, 80, 0.6)',
                            '&.Mui-checked': { color: 'rgb(76, 175, 80)' },
                            '&:hover': { backgroundColor: 'rgba(76, 175, 80, 0.1)' },
                        }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                        <SpellButton selectedSpell={talent} action={() => {}} />
                        <Typography variant="body2" sx={{ 
                            fontWeight: 'bold',
                            color: isChecked ? 'rgb(76, 175, 80)' : 'text.primary',
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
            background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.05))', 
            borderColor: 'rgba(76, 175, 80, 0.3)' 
        }}>
            <Grid container spacing={1}>
                {talents.map((config) => (
                    <TalentOption key={config.key} config={config} />
                ))}
            </Grid>
        </Card>
    );
};

export default TalentsCard;