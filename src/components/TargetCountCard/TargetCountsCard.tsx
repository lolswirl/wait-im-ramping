import React from 'react';
import { TextField } from '@mui/material';
import { T } from '@util/T';
import { rowLabel, rowSep } from '@components/StatsCard/StatsCard';

interface TargetCountsCardProps {
    options: {
        enemyCount: number;
        allyCount: number;
    };
    onOptionsChange: (newOptions: any) => void;
}

const fieldStyles = {
    '& .MuiOutlinedInput-root': {
        '& fieldset': { borderColor: 'rgba(255, 152, 0, 0.3)' },
        '&:hover fieldset': { borderColor: 'rgba(255, 152, 0, 0.5)' },
        '&.Mui-focused fieldset': { borderColor: 'rgba(255, 152, 0, 0.8)' },
    },
};

const targets = [
    { key: 'enemyCount' as const, label: 'Enemies' },
    { key: 'allyCount' as const, label: 'Allies' },
];

const TargetCountsCard: React.FC<TargetCountsCardProps> = ({ options, onOptionsChange }) => {
    const handleChange = (field: string, value: number) => {
        onOptionsChange((prev: any) => ({ ...prev, [field]: value }));
    };

    return (
        <React.Fragment>
            <span style={rowLabel}>Targets</span>
            {rowSep}
            <div style={{ display: "flex", gap: 8, paddingTop: 10, paddingBottom: 10 }}>
                {targets.map(({ key, label }) => (
                    <TextField
                        key={key}
                        label={(label)}
                        type="number"
                        size="small"
                        value={options[key]}
                        onChange={(e) => handleChange(key, Math.max(1, Number(e.target.value)))}
                        slotProps={{ htmlInput: { min: 1 } }}
                        sx={{ ...fieldStyles, width: 90 }}
                    />
                ))}
            </div>
        </React.Fragment>
    );
};

export default TargetCountsCard;
