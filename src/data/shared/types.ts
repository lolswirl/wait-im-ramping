import spell from "@data/spells/spell";

export interface SpecStats {
    intellect: number;
    mastery: number;
    spellpower: (healingValue: number) => number;
    masteryBonus?: (baseHealing: number) => number;
}

export interface Specialization extends SpecStats {
    spells: spell[];
    talents: spell[];
    rotations: rotation[];
    buffs: buff[];
    bugs: Bug[];
    icon: string;
    name: string;
    class: string;
    color: string;
}