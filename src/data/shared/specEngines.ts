import type spell from "@data/spells/spell";
import type { Player } from "@data/shared/engine";

export interface SpecEngine {
    calculateSpellDamage: (spell: spell, player: Player) => number;
    calculateSpellHealing: (spell: spell, player: Player) => number;
    resolveSpellValue?: (spell: spell, player: Player) => number | null;
}

const registry = new Map<string, SpecEngine>();

export const registerSpecEngine = (specKey: string, engine: SpecEngine): void => {
    registry.set(specKey, engine);
};

export const getSpecEngine = (specKey: string): SpecEngine | undefined => {
    return registry.get(specKey);
};
