import { attachGetters } from '@data/class/attachGetters';
import { specialization } from '@data/class/class';
import RESTORATION_DRUID_SPELLS from '@data/spells/druid/restoration';
import RESTORATION_DRUID_ROTATIONS from '@data/rotations/druid/restoration';

const RESTORATION_DRUID = attachGetters({
  spells: RESTORATION_DRUID_SPELLS,
  rotations: RESTORATION_DRUID_ROTATIONS,
  icon: 'spell_nature_healingtouch',
  name: 'Restoration',
  class: 'Druid',
  color: '#29ab30',
} satisfies specialization);

export default RESTORATION_DRUID;