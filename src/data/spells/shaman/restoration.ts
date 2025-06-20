import spell from '../spell.ts';

const spells = {
  RIPTIDE: {
    name: 'Riptide',
    id: 61295,
    icon: 'spell_nature_riptide',
    castTime: 0,
  },
  HEALING_RAIN: {
    name: 'Healing Rain',
    id: 73920,
    icon: 'spell_nature_giftofthewaterspirit',
    castTime: 2,
  },
  DOWNPOUR: {
    name: 'Downpour',
    id: 462486,
    icon: 'ability_mage_waterjet',
    castTime: 0,
  },
  EARTH_SHIELD: {
    name: 'Earth Shield',
    id: 974,
    icon: 'spell_nature_skinofearth',
    castTime: 0,
  },
  CHAIN_HEAL: {
    name: 'Chain Heal',
    id: 1064,
    icon: 'spell_nature_healingwavegreater',
    castTime: 2.5,
  },
  HEALING_SURGE: {
    name: 'Healing Surge',
    id: 8004,
    icon: 'spell_nature_healingway',
    castTime: 1.5,
  },
  HEALING_WAVE: {
    name: 'Healing Wave',
    id: 77472,
    icon: 'spell_nature_healingwavelesser',
    castTime: 2.5,
  },
  NATURES_SWIFTNESS: {
    name: "Nature's Swiftness",
    id: 378081,
    icon: 'spell_nature_ravenform',
    castTime: 0,
    gcd: false,
  },
  UNLEASH_LIFE: {
    name: 'Unleash Life',
    id: 73685,
    icon: 'spell_shaman_unleashweapon_life',
    castTime: 0,
  },
  WELLSPRING: {
    name: 'Wellspring',
    id: 197995,
    icon: 'ability_shawaterelemental_split',
    castTime: 1.5,
  },
  CLOUDBURST_TOTEM: {
    name: 'Cloudburst Totem',
    id: 157153,
    icon: 'ability_shaman_condensationtotem',
    castTime: 0,
  },
} satisfies Record<string, spell>;

export default spells;
export { spells as RESTORATION_SHAMAN_SPELLS };
