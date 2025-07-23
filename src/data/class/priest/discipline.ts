import DISCIPLINE_PRIEST_SPELLS from '@data/spells/priest/discipline';
import DISCIPLINE_PRIEST_ROTATIONS from '@data/rotations/priest/discipline';
import { attachGetters } from '../attachGetters';
import { specialization } from '../class';

const DISCIPLINE_PRIEST = attachGetters({
  spells: DISCIPLINE_PRIEST_SPELLS,
  rotations: DISCIPLINE_PRIEST_ROTATIONS,
  icon: 'spell_holy_powerwordshield',
  name: 'Discipline',
  class: 'Priest',
  color: '#e1cbd2',
} satisfies specialization);

export default DISCIPLINE_PRIEST;
