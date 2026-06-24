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

const targets = [
    { key: 'enemyCount' as const, label: 'Enemies' },
    { key: 'allyCount' as const, label: 'Allies' },
];

const inputSx = { width: "100%", maxWidth: 110, '& .MuiInputBase-input': { textAlign: 'right', fontSize: '0.9rem', fontFamily: 'monospace' } };

const TargetCountsCard: React.FC<TargetCountsCardProps> = ({ options, onOptionsChange }) => {
    const handleChange = (field: string, value: number) => {
        onOptionsChange((prev: any) => ({ ...prev, [field]: value }));
    };

    return (
        <div style={{ display: "grid", gridTemplateColumns: "max-content 1px auto", gap: "4px 10px", alignItems: "center" }}>
            {targets.map(({ key, label }) => (
                <React.Fragment key={key}>
                    <span style={rowLabel}>{T(label)}</span>
                    {rowSep}
                    <TextField
                        type="text"
                        size="small"
                        variant="standard"
                        value={options[key]}
                        onChange={(e) => handleChange(key, Math.max(1, Number(e.target.value)))}
                        slotProps={{ htmlInput: { min: 1, inputMode: 'numeric' } }}
                        sx={inputSx}
                    />
                </React.Fragment>
            ))}
        </div>
    );
};

export default TargetCountsCard;
