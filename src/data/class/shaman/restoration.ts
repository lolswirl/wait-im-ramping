import RESTORATION_SHAMAN_SPELLS from '@data/spells/shaman/restoration';
import RESTORATION_SHAMAN_ROTATIONS from '@data/rotations/shaman/restoration';
import { attachGetters } from '../attachGetters';
import { specialization } from '../class';

const RESTORATION_SHAMAN = attachGetters({
  spells: RESTORATION_SHAMAN_SPELLS,
  rotations: RESTORATION_SHAMAN_ROTATIONS,
  icon: 'spell_nature_magicimmunity',
  name: 'Restoration',
  class: 'Shaman',
  color: "#7cb63c",
} satisfies specialization);

export default RESTORATION_SHAMAN;