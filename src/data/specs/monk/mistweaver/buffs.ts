import spell, { GCD } from '@data/spells/spell';
import SPELLS from '@data/spells';
import TALENTS from '@data/specs/monk/mistweaver/talents';

export const MISTWEAVER_MONK_BUFFS = (spellList: spell[]): spell[] => {
    let thunderFocusTeaUsed = false;
    let soothingMistUsed = false;
    let insideChiji = false;

    let chijiStacks = 0;
    let totmStacks = 0;

    return spellList.map((spell) => {
        if (spell.id === SPELLS.THUNDER_FOCUS_TEA.id) {
            thunderFocusTeaUsed = true;
        }
        else if (spell.id === SPELLS.SOOTHING_MIST.id) {
            soothingMistUsed = true;
        }
        else if (spell.id === SPELLS.CHI_JI.id) {
            insideChiji = true;
        }
        else if (insideChiji) {
            if (spell.id === SPELLS.ENVELOPING_MIST.id) {
                spell = {
                    ...spell,
                    castTime: GCD,
                };
            };
        }
        else if (thunderFocusTeaUsed) {
            switch (spell.id) {
                case SPELLS.ENVELOPING_MIST.id:
                    spell = { 
                        ...spell, 
                        castTime: GCD 
                    };
                    thunderFocusTeaUsed = false;
                    break;
                case SPELLS.RISING_SUN_KICK.id:
                case SPELLS.RENEWING_MIST.id:
                    spell = { 
                        ...spell, 
                        custom: {
                            duration: 30,
                        }
                    };
                    thunderFocusTeaUsed = false;
                    break;
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
                case SPELLS.SHEILUNS_GIFT.id:
                    spell = {
                        ...spell,
                        castTime: GCD
                    };
                    break;
                case SPELLS.VIVIFY.id:
                case SPELLS.LIFE_COCOON.id:
                    break;
                default:
                    soothingMistUsed = false;
                    break;
            }
        }

        return spell;
    });
};
