import { GCD } from "@data/spells/spell";
import spell from "@data/spells/spell";
import SPELLS from "@data/spells";
import TALENTS from "@data/specs/monk/mistweaver/talents";
import {
  calculateAncientTeachingsHealing,
  calculateWayOfTheCraneHealing,
  calculateSpellDamage,
} from "@data/specs/monk/mistweaver/helpers";

type DamagePoint = { time: number; damage: number };

interface SimulationParams {
  talents: Map<spell, boolean>;
  mastery: number;
}

export const simulateMeleeRotation = (
  totalTime: number,
  targets: number,
  asHealing: boolean,
  params: SimulationParams
): DamagePoint[] => {
  const { talents, mastery } = params;
  
  let currentTime = 0;
  let risingSunKickCooldown = 0;
  let blackoutKickCooldown = 0;
  let totmStacks = 0;
  let cumulativeDamage = 0;
  const rotationDamage: DamagePoint[] = [];

  const risingSunKickDamage = calculateSpellDamage(SPELLS.RISING_SUN_KICK, talents, mastery);
  const tigerPalmDamage = calculateSpellDamage(SPELLS.TIGER_PALM, talents, mastery);
  const blackoutKickDamage = calculateSpellDamage(SPELLS.BLACKOUT_KICK, talents, mastery);

  const risingSunKickValue = asHealing 
    ? calculateAncientTeachingsHealing(risingSunKickDamage, talents, true, SPELLS.RISING_SUN_KICK) 
    : risingSunKickDamage;
  const tigerPalmValue = asHealing 
    ? calculateAncientTeachingsHealing(tigerPalmDamage, talents, true, SPELLS.TIGER_PALM) 
    : tigerPalmDamage;
  const blackoutKickValue = asHealing 
    ? calculateAncientTeachingsHealing(blackoutKickDamage, talents, true, SPELLS.BLACKOUT_KICK) 
    : blackoutKickDamage;

  const cleaveMultiplier = Math.min(targets, 3);

  // initial rotation
  cumulativeDamage += risingSunKickValue;
  rotationDamage.push({ time: currentTime, damage: cumulativeDamage });
  currentTime += GCD;

  for (let i = 1; i <= 2; i++) {
    cumulativeDamage += tigerPalmValue;
    totmStacks += 2;
    rotationDamage.push({ time: currentTime, damage: cumulativeDamage });
    currentTime += GCD;
  }

  if (blackoutKickCooldown <= 0) {
    const bokHits = (1 + totmStacks) * cleaveMultiplier;
    totmStacks = 0;
    let bokResetRsk = false;
    cumulativeDamage += blackoutKickValue * bokHits;

    for (let i = 0; i < bokHits; i++) {
      if (Math.random() < 0.15) bokResetRsk = true;
    }

    rotationDamage.push({ time: currentTime, damage: cumulativeDamage });
    currentTime += GCD;
    blackoutKickCooldown = 1.5;

    if (bokResetRsk) risingSunKickCooldown = 0;
  }

  if (risingSunKickCooldown > 0) risingSunKickCooldown -= 1.5;
  blackoutKickCooldown -= 1.5;

  // loop rotation
  while (currentTime < totalTime) {
    if (risingSunKickCooldown <= 0) {
      cumulativeDamage += risingSunKickValue;
      rotationDamage.push({ time: currentTime, damage: cumulativeDamage });
      currentTime += 1.5;
      risingSunKickCooldown = 12;
    }
    if (currentTime >= totalTime) break;

    for (let i = 1; i <= 2; i++) {
      cumulativeDamage += tigerPalmValue;
      totmStacks += 2;
      rotationDamage.push({ time: currentTime, damage: cumulativeDamage });
      currentTime += GCD;
      if (currentTime >= totalTime) break;
    }
    if (currentTime >= totalTime) break;

    if (blackoutKickCooldown <= 0) {
      const bokHits = (1 + totmStacks) * cleaveMultiplier;
      totmStacks = 0;
      let bokResetRsk = false;
      cumulativeDamage += blackoutKickValue * bokHits;

      for (let i = 0; i < bokHits; i++) {
        if (Math.random() < 0.15) bokResetRsk = true;
      }

      rotationDamage.push({ time: currentTime, damage: cumulativeDamage });
      currentTime += GCD;
      blackoutKickCooldown = 1.5;

      if (bokResetRsk) risingSunKickCooldown = 0;
    }

    if (risingSunKickCooldown > 0) risingSunKickCooldown -= 1.5;
    blackoutKickCooldown -= 1.5;
  }

  return rotationDamage;
};

