import React, { useState } from 'react';
import { Card, Grid, TextField, Tooltip } from '@mui/material';
import { GetTitle } from '../../../util/stringManipulation.tsx';

interface StatsCardProps {
    options: {
        intellect: number;
        totalHp: number;
        crit: number;
        versatility: number;
        mastery: number;
        haste: number;
    };
    onOptionsChange: (newOptions: any) => void;
}

interface StatField {
    key: keyof StatsCardProps['options'];
    label: string;
    min?: number;
    tooltip?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ options, onOptionsChange }) => {
    const [localValues, setLocalValues] = useState<{ [key: string]: string }>({});

    const handleChange = (field: string, value: number) => {
        onOptionsChange(prev => ({ ...prev, [field]: value }));
    };

    const formatNumber = (num: number): string => {
        return num.toLocaleString();
    };

    const parseNumber = (str: string): number => {
        return Number(str.replace(/,/g, ''));
    };

    const statFields: StatField[] = [
        { key: 'intellect', label: 'Intellect', min: 1 },
        { key: 'totalHp', label: 'Total HP', min: 1 },
        { 
            key: 'crit', 
            label: 'Critical Strike %', 
            min: 0,
            tooltip: "We're using the law of large numbers to assume that, out of a large number of casts, you will critically strike as often as your crit percentage."
        },
        { key: 'versatility', label: 'Versatility %', min: 0 },
        { key: 'mastery', label: 'Mastery %', min: 55.4 },
        { key: 'haste', label: 'Haste %', min: 0 },
    ];

    const fieldStyles = {
        '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'rgba(54, 162, 235, 0.3)' },
            '&:hover fieldset': { borderColor: 'rgba(54, 162, 235, 0.5)' },
            '&.Mui-focused fieldset': { borderColor: 'rgba(54, 162, 235, 0.8)' },
        },
    };

    return (
        <Card variant="outlined" sx={{ 
            p: 2, 
            background: 'linear-gradient(135deg, rgba(54, 162, 235, 0.1), rgba(54, 162, 235, 0.05))', 
            borderColor: 'rgba(54, 162, 235, 0.3)' 
        }}>
            <Grid container spacing={2}>
                {statFields.map((field) => (
                    <Grid item xs={6} key={field.key}>
                        {field.tooltip ? (
                            <Tooltip title={GetTitle(field.tooltip)} arrow>
                                <TextField
                                    label={GetTitle(field.label)}
                                    type="text"
                                    size="small"
                                    fullWidth
                                    value={localValues[field.key] !== undefined ? localValues[field.key] : formatNumber(options[field.key])}
                                    onChange={(e) => {
                                        const inputValue = e.target.value;
                                        setLocalValues(prev => ({ ...prev, [field.key]: inputValue }));
                                        
                                        const rawValue = parseNumber(inputValue);
                                        if (!isNaN(rawValue)) {
                                            handleChange(field.key, rawValue);
                                        }
                                    }}
                                    onBlur={() => {
                                        const currentValue = options[field.key];
                                        const minValue = field.min || 0;
                                        if (currentValue < minValue) {
                                            handleChange(field.key, minValue);
                                        }
                                        setLocalValues(prev => {
                                            const newState = { ...prev };
                                            delete newState[field.key];
                                            return newState;
                                        });
                                    }}
                                    inputProps={{ 
                                        min: field.min,
                                        inputMode: 'numeric',
                                        pattern: '[0-9,]*'
                                    }}
                                    sx={fieldStyles}
                                />
                            </Tooltip>
                        ) : (
                            <TextField
                                label={GetTitle(field.label)}
                                type="text"
                                size="small"
                                fullWidth
                                value={localValues[field.key] !== undefined ? localValues[field.key] : formatNumber(options[field.key])}
                                onChange={(e) => {
                                    const inputValue = e.target.value;
                                    setLocalValues(prev => ({ ...prev, [field.key]: inputValue }));
                                    
                                    const rawValue = parseNumber(inputValue);
                                    if (!isNaN(rawValue)) {
                                        handleChange(field.key, rawValue);
                                    }
                                }}
                                onBlur={() => {
                                    const currentValue = options[field.key];
                                    const minValue = field.min || 0;
                                    if (currentValue < minValue) {
                                        handleChange(field.key, minValue);
                                    }
                                    setLocalValues(prev => {
                                        const newState = { ...prev };
                                        delete newState[field.key];
                                        return newState;
                                    });
                                }}
                                inputProps={{ 
                                    min: field.min,
                                    inputMode: 'numeric',
                                    pattern: '[0-9,]*'
                                }}
                                sx={fieldStyles}
                            />
                        )}
                    </Grid>
                ))}
            </Grid>
        </Card>
    );
};

export default StatsCard;