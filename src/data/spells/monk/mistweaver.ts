import spell from '../spell.ts';

const spells = {
  RENEWING_MIST: {
    name: 'Renewing Mist',
    id: 119611,
    icon: 'ability_monk_renewingmists',
    castTime: 0,
  },
  ENVELOPING_MIST: {
    name: 'Enveloping Mist',
    id: 124682,
    icon: 'spell_monk_envelopingmist',
    castTime: 2
  },
  RISING_SUN_KICK: {
    name: 'Rising Sun Kick',
    id: 107428,
    icon: 'ability_monk_risingsunkick',
    castTime: 0,
    value: {
      damage: 40775
    }
  },
  TIGER_PALM: {
    name: 'Tiger Palm',
    id: 100780,
    icon: 'ability_monk_tigerpalm',
    castTime: 0,
    value: {
      damage: 14769
    }
  },
  BLACKOUT_KICK: {
    name: 'Blackout Kick',
    id: 100784,
    icon: 'ability_monk_roundhousekick',
    castTime: 0,
    value: {
      damage: 26582
    }
  },
  VIVIFY: {
    name: 'Vivify',
    id: 116670,
    icon: 'ability_monk_vivify',
    castTime: 1.5
  },
  SOOTHING_MIST: {
    name: 'Soothing Mist',
    id: 115175,
    icon: 'ability_monk_soothingmists',
    castTime: 1,
    hasted: false,
    custom: {
      replaceGCD: 1
    }
  },
  THUNDER_FOCUS_TEA: {
    name: 'Thunder Focus Tea',
    id: 116680,
    icon: 'ability_monk_thunderfocustea',
    castTime: 0,
    gcd: false
  },
  SHEILUNS_GIFT: {
    name: "Sheilun's Gift",
    id: 205406,
    icon: 'inv_staff_2h_artifactshaohao_d_01',
    castTime: 0,
    value: {
      healing: 25750
    }, 
    custom: {
      targetsHit: 3
    }
  },
  CHI_JI: {
    name: 'Chi-Ji',
    id: 198664,
    icon: 'inv_pet_cranegod',
    castTime: 0,
    custom: {
      duration: 12,
    }
  },
  YULON: {
    name: "Yu'lon",
    id: 322118,
    icon: 'ability_monk_dragonkick',
    castTime: 0,
    custom: {
      duration: 12,
    }
  },
  REVIVAL: {
    name: 'Revival',
    id: 115310,
    icon: 'spell_monk_revival',
    castTime: 0
  },
  CRACKLING_JADE_LIGHTNING: {
    name: 'Crackling Jade Lightning',
    id: 117952,
    icon: 'ability_monk_cracklingjadelightning',
    castTime: 3,
    value: {
      damage: 19270
    }
  },
  SPINNING_CRANE_KICK: {
    name: 'Spinning Crane Kick',
    id: 101546,
    icon: 'ability_monk_cranekick_new',
    castTime: 1.5,
    value: {
      damage: 25217
    }
  },
  LIFE_COCON: {
    name: 'Life Cocoon',
    id: 116849,
    icon: 'ability_monk_chicocoon',
    castTime: 0,
    gcd: false
  }
} satisfies Record<string, spell>;

export default spells;
export { spells as MISTWEAVER_SPELLS };