export const simulateSpinningCraneKick = (
  totalTime: number,
  targets: number,
  asHealing: boolean,
  params: SimulationParams
): DamagePoint[] => {
  const { talents, mastery } = params;
  
  let currentTime = 0;
  let cumulativeDamage = 0;
  const sckDamage: DamagePoint[] = [];

  const sckDamageValue = calculateSpellDamage(SPELLS.SPINNING_CRANE_KICK, talents, mastery);

  while (currentTime < totalTime) {
    let rawDamage =
      targets <= 5
        ? sckDamageValue * targets
        : sckDamageValue * targets * Math.sqrt(5 / targets);
    
    if (asHealing) {
      rawDamage = calculateWayOfTheCraneHealing(rawDamage, talents);
    }
    
    cumulativeDamage += rawDamage;
    sckDamage.push({ time: currentTime, damage: cumulativeDamage });
    currentTime += 1.5;
  }

  return sckDamage;
};

export const simulateJadeEmpowerment = (
  totalTime: number,
  targets: number,
  asHealing: boolean,
  params: SimulationParams
): DamagePoint[] => {
  const { talents, mastery } = params;
  
  const jadeEmpowerment = TALENTS.JADE_EMPOWERMENT;
  const jadeEmpowermentIncrease = jadeEmpowerment.custom.spellpowerIncrease;
  const jadeEmpowermentChain = jadeEmpowerment.custom.chainVal;
  const cjl = SPELLS.CRACKLING_JADE_LIGHTNING;
  
  let currentTime = 0;
  let cumulativeDamage = 0;
  const jadeEmpowermentData: DamagePoint[] = [];

  const channelDuration = cjl.castTime;
  const tickInterval = 1.5;
  const ticksPerChannel = channelDuration / tickInterval;

  const baseCJLDamage = calculateSpellDamage(cjl, talents, mastery);

  while (currentTime < totalTime) {
    for (let tick = 0; tick < ticksPerChannel && currentTime < totalTime; tick++) {
      const effectiveTargets = Math.min(targets, 5);
      
      const baseDamageWithIncrease = baseCJLDamage * (1 + jadeEmpowermentIncrease / 100);
      
      let totalDamage = baseDamageWithIncrease;
      if (effectiveTargets > 1) {
        totalDamage += baseDamageWithIncrease * jadeEmpowermentChain * (effectiveTargets - 1);
      }
      
      let damagePerTick = totalDamage / ticksPerChannel;
      
      if (asHealing) {
        damagePerTick = calculateAncientTeachingsHealing(damagePerTick, talents, true, cjl);
      }
      
      cumulativeDamage += damagePerTick;
      jadeEmpowermentData.push({ time: currentTime, damage: cumulativeDamage });
      currentTime += tickInterval;
    }
  }

  return jadeEmpowermentData;
};

export const simulateRSKWithSCK = (
  totalTime: number,
  targets: number,
  asHealing: boolean,
  params: SimulationParams
): DamagePoint[] => {
  const { talents, mastery } = params;
  
  let currentTime = 0;
  let risingSunKickCooldown = 0;
  let cumulativeDamage = 0;
  const rskSckData: DamagePoint[] = [];

  const risingSunKickDamage = calculateSpellDamage(SPELLS.RISING_SUN_KICK, talents, mastery);
  const sckDamageValue = calculateSpellDamage(SPELLS.SPINNING_CRANE_KICK, talents, mastery);

  const risingSunKickValue = asHealing 
    ? calculateAncientTeachingsHealing(risingSunKickDamage, talents, true, SPELLS.RISING_SUN_KICK) 
    : risingSunKickDamage;

  while (currentTime < totalTime) {
    if (risingSunKickCooldown <= 0) {
      cumulativeDamage += risingSunKickValue;
      rskSckData.push({ time: currentTime, damage: cumulativeDamage });
      currentTime += 1.5;
      risingSunKickCooldown = 12;
    } else {
      let rawDamage =
        targets <= 5
          ? sckDamageValue * targets
          : sckDamageValue * targets * Math.sqrt(5 / targets);
      
      if (asHealing) {
        rawDamage = calculateWayOfTheCraneHealing(rawDamage, talents);
      }
      
      cumulativeDamage += rawDamage;
      rskSckData.push({ time: currentTime, damage: cumulativeDamage });
      currentTime += 1.5;
      risingSunKickCooldown -= 1.5;
    }
  }

  return rskSckData;
};
