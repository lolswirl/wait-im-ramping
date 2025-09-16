import { attachGetters } from '@data/shared/attachGetters';
import { specialization } from '@data/class';
import DISCIPLINE_PRIEST_SPELLS from '@data/specs/priest/discipline/spells';
import DISCIPLINE_PRIEST_ROTATIONS from '@data/specs/priest/discipline/rotations';

const DISCIPLINE_PRIEST = attachGetters({
  spells: DISCIPLINE_PRIEST_SPELLS,
  rotations: DISCIPLINE_PRIEST_ROTATIONS,
  icon: 'spell_holy_powerwordshield',
  name: 'Discipline',
  class: 'Priest',
  color: '#e1cbd2',
} satisfies specialization);

export default DISCIPLINE_PRIEST;
