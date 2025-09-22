import { attachGetters } from '@data/shared/attachGetters';
import { specialization } from '@data/class';
import HOLY_PRIEST_SPELLS from '@data/specs/priest/holy/spells';
import HOLY_PRIEST_ROTATIONS from '@data/specs/priest/holy/rotations';

const HOLY_PRIEST = attachGetters({
  key: "priest_holy",
  spells: HOLY_PRIEST_SPELLS,
  rotations: HOLY_PRIEST_ROTATIONS,
  icon: 'spell_holy_guardianspirit',
  name: 'Holy',
  class: 'Priest',
  color: '#668ea7',
} satisfies specialization);

export default HOLY_PRIEST;