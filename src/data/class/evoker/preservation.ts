import PRESERVATION_EVOKER_SPELLS from '../../spells/evoker/preservation.ts';
import PRESERVATION_EVOKER_ROTATIONS from '../../rotations/evoker/preservation.ts';
import { attachGetters } from '../attachGetters.ts';
import { specialization } from '../class.ts';

const PRESERVATION_EVOKER = attachGetters({
  spells: PRESERVATION_EVOKER_SPELLS,
  icon: 'classicon_evoker_preservation',
  name: 'Preservation',
  class: 'Evoker',
  color: "#175a2e",
  rotations: PRESERVATION_EVOKER_ROTATIONS,
} satisfies specialization);

export default PRESERVATION_EVOKER;