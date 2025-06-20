import spell from "../../spells/spell";
import SPELLS from "../../spells/index.ts";

const rotations = {
  RIPTIDE: [
    SPELLS.RIPTIDE,
    SPELLS.RIPTIDE,
    SPELLS.RIPTIDE,
    SPELLS.UNLEASH_LIFE,
    SPELLS.CHAIN_HEAL
  ]
} satisfies Record<string, spell[]>;

export default rotations;
