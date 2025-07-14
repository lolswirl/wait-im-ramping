import { Inventory } from '@mui/icons-material';
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
            transferRate: 0.3,
            armorModifier: 1,
        }
    },
    JADEFIRE_TEACHINGS: {
        name: "Jadefire Teachings",
        id: 467293,
        icon: 'inv_misc_book_07',
        custom: {
            transferRate: 2.15,
            armorModifier: 1,
        }
    },
    AWAKENED_JADEFIRE: {
        name: "Awakened Jadefire",
        id: 388779,
        icon: 'inv_leather_raidmonkt2_d_01_helm',
        custom: {
            targetsPerSCK: 3,
            transferRate: 1.20,
            armorModifier: 0.7,
            tigerPalmHits: 2,
            blackoutKickHits: 2,
            blackoutKickEffectiveness: 0.2,
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
        icon: 'passive_monk_teachingsofmonastery',
        custom: {
            maxStacks: 4,
            resetChance: 0.2,
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
    CELESTIAL_HARMONY: {
        name: "Celestial Harmony",
        id: 343655,
        icon: 'ability_monk_jadeserpentbreath',
        custom: {
            chiCocoonTargets: 5,
            chiCocoonFormula: (sourceHp: number, versatility: number) => {
                return sourceHp * 24 / 100 * (1 + versatility);
            },
            envelopingBreathAmp: 1.1,
            envelopingBreathTargets: 5,
            envelopingBreathHealing: 19011,
            envelopingBreathDuration: 6
        }
    },
    JADE_BOND: {
        name: "Jade Bond",
        id: 336773,
        icon: 'inv_inscription_deck_jadeserpent',
        custom: {
            duration: 25,
            gustIncrease: 0.2,
            soothingBreathIncrease: 5,
            chiCocoonEnvmDuration: 4, 
        }
    },
    MIST_WRAP: {
        name: "Mist Wrap",
        id: 197900,
        icon: 'ability_monk_pathofmists',
        custom: {
            duration: 1,
            amp: 0.1,
        }
    },
    RAPID_DIFFUSION: {
        name: "Rapid Diffusion",
        id: 388847,
        icon: 'ability_monk_chiswirl',
        custom: {
            duration: 6,
        }
    },
    CHI_HARMONY: {
        name: "Chi Harmony",
        id: 448392,
        icon: 'ability_monk_counteractmagic',
        custom: {
            duration: 8,
            amp: 1.5,
        }
    },

} satisfies Record<string, spell>;

export default talents;
export { talents as MISTWEAVER_MONK_TALENTS };
