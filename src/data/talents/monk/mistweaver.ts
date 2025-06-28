import spell from '../../spells/spell.ts';

const talents = {
    LEGACY_OF_WISDOM: {
        name: "Legacy of Wisdom",
        id: 404408,
        icon: 'misc_legionfall_monk',
        custom: {
            targetsHit: 5
        }
    },
    JADE_EMPOWERMENT: {
        name: "Jade Empowerment",
        id: 467317,
        icon: 'ability_thunderking_thunderstruck',
        custom: {
            spellpowerIncrease: 2000,
            chainVal: 0.25,
        }
    },
    DANCE_OF_CHI_JI: {
        name: "Dance of Chi-Ji",
        id: 438439,
        icon: 'ability_monk_cranekick_new',
        custom: {
            spellpowerIncrease: 400
        }
    },
    ANCIENT_TEACHINGS: {
        name: "Ancient Teachings",
        id: 388023,
        icon: 'inv_misc_book_07',
        custom: {
            transferRate: 2.45,
            armorModifier: 1,
        }
    },
    AWAKENED_JADEFIRE: {
        name: "Awakened Jadefire",
        id: 388779,
        icon: 'inv_leather_raidmonkt2_d_01_helm',
        custom: {
            transferRate: 1.20,
            armorModifier: 0.7,
            tigerPalmHits: 2,
        }
    },
    CRANE_STYLE: {
        name: "Crane Style",
        id: 388024,
        icon: 'ability_monk_mightyoxkick',
        custom: {
            risingSunKickGOM: 2,
            blackoutKickGOM: 1,
            spinningCraneKickGOM: 1,
            gomChance: 0.1,
        }
    },
    HARMONIC_SURGE: {
        name: "Harmonic Surge",
        id: 1239442,
        icon: 'ability_socererking_forcenova',
        value: {
            healing: 74117,
            damage: 1,
        },
        custom: {
            targetsHit: 5
        }
    },
    TEACHINGS_OF_THE_MONASTERY: {
        name: "Teachings of the Monastery",
        id: 116645,
        icon: 'inv_misc_book_06',
        custom: {
            maxStacks: 4
        }
    },
    GUST_OF_MISTS: {
        name: "Gust of Mists",
        id: 117907,
        icon: 'ability_monk_souldance',
        value: {
            healing: 10703
        },
        custom: {
            multiplier: 6.93,
        }
    },
} satisfies Record<string, spell>;

export default talents;
export { talents as MISTWEAVER_MONK_TALENTS };
