import spell, { CATEGORY } from "@data/spells/spell";
import TALENTS from "./talents";
import SHARED from "@data/specs/monk/talents";
import SPELLS from "@data/spells";
import { SCHOOLS } from "@data/shared/schools";
import { getSpellAura } from "@data/core-passives/core-passive";
import type CorePassive from "@data/core-passives/core-passive";
import type { Stats } from '@data/shared/stats';

export type TalentMap = Map<spell, boolean>;

export interface Player {
    stats: Stats;
    talents: TalentMap;
    corePassives: CorePassive[];
}

export const isTalentEnabled = (talents: TalentMap | undefined, talent: spell): boolean => {
    if (!talents) return false;
    return talents.get(talent) === true;
};

interface TalentRule {
    talent: spell;
    getValue: (stats?: Stats) => number;
    appliesTo: (spell: spell) => boolean;
}

const DAMAGE_MULTIPLIER_RULES: TalentRule[] = [
    {
        talent: SHARED.FEROCITY_OF_XUEN,
        getValue: () => 2 * SHARED.FEROCITY_OF_XUEN.custom.damageIncrease, // 2 pts
        appliesTo: (spell) => spell.category === CATEGORY.DAMAGE
    },
    {
        talent: SHARED.FAST_FEET,
        getValue: () => SHARED.FAST_FEET.custom.risingSunKickIncrease,
        appliesTo: (spell) =>
            spell.id === SPELLS.RISING_SUN_KICK.id ||
            spell.id === TALENTS.RUSHING_WIND_KICK.id
    },
    {
        talent: SHARED.FAST_FEET,
        getValue: () => SHARED.FAST_FEET.custom.spinningCraneKickIncrease,
        appliesTo: (spell) => spell.id === SPELLS.SPINNING_CRANE_KICK.id
    },
    {
        talent: SHARED.CHI_PROFICIENCY,
        getValue: () => SHARED.CHI_PROFICIENCY.custom.magicDamageIncrease,
        appliesTo: (spell) => spell.school === SCHOOLS.NATURE
    },
    {
        talent: SHARED.MARTIAL_INSTINCTS,
        getValue: () => 2 * SHARED.MARTIAL_INSTINCTS.custom.damageIncrease,
        appliesTo: (spell) => spell.school === SCHOOLS.PHYSICAL
    },
    {
        talent: TALENTS.YULONS_KNOWLEDGE,
        getValue: () => TALENTS.YULONS_KNOWLEDGE.custom.rskDamageIncrease,
        appliesTo: (spell) =>
            spell.id === SPELLS.RISING_SUN_KICK.id ||
            spell.id === TALENTS.RUSHING_WIND_KICK.id
    },
    {
        talent: TALENTS.MORNING_BREEZE,
        getValue: (stats) => ((stats?.mastery ?? 0) / 100 * TALENTS.MORNING_BREEZE.custom.masteryMultiplier),
        appliesTo: (spell) =>
            spell.id === SPELLS.RISING_SUN_KICK.id ||
            spell.id === TALENTS.RUSHING_WIND_KICK.id
    },
    {
        talent: TALENTS.SPIRITFONT,
        getValue: () => TALENTS.SPIRITFONT.custom.rskIncrease,
        appliesTo: (spell) =>
            spell.id === SPELLS.RISING_SUN_KICK.id ||
            spell.id === TALENTS.RUSHING_WIND_KICK.id
    },
    {
        talent: TALENTS.TEMPLE_TRAINING,
        getValue: () => TALENTS.TEMPLE_TRAINING.custom.sckIncrease,
        appliesTo: (spell) => spell.id === SPELLS.SPINNING_CRANE_KICK.id
    }
];

const HEALING_MULTIPLIER_RULES: TalentRule[] = [
    {
        talent: SHARED.CHI_PROFICIENCY,
        getValue: () => SHARED.CHI_PROFICIENCY.custom.healingDoneIncrease,
        appliesTo: (spell) => spell.category === CATEGORY.HEALING
    },
    {
        talent: TALENTS.TEAR_OF_MORNING,
        getValue: () => TALENTS.TEAR_OF_MORNING.custom.sheilunsGiftIncrease,
        appliesTo: (spell) => spell.id === SPELLS.SHEILUNS_GIFT.id
    },
    {
        talent: TALENTS.WAY_OF_THE_SERPENT,
        getValue: () => TALENTS.WAY_OF_THE_SERPENT.custom.sheilunsGiftIncrease,
        appliesTo: (spell) => spell.id === SPELLS.SHEILUNS_GIFT.id
    },
    {
        talent: TALENTS.WAY_OF_THE_SERPENT,
        getValue: () => TALENTS.WAY_OF_THE_SERPENT.custom.renewingMistIncrease,
        appliesTo: (spell) => spell.id === SPELLS.RENEWING_MIST.id
    },
];

export const calculateSpellDamageMultiplier = (spell: spell, player: Player): number => {
    let multiplier = 1;

    for (const rule of DAMAGE_MULTIPLIER_RULES) {
        if (!isTalentEnabled(player.talents, rule.talent)) continue;

        if (rule.appliesTo(spell)) {
            multiplier *= (1 + rule.getValue(player.stats));
        }
    }

    return multiplier;
};

