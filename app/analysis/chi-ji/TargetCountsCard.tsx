import React from 'react';
import { Card, Grid, TextField } from '@mui/material';
import { GetTitle } from '@util/stringManipulation';

interface TargetCountsCardProps {
    options: {
        enemyCount: number;
        allyCount: number;
    };
    onOptionsChange: (newOptions: any) => void;
}

interface TargetsConfig {
    key: keyof TargetCountsCardProps['options'];
    label: string;
}

const TargetCountsCard: React.FC<TargetCountsCardProps> = ({ options, onOptionsChange }) => {
    const handleChange = (field: string, value: number) => {
        onOptionsChange(prev => ({ ...prev, [field]: value }));
    };

    const targets: TargetsConfig[] = [
        { 
            key: 'enemyCount',
            label: 'Enemies',
        },
        { 
            key: 'allyCount',
            label: 'Allies',
        },
    ];

    return (
        <Card variant="outlined" sx={{ 
            p: 2, 
            background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.1), rgba(255, 152, 0, 0.05))', 
            borderColor: 'rgba(255, 152, 0, 0.3)' 
        }}>
            <Grid container spacing={2}>
                {targets.map((target) => (
                    <Grid item xs={6} key={target.key}>
                        <TextField
                            label={GetTitle(target.label)}
                            type="number"
                            size="small"
                            fullWidth
                            value={options[target.key]}
                            onChange={(e) => handleChange(target.key, Math.max(1, Number(e.target.value)))}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: 'rgba(255, 152, 0, 0.3)' },
                                '&:hover fieldset': { borderColor: 'rgba(255, 152, 0, 0.5)' },
                                '&.Mui-focused fieldset': { borderColor: 'rgba(255, 152, 0, 0.8)' },
                            },
                        }}
                    />
                    </Grid>
                ))}
            </Grid>
        </Card>
    );
};

export default TargetCountsCard;