import spell from '@data/spells/spell';
import SPELLS from '@data/spells';

const rotations = {
  FLOURISH_RAMP: [
    SPELLS.SWIFTMEND,
    SPELLS.GROVE_GUARDIAN,
    SPELLS.WILD_GROWTH,
    SPELLS.GROVE_GUARDIAN,
    SPELLS.FLOURISH,
    SPELLS.GROVE_GUARDIAN,
    SPELLS.REGROWTH,
    SPELLS.REGROWTH,
    SPELLS.REGROWTH
  ]
} satisfies Record<string, spell[]>;

export default rotations;
