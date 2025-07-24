import spell from '@data/spells/spell';

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
        name: "Tea of Serenity",
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

    // hero talents
    // master of harmony
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
    ASPECT_OF_HARMONY: {
        name: "Aspect of Harmony",
        id: 450508,
        icon: 'inv_ability_masterofharmonymonk_aspectofharmony',
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

    // conduit of the celestials
    FLIGHT_OF_THE_RED_CRANE: {
        name: "Flight of the Red Crane",
        id: 443255,
        icon: 'inv_pet_cranegod',
    },
    COURAGE_OF_THE_WHITE_TIGER: {
        name: "Courage of the White Tiger",
        id: 443087,
        icon: 'ability_monk_summontigerstatue',
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
    },
    UNITY_WITHIN: {
        name: "Unity Within",
        id: 443589,
        icon: 'ability_monk_prideofthetiger',
    }
} satisfies Record<string, spell>;

export default talents;
export { talents as MISTWEAVER_MONK_TALENTS };
