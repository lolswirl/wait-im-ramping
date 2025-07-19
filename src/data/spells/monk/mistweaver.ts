import { SCHOOLS } from "../../schools.ts";
import spell from "../spell.ts";

const spells = {
    // damaging abilities
    TIGER_PALM: {
        name: "Tiger Palm",
        id: 100780,
        icon: "ability_monk_tigerpalm",
        castTime: 0,
        school: SCHOOLS.PHYSICAL,
        value: {
            damage: 14769,
        },
    },
    BLACKOUT_KICK: {
        name: "Blackout Kick",
        id: 100784,
        icon: "ability_monk_roundhousekick",
        castTime: 0,
        school: SCHOOLS.PHYSICAL,
        value: {
            damage: 26582,
        },
    },
    RISING_SUN_KICK: {
        name: "Rising Sun Kick",
        id: 107428,
        icon: "ability_monk_risingsunkick",
        castTime: 0,
        school: SCHOOLS.PHYSICAL,
        value: {
            damage: 40775,
        },
    },
    CRACKLING_JADE_LIGHTNING: {
        name: "Crackling Jade Lightning",
        id: 117952,
        icon: "ability_monk_cracklingjadelightning",
        castTime: 3,
        school: SCHOOLS.NATURE,
        value: {
            damage: 19270,
        },
    },
    SPINNING_CRANE_KICK: {
        name: "Spinning Crane Kick",
        id: 101546,
        icon: "ability_monk_cranekick_new",
        school: SCHOOLS.PHYSICAL,
        castTime: 1.5,
        value: {
            damage: 25217,
        },
    },
    JADEFIRE_STOMP: {
        name: "Jadefire Stomp",
        id: 338193,
        icon: "inv_ability_monk_jadefirestomp",
        school: SCHOOLS.NATURE,
        castTime: 0,
        value: {
            damage: 15945,
            healing: 32880,
        },
        custom: {
            enemyTargets: 5,
            friendlyTargets: 5,
            resetChance: 0.06,
        },
    },
    CHI_BURST: {
        name: 'Chi Burst',
        id: 123986,
        icon: 'spell_arcane_arcanetorrent',
        castTime: 1,
        school: SCHOOLS.NATURE,
    },

    // healing abilities
    RENEWING_MIST: {
        name: "Renewing Mist",
        id: 119611,
        icon: "ability_monk_renewingmists",
        castTime: 0,
        school: SCHOOLS.NATURE,
        value: {
            healing: 36437,
        },
        custom: {
            duration: 20,
        },
    },
    SOOTHING_MIST: {
        name: "Soothing Mist",
        id: 115175,
        icon: "ability_monk_soothingmists",
        castTime: 1,
        hasted: false,
        school: SCHOOLS.NATURE,
        custom: {
            replaceGCD: 1,
        },
    },
    ENVELOPING_MIST: {
        name: "Enveloping Mist",
        id: 124682,
        icon: "spell_monk_envelopingmist",
        castTime: 2,
        school: SCHOOLS.NATURE,
        value: {
            healing: 57811,
        },
        custom: {
            duration: 6,
            amp: 1.3,
        },
    },
    VIVIFY: {
        name: "Vivify",
        id: 116670,
        icon: "ability_monk_vivify",
        castTime: 1.5,
        school: SCHOOLS.NATURE,
        value: {
            healing: 201357,
        },
    },
    THUNDER_FOCUS_TEA: {
        name: "Thunder Focus Tea",
        id: 116680,
        icon: "ability_monk_thunderfocustea",
        castTime: 0,
        gcd: false,
    },

    // cooldowns
    CHI_JI: {
        name: "Chi-Ji",
        id: 198664,
        icon: "inv_pet_cranegod",
        castTime: 0,
        custom: {
            duration: 12,
            maxStacks: 3,
            reductionPerStack: 0.33,
        },
    },
    YULON: {
        name: "Yu'lon",
        id: 322118,
        icon: "ability_monk_dragonkick",
        castTime: 0,
        custom: {
            duration: 12,
        },
    },
    SHEILUNS_GIFT: {
        name: "Sheilun's Gift",
        id: 205406,
        icon: "inv_staff_2h_artifactshaohao_d_01",
        castTime: 0,
        school: SCHOOLS.NATURE,
        value: {
            healing: 25750,
        },
        custom: {
            targetsHit: 3,
        },
    },
    REVIVAL: {
        name: "Revival",
        id: 115310,
        icon: "spell_monk_revival",
        castTime: 0,
        school: SCHOOLS.NATURE,
    },
    LIFE_COCOON: {
        name: "Life Cocoon",
        id: 116849,
        icon: "ability_monk_chicocoon",
        castTime: 0,
        gcd: false,
        custom: {
            absorbFormula: (sourceHp: number, versatility: number) => {
                return ((sourceHp * 48) / 100) * (1 + versatility);
            },
        }
    },
    CELESTIAL_CONDUIT: {
        name: 'Celestial Conduit',
        id: 443028,
        icon: 'inv_ability_conduitofthecelestialsmonk_celestialconduit',
        castTime: 4,
        school: SCHOOLS.NATURE,
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
    spells.JADEFIRE_STOMP,
    spells.RENEWING_MIST,
    spells.VIVIFY,
    spells.THUNDER_FOCUS_TEA,
];

export default spells;
export { spells as MISTWEAVER_SPELLS, CHIJI_ABILITIES };
