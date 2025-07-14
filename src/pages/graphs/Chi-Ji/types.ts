import spell from "../../../data/spells/spell.ts";

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

export interface SimulationOptions {
    intellect: number;
    totalHp: number;
    crit: number;
    versatility: number;
    mastery: number;
    haste: number;
    enemyCount: number;
    allyCount: number;
    celestialHarmony: boolean;
    jadeBond: boolean;
    mistWrap: boolean;
    chiHarmony: boolean;
    craneStyle: boolean;
    jadefireTeachings: boolean;
    awakenedJadefire: boolean;
}