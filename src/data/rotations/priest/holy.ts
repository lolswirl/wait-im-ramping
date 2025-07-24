import spell from '@data/spells/spell';
import SPELLS from '@data/spells/index';

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
