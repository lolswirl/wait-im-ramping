"use client";
import React from 'react';
import { FieldCells, type FieldDef } from '@components/FieldCells/FieldCells';
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

export const rowLabel: React.CSSProperties = { fontSize: "0.7rem", fontWeight: 600, opacity: 0.45, textAlign: "right", whiteSpace: "nowrap" };
export const rowSep = <div style={{ width: 1, alignSelf: "stretch", background: "rgba(255,255,255,0.12)" }} />;

export const Group: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div style={{ display: "grid", gridTemplateColumns: "max-content 1px auto", gap: "8px 10px", alignItems: "start" }}>
        {children}
    </div>
);

const baseFields: FieldDef[] = [
    { key: 'intellect', label: 'intellect', min: 1 },
    { key: 'totalHp', label: 'total hp', min: 1 },
];

const secondaryFields: FieldDef[] = [
    { key: 'haste', label: 'haste', min: 0, adornment: "%" },
    { key: 'crit', label: 'crit', min: 0, adornment: "%", tooltip: "We're using the law of large numbers to assume that, out of a large number of casts, you will critically strike as often as your crit percentage." },
    { key: 'versatility', label: 'vers', min: 0, adornment: "%" },
    { key: 'mastery', label: 'mastery', min: 55.4, adornment: "%" },
];

const StatsCard: React.FC<StatsCardProps> = ({ options, onOptionsChange, label, fields }) => {
    const visibleFields = [...baseFields, ...secondaryFields]
        .filter(field => !fields || fields.includes(field.key as keyof StatsCardOptions));

    return (
        <FieldCells
            fields={visibleFields}
            options={options}
            onOptionsChange={onOptionsChange}
            label={label}
        />
    );
};

export default StatsCard;
