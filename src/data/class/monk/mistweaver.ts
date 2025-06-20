import MISTWEAVER_MONK_SPELLS from '../../spells/monk/mistweaver.ts';
import MISTWEAVER_MONK_TALENTS from '../../talents/monk/mistweaver.ts';
import MISTWEAVER_MONK_ROTATIONS from '../../rotations/monk/mistweaver.ts';
import { MISTWEAVER_MONK_BUFFS } from '../../buffs/monk/mistweaver.ts';
import { attachGetters } from '../attachGetters.ts';
import { specialization } from '../class.ts';

const MISTWEAVER_MONK = attachGetters({
  spells: MISTWEAVER_MONK_SPELLS,
  talents: MISTWEAVER_MONK_TALENTS,
  rotations: MISTWEAVER_MONK_ROTATIONS,
  buffs: MISTWEAVER_MONK_BUFFS,
  icon: 'spell_monk_mistweaver_spec',
  name: 'Mistweaver',
  class: 'Monk',
  color: '#4ea55c',
  intellect: 17647,
} satisfies specialization )

export default MISTWEAVER_MONK;
