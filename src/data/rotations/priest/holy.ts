import spell from "../../spells/spell";
import SPELLS from "../../spells/index.ts";

const rotations = {
  RENEW: [
    SPELLS.RENEW,
    SPELLS.RENEW,
    SPELLS.RENEW,
    SPELLS.RENEW,
    SPELLS.RENEW,
    SPELLS.RENEW
  ]
} satisfies Record<string, spell[]>;

export default rotations;
