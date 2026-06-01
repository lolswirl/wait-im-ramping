import type Spell from "@data/spells/spell";

export default interface CorePassive {
    name: string;
    id: number;
    icon: string;
    effects?: CorePassiveEffect[];
}

export interface CorePassiveEffect {
    type: string;
    value?: number | string;
    pvpMultiplier?: number;
    affectedSpells?: number[];
}

const DAMAGE_EFFECT_TYPES = [
    'modifies damage done',
    'modifies periodic damage done',
];

const HEALING_EFFECT_TYPES = [
    'modifies healing done',
    'modifies periodic healing done',
];

const isMatchingEffect = (type: string, calcType: 'damage' | 'healing'): boolean => {
    const lower = type.toLowerCase();
    const typeSpecific = calcType === 'damage' ? DAMAGE_EFFECT_TYPES : HEALING_EFFECT_TYPES;
    return typeSpecific.some(t => lower.includes(t));
};

export const getSpellAura = (spell: Spell, corePassives: CorePassive | CorePassive[], calcType: 'damage' | 'healing' = 'damage'): number => {
    const passives = Array.isArray(corePassives) ? corePassives : [corePassives];
    return passives.flatMap(p => p.effects ?? [])
        .filter(e => {
            if (typeof e.value !== 'number') return false;
            if (!isMatchingEffect(e.type, calcType)) return false;
            if (!e.affectedSpells?.includes(spell.id)) return false;
            const isPeriodic = e.type.toLowerCase().includes('periodic');
            return spell.periodic ? isPeriodic : !isPeriodic;
        })
        .reduce((aura, e) => aura * (1 + (e.value as number) / 100), 1);
};
