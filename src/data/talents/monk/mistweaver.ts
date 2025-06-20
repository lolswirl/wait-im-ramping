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
        }
    },
} satisfies Record<string, spell>;

export default talents;
export { talents as MISTWEAVER_MONK_TALENTS };
