import React from 'react';
import spell from '@data/spells/spell';
import { HeroTree } from '@data/heroTalents';
import { rowLabel, rowSep, Group } from '@components/StatsCard/StatsCard';
import { TalentOption } from './TalentsCard';
import { T } from '@util/T';

interface HeroTalentsCardProps {
    options: Map<spell, boolean>;
    label?: string;
    onChange: (key: spell, checked: boolean) => void;
}

const HeroTalentsCard: React.FC<HeroTalentsCardProps> = ({ options, label, onChange }) => {
    const entries = Array.from(options.entries());

    const trees = new Map<HeroTree, [spell, boolean][]>();
    for (const [spell, checked] of entries) {
        if (!spell.heroTalent) continue;
        if (!trees.has(spell.heroTalent)) trees.set(spell.heroTalent, []);
        trees.get(spell.heroTalent)!.push([spell, checked]);
    }

    const handleChange = (talent: spell, checked: boolean) => {
        if (checked && talent.heroTalent) {
            for (const [other, isChecked] of options.entries()) {
                if (isChecked && other.heroTalent && other.heroTalent !== talent.heroTalent) {
                    onChange(other, false);
                }
            }
        }
        onChange(talent, checked);
    };

    const treeRows = Array.from(trees.entries()).flatMap(([info, spells]) => [
        <span key={`${info.name}-label`} style={{ ...rowLabel, paddingTop: 6, color: info.color }}><T>{info.shortName}</T></span>,
        <React.Fragment key={`${info.name}-sep`}>{rowSep}</React.Fragment>,
        <div key={`${info.name}-spells`} style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {spells.map(([spell, isChecked]) => (
                <TalentOption
                    key={spell.id}
                    talent={spell}
                    isChecked={isChecked}
                    onChange={handleChange}
                    color={info.color}
                />
            ))}
        </div>,
    ]);

    return (
        <React.Fragment>
            <span style={{ ...rowLabel, paddingTop: 6 }}><T>{label ?? 'Hero'}</T></span>
            {rowSep}
            <Group>
                {treeRows}
            </Group>
        </React.Fragment>
    );
};

export default HeroTalentsCard;
