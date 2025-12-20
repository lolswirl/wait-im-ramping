import CorePassive from '@data/core-passives/core-passive';
import SPELLS from '@data/spells';
import TALENTS from '@data/talents';

const HEALING_SPELLS = [
    SPELLS.VIVIFY.id,
    // SPELLS.EXPEL_HARM.id, removed in midnight
    SPELLS.SOOTHING_MIST.id,
    SPELLS.REVIVAL.id,
    SPELLS.ENVELOPING_MIST.id,
    //SPELLS.RESTORAL.id, meh
    SPELLS.SHEILUNS_GIFT.id,
    //SPELLS.HEALING_SPHERES.id, pvp lol
    //SPELLS.STRENGTH_OF_SPIRIT.id, azerite talent and expel harm removed from game
    //TALENTS.WEAPONS_OF_ORDER.id, not used by mw anymore
    //TALENTS.FAELINE_STOMP.id, its called jadefire stomp now
    TALENTS.HARMONIC_SURGE.id,
    //TALENTS.INSURANCE.id, old tier set
    //SPELLS.CHI_BURST.id, removed from mw in midnight
    SPELLS.CELESTIAL_CONDUIT.id,
    TALENTS.MANTRA_OF_PURITY.id,
    TALENTS.RUSHING_WIND_KICK.id,
    //SPELLS.HEALING_SPHERE.id, pvp lol
    SPELLS.RENEWING_MIST.id,
    TALENTS.CHI_WAVE.id,
    //TALENTS.REFRESHING_JADE_WIND.id, no longer mw toolkit
    TALENTS.GUST_OF_MISTS.id,
    TALENTS.ZEN_PULSE.id,
    //SPELLS.CELESTIAL_BREATH.id, removed in bfa
    //SPELLS.SURGING_MIST.id, removed in LEGION
    TALENTS.OVERFLOWING_MISTS.id,
    TALENTS.RISING_MIST.id,
    //TALENTS.BURST_OF_LIFE.id, won't even implement this, this thing sucks
    //SPELLS.ENVELOPING_BREATH.id, removed in midnight
    TALENTS.YULONS_WHISPER.id,
    TALENTS.TEAR_OF_MORNING.id,
    TALENTS.SOOTHING_BREATH.id,
    TALENTS.JADEFIRE_STOMP.id,
    //TALENTS.THUNDEROUS_FOCUS_TEA.id, pvp talent cba
    //TALENTS.SPHERE_OF_HOPE.id, pvp 
    TALENTS.INVIGORATING_MISTS.id,
    //TALENTS.FLIGHT_OF_THE_RED_CRANE.id, can only proc from unity within now, shouldn't be in the game
]

const corePassive = {
    MISTWEAVER_MONK: {
        name: 'Mistweaver Monk',
        id: 137024,
        icon: 'ability_mage_firestarter',
        effects: [
            {
                type: 'Apply Aura: Modifies Damage/Healing Done',
                value: -5,
                pvpMultiplier: 1,
                affectedSpells: HEALING_SPELLS
            },
            {
                type: 'Apply Aura: Modifies Periodic Damage/Healing Done',
                value: -5,
                pvpMultiplier: 1,
                affectedSpells: HEALING_SPELLS
            },
            {
                type: 'Apply Aura: Modifies Damage/Healing Done',
                value: -2,
                pvpMultiplier: 1,
                affectedSpells: [
                    //SPELLS.CORROSIVE_DOSAGE.id,
                    TALENTS.COURAGE_OF_THE_WHITE_TIGER.id,
                    //TALENTS.SPHERE_OF_DESPAIR.id, pvp lol
                    //TALENTS.FIST_OF_THE_WHITE_TIGER.id, removed in midnight
                ]
            },
            {
                type: 'Apply Aura: Modifies Periodic Damage/Healing Done',
                value: -2,
                pvpMultiplier: 1,
                affectedSpells: [
                    //SPELLS.CORROSIVE_DOSAGE.id,
                    TALENTS.COURAGE_OF_THE_WHITE_TIGER.id,
                    //TALENTS.SPHERE_OF_DESPAIR.id, pvp lol
                    //TALENTS.FIST_OF_THE_WHITE_TIGER.id, removed in midnight
                ]
            },
            {
                type: 'Apply Aura: Mod Pet Damage %',
                value: -2,
                pvpMultiplier: 1,
            },
            {
                type: 'Apply Aura: Mod Pet Damage %',
                value: -2,
                pvpMultiplier: 1,
            },
            {
                type: 'Apply Aura: Mod Auto Attack Damage %',
                pvpMultiplier: 1,
            },
            {
                type: 'Apply Aura: Modifies Damage/Healing Done',
                value: 92,
                pvpMultiplier: 1,
                affectedSpells: [
                    SPELLS.VIVIFY.id,
                ]
            },
            {
                type: 'Apply Aura: Add Modifier - % (Label): Modifies Damage/Healing Done',
                pvpMultiplier: 1,
                affectedSpells: [
                    TALENTS.INVIGORATING_MISTS.id,
                ]
            },
            {
                type: 'Apply Aura: Modifies Damage/Healing Done',
                value: 589,
                pvpMultiplier: 1,
                affectedSpells: [
                    //SPELLS.EXPEL_HARM.id, // removed in midnight
                ]
            },
            {
                type: 'Apply Aura: Modifies Damage/Healing Done',
                value: 106,
                pvpMultiplier: 0.447,
                affectedSpells: [
                    SPELLS.RISING_SUN_KICK.id,
                    TALENTS.RUSHING_WIND_KICK.id,
                    //TALENTS.GLORY_OF_THE_DAWN.id, old azerite trait
                ]
            },
            {
                type: 'Apply Aura: Modifies Damage/Healing Done',
                value: 128,
                pvpMultiplier: 1,
                affectedSpells: [
                    SPELLS.BLACKOUT_KICK.id,
                    //TALENTS.TORNADO_KICK.id, no idea honestly
                ]
            },
            {
                type: 'Apply Aura: Modifies Damage/Healing Done',
                value: 22,
                pvpMultiplier: 0.325,
                affectedSpells: [
                    SPELLS.TIGER_PALM.id,
                ]
            },
            {
                type: 'Apply Aura: Modifies Damage/Healing Done',
                value: 358,
                pvpMultiplier: 1,
                affectedSpells: [
                    //TALENTS.DEVOUT_SPIRIT.id, // corruption stuff from bfa
                    //TALENTS.SAVING_VIGIL.id, // corruption stuff from bfa
                    SPELLS.SPINNING_CRANE_KICK.id,
                ]
            },
            {
                type: 'Apply Aura: Modifies Periodic Damage/Healing Done',
                value: 400,
                pvpMultiplier: 1,
                affectedSpells: [
                    SPELLS.CRACKLING_JADE_LIGHTNING.id,
                ]
            },
            {
                type: 'Apply Aura: Add Modifier - % (Label): Modifies Damage/Healing Done',
                value: -15,
                pvpMultiplier: 1,
                affectedSpells: [
                    SPELLS.CELESTIAL_CONDUIT.id,
                ]
            },
        ]
    } as CorePassive,
};

export default corePassive;
