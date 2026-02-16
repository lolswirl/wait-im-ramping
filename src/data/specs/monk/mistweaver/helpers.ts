import spell from "@data/spells/spell";
import TALENTS from "./talents";
import SHARED from "@data/specs/monk/talents";
import SPELLS from "@data/spells";
import { SCHOOLS } from "@data/shared/schools";

export type TalentMap = Map<spell, boolean>;

export const isTalentEnabled = (talents: TalentMap | undefined, talent: spell): boolean => {
    if (!talents) return false;
    return talents.get(talent) === true;
};

interface TalentRule {
    talent: spell;
    getValue: (mastery?: number) => number;
    appliesTo: (spell: spell) => boolean;
}

const DAMAGE_MULTIPLIER_RULES: TalentRule[] = [
    {
        talent: SHARED.FEROCITY_OF_XUEN,
        getValue: () => 1 + SHARED.FEROCITY_OF_XUEN.custom.damageIncrease,
        appliesTo: (spell) => spell.value?.damage !== undefined
    },
    {
        talent: SHARED.FAST_FEET,
        getValue: () => 1 + SHARED.FAST_FEET.custom.risingSunKickIncrease,
        appliesTo: (spell) => 
            spell.id === SPELLS.RISING_SUN_KICK.id || 
            spell.id === TALENTS.RUSHING_WIND_KICK.id
    },
    {
        talent: SHARED.FAST_FEET,
        getValue: () => 1 + SHARED.FAST_FEET.custom.spinningCraneKickIncrease,
        appliesTo: (spell) => spell.id === SPELLS.SPINNING_CRANE_KICK.id
    },
    {
        talent: SHARED.CHI_PROFICIENCY,
        getValue: () => 1 + SHARED.CHI_PROFICIENCY.custom.magicDamageIncrease,
        appliesTo: (spell) => 
            spell.school === SCHOOLS.NATURE
    },
    {
        talent: SHARED.MARTIAL_INSTINCTS,
        getValue: () => 1 + SHARED.MARTIAL_INSTINCTS.custom.damageIncrease,
        appliesTo: (spell) => spell.school === SCHOOLS.PHYSICAL
    },
    {
        talent: TALENTS.YULONS_KNOWLEDGE,
        getValue: () => 1 + TALENTS.YULONS_KNOWLEDGE.custom.rskDamageIncrease,
        appliesTo: (spell) => 
            spell.id === SPELLS.RISING_SUN_KICK.id || 
            spell.id === TALENTS.RUSHING_WIND_KICK.id
    },
    {
        talent: TALENTS.MORNING_BREEZE,
        getValue: (mastery = 1) => 1 + (mastery * TALENTS.MORNING_BREEZE.custom.masteryMultiplier),
        appliesTo: (spell) => 
            spell.id === SPELLS.RISING_SUN_KICK.id || 
            spell.id === TALENTS.RUSHING_WIND_KICK.id
    },
    {
        talent: TALENTS.SPIRITFONT,
        getValue: () => 1 + TALENTS.SPIRITFONT.custom.rskIncrease,
        appliesTo: (spell) => 
            spell.id === SPELLS.RISING_SUN_KICK.id || 
            spell.id === TALENTS.RUSHING_WIND_KICK.id
    }
];

const HEALING_MULTIPLIER_RULES: TalentRule[] = [
    {
        talent: SHARED.CHI_PROFICIENCY,
        getValue: () => 1 + SHARED.CHI_PROFICIENCY.custom.healingDoneIncrease,
        appliesTo: (spell) => spell.value?.healing !== undefined
    },
];

export const calculateSpellDamageMultiplier = (
    spell: spell,
    talents?: TalentMap,
    mastery?: number
): number => {
    let multiplier = 1;
    
    for (const rule of DAMAGE_MULTIPLIER_RULES) {
        if (!isTalentEnabled(talents, rule.talent)) continue;
        
        if (rule.appliesTo(spell)) {
            multiplier *= rule.getValue(mastery);
        }
    }
    
    return multiplier;
};

export const calculateSpellHealingMultiplier = (
    spell: spell,
    talents?: TalentMap,
    mastery?: number
): number => {
    let multiplier = 1;
    
    for (const rule of HEALING_MULTIPLIER_RULES) {
        if (!isTalentEnabled(talents, rule.talent)) continue;
        
        if (rule.appliesTo(spell)) {
            multiplier *= rule.getValue(mastery);
        }
    }
    
    return multiplier;
};

export const calculateSpellDamage = (
    spell: spell,
    talents?: TalentMap,
    mastery?: number
): number => {
    const baseDamage = spell.value?.damage ?? 0;
    const multiplier = calculateSpellDamageMultiplier(spell, talents, mastery);
    return baseDamage * multiplier;
};

export const calculateSpellHealing = (
    spell: spell,
    talents?: TalentMap,
    mastery?: number
): number => {
    const baseHealing = spell.value?.healing ?? 0;
    const multiplier = calculateSpellHealingMultiplier(spell, talents, mastery);
    return baseHealing * multiplier;
};

export const getHealingMultiplier = (talents?: TalentMap): number => {
    let multiplier = 1;
    
    for (const rule of HEALING_MULTIPLIER_RULES) {
        if (isTalentEnabled(talents, rule.talent)) {
            multiplier *= rule.getValue();
        }
    }
    
    return multiplier;
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

export const getCombinedTeachingsTransfer = (talents?: TalentMap, includeJadefire: boolean = true): number => {
    let transfer = getAncientTeachingsBaseTransfer();
    
    if (includeJadefire && isTalentEnabled(talents, TALENTS.JADEFIRE_TEACHINGS)) {
        transfer += getJadefireTeachingsTransfer();
    }
    
    if (isTalentEnabled(talents, TALENTS.MEDITATIVE_FOCUS)) {
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

export const calculateAncientTeachingsHealing = (
    damage: number,
    talents?: TalentMap,
    includeJadefire: boolean = true
): number => {
    const transfer = getCombinedTeachingsTransfer(talents, includeJadefire);
    const armorModifier = getAncientTeachingsArmorModifier();
    const healingMultiplier = getHealingMultiplier(talents);
    
    return damage * transfer * armorModifier * healingMultiplier;
};

export const calculateWayOfTheCraneHealing = (
    damage: number,
    talents?: TalentMap
): number => {
    const transfer = getWayOfTheCraneTransfer();
    const armorModifier = getWayOfTheCraneArmorModifier();
    const healingMultiplier = getHealingMultiplier(talents);
    
    return damage * transfer * armorModifier * healingMultiplier;
};
