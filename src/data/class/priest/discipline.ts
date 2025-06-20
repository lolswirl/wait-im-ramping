import DISCIPLINE_PRIEST_SPELLS from '../../spells/priest/discipline.ts';
import DISCIPLINE_PRIEST_ROTATIONS from '../../rotations/priest/discipline.ts';
import { attachGetters } from '../attachGetters.ts';
import { specialization } from '../class.ts';

const DISCIPLINE_PRIEST = attachGetters({
  spells: DISCIPLINE_PRIEST_SPELLS,
  rotations: DISCIPLINE_PRIEST_ROTATIONS,
  icon: 'spell_holy_powerwordshield',
  name: 'Discipline',
  class: 'Priest',
  color: '#e1cbd2',
} satisfies specialization);

export default DISCIPLINE_PRIEST;
