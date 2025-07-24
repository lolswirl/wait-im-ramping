import { attachGetters } from '@data/class/attachGetters';
import { specialization } from '@data/class/class';
import HOLY_PRIEST_SPELLS from '@data/spells/priest/holy';
import HOLY_PRIEST_ROTATIONS from '@data/rotations/priest/holy';

const HOLY_PRIEST = attachGetters({
  spells: HOLY_PRIEST_SPELLS,
  rotations: HOLY_PRIEST_ROTATIONS,
  icon: 'spell_holy_guardianspirit',
  name: 'Holy',
  class: 'Priest',
  color: '#668ea7',
} satisfies specialization);

export default HOLY_PRIEST;