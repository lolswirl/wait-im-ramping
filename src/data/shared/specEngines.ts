import type spell from "@data/spells/spell";
import type { Player, SpellModifier } from "@data/shared/engine";

export interface SpecEngine {
    calculateSpellDamage: (spell: spell, player: Player) => number;
    calculateSpellHealing: (spell: spell, player: Player) => number;
    resolveSpellValue?: (spell: spell, player: Player) => number | null;
    getSpellModifiers?: (spell: spell, player: Player, type: 'damage' | 'healing') => SpellModifier[];
}

const registry = new Map<string, SpecEngine>();

export const registerSpecEngine = (specKey: string, engine: SpecEngine): void => {
    registry.set(specKey, engine);
};

export const getSpecEngine = (specKey: string): SpecEngine | undefined => {
    return registry.get(specKey);
};
