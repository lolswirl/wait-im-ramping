import PRESERVATION_EVOKER_SPELLS from '@data/spells/evoker/preservation';
import PRESERVATION_EVOKER_ROTATIONS from '@data/rotations/evoker/preservation';
import { attachGetters } from '../attachGetters';
import { specialization } from '../class';

const PRESERVATION_EVOKER = attachGetters({
  spells: PRESERVATION_EVOKER_SPELLS,
  icon: 'classicon_evoker_preservation',
  name: 'Preservation',
  class: 'Evoker',
  color: "#175a2e",
  rotations: PRESERVATION_EVOKER_ROTATIONS,
} satisfies specialization);

export default PRESERVATION_EVOKER;