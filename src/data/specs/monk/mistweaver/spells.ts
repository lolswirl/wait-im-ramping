import spell, { CATEGORY } from '@data/spells/spell';
import { SCHOOLS } from '@data/shared/schools';

const spells = {
    // damaging abilities
    TIGER_PALM: {
        name: 'Tiger Palm',
        id: 100780,
        icon: 'ability_monk_tigerpalm',
        castTime: 0,
        school: SCHOOLS.PHYSICAL,
        value: {
            damage: 915
        },
        category: CATEGORY.DAMAGE,
    },
    BLACKOUT_KICK: {
        name: 'Blackout Kick',
        id: 100784,
        icon: 'ability_monk_roundhousekick',
        castTime: 0,
        school: SCHOOLS.PHYSICAL,
        value: {
            damage: 1619
        },
        category: CATEGORY.DAMAGE,
    },
    RISING_SUN_KICK: {
        name: 'Rising Sun Kick',
        id: 185099,
        icon: 'ability_monk_risingsunkick',
        castTime: 0,
        cooldown: 12,
        school: SCHOOLS.PHYSICAL,
        value: {
            damage: 2484
        },
        category: CATEGORY.DAMAGE,
    },
    CRACKLING_JADE_LIGHTNING: {
        name: 'Crackling Jade Lightning',
        id: 117952,
        icon: 'ability_monk_cracklingjadelightning',
        castTime: 3,
        school: SCHOOLS.NATURE,
        value: {
            damage: 1173
        },
        category: CATEGORY.DAMAGE,
    },
    SPINNING_CRANE_KICK: {
        name: 'Spinning Crane Kick',
        id: 107270,
        icon: 'ability_monk_cranekick_new',
        school: SCHOOLS.PHYSICAL,
        castTime: 1.5,
        value: {
            damage: 1687
        },
        category: CATEGORY.DAMAGE,
    },

    // healing abilities
    RENEWING_MIST: {
        name: 'Renewing Mist',
        id: 119611,
        icon: 'ability_monk_renewingmists',
        castTime: 0,
        cooldown: 9,
        school: SCHOOLS.NATURE,
        value: {
            healing: 1134
        },
        custom: {
            duration: 20
        },
        category: CATEGORY.HEALING,
    },
    SOOTHING_MIST: {
        name: 'Soothing Mist',
        id: 115175,
        icon: 'ability_monk_soothingmists',
        castTime: 1,
        school: SCHOOLS.NATURE,
        custom: {
            replaceGCD: 1
        },
        category: CATEGORY.HEALING,
    },
    ENVELOPING_MIST: {
        name: 'Enveloping Mist',
        id: 124682,
        icon: 'spell_monk_envelopingmist',
        castTime: 2,
        school: SCHOOLS.NATURE,
        value: {
            healing: 4320
        },
        custom: {
            duration: 6,
            amp: 1.1,
        },
        category: CATEGORY.HEALING,
    },
    VIVIFY: {
        name: 'Vivify',
        id: 116670,
        icon: 'ability_monk_vivify',
        castTime: 1.5,
        school: SCHOOLS.NATURE,
        value: {
            healing: 5390
        },
        category: CATEGORY.HEALING,
    },
    SHEILUNS_GIFT: {
        name: "Sheilun's Gift",
        id: 399491,
        icon: 'inv12_ability_monk_sheilunsgift',
        castTime: 2,
        school: SCHOOLS.NATURE,
        value: {
            healing: 2326
        }, 
        custom: {
            healingPerStack: 116,
            targetsHit: 3,
            maxStacks: 10,
        },
        category: CATEGORY.HEALING,
    },

    // cooldowns
    THUNDER_FOCUS_TEA: {
        name: 'Thunder Focus Tea',
        id: 116680,
        icon: 'ability_monk_thunderfocustea',
        castTime: 0,
        cooldown: 30,
        gcd: false,
        category: CATEGORY.COOLDOWN,
    },
    CHI_JI: {
        name: 'Chi-Ji',
        id: 325197,
        icon: 'inv_pet_cranegod',
        castTime: 0,
        custom: {
            duration: 12,
        },
        category: CATEGORY.COOLDOWN,
    },
    YULON: {
        name: "Yu'lon",
        id: 322118,
        icon: 'ability_monk_dragonkick',
        castTime: 0,
        custom: {
            duration: 12,
        },
        category: CATEGORY.COOLDOWN,
    },
    REVIVAL: {
        name: 'Revival',
        id: 115310,
        icon: 'spell_monk_revival',
        castTime: 0,
        school: SCHOOLS.NATURE,
        category: CATEGORY.COOLDOWN,
    },
    LIFE_COCOON: {
        name: 'Life Cocoon',
        id: 116849,
        icon: 'ability_monk_chicocoon',
        castTime: 0,
        cooldown: 120,
        gcd: false,
        custom: {
            absorbFormula: (sourceHp: number, versatility: number) => {
                return sourceHp * 48 / 100 * (1 + versatility);
            },
        },
        category: CATEGORY.COOLDOWN,
    },
    CELESTIAL_CONDUIT: {
        name: 'Celestial Conduit',
        id: 443028,
        icon: 'inv_ability_conduitofthecelestialsmonk_celestialconduit',
        castTime: 4,
        cooldown: 90,
        school: SCHOOLS.NATURE,
        value: {
            healing: 31284,
            damage: 8088,
        },
        custom: {
            maxTargets: 5,
        },
        category: CATEGORY.COOLDOWN,
    },

} satisfies Record<string, spell>;

const CHIJI_ABILITIES = [
    // direct interaction
    spells.CHI_JI,
    spells.ENVELOPING_MIST,
    spells.TIGER_PALM,
    spells.BLACKOUT_KICK,
    spells.RISING_SUN_KICK,
    spells.SPINNING_CRANE_KICK,

    // indirect interactions
    spells.RENEWING_MIST,
    spells.VIVIFY,
    spells.THUNDER_FOCUS_TEA,
];

export default spells;
export { spells as MISTWEAVER_SPELLS, CHIJI_ABILITIES };
