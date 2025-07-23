import { attachGetters } from '@data/class/attachGetters';
import { specialization } from '@data/class/class';
import HOLY_PALADIN_SPELLS from '@data/spells/paladin/holy';
import HOLY_PALADIN_ROTATIONS from '@data/rotations/paladin/holy';

const HOLY_PALADIN = attachGetters({
  spells: HOLY_PALADIN_SPELLS,
  icon: 'spell_holy_holybolt',
  name: 'Holy',
  class: 'Paladin',
  color: "ffe38e",
  rotations: HOLY_PALADIN_ROTATIONS,
} satisfies specialization);

export default HOLY_PALADIN;