import React from 'react';
import { Card } from '@mui/material';
import SpellButton from '@components/SpellButtons/SpellButton';
import spell from '@data/spells/spell';
import { T } from '@util/T';

export interface TalentItem {
  key: string;
  talent: spell;
}

interface TalentsCardProps {
  options: Map<spell, boolean>;
  color: string;
  label?: string;
  card?: boolean;
  onChange: (key: spell, checked: boolean) => void;
}

export interface TalentOptionProps {
  talent: spell;
  isChecked: boolean;
  onChange: (talent: spell, checked: boolean) => void;
  color: string;
}

export const TalentOption: React.FC<TalentOptionProps> = ({ talent, isChecked, onChange, color }) => {
    return (
        <div
            onClick={() => onChange(talent, !isChecked)}
            style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                cursor: "pointer",
                padding: "4px 8px 4px 4px",
                borderRadius: 4,
                border: `1px solid ${isChecked ? color + "55" : "rgba(255,255,255,0.08)"}`,
                backgroundColor: isChecked ? color + "18" : "transparent",
                opacity: isChecked ? 1 : 0.35,
                transition: "all 0.15s",
                userSelect: "none",
                whiteSpace: "nowrap",
            }}
        >
            <SpellButton selectedSpell={talent} size={32} />
            <span style={{ fontSize: "0.72rem", fontWeight: 500 }}>
                <T>{talent.name}</T>
            </span>
        </div>
    );
};

const rowLabel: React.CSSProperties = {
    fontSize: "0.7rem",
    fontWeight: 600,
    opacity: 0.45,
    textAlign: "right",
    whiteSpace: "nowrap",
    alignSelf: "flex-start",
    paddingTop: 6,
};

const rowSep = <div style={{ width: 1, alignSelf: "stretch", background: "rgba(255,255,255,0.12)" }} />;

const TalentsCard: React.FC<TalentsCardProps> = ({ options, color, label, card, onChange }) => {
    const entries = Array.from(options.entries());

    const content = label ? (
        <div style={{ display: "grid", gridTemplateColumns: "max-content 1px auto", gap: "6px 10px", alignItems: "center" }}>
            <span style={rowLabel}><T>{label}</T></span>
            {rowSep}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {entries.map(([talent, isChecked]) => (
                    <TalentOption key={talent.name} talent={talent} isChecked={isChecked} onChange={onChange} color={color} />
                ))}
            </div>
        </div>
    ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {entries.map(([talent, isChecked]) => (
                <TalentOption key={talent.name} talent={talent} isChecked={isChecked} onChange={onChange} color={color} />
            ))}
        </div>
    );

    if (card) {
        return <Card variant="outlined" sx={{ p: 2 }}>{content}</Card>;
    }

    return content;
};

export default TalentsCard;
