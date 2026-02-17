import spell from '@data/spells/spell';

const spells = {
  REJUVENATION: {
    name: 'Rejuvenation',
    id: 774,
    icon: 'spell_nature_rejuvenation',
    castTime: 0,
  },
  REGROWTH: {
    name: 'Regrowth',
    id: 8936,
    icon: 'spell_nature_resistnature',
    castTime: 1.5,
  },
  WILD_GROWTH: {
    name: 'Wild Growth',
    id: 48438,
    icon: 'ability_druid_flourish',
    castTime: 1.5,
  },
  SWIFTMEND: {
    name: 'Swiftmend',
    id: 18562,
    icon: 'inv_relics_idolofrejuvenation',
    castTime: 0,
  },
  LIFEBLOOM: {
    name: 'Lifebloom',
    id: 33763,
    icon: 'inv_misc_herb_felblossom',
    castTime: 0,
  },
  EFFLORESCENCE: {
    name: 'Efflorescence',
    id: 145205,
    icon: 'inv_misc_herb_talandrasrose',
    castTime: 0,
  },
  NATURES_SWIFTNESS: {
    name: "Nature's Swiftness",
    id: 132158,
    icon: 'spell_nature_ravenform',
    castTime: 0,
    gcd: false,
  },
  TRANQUILITY: {
    name: 'Tranquility',
    id: 740,
    icon: 'spell_nature_tranquility',
    castTime: 5,
  },
  CONVOKE_THE_SPIRITS: {
    name: 'Convoke the Spirits',
    id: 391528,
    icon: 'inv_ability_druid_convokethespirits',
    castTime: 4,
  },
  INCARNATION_TREE_OF_LIFE: {
    name: 'Incarnation: Tree of Life',
    id: 33891,
    icon: 'ability_druid_improvedtreeform',
  },
  IRON_BARK: {
    name: 'Iron Bark',
    id: 102342,
    icon: 'spell_druid_ironbark',
    castTime: 0,
    gcd: false,
  },
} satisfies Record<string, spell>;

export default spells;
export { spells as RESTORATION_DRUID_SPELLS };