export const calculateSpellHealingMultiplier = (spell: spell, player: Player): number => {
    let multiplier = 1;

    for (const rule of HEALING_MULTIPLIER_RULES) {
        if (!isTalentEnabled(player.talents, rule.talent)) continue;

        if (rule.appliesTo(spell)) {
            multiplier *= (1 + rule.getValue(player.stats));
        }
    }

    return multiplier;
};

const resolveCoeff = (coeff: spell['coeff'], type: 'damage' | 'healing'): number | undefined => {
    if (coeff === undefined) return undefined;
    if (typeof coeff === 'number') return coeff;
    return coeff[type];
};

export const calcSpellValue = (spell: spell, player: Player, type: 'damage' | 'healing' = 'healing'): number => {
    const coeff = resolveCoeff(spell.coeff, type);
    if (coeff === undefined) return 0;
    const critMultiplier = 1 + (player.stats.crit / 100);
    const versMultiplier = 1 + (player.stats.versatility / 100);
    return player.stats.intellect * coeff * getSpellAura(spell, player.corePassives) * critMultiplier * versMultiplier;
};

export const calculateSpellDamage = (spell: spell, player: Player): number => {
    const coeff = resolveCoeff(spell.coeff, 'damage');
    const base = coeff !== undefined
        ? calcSpellValue(spell, player, 'damage')
        : (spell.value?.damage ?? 0);
    return base * calculateSpellDamageMultiplier(spell, player);
};

export const calculateSpellHealing = (spell: spell, player: Player): number => {
    const coeff = resolveCoeff(spell.coeff, 'healing');
    const base = coeff !== undefined
        ? calcSpellValue(spell, player, 'healing')
        : (spell.value?.healing ?? 0);
    return base * calculateSpellHealingMultiplier(spell, player);
};

export const getHealingMultiplier = (talents?: TalentMap): number => {
    let multiplier = 1;

    for (const rule of HEALING_MULTIPLIER_RULES) {
        if (isTalentEnabled(talents, rule.talent)) {
            multiplier *= (1 + rule.getValue());
        }
    }

    return multiplier;
};

export const calculateGustOfMists = (player: Player): number => {
    const gom = TALENTS.GUST_OF_MISTS;
    const pseudoGom = { ...gom, coeff: player.stats.mastery / 100 } as spell;
    return calculateSpellHealing(pseudoGom, player);
};

export const getAncientTeachingsBaseTransfer = (): number => {
    return TALENTS.ANCIENT_TEACHINGS.custom.transferRate;
};

export const getAncientTeachingsArmorModifier = (): number => {
    return TALENTS.ANCIENT_TEACHINGS.custom.armorModifier;
};

export const getJadefireTeachingsTransfer = (): number => {
    return TALENTS.JADEFIRE_TEACHINGS.custom.transferRate;
};

export const getMeditativeFocusTransfer = (): number => {
    return TALENTS.MEDITATIVE_FOCUS.custom.transferRate;
};

export const getCombinedTeachingsTransfer = (player: Player, includeJadefire: boolean = true): number => {
    let transfer = getAncientTeachingsBaseTransfer();

    if (includeJadefire && isTalentEnabled(player.talents, TALENTS.JADEFIRE_TEACHINGS)) {
        transfer += getJadefireTeachingsTransfer();
    }

    if (isTalentEnabled(player.talents, TALENTS.MEDITATIVE_FOCUS)) {
        transfer += getMeditativeFocusTransfer();
    }

    return transfer;
};

export const getWayOfTheCraneTransferPerTarget = (): number => {
    return TALENTS.WAY_OF_THE_CRANE.custom.transferRate;
};

export const getWayOfTheCraneTargets = (): number => {
    return TALENTS.WAY_OF_THE_CRANE.custom.targetsPerSCK;
};

export const getWayOfTheCraneArmorModifier = (): number => {
    return TALENTS.WAY_OF_THE_CRANE.custom.armorModifier;
};

export const getWayOfTheCraneTransfer = (): number => {
    return getWayOfTheCraneTransferPerTarget() * getWayOfTheCraneTargets();
};

export const calculateAncientTeachingsData = (
    spell: spell,
    player: Player,
    includeJadefire: boolean = true,
): { damage: number; healing: number } => {
    const damage = calculateSpellDamage(spell, player);
    const healing = calculateAncientTeachingsHealing(damage, player, includeJadefire, spell);
    return { damage, healing };
};

export const calculateAncientTeachingsHealing = (
    damage: number,
    player: Player,
    includeJadefire: boolean = true,
    sourceSpell?: spell
): number => {
    const transfer = getCombinedTeachingsTransfer(player, includeJadefire);
    const armorModifier = sourceSpell?.school === SCHOOLS.NATURE ? 1 : getAncientTeachingsArmorModifier();
    const healingMultiplier = getHealingMultiplier(player.talents);
    return damage * transfer * armorModifier * healingMultiplier;
};

export const calculateWayOfTheCraneHealing = (
    damage: number,
    player: Player
): number => {
    const transfer = getWayOfTheCraneTransfer();
    const armorModifier = getWayOfTheCraneArmorModifier();
    const healingMultiplier = getHealingMultiplier(player.talents);
    return damage * transfer * armorModifier * healingMultiplier;
};
