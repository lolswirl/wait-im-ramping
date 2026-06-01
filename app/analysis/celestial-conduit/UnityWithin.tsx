import TALENTS from "@data/specs/monk/mistweaver/talents";

interface UnityWithinResult {
    sotbo: number;
    cotwt: number;
    fotrc: number;
    total: number;
    spellpower: number;
}

export const calculateUnityWithin = (targets: number, unityWithin: boolean): UnityWithinResult => {
    const unityWithinMultiplier = unityWithin ? 2 : 1;

    const sotbo = TALENTS.STRENGTH_OF_THE_BLACK_OX;
    const sotboTargetsHit = Math.min(targets, sotbo.custom?.targetsHit);
    const sotboAbsorb = (sotboTargetsHit - 1) * (sotbo.coeff * unityWithinMultiplier)
        + 1 * (sotbo.coeff * unityWithinMultiplier * TALENTS.STAMPEDE_OF_THE_ANCIENTS.custom.mainTargetIncrease);

    const cotwt = TALENTS.COURAGE_OF_THE_WHITE_TIGER;
    const cotwtHeal = cotwt.coeff.healing * unityWithinMultiplier;

    const fotrc = TALENTS.FLIGHT_OF_THE_RED_CRANE;
    const fotrcTargetsHit = Math.min(targets, fotrc.custom?.targetsHit);
    const fotrcHeal = fotrc.coeff * fotrcTargetsHit; // unity multi already incorporated into coeff

    const totalSpCoeff = sotboAbsorb + cotwtHeal + fotrcHeal;

    return {
        sotbo: sotboAbsorb,
        cotwt: cotwtHeal,
        fotrc: fotrcHeal,
        total: totalSpCoeff,
        spellpower: totalSpCoeff,
    };
};

export default calculateUnityWithin;