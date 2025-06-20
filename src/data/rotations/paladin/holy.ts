import spell from "../../spells/spell";
import SPELLS from "../../spells/index.ts";

const rotations = {
  DIVINE_TOLL_RISING_SUNLIGHT: [
    SPELLS.BEACON_OF_VIRTUE,
    SPELLS.DIVINE_TOLL,
    SPELLS.ETERNAL_FLAME,
    SPELLS.HOLY_SHOCK,
    SPELLS.ETERNAL_FLAME,
    SPELLS.HOLY_SHOCK,
    SPELLS.ETERNAL_FLAME,
  ]
} satisfies Record<string, spell[]>;

export default rotations;
