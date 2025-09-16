import TALENTS from "@data/talents/monk/mistweaver";

interface UnityWithinResult {
    sotbo: number;
    fotrc: number;
    cotwt: number;
    total: number;
    spellpower: number;
}

/**
 * calcs unity within spell data
 * @param intellect - intellect of character for spellpower calculation
 * @param targets - number of targets hit for sotbo and fotrc
 * @param unityWithin - whether talents procced via unity within or naturally
 * @returns object with breakdown per talent, total healing, and spellpower
 */
export const calculateUnityWithin = (intellect: number, targets: number, unityWithin: boolean): UnityWithinResult => {
    const maxHP = 1729040; // default max hp with no gear at level 80

    const unityWithinMultiplier = unityWithin ? 2 : 1;

    const sotbo = TALENTS.STRENGTH_OF_THE_BLACK_OX;
    const sotboMaxTargets = sotbo.custom?.targets;
    const sotboTargetsHit = Math.min(targets, sotboMaxTargets);
    const sotboAbsorb = sotboTargetsHit * (sotbo.custom?.absorbPercentage * unityWithinMultiplier * maxHP);

    const fotrc = TALENTS.FLIGHT_OF_THE_RED_CRANE;
    const fotrcMaxTargets = fotrc.custom?.targetsHit;
    const fotrcTargetsHit = Math.min(targets, fotrcMaxTargets);
    const fotrcHeal = fotrc.value.healing * unityWithinMultiplier * fotrcTargetsHit;

    const cotwt = TALENTS.COURAGE_OF_THE_WHITE_TIGER;
    const cotwtHeal = cotwt.value.healing * unityWithinMultiplier;

    const totalHealing = sotboAbsorb + fotrcHeal + cotwtHeal;
    
    const spellpower = (totalHealing / intellect) * 100;

    return {
        sotbo: sotboAbsorb,
        fotrc: fotrcHeal,
        cotwt: cotwtHeal,
        total: totalHealing,
        spellpower
    };
};

export default calculateUnityWithin;