import HOLY_PALADIN_SPELLS from '../../spells/paladin/holy.ts';
import HOLY_PALADIN_ROTATIONS from '../../rotations/paladin/holy.ts';
import { attachGetters } from '../attachGetters.ts';
import { specialization } from '../class.ts';

const HOLY_PALADIN = attachGetters({
  spells: HOLY_PALADIN_SPELLS,
  icon: 'spell_holy_holybolt',
  name: 'Holy',
  class: 'Paladin',
  color: "ffe38e",
  rotations: HOLY_PALADIN_ROTATIONS,
} satisfies specialization);

export default HOLY_PALADIN;