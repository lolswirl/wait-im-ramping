import { attachGetters } from '@data/shared/attachGetters';
import { specialization } from '@data/class';
import MISTWEAVER_MONK_SPELLS from '@data/specs/monk/mistweaver/spells';
import MISTWEAVER_MONK_TALENTS from '@data/specs/monk/mistweaver/talents';
import MISTWEAVER_MONK_ROTATIONS from '@data/specs/monk/mistweaver/rotations';
import { MISTWEAVER_MONK_BUFFS } from '@data/specs/monk/mistweaver/buffs';
import MISTWEAVER_MONK_BUGS from '@data/specs/monk/mistweaver/bugs';
import MONK_BUGS from '@data/specs/monk/bugs';
import MISTWEAVER_DEFAULT_TALENTS from '@data/specs/monk/mistweaver/defaultTalents';

const MISTWEAVER_MONK = attachGetters({
  key: "monk_mistweaver",
  spells: MISTWEAVER_MONK_SPELLS,
  talents: MISTWEAVER_MONK_TALENTS,
  rotations: MISTWEAVER_MONK_ROTATIONS,
  buffs: MISTWEAVER_MONK_BUFFS,
  bugs: MONK_BUGS.concat(MISTWEAVER_MONK_BUGS),
  icon: 'spell_monk_mistweaver_spec',
  name: 'Mistweaver',
  class: 'Monk',
  color: '#4ea55c',
  masteryCoefficient: 13.86,
  defaultTalents: MISTWEAVER_DEFAULT_TALENTS,
  stats: {
    intellect: 620,
    mastery: 13.86 * 8, // 110.88%
    crit: 0,
    versatility: 0,
    haste: 0,
  },
} satisfies specialization )

export default MISTWEAVER_MONK;
