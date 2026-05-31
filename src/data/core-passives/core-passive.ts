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

export const getSpellAura = (spell: Spell, corePassives: CorePassive | CorePassive[]): number => {
    const passives = Array.isArray(corePassives) ? corePassives : [corePassives];
    return passives.flatMap(p => p.effects ?? [])
        .filter(e => {
            if (typeof e.value !== 'number') return false;
            if (!e.affectedSpells?.includes(spell.id)) return false;
            const isPeriodic = e.type.toLowerCase().includes('periodic');
            return spell.periodic ? isPeriodic : !isPeriodic;
        })
        .reduce((aura, e) => aura * (1 + (e.value as number) / 100), 1);
};
