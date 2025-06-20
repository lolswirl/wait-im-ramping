import spell, { GCD } from '../../spells/spell.ts';
import SPELLS from '../../spells/index.ts';

export const MISTWEAVER_MONK_BUFFS = (spellList: spell[]): spell[] => {
  let thunderFocusTeaUsed = false;
  let soothingMistUsed = false;

  return spellList.map((spell) => {
    if (spell.id === SPELLS.THUNDER_FOCUS_TEA.id) {
      thunderFocusTeaUsed = true;
    }
    else if (spell.id === SPELLS.SOOTHING_MIST.id) {
      soothingMistUsed = true;
    }
    else if (thunderFocusTeaUsed) {
      switch (spell.id) {
        case SPELLS.ENVELOPING_MIST.id:
          spell = { ...spell, castTime: GCD };
          thunderFocusTeaUsed = false;
          break;
        case SPELLS.RISING_SUN_KICK.id:
        case SPELLS.RENEWING_MIST.id:
        case SPELLS.VIVIFY.id:
          thunderFocusTeaUsed = false;
          break;
        default:
          break;
      }
    }
    else if (soothingMistUsed) {
      switch (spell.id) {
        case SPELLS.ENVELOPING_MIST.id:
          spell = { ...spell, castTime: GCD };
          break;
        case SPELLS.VIVIFY.id:
          thunderFocusTeaUsed = false;
          break;
        default:
          soothingMistUsed = false;
          break;
      }
    }

    return spell;
  });
};
