import { attachGetters } from '@data/shared/attachGetters';
import { specialization } from '@data/class';
import PRESERVATION_EVOKER_SPELLS from '@data/specs/evoker/preservation/spells';
import PRESERVATION_EVOKER_ROTATIONS from '@data/specs/evoker/preservation/rotations';

const PRESERVATION_EVOKER = attachGetters({
  spells: PRESERVATION_EVOKER_SPELLS,
  icon: 'classicon_evoker_preservation',
  name: 'Preservation',
  class: 'Evoker',
  color: "#175a2e",
  rotations: PRESERVATION_EVOKER_ROTATIONS,
} satisfies specialization);

export default PRESERVATION_EVOKER;