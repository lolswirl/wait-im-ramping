import SPELLS from "@data/spells";
import TALENTS from "@data/specs/monk/mistweaver/talents";
import SHARED from "@data/specs/monk/talents";
import spell from "@data/spells/spell";

export interface SheilunsGiftBreakdownData {
  cloudCount: number;
  mainPercent: number;
  cloudsPercent: number;
  basePercent: number;
  mainSpellpower: number;
  cloudsSpellpower: number;
  totalSpellpower: number;
  mainHealing: number;
  cloudHealing: number;
  totalHealing: number;
}

export interface SheilunsGiftCalcParams {
  intellect: number;
  talents: Map<spell, boolean>;
}


export function calculateSheilunsGiftBreakdown(
  params: SheilunsGiftCalcParams
): SheilunsGiftBreakdownData[] {
  const { intellect, talents } = params;
  
  let sheilunBaseHealing = SPELLS.SHEILUNS_GIFT.value.healing;
  let sheilunCloudHealing = SPELLS.SHEILUNS_GIFT.custom.healingPerStack;
  const sheilunTargetsHit = talents.get(TALENTS.LEGACY_OF_WISDOM) 
    ? TALENTS.LEGACY_OF_WISDOM.custom.targetsHit 
    : SPELLS.SHEILUNS_GIFT.custom.targetsHit;
  
  // multipliers!!!
  for (let talent of [TALENTS.TEAR_OF_MORNING, TALENTS.WAY_OF_THE_SERPENT]) {
    if (talents.get(talent)) {
      sheilunBaseHealing *= 1 + talent.custom.sheilunsGiftIncrease;
      sheilunCloudHealing *= 1 + talent.custom.sheilunsGiftIncrease;
    }
  }

  if (talents.get(SHARED.CHI_PROFICIENCY)) {
    sheilunBaseHealing *= 1 + SHARED.CHI_PROFICIENCY.custom.healingDoneIncrease;
    sheilunCloudHealing *= 1 + SHARED.CHI_PROFICIENCY.custom.healingDoneIncrease;
  }

  const sheilunMainMultiplier = 1 + (talents.get(TALENTS.INVIGORATING_MISTS) 
  ? TALENTS.INVIGORATING_MISTS.custom.sheilunsMainTargetIncrease
  : 0);
  
  const maxClouds = SPELLS.SHEILUNS_GIFT.custom.maxStacks;
  const cloudCounts = Array.from({ length: maxClouds + 1 }, (_, i) => i);
  
  return cloudCounts.map(cloudCount => {
    const mainBaseHealing = sheilunMainMultiplier * sheilunBaseHealing;
    const otherBaseHealing = sheilunBaseHealing * (sheilunTargetsHit - 1);
    const totalBaseHealing = mainBaseHealing + otherBaseHealing;
    
    const mainCloudHealing = sheilunMainMultiplier * (cloudCount * sheilunCloudHealing);
    const otherCloudHealing = (cloudCount * sheilunCloudHealing) * (sheilunTargetsHit - 1);
    const totalCloudHealing = mainCloudHealing + otherCloudHealing;
    
    const mainHealing = mainBaseHealing + mainCloudHealing;
    const cloudHealing = otherBaseHealing + otherCloudHealing;
    
    const totalHealing = totalBaseHealing + totalCloudHealing;
    
    const basePercent = (totalBaseHealing / totalHealing) * 100;
    const cloudsPercent = (totalCloudHealing / totalHealing) * 100;
    
    const mainPercent = (mainHealing / totalHealing) * 100;
    const othersPercent = (cloudHealing / totalHealing) * 100;
    
    const mainSpellpower = (mainHealing / intellect) * 100;
    const cloudsSpellpower = (cloudHealing / intellect) * 100;
    const totalSpellpower = (totalHealing / intellect) * 100;
    
    return {
      cloudCount,
      mainPercent,
      cloudsPercent,
      basePercent,
      mainSpellpower,
      cloudsSpellpower,
      totalSpellpower,
      mainHealing,
      cloudHealing,
      totalHealing
    };
  });
}
