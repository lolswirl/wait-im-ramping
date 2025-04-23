import { spell } from '../../../../spell.ts';

export const mistweaverMonkTalents: spell[] = [
    {
        name: "Legacy of Wisdom",
        id: 404408,
        icon: 'misc_legionfall_monk',
        custom: {
            targetsHit: 5
        }
    },
    {
        name: "Jade Empowerment",
        id: 467317,
        icon: 'ability_thunderking_thunderstruck',
        custom: {
            spellpowerIncrease: 2000,
            chainVal: 0.25,
        }
    },
    {
        name: "Dance of Chi-Ji",
        id: 438439,
        icon: 'ability_monk_cranekick_new',
        custom: {
            spellpowerIncrease: 400
        }
    },
    {
        name: "Ancient Teachings",
        id: 388023,
        icon: 'inv_misc_book_07',
        custom: {
            transferRate: 2.45,
            armorModifier: 1,
        }
    },
    {
        name: "Awakened Jadefire",
        id: 388779,
        icon: 'inv_leather_raidmonkt2_d_01_helm',
        custom: {
            transferRate: 1.20,
            armorModifier: 0.7,
        }
    },
];
