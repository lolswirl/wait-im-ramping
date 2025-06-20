import spell from "../../spells/spell";
import SPELLS from "../../spells/index.ts";

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
