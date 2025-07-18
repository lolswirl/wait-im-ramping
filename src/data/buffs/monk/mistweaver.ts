import spell, { GCD } from '../../spells/spell.ts';
import SPELLS from '../../spells/index.ts';
import TALENTS from '../../talents/monk/mistweaver.ts';

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
            switch (spell.id) {
                case SPELLS.TIGER_PALM.id:
                    const stacksGained = 2;
                    totmStacks = Math.min(totmStacks + stacksGained, TALENTS.TEACHINGS_OF_THE_MONASTERY.custom.maxStacks);
                    break;
                case SPELLS.BLACKOUT_KICK.id:
                    const bokHits = 1 + totmStacks;
                    totmStacks = 0;
                    chijiStacks = Math.min(chijiStacks + bokHits, SPELLS.CHI_JI.custom.maxStacks);
                    break;
                case SPELLS.RISING_SUN_KICK.id:
                case SPELLS.SPINNING_CRANE_KICK.id:
                    chijiStacks = Math.min(chijiStacks + 1, SPELLS.CHI_JI.custom.maxStacks);
                    break;
                case SPELLS.ENVELOPING_MIST.id:
                    const reductionPerStack = SPELLS.CHI_JI.custom.reductionPerStack;
                    const totalReduction = chijiStacks * reductionPerStack;
                    const newCastTime = totalReduction >= 0.99 ? 0 : spell.castTime ? spell.castTime * (1 - totalReduction) : 0;
                    spell = { 
                        ...spell,
                        castTime: newCastTime
                    };
                    break;
            }
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
                    spell = {
                        ...spell,
                        castTime: GCD
                    };
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
