import { attachGetters } from '@data/shared/attachGetters';
import { specialization } from '@data/class';
import HOLY_PALADIN_SPELLS from '@data/specs/paladin/holy/spells';
import HOLY_PALADIN_ROTATIONS from '@data/specs/paladin/holy/rotations';

const HOLY_PALADIN = attachGetters({
  spells: HOLY_PALADIN_SPELLS,
  icon: 'spell_holy_holybolt',
  name: 'Holy',
  class: 'Paladin',
  color: "ffe38e",
  rotations: HOLY_PALADIN_ROTATIONS,
} satisfies specialization);

export default HOLY_PALADIN;