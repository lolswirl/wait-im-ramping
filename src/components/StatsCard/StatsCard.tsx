"use client";
import React, { useState } from 'react';
import { TextField, InputAdornment, Typography } from '@mui/material';
import { GlassTooltip } from '@components/Glass';
import { type Stats } from '@data/shared/stats';

export interface StatsCardOptions extends Stats {
    totalHp?: number;
}

interface StatsCardProps {
    options: StatsCardOptions;
    onOptionsChange: (newOptions: any) => void;
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

const inputSx = { width: "100%", maxWidth: 110, '& .MuiInputBase-input': { textAlign: 'right', fontSize: '0.9rem', fontFamily: 'monospace' } };

const StatsCard: React.FC<StatsCardProps> = ({ options, onOptionsChange }) => {
    const [localValues, setLocalValues] = useState<{ [key: string]: string }>({});

    const handleChange = (field: string, value: number) => {
        onOptionsChange((prev: any) => ({ ...prev, [field]: value }));
    };

    const formatNumber = (num: number): string => num.toLocaleString();
    const parseNumber = (str: string): number => Number(str.replace(/,/g, ''));

    const makeInput = (field: StatField) => (
        <TextField
            key={field.key}
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
                input: field.adornment ? {
                    endAdornment: (
                        <InputAdornment position="end">
                            <Typography variant="caption" color="text.disabled">{field.adornment}</Typography>
                        </InputAdornment>
                    ),
                } : undefined,
            }}
            sx={inputSx}
        />
    );

    const renderRow = (field: StatField) => {
        const input = makeInput(field);
        const inputCell = field.tooltip
            ? <GlassTooltip key={field.key} title={field.tooltip}>{input}</GlassTooltip>
            : <React.Fragment key={field.key}>{input}</React.Fragment>;
        return (
            <React.Fragment key={field.key}>
                <span style={{ ...rowLabel, paddingTop: 4 }}>{field.label}</span>
                {rowSep}
                {inputCell}
            </React.Fragment>
        );
    };

    return (
        <div style={{ display: "grid", gridTemplateColumns: "max-content 1px auto", gap: "4px 10px", alignItems: "start" }}>
            {baseFields.map(renderRow)}
            <div style={{ gridColumn: "1 / -1", height: 1, background: "rgba(255,255,255,0.12)", margin: "4px 0" }} />
            {secondaryFields.map(renderRow)}
        </div>
    );
};

export default StatsCard;
