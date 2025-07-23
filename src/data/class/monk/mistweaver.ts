import { attachGetters } from '../attachGetters.ts';
import { specialization } from '../class.ts';
import MISTWEAVER_MONK_SPELLS from '@data/spells/monk/mistweaver';
import MISTWEAVER_MONK_TALENTS from '@data/talents/monk/mistweaver';
import MISTWEAVER_MONK_ROTATIONS from '@data/rotations/monk/mistweaver';
import { MISTWEAVER_MONK_BUFFS } from '@data/buffs/monk/mistweaver';
import MISTWEAVER_MONK_BUGS from '@data/bugs/monk/mistweaver';

const MISTWEAVER_MONK = attachGetters({
  spells: MISTWEAVER_MONK_SPELLS,
  talents: MISTWEAVER_MONK_TALENTS,
  rotations: MISTWEAVER_MONK_ROTATIONS,
  buffs: MISTWEAVER_MONK_BUFFS,
  bugs: MISTWEAVER_MONK_BUGS,
  icon: 'spell_monk_mistweaver_spec',
  name: 'Mistweaver',
  class: 'Monk',
  color: '#4ea55c',
  intellect: 17647,
  mastery: 55.44,
} satisfies specialization )

export default MISTWEAVER_MONK;
