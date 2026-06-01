import SPELLS from "@data/spells";
import TALENTS from "@data/specs/monk/mistweaver/talents";
import SHARED from "@data/specs/monk/talents";
import spell from "@data/spells/spell";
import { calculateSpellHealing, Player } from "../helpers";

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

export function calculateSheilunsGiftBreakdown(
  player: Player
): SheilunsGiftBreakdownData[] {
  const { stats, talents } = player;

  let sheilunBaseHealing = calculateSpellHealing(SPELLS.SHEILUNS_GIFT, player);
  let sheilunCloudHealing = sheilunBaseHealing * SPELLS.SHEILUNS_GIFT.custom.coeffPerStack;

  const sheilunTargetsHit = talents.get(TALENTS.LEGACY_OF_WISDOM) 
    ? TALENTS.LEGACY_OF_WISDOM.custom.targetsHit 
    : SPELLS.SHEILUNS_GIFT.custom.targetsHit;

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

    const mainSpellpower = (mainHealing / stats.intellect) * 100;
    const cloudsSpellpower = (cloudHealing / stats.intellect) * 100;
    const totalSpellpower = (totalHealing / stats.intellect) * 100;
    
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
