"use client";
import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { GlassTooltip } from '@components/Glass';
import { T } from '@util/T';

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

export const rowLabel: React.CSSProperties = { fontSize: "0.7rem", fontWeight: 600, opacity: 0.45, textAlign: "right", whiteSpace: "nowrap" };
export const rowSep = <div style={{ width: 1, alignSelf: "stretch", background: "rgba(255,255,255,0.12)" }} />;

export const StatsGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div style={{ display: "grid", gridTemplateColumns: "max-content 1px auto", gap: "8px 10px", alignItems: "start" }}>
        {children}
    </div>
);

const fieldStyles = {
    '& .MuiOutlinedInput-root': {
        '& fieldset': { borderColor: 'rgba(54, 162, 235, 0.3)' },
        '&:hover fieldset': { borderColor: 'rgba(54, 162, 235, 0.5)' },
        '&.Mui-focused fieldset': { borderColor: 'rgba(54, 162, 235, 0.8)' },
    },
};

const statFields: StatField[] = [
    { key: 'intellect', label: 'Intellect', min: 1 },
    { key: 'totalHp', label: 'Total HP', min: 1 },
    { key: 'crit', label: 'Crit %', min: 0, tooltip: "We're using the law of large numbers to assume that, out of a large number of casts, you will critically strike as often as your crit percentage." },
    { key: 'versatility', label: 'Vers %', min: 0 },
    { key: 'mastery', label: 'Mastery %', min: 55.4 },
    { key: 'haste', label: 'Haste %', min: 0 },
];

const StatsCard: React.FC<StatsCardProps> = ({ options, onOptionsChange }) => {
    const [localValues, setLocalValues] = useState<{ [key: string]: string }>({});

    const handleChange = (field: string, value: number) => {
        onOptionsChange((prev: any) => ({ ...prev, [field]: value }));
    };

    const formatNumber = (num: number): string => num.toLocaleString();
    const parseNumber = (str: string): number => Number(str.replace(/,/g, ''));

    return (
        <React.Fragment>
            <span style={rowLabel}><T>stats</T></span>
            {rowSep}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, paddingTop: 10, paddingBottom: 10 }}>
                {statFields.map((field) => {
                    const input = (
                        <TextField
                            key={field.key}
                            label={T(field.label)}
                            type="text"
                            size="small"
                            value={localValues[field.key] !== undefined ? localValues[field.key] : formatNumber(options[field.key])}
                            onChange={(e) => {
                                setLocalValues(prev => ({ ...prev, [field.key]: e.target.value }));
                                const raw = parseNumber(e.target.value);
                                if (!isNaN(raw)) handleChange(field.key, raw);
                            }}
                            onBlur={() => {
                                const cur = options[field.key];
                                const min = field.min ?? 0;
                                if (cur < min) handleChange(field.key, min);
                                setLocalValues(prev => { const s = { ...prev }; delete s[field.key]; return s; });
                            }}
                            slotProps={{ htmlInput: { min: field.min, inputMode: 'numeric', pattern: '[0-9,]*' } }}
                            sx={{ ...fieldStyles, width: 100 }}
                        />
                    );

                    return field.tooltip ? (
                        <GlassTooltip key={field.key} title={T(field.tooltip)}>{input}</GlassTooltip>
                    ) : input;
                })}
            </div>
        </React.Fragment>
    );
};

export default StatsCard;
