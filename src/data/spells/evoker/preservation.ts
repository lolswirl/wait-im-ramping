import spell from '@data/spells/spell';

const spells = {
  TEMPORAL_ANOMALY: {
    name: 'Temporal Anomaly',
    id: 374169,
    icon: 'ability_evoker_temporalanomaly',
    castTime: 1.5,
  },
  ECHO: {
    name: 'Echo',
    id: 374154,
    icon: 'ability_evoker_echo',
    castTime: 0,
  },
  VERDANT_EMBRACE: {
    name: 'Verdant Embrace',
    id: 360995,
    icon: 'ability_evoker_rescue',
    castTime: 0,
  },
  DREAM_BREATH: {
    name: 'Dream Breath',
    id: 355936,
    icon: 'ability_evoker_dreambreath',
    castTime: 2.5,
    empowerLevel: 5,
  },
  SPIRITBLOOM: {
    name: 'Spiritbloom',
    id: 367226,
    icon: 'ability_evoker_spiritbloom2',
    castTime: 2.5,
    empowerLevel: 5,
  },
  EMERALD_BLOSSOM: {
    name: 'Emerald Blossom',
    id: 355913,
    icon: 'ability_evoker_emeraldblossom',
    castTime: 0,
  },
  REVERSION: {
    name: 'Reversion',
    id: 374155,
    icon: 'ability_evoker_reversion',
    castTime: 0,
  },
  STASIS: {
    name: 'Stasis',
    id: 370537,
    icon: 'ability_evoker_stasis',
    castTime: 0,
  },
  EMERALD_COMMUNION: {
    name: 'Emerald Communion',
    id: 370984,
    icon: 'ability_evoker_green_01',
    castTime: 5,
  },
  ENGULF: {
    name: 'Engulf',
    id: 443328,
    icon: 'inv_ability_flameshaperevoker_engulf',
    castTime: 0,
  },
} satisfies Record<string, spell>;

export default spells;
export { spells as PRESERVATION_EVOKER_SPELLS };
