import spell from '@data/spells/spell';

const talents = {
    BEACON_OF_FAITH: {
        name: "Beacon of Faith",
        id: 156910,
        icon: 'ability_paladin_beaconsoflight',
    },
    PILLARS_OF_LIGHT: {
        name: "Pillars of Light",
        id: 1232616,
        icon: 'inv_helm_plate_raidpaladindragon_d_01',
    },
    HAMMER_AND_ANVIL: {
        name: "Hammer and Anvil",
        id: 1232617,
        icon: 'inv_10_blacksmithing_consumable_repairhammer_color1',
    },
    POWER_OF_THE_SILVER_HAND: {
        name: "Power of the Silver Hand",
        id: 200474, 
        icon: 'ability_paladin_blessedhands', 
    },
    SUNS_AVATAR: {
        name: "Sun's Avatar",
        id: 431425, 
        icon: 'ability_paladin_holyavenger', 
    },
    RISING_SUNLIGHT: {
        name: "Rising Sunlight",
        id: 461250, 
        icon: 'spell_priest_divinestar_holy', 
    },
    GLEAMING_RAYS: {
        name: "Gleaming Rays",
        id: 431480, 
        icon: 'spell_priest_power-word', 
    },
    EMPYREAL_WARD: {
        name: "Empyreal Ward",
        id: 387791, 
        icon: 'spell_holy_layonhands', 
    },
    SECOND_SUNRISE: {
        name: "Second Sunrise",
        id: 431474, 
        icon: 'ability_priest_halo', 
    },
    DIVINE_PURPOSE: {
        name: "Divine Purpose",
        id: 223817,
        icon: 'spell_holy_divinepurpose',
    },
    DAWNLIGHT: {
        name: "Dawnlight",
        id: 431377, 
        icon: 'inv_ability_heraldofthesunpaladin_dawnlight', 
    },
    BREAKING_DAWN: {
        name: "Breaking Dawn",
        id: 387879, 
        icon: 'spell_holy_rune', 
    },
    LIBERATION: {
        name: "Liberation",
        id: 461287, 
        icon: 'ability_paladin_toweroflight', 
    },
    LIGHT_OF_THE_MARTYR: {
        name: "Light of the Martyr",
        id: 183998,
        icon: 'ability_paladin_lightofthemartyr',
    },
    MASTERWORK: {
        name: "Masterwork",
        id: 1238903, 
        icon: 'inv_mace_1h_gryphonrider_d_02_silver', 
    },
    SOLAR_WRATH: {
        name: "Solar Wrath",
        id: 1236972, 
        icon: 'inv_icon_wing06c', 
    },
    AVENGING_CRUSADER: {
        name: "Avenging Crusader",
        id: 216331,
        icon: 'ability_paladin_veneration',
    },
    LAYING_DOWN_ARMS: {
        name: "Laying Down Arms",
        id: 432866, 
        icon: 'ability_paladin_handoflight', 
    },
} satisfies Record<string, spell>;
    
export default talents;
export { talents as HOLY_PALADIN_TALENTS };