import spell from "@data/spells/spell";

const spells = {
    HOLY_SHOCK: {
        name: "Holy Shock",
        id: 20473,
        icon: "spell_holy_searinglight",
        castTime: 0,
    },
    HOLY_LIGHT: {
        name: "Holy Light",
        id: 82326,
        icon: "spell_holy_surgeoflight",
        castTime: 2,
    },
    FLASH_OF_LIGHT: {
        name: "Flash of Light",
        id: 19750,
        icon: "spell_holy_flashheal",
        castTime: 1.5,
    },
    BEACON_OF_LIGHT: {
        name: "Beacon of Light",
        id: 88852,
        icon: 'ability_paladin_beaconoflight',
        castTime: 0,
    },
    BEACON_OF_VIRTUE: {
        name: "Beacon of Virtue",
        id: 200025,
        icon: "ability_paladin_beaconofinsight",
        castTime: 0,
    },
    CRUSADER_STRIKE: {
        name: "Crusader Strike",
        id: 35395,
        icon: "spell_holy_crusaderstrike",
        castTime: 0,
    },
    JUDGMENT: {
        name: "Judgment",
        id: 275773,
        icon: "spell_holy_righteousfury",
        castTime: 2,
    },
    HAMMER_OF_WRATH: {
        name: "Hammer of Wrath",
        id: 24275,
        icon: "inv12_ability_paladin_hammerofwrath",
        castTime: 0,
    },
    ETERNAL_FLAME: {
        name: "Eternal Flame",
        id: 156322,
        icon: "inv_torch_thrown",
        castTime: 0,
    },
    WORD_OF_GLORY: {
        name: "Word of Glory",
        id: 85673,
        icon: "inv_helmet_96",
        castTime: 0,
    },
    AURA_MASTERY: {
        name: "Aura Mastery",
        id: 31821,
        icon: "spell_holy_auramastery",
        castTime: 0,
    },
    BLESSING_OF_SACRIFICE: {
        name: "Blessing of Sacrifice",
        id: 6940,
        icon: "spell_holy_sealofsacrifice",
        castTime: 0,
        gcd: false,
    },
    BLESSING_OF_PROTECTION: {
        name: "Blessing of Protection",
        id: 1022,
        icon: "spell_holy_sealofprotection",
        castTime: 0,
        gcd: false,
    },
    LAY_ON_HANDS: {
        name: "Lay on Hands",
        id: 633,
        icon: "spell_holy_layonhands",
        castTime: 0,
        gcd: false,
    },
    HOLY_PRISM: {
        name: "Holy Prism",
        id: 114165,
        icon: "spell_paladin_holyprism",
        castTime: 0,
    },
    DIVINE_TOLL: {
        name: "Divine Toll",
        id: 375576,
        icon: "inv_ability_paladin_divinetoll",
        castTime: 0,
    },
    AVENGING_WRATH: {
        name: "Avenging Wrath",
        id: 31884,
        icon: "spell_holy_avenginewrath",
        castTime: 0,
        custom: {
            duration: 20,
        },
    },
    LIGHT_OF_DAWN: {
        name: "Light of Dawn",
        id: 85222,
        icon: "spell_paladin_lightofdawn",
        castTime: 0,
    },
    DIVINE_SHIELD: {
        name: "Divine Shield",
        id: 642,
        icon: "spell_holy_divineshield",
        castTime: 0,
    },
    HOLY_BULWARK: {
        name: "Holy Bulwark",
        id: 432459, 
        icon: 'inv_ability_lightsmithpaladin_holybulwark', 
    },
    SACRED_WEAPON: {
        name: "Sacred Weapon",
        id: 432472, 
        icon: 'inv_ability_lightsmithpaladin_sacredweapon', 
    },
} satisfies Record<string, spell>;

export default spells;
export { spells as HOLY_PALADIN_SPELLS };
