import { SCHOOLS } from '@data/shared/schools';
import spell from '@data/spells/spell';

const talents = {
    INVIGORATING_MISTS: {
        name: "Invigorating Mists",
        id: 274586,
        icon: 'ability_monk_vivify',
        custom: {
            sheilunsMainTargetIncrease: 5.0,
        }
    },
    LEGACY_OF_WISDOM: {
        name: "Legacy of Wisdom",
        id: 404408,
        icon: 'misc_legionfall_monk',
        custom: {
            targetsHit: 5,
            castTime: -0.5,
        }
    },
    EMPERORS_FAVOR: {
        name: "Emperor's Favor",
        id: 471761,
        icon: 'inv_leather_raidmonkt2_d_01_helm',
        custom: {
            increase: 1.2,
            castTime: 0,
            targetsHit: 1,
        }
    },
    JADE_EMPOWERMENT: {
        name: "Jade Empowerment",
        id: 467317,
        icon: 'ability_thunderking_thunderstruck',
        custom: {
            spellpowerIncrease: 300,
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
            transferRate: 0.25,
            armorModifier: 0.7, // sad
        }
    },
    JADEFIRE_TEACHINGS: {
        name: "Jadefire Teachings",
        id: 467293,
        icon: 'inv_misc_book_07',
        custom: {
            transferRate: 1.80,
            armorModifier: 0.7, // sad
        }
    },
    WAY_OF_THE_CRANE: {
        name: "Way of the Crane",
        id: 388779,
        icon: 'monk_stance_redcrane',
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
            healing: 990
        },
        custom: {
            multiplier: 13.86,
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
            amp: 1.25,
        }
    },
    LOTUS_INFUSION: {
        name: "Lotus Infusion",
        id: 458431,
        icon: 'inv_misc_herb_chamlotus',
        custom: {
            additionalDuration: 2,
            amp: 1.1,
        }
    },
    MISTY_PEAKS: {
        name: "Misty Peaks",
        id: 388682,
        icon: 'achievement_zone_stormpeaks_10',
    },
    RESTORAL: {
        name: "Restoral",
        id: 388615,
        icon: 'ability_monk_tigerstyle',
    },
    SECRET_INFUSION: {
        name: "Secret Infusion",
        id: 388491,
        icon: 'ability_monk_chibrew',
    },
    TEAR_OF_MORNING: {
        name: "Tear of Morning",
        id: 387991,
        icon: 'ability_monk_uplift',
    },
    TEA_OF_SERENITY: {
        name: "Tea of Serenity",
        id: 393460,
        icon: 'inv_misc_food_vendor_roastedbarlytea',
    },
    TEA_OF_PLENTY: {
        name: "Tea of Plenty",
        id: 388517,
        icon: 'inv_misc_pearlmilktea',
    },
    MENDING_PROLIFERATION: {
        name: "Mending Proliferation",
        id: 388509,
        icon: 'inv_shoulder_inv_leather_raidmonk_s_01',
    },
    UNISON: {
        name: "Unison",
        id: 388477,
        icon: 'ability_creature_cursed_04',
    },
    PEER_INTO_PEACE: {
        name: "Peer into Peace",
        id: 440008,
        icon: 'inv_staff_2h_monk_c_01',
    },
    RUSHING_WIND_KICK: {
        name: "Rushing Wind Kick",
        id: 467307,
        icon: 'ability_monk_ridethewind',
    },
    JADE_SERPENT_STATUE: {
        name: "Jade Serpent Statue",
        id: 115313,
        icon: 'ability_monk_summonserpentstatue',
    },
    MANA_TEA: {
        name: "Mana Tea",
        id: 115869,
        icon: 'monk_ability_cherrymanatea',
    },
    SHAOHAOS_LESSONS: {
        name: "Shaohao's Lessons",
        id: 400089,
        icon: "ability_monk_dematerialize",
        custom: {
            secondsPerCloud: 8,
        }
    },
    VEIL_OF_PRIDE: {
        name: "Veil of Pride",
        id: 400053,
        icon: "ability_monk_vivify",
        custom: {
            secondsPerCloud: 4,
        }
    },
    JADE_INFUSION: {
        name: "Jade Infusion",
        id: 1242910,
        icon: 'ability_monk_summonserpentstatue',
    },
    PEACEFUL_MENDING: {
        name: "Peaceful Mending",
        id: 388593,
        icon: 'pandarenracial_innerpeace',
    },
    SPIRITFONT: {
        name: "Spiritfont",
        id: 1260511,
        icon: 'inv12_apextalent_monk_spiritfont',
    },
    ZEN_PULSE: {
        name: "Zen Pulse",
        id: 124081,
        icon: 'ability_monk_forcesphere',
    },
    UPLIFTED_SPIRITS: {
        name: "Uplifted Spirits",
        id: 388551,
        icon: 'inv_helm_leather_raidmonkgoblin_d_01',
    },
    CHI_COCOON: {
        name: "Chi Cocoon",
        id: 432772,
        icon: 'ability_monk_chiexplosion',
    },
    CALMING_COALESCENCE: {
        name: "Calming Coalescence",
        id: 388218,
        icon: 'ability_monk_healthsphere',
    },
    SOOTHING_BREATH: {
        name: "Soothing Breath",
        id: 343737,
        icon: 'ability_monk_soothingmists',
    },
    MORNING_BREEZE: {
        name: "Morning Breeze",
        id: 1277302,
        icon: 'expansionicon_mistsofpandaria',
    },
    EMPERORS_ELIXIR: {
        name: "Emperor's Elixir",
        id: 1268807,
        icon: 'inv_drink_25_honeytea',
    },
    CHI_WARDING: {
        name: "Chi Warding",
        id: 1277444,
        icon: 'inv_belt__inv_leather_raidmonkmythic_s_01',
    },
    FOCUSED_THUNDER: {
        name: "Focused Thunder",
        id: 197895,
        icon: 'spell_monk_nimblebrew',
    },
    RISING_MIST: {
        name: "Rising Mist",
        id: 274909,
        icon: 'ability_monk_effuse',
    },
    MISTS_OF_LIFE: {
        name: "Mists of Life",
        id: 388548,
        icon: 'inv_shoulder__inv_leather_raidmonkmythic_s_01',
    },
    JADEFIRE_STOMP: {
        name: 'Jadefire Stomp',
        id: 338193,
        icon: 'inv_ability_monk_jadefirestomp',
        school: SCHOOLS.NATURE,
        castTime: 0,
        value: {
            damage: 5637,
        },
        custom: {
            enemyTargets: 5,
            friendlyTargets: 5,
        }
    },
    OVERFLOWING_MISTS: {
        name: "Overflowing Mists",
        id: 388511,
        icon: 'inv_legion_faction_dreamweavers',
    },
    WAY_OF_THE_SERPENT: {
        name: "Way of the Serpent",
        id: 1243155,
        icon: 'monk_stance_wiseserpent',
    },
    YULONS_WHISPER: {
        name: "Yulon's Whisper",
        id: 388038,
        icon: 'ability_monk_chiexplosion',
    },

    // hero talents
    // master of harmony
    HARMONIC_SURGE: {
        name: "Harmonic Surge",
        id: 1239442,
        icon: 'ability_socererking_forcenova',
        value: {
            healing: 1225,
            damage: 268,
        },
        custom: {
            targetsHit: 5
        }
    },
    ASPECT_OF_HARMONY: {
        name: "Aspect of Harmony",
        id: 450508,
        icon: 'inv_ability_masterofharmonymonk_aspectofharmony',
    },
    ASPECT_OF_HARMONY_T1: {
        name: "Aspect of Harmony",
        id: 450521,
        icon: 'inv_10_gathering_bioluminescentspores_small',
    },
    ASPECT_OF_HARMONY_T2: {
        name: "Aspect of Harmony",
        id: 450526,
        icon: 'inv_10_gathering_bioluminescentspores_medium',
    },
    ASPECT_OF_HARMONY_T3: {
        name: "Aspect of Harmony",
        id: 450531,
        icon: 'inv_10_gathering_bioluminescentspores_large',
    },
    ASPECT_OF_HARMONY_WITHDRAW: {
        name: "Aspect of Harmony",
        id: 450711,
        icon: 'ability_evoker_essenceburst3',
    },
    CLARITY_OF_PURPOSE: {
        name: "Clarity of Purpose",
        id: 450509,
        icon: 'ability_titankeeper_cleanse',
    },
    BALANCED_STRATAGEM: {
        name: "Balanced Stratagem",
        id: 450889,
        icon: 'ability_monk_sphereharmonydiscord',
    },
    PATH_OF_RESURGENCE: {
        name: "Path of Resurgence",
        id: 451084,
        icon: 'ability_monk_pathofmists',
    },
    OVERWHELMING_FORCE: {
        name: "Overwhelming Force",
        id: 451024,
        icon: 'ability_titankeeper_piercingcorruption',
        custom: {
            percentOfDamage: 15,
        }
    },
    MANTRA_OF_PURITY: {
        name: "Mantra of Purity",
        id: 451036,
        icon: 'ability_monk_domeofmist',
    },
    COALESCENCE: {
        name: "Coalescence",
        id: 450529,
        icon: 'ability_monk_effuse',
    },
    MANIFESTATION: {
        name: "Manifestation",
        id: 450875,
        icon: 'inv_shoulder_inv_leather_raidmonk_s_01',
    },

    // conduit of the celestials
    TEMPLE_TRAINING: {
        name: "Temple Training",
        id: 442743,
        icon: 'ability_monk_provoke',
    },
    COURAGE_OF_THE_WHITE_TIGER: {
        name: "Courage of the White Tiger",
        id: 443087,
        icon: 'ability_monk_summontigerstatue',
        value: {
            healing: 6399,
            damage: 2133,
        }
    },
    HEART_OF_THE_JADE_SERPENT: {
        name: "Heart of the Jade Serpent",
        id: 443294,
        icon: 'ability_monk_dragonkick',
    },
    STRENGTH_OF_THE_BLACK_OX: {
        name: "Strength of the Black Ox",
        id: 443110,
        icon: 'ability_monk_chargingoxwave',
        custom: {
            targets: 5,
            absorbAmount: 930,
        }
    },
    FLIGHT_OF_THE_RED_CRANE: {
        name: "Flight of the Red Crane",
        id: 443255,
        icon: 'inv_pet_cranegod',
    },
    STAMPEDE_OF_THE_ANCIENTS: {
        name: "Stampede of the Ancients",
        id: 443321,
        icon: 'monk_ability_summonoxstatue',
        custom: {
            mainTargetIncrease: 4.0,
        }
    },
    INNER_COMPASS: {
        name: "Inner Compass",
        id: 443571,
        icon: 'inv_10_dungeonjewelry_explorer_trinket_1compass_color2',
    },
    UNITY_WITHIN: {
        name: "Unity Within",
        id: 443589,
        icon: 'ability_monk_prideofthetiger',
    },
    YULONS_AVATAR: {
        name: "Yulon's Avatar",
        id: 1262667,
        icon: 'inv_celestialserpentmount_jade',
    },
    FLOWING_WISDOM: {
        name: "Flowing Wisdom",
        id: 1262672,
        icon: 'ability_monk_flyingdragonkick',
    },
    CHI_JIS_SWIFTNESS: {
        name: "Chi-Ji's Swiftness",
        id: 443566,
        icon: 'inv_shoulder_leather_raidmonkemerald_d_01',
    },
    YULONS_KNOWLEDGE: {
        name: "Yulon's Knowledge",
        id: 443625,
        icon: 'inv_jewelcrafting_jadeserpent',
    },
} satisfies Record<string, spell>;

export default talents;
export { talents as MISTWEAVER_MONK_TALENTS };
