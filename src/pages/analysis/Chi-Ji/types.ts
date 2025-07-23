import spell from "../../../data/spells/spell";

export interface AllyState {
    id: number;
    buffs: {
        envelopingMist: {
            remaining: number;
            amp: number;
        };
        renewingMist: {
            remaining: number;
            amp: number;
        };
        envelopingBreath: {
            remaining: number;
            amp: number;
        };
    };
}

export interface RotationResult {
    id: string;
    name: string;
    hps: number;
    totalHealing: number;
    duration: number;
    spells: spell[];
    breakdown: Array<{
        spellName: string;
        healing: number;
        percentage: number;
        sources: {
            baseHealing?: number;
            chiJiGusts?: number;
            ancientTeachings?: number;
            awakenedJadefire?: number;
            gustOfMists?: number;
            chiCocoons?: number;
            envelopingBreath?: number;
            rapidDiffusion?: number;
        };
    }>;
}

export function isTalentEnabled(
  options: SimulationOptions,
  talent: spell
): boolean {
  return (
    options.specTalents.get(talent) === true ||
    options.classTalents.get(talent) === true
  );
}

export interface SimulationOptions {
    intellect: number;
    totalHp: number;
    crit: number;
    versatility: number;
    mastery: number;
    haste: number;
    enemyCount: number;
    allyCount: number;
    specTalents: Map<spell, boolean>;
    classTalents: Map<spell, boolean>;
}