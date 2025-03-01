import { spell } from '../../../../spell.ts';

export const applyBuffs = (spellList: spell[]): spell[] => {
  let thunderFocusTeaUsed = false;
  let soothingMistUsed = false;

  return spellList.map((spell) => {
    if (spell.id === 116680) { // Thunder Focus Tea
      thunderFocusTeaUsed = true;
    }
    else if (spell.id === 115175) { // Soothing Mist
      soothingMistUsed = true;
    }
    else if (thunderFocusTeaUsed) {
      switch (spell.id) {
        case 124682: // Enveloping Mist
          spell = { ...spell, castTime: 0 };
          thunderFocusTeaUsed = false;
          break;
        case 107428: // Rising Sun Kick
        case 119611: // Renewing Mist
        case 116670: // Vivify
          thunderFocusTeaUsed = false;
          break;
        default:
          break;
      }
    }
    else if (soothingMistUsed) {
      switch (spell.id) {
        case 124682: // Enveloping Mist
          spell = { ...spell, castTime: 0 };
          break;
        case 116670: // Vivify (No change)
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
