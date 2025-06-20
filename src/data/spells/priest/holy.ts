import spell from '../spell.ts';

const spells = {
  HOLY_WORD_CHASTISE: {
    name: 'Holy Word: Chastise',
    id: 88625,
    icon: 'spell_holy_chastise',
  },
  GUARDIAN_SPIRIT: {
    name: 'Guardian Spirit',
    id: 47788,
    icon: 'spell_holy_guardianspirit',
  },
  FLASH_HEAL: {
    name: 'Flash Heal',
    id: 2061,
    icon: 'spell_holy_flashheal',
  },
  PRAYER_OF_HEALING: {
    name: 'Prayer of Healing',
    id: 596,
    icon: 'spell_holy_prayerofhealing02',
  },
  RENEW: {
    name: 'Renew',
    id: 139,
    icon: 'spell_holy_renew',
  },
  HOLY_NOVA: {
    name: 'Holy Nova',
    id: 132157,
    icon: 'spell_holy_holynova',
  },
} satisfies Record<string, spell>;

export default spells;
export { spells as HOLY_PRIEST_SPELLS };
