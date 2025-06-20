import HOLY_PRIEST_SPELLS from '../../spells/priest/holy.ts';
import HOLY_PRIEST_ROTATIONS from '../../rotations/priest/holy.ts';
import { attachGetters } from '../attachGetters.ts';
import { specialization } from '../class.ts';

const HOLY_PRIEST = attachGetters({
  spells: HOLY_PRIEST_SPELLS,
  rotations: HOLY_PRIEST_ROTATIONS,
  icon: 'spell_holy_guardianspirit',
  name: 'Holy',
  class: 'Priest',
  color: '#668ea7',
} satisfies specialization);

export default HOLY_PRIEST;