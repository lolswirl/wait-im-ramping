import RESTORATION_DRUID_SPELLS from '../../spells/druid/restoration.ts';
import RESTORATION_DRUID_ROTATIONS from '../../rotations/druid/restoration.ts';
import { attachGetters } from '../attachGetters.ts';
import { specialization } from '../class.ts';

const RESTORATION_DRUID = attachGetters({
  spells: RESTORATION_DRUID_SPELLS,
  rotations: RESTORATION_DRUID_ROTATIONS,
  icon: 'spell_nature_healingtouch',
  name: 'Restoration',
  class: 'Druid',
  color: '#29ab30',
} satisfies specialization);

export default RESTORATION_DRUID;