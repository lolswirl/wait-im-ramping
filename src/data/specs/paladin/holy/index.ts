import { attachGetters } from '@data/shared/attachGetters';
import { specialization } from '@data/class';
import HOLY_PALADIN_SPELLS from '@data/specs/paladin/holy/spells';
import HOLY_PALADIN_ROTATIONS from '@data/specs/paladin/holy/rotations';
import HOLY_PALADIN_BUGS from '@data/specs/paladin/holy/bugs';

const HOLY_PALADIN = attachGetters({
  spells: HOLY_PALADIN_SPELLS,
  icon: 'spell_holy_holybolt',
  name: 'Holy',
  class: 'Paladin',
  color: "ffe38e",
  rotations: HOLY_PALADIN_ROTATIONS,
  bugs: HOLY_PALADIN_BUGS,
} satisfies specialization);

export default HOLY_PALADIN;