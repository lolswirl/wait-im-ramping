import type spell from "@data/spells/spell";
import type CorePassive from "@data/core-passives/core-passive";
import { getSpellAura, getSpellAuraSources } from "@data/core-passives/core-passive";
import type { Stats } from "@data/shared/stats";

// a number is points spent; true counts as fully ranked
export type TalentMap = Map<spell, boolean | number>;

export interface Player {
    stats: Stats;
    talents: TalentMap;
    corePassives: CorePassive[];
}

export const getTalentRank = (talents: TalentMap | undefined, talent: spell): number => {
    const value = talents?.get(talent);
    if (value === true) return talent.maxRank ?? 1;
    return value || 0;
};

export const isTalentEnabled = (talents: TalentMap | undefined, talent: spell): boolean => {
    return getTalentRank(talents, talent) > 0;
};

export interface TalentRule {
    talent: spell;
    getValue: (stats: Stats, rank: number) => number;
    appliesTo: (spell: spell) => boolean;
}

const resolveCoeff = (coeff: spell['coeff'], type: 'damage' | 'healing'): number | undefined => {
    if (coeff === undefined) return undefined;
    if (typeof coeff === 'number') return coeff;
    return coeff[type];
};

export const calcSpellValue = (spell: spell, player: Player, type: 'damage' | 'healing' = 'healing'): number => {
    const coeff = resolveCoeff(spell.coeff, type);
    if (coeff === undefined) return 0;
    
    // using the law of large numbers to assume that, out of a large number of casts, you will critically strike as often as your crit percentage
    const critMultiplier = 1 + (player.stats.crit / 100);
    const versMultiplier = 1 + (player.stats.versatility / 100);

    return player.stats.intellect * coeff * getSpellAura(spell, player.corePassives, type) * critMultiplier * versMultiplier;
};

export interface SpellModifier {
    label: string;
    multiplier: number;
}

export const getSpellModifiers = (spell: spell, player: Player, type: 'damage' | 'healing', rules: TalentRule[]): SpellModifier[] => {
    const modifiers: SpellModifier[] = getSpellAuraSources(spell, player.corePassives, type)
        .map(source => ({ label: `${source.name} #${source.effectIndex}`, multiplier: source.multiplier }));

    if (player.stats.crit > 0) {
        modifiers.push({ label: "Critical Strike", multiplier: 1 + player.stats.crit / 100 });
    }
    if (player.stats.versatility > 0) {
        modifiers.push({ label: "Versatility", multiplier: 1 + player.stats.versatility / 100 });
    }

    for (const rule of rules) {
        if (!isTalentEnabled(player.talents, rule.talent)) continue;
        if (!rule.appliesTo(spell)) continue;
        modifiers.push({ label: rule.talent.name, multiplier: 1 + rule.getValue(player.stats, getTalentRank(player.talents, rule.talent)) });
    }

    return modifiers.filter(m => m.multiplier !== 1);
};

export const calculateSpellDamageMultiplier = (spell: spell, player: Player, rules: TalentRule[]): number => {
    let multiplier = 1;

    for (const rule of rules) {
        if (!isTalentEnabled(player.talents, rule.talent)) continue;
        if (rule.appliesTo(spell)) {
            multiplier *= (1 + rule.getValue(player.stats, getTalentRank(player.talents, rule.talent)));
        }
    }

    return multiplier;
};

export const calculateSpellHealingMultiplier = (spell: spell, player: Player, rules: TalentRule[]): number => {
    let multiplier = 1;

    for (const rule of rules) {
        if (!isTalentEnabled(player.talents, rule.talent)) continue;
        if (rule.appliesTo(spell)) {
            multiplier *= (1 + rule.getValue(player.stats, getTalentRank(player.talents, rule.talent)));
        }
    }

    return multiplier;
};

export const calculateSpellDamage = (spell: spell, player: Player, rules: TalentRule[]): number => {
    const base = calcSpellValue(spell, player, 'damage');
    return base * calculateSpellDamageMultiplier(spell, player, rules);
};

export const calculateSpellHealing = (spell: spell, player: Player, rules: TalentRule[]): number => {
    const base = calcSpellValue(spell, player, 'healing');
    return base * calculateSpellHealingMultiplier(spell, player, rules);
};

