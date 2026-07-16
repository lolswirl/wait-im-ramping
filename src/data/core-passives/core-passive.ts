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

const matchingEffects = (spell: Spell, passive: CorePassive, calcType: 'damage' | 'healing'): { effect: CorePassiveEffect; effectIndex: number }[] =>
    (passive.effects ?? [])
        .map((effect, i) => ({ effect, effectIndex: i + 1 }))
        .filter(({ effect: e }) => {
            if (typeof e.value !== 'number') return false;
            if (!isMatchingEffect(e.type, calcType)) return false;
            if (!e.affectedSpells?.includes(spell.id)) return false;
            const isPeriodic = e.type.toLowerCase().includes('periodic');
            return spell.periodic ? isPeriodic : !isPeriodic;
        });

export const getSpellAura = (spell: Spell, corePassives: CorePassive | CorePassive[], calcType: 'damage' | 'healing' = 'damage'): number => {
    const passives = Array.isArray(corePassives) ? corePassives : [corePassives];
    return passives.flatMap(p => matchingEffects(spell, p, calcType))
        .reduce((aura, { effect }) => aura * (1 + (effect.value as number) / 100), 1);
};

export const getSpellAuraSources = (spell: Spell, corePassives: CorePassive | CorePassive[], calcType: 'damage' | 'healing' = 'damage'): { name: string; effectIndex: number; multiplier: number }[] => {
    const passives = Array.isArray(corePassives) ? corePassives : [corePassives];
    return passives
        .flatMap(p => matchingEffects(spell, p, calcType).map(({ effect, effectIndex }) => ({
            name: p.name,
            effectIndex,
            multiplier: 1 + (effect.value as number) / 100,
        })))
        .filter(source => source.multiplier !== 1);
};
