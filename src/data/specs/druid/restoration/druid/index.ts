import { attachGetters } from '@data/shared/attachGetters';
import { specialization } from '@data/class';
import RESTORATION_DRUID_SPELLS from '@data/specs/druid/restoration/druid/spells';
import RESTORATION_DRUID_ROTATIONS from '@data/specs/druid/restoration/druid/rotations';

const RESTORATION_DRUID = attachGetters({
  key: "druid_restoration",
  spells: RESTORATION_DRUID_SPELLS,
  rotations: RESTORATION_DRUID_ROTATIONS,
  icon: 'spell_nature_healingtouch',
  name: 'Restoration',
  class: 'Druid',
  color: '#29ab30',
} satisfies specialization);

export default RESTORATION_DRUID;