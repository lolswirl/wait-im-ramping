import spell, { CATEGORY } from "@data/spells/spell";
import TALENTS from "../talents";
import SHARED from "@data/specs/monk/talents";
import SPELLS from "@data/spells";
import { SCHOOLS } from "@data/shared/schools";
import { registerSpecEngine } from "@data/shared/specEngines";
import MISTWEAVER_KEY from "../key";
import {
    TalentMap,
    Player,
    TalentRule,
    isTalentEnabled,
    calculateSpellDamageMultiplier,
    calculateSpellHealingMultiplier,
    calcSpellValue,
} from "@data/shared/engine";
import * as Engine from "@data/shared/engine";

export type { TalentMap, Player };
export { isTalentEnabled, calcSpellValue, calculateSpellDamageMultiplier, calculateSpellHealingMultiplier };

const DAMAGE_MULTIPLIER_RULES: TalentRule[] = [
    {
        talent: SHARED.FEROCITY_OF_XUEN,
        getValue: () => 2 * SHARED.FEROCITY_OF_XUEN.custom.damageIncrease,
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
        appliesTo: (spell) => spell.category === CATEGORY.HEALING || spell.category === CATEGORY.COOLDOWN || spell.id === TALENTS.RUSHING_WIND_KICK.id || spell.id === TALENTS.HARMONIC_SURGE.id
    },
    {
        talent: TALENTS.TEAR_OF_MORNING,
        getValue: () => TALENTS.TEAR_OF_MORNING.custom.sheilunsGiftIncrease,
        appliesTo: (spell) => spell.id === SPELLS.SHEILUNS_GIFT.id
    },
    {
        talent: TALENTS.TEAR_OF_MORNING,
        getValue: () => TALENTS.TEAR_OF_MORNING.custom.invigoratingMistsIncrease,
        appliesTo: (spell) => spell.id === TALENTS.INVIGORATING_MISTS.id
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
    {
        talent: TALENTS.UPLIFTED_SPIRITS,
        getValue: () => TALENTS.UPLIFTED_SPIRITS.custom.revivalIncrease,
        appliesTo: (spell) => spell.id === SPELLS.REVIVAL.id || spell.id == TALENTS.RESTORAL.id,
    }
];

export const calculateSpellDamage = (spell: spell, player: Player): number =>
    Engine.calculateSpellDamage(spell, player, DAMAGE_MULTIPLIER_RULES);

export const calculateSpellHealing = (spell: spell, player: Player): number =>
    Engine.calculateSpellHealing(spell, player, HEALING_MULTIPLIER_RULES);


export const calculateGustOfMists = (player: Player): number => {
    const gom = TALENTS.GUST_OF_MISTS;
    const pseudoGom = { ...gom, coeff: player.stats.mastery / 100 } as spell;
    return Engine.calculateSpellHealing(pseudoGom, player, HEALING_MULTIPLIER_RULES);
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
    return damage * transfer * armorModifier;
};

export const calculateWayOfTheCraneHealing = (
    damage: number,
): number => {
    const transfer = getWayOfTheCraneTransfer();
    const armorModifier = getWayOfTheCraneArmorModifier();
    return damage * transfer * armorModifier;
};

registerSpecEngine(MISTWEAVER_KEY, {
    calculateSpellDamage,
    calculateSpellHealing,
    resolveSpellValue: (spell, player) => {
        if (spell.id === TALENTS.GUST_OF_MISTS.id) {
            return calculateGustOfMists(player);
        }
        return null;
    },
});
