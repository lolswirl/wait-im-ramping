import RESTORATION_SHAMAN_SPELLS from '../../spells/shaman/restoration.ts';
import RESTORATION_SHAMAN_ROTATIONS from '../../rotations/shaman/restoration.ts';
import { attachGetters } from '../attachGetters.ts';
import { specialization } from '../class.ts';

const RESTORATION_SHAMAN = attachGetters({
  spells: RESTORATION_SHAMAN_SPELLS,
  rotations: RESTORATION_SHAMAN_ROTATIONS,
  icon: 'spell_nature_magicimmunity',
  name: 'Restoration',
  class: 'Shaman',
  color: "#7cb63c",
} satisfies specialization);

export default RESTORATION_SHAMAN;