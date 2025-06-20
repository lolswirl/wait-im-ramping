import spell from '../spell.ts';

const spells = {
  POWER_WORD_SHIELD: {
    name: 'Power Word: Shield',
    id: 17,
    icon: 'spell_holy_powerwordshield',
    castTime: 0,
  },
  SHADOW_WORD_PAIN: {
    name: 'Shadow Word: Pain',
    id: 589,
    icon: 'spell_shadow_shadowwordpain',
    castTime: 0,
  },
  MINDBENDER: {
    name: 'Mindbender',
    id: 123040,
    icon: 'spell_shadow_soulleech_3',
    castTime: 0,
  },
  SHADOWFIEND: {
    name: 'Shadowfiend',
    id: 34433,
    icon: 'spell_shadow_shadowfiend',
    castTime: 0,
  },
  MIND_BLAST: {
    name: 'Mind Blast',
    id: 8092,
    icon: 'spell_shadow_unholyfrenzy',
    castTime: 1.5,
  },
  POWER_WORD_RADIANCE: {
    name: 'Power Word: Radiance',
    id: 194509,
    icon: 'spell_priest_power-word',
    castTime: 2,
  },
  EVANGELISM: {
    name: 'Evangelism',
    id: 472433,
    icon: 'spell_holy_divineillumination',
    castTime: 0,
  },
  PENANCE: {
    name: 'Penance',
    id: 47540,
    icon: 'spell_holy_penance',
    castTime: 2,
  },
  VOID_BLAST: {
    name: 'Void Blast',
    id: 450405,
    icon: 'inv_cosmicvoid_missile',
    castTime: 1.5,
  },
  SMITE: {
    name: 'Smite',
    id: 585,
    icon: 'spell_holy_holysmite',
    castTime: 1.5,
  },
  RENEW: {
    name: 'Renew',
    id: 139,
    icon: 'spell_holy_renew',
    castTime: 0,
  },
  SHADOW_WORD_DEATH: {
    name: 'Shadow Word: Death',
    id: 32379,
    icon: 'spell_shadow_demonicfortitude',
    castTime: 0,
  },
  FLASH_HEAL: {
    name: 'Flash Heal',
    id: 2061,
    icon: 'spell_holy_flashheal',
    castTime: 0,
  },
  PREMONITION: {
    name: 'Premonition',
    id: 428933,
    icon: 'inv_ability_oraclepriest_premonitioninsight',
    castTime: 0,
    gcd: false,
  },
  PAIN_SUPPRESSION: {
    name: 'Pain Suppression',
    id: 33206,
    icon: 'spell_holy_painsupression',
    castTime: 0,
    gcd: false,
  },
  ULTIMATE_PENITENCE: {
    name: 'Ultimate Penitence',
    id: 421453,
    icon: 'ability_priest_ascendance',
    castTime: 0,
  }
} satisfies Record<string, spell>;

export default spells;
export { spells as DISCIPLINE_PRIEST_SPELLS };
