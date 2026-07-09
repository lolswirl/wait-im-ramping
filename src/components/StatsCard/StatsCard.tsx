"use client";
import React, { useState } from 'react';
import { Box, TextField, InputAdornment, Typography } from '@mui/material';
import { GlassTooltip } from '@components/Glass';
import { type Stats } from '@data/shared/stats';

export interface StatsCardOptions extends Stats {
    totalHp?: number;
}

interface StatsCardProps {
    options: StatsCardOptions;
    onOptionsChange: (newOptions: any) => void;
    label?: string;
    fields?: (keyof StatsCardOptions)[];
}

interface StatField {
    key: keyof StatsCardOptions;
    label: string;
    min?: number;
    tooltip?: string;
    adornment?: string;
}

export const rowLabel: React.CSSProperties = { fontSize: "0.7rem", fontWeight: 600, opacity: 0.45, textAlign: "right", whiteSpace: "nowrap" };
export const rowSep = <div style={{ width: 1, alignSelf: "stretch", background: "rgba(255,255,255,0.12)" }} />;

export const Group: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div style={{ display: "grid", gridTemplateColumns: "max-content 1px auto", gap: "8px 10px", alignItems: "start" }}>
        {children}
    </div>
);

const baseFields: StatField[] = [
    { key: 'intellect', label: 'intellect', min: 1 },
    { key: 'totalHp', label: 'total hp', min: 1 },
];

const secondaryFields: StatField[] = [
    { key: 'haste', label: 'haste', min: 0, adornment: "%" },
    { key: 'crit', label: 'crit', min: 0, adornment: "%", tooltip: "We're using the law of large numbers to assume that, out of a large number of casts, you will critically strike as often as your crit percentage." },
    { key: 'versatility', label: 'vers', min: 0, adornment: "%" },
    { key: 'mastery', label: 'mastery', min: 55.4, adornment: "%" },
];

const inputSx = { width: 92, '& .MuiInputBase-input': { fontSize: '0.85rem', fontFamily: 'monospace', py: 0 } };

const StatsCard: React.FC<StatsCardProps> = ({ options, onOptionsChange, label, fields }) => {
    const [localValues, setLocalValues] = useState<{ [key: string]: string }>({});

    const handleChange = (field: string, value: number) => {
        onOptionsChange((prev: any) => ({ ...prev, [field]: value }));
    };

    const formatNumber = (num: number): string => num.toLocaleString();
    const parseNumber = (str: string): number => Number(str.replace(/,/g, ''));

    const makeInput = (field: StatField) => (
        <TextField
            type="text"
            size="small"
            variant="standard"
            value={localValues[field.key] !== undefined ? localValues[field.key] : formatNumber(options[field.key] ?? 0)}
            onChange={(e) => {
                setLocalValues(prev => ({ ...prev, [field.key]: e.target.value }));
                const raw = parseNumber(e.target.value);
                if (!isNaN(raw)) handleChange(field.key, raw);
            }}
            onBlur={() => {
                const cur = options[field.key] ?? 0;
                const min = field.min ?? 0;
                if (cur < min) handleChange(field.key, min);
                setLocalValues(prev => { const s = { ...prev }; delete s[field.key]; return s; });
            }}
            slotProps={{
                htmlInput: { min: field.min, inputMode: 'numeric', pattern: '[0-9,]*' },
                input: {
                    disableUnderline: true,
                    endAdornment: field.adornment ? (
                        <InputAdornment position="end">
                            <Typography variant="caption" color="text.disabled">{field.adornment}</Typography>
                        </InputAdornment>
                    ) : undefined,
                },
            }}
            sx={inputSx}
        />
    );

    const renderCell = (field: StatField) => {
        const cell = (
            <Box
                key={field.key}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.25,
                    px: 1.25,
                    py: 0.75,
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "divider",
                    "&:focus-within": { borderColor: "text.secondary" },
                }}
            >
                <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: 0.5, color: "text.disabled" }}>
                    {field.label}
                </Typography>
                {makeInput(field)}
            </Box>
        );
        return field.tooltip
            ? <GlassTooltip key={field.key} title={field.tooltip}>{cell}</GlassTooltip>
            : cell;
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {label && (
                <span style={{ ...rowLabel, textAlign: "left", letterSpacing: 1 }}>{label}</span>
            )}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[...baseFields, ...secondaryFields]
                    .filter(field => !fields || fields.includes(field.key))
                    .map(renderCell)}
            </div>
        </div>
    );
};

export default StatsCard;
