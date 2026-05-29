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

export const getSpellAura = (spellId: number, corePassive: CorePassive): number => {
    if (!corePassive.effects) return 1;
    return corePassive.effects
        .filter(e => typeof e.value === 'number' && e.affectedSpells?.includes(spellId))
        .reduce((aura, e) => aura * (1 + (e.value as number) / 100), 1);
};
