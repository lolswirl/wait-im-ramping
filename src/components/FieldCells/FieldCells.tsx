"use client";
import React, { useState } from 'react';
import { Box, TextField, InputAdornment, Typography } from '@mui/material';
import { GlassTooltip } from '@components/Glass';

export interface FieldDef {
    key: string;
    label: string;
    min?: number;
    tooltip?: string;
    adornment?: string;
}

interface FieldCellsProps {
    fields: FieldDef[];
    options: object;
    onOptionsChange: (newOptions: any) => void;
    label?: string;
}

const inputSx = { width: 92, '& .MuiInputBase-input': { fontSize: '0.85rem', fontFamily: 'monospace', py: 0 } };

export const FieldCells: React.FC<FieldCellsProps> = ({ fields, options, onOptionsChange, label }) => {
    const values = options as Record<string, number | undefined>;
    const [localValues, setLocalValues] = useState<{ [key: string]: string }>({});

    const handleChange = (field: string, value: number) => {
        onOptionsChange((prev: any) => ({ ...prev, [field]: value }));
    };

    const formatNumber = (num: number): string => num.toLocaleString();
    const parseNumber = (str: string): number => Number(str.replace(/,/g, ''));

    const makeInput = (field: FieldDef) => (
        <TextField
            type="text"
            size="small"
            variant="standard"
            value={localValues[field.key] !== undefined ? localValues[field.key] : formatNumber(values[field.key] ?? 0)}
            onChange={(e) => {
                setLocalValues(prev => ({ ...prev, [field.key]: e.target.value }));
                const raw = parseNumber(e.target.value);
                if (!isNaN(raw)) handleChange(field.key, raw);
            }}
            onBlur={() => {
                const cur = values[field.key] ?? 0;
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

    const renderCell = (field: FieldDef) => {
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
                <span style={{ fontSize: "0.7rem", fontWeight: 600, opacity: 0.45, letterSpacing: 1, whiteSpace: "nowrap" }}>{label}</span>
            )}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {fields.map(renderCell)}
            </div>
        </div>
    );
};

export default FieldCells;
