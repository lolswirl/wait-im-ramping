import { GCD } from "@data/spells/spell";
import spell from "@data/spells/spell";
import SPELLS from "@data/spells";
import TALENTS from "@data/specs/monk/mistweaver/talents";
import {
  calculateAncientTeachingsHealing,
  calculateAncientTeachingsData,
  calculateWayOfTheCraneHealing,
  calculateSpellDamage,
  calculateSpellHealing,
} from "@data/specs/monk/mistweaver/helpers";
import { type Stats } from "@data/shared/stats";

type DamagePoint = { time: number; damage: number };
type SimState = Record<string, number>;

interface RotationAction {
  priority: number;
  cooldown: number;
  castTime?: number;
  getValue: (state: SimState) => number;
  canCast?: (state: SimState) => boolean;
  onCast?: (state: SimState, cooldowns: number[]) => void;
}

interface SimulationParams {
  talents: Map<spell, boolean>;
  stats: Stats;
}

const runRotation = (
  actions: RotationAction[],
  totalTime: number,
  initialState: SimState = {}
): DamagePoint[] => {
  const cooldowns = actions.map(() => 0);
  const state = { ...initialState };
  const sorted = [...actions.keys()].sort((a, b) => actions[a].priority - actions[b].priority);
  let currentTime = 0;
  let cumulativeDamage = 0;
  const result: DamagePoint[] = [];

  while (currentTime < totalTime) {
    for (const i of sorted) {
      if (cooldowns[i] > 0) continue;
      if (actions[i].canCast && !actions[i].canCast!(state)) continue;

      cumulativeDamage += actions[i].getValue(state);
      result.push({ time: currentTime, damage: cumulativeDamage });
      actions[i].onCast?.(state, cooldowns);

      const castTime = actions[i].castTime ?? GCD;
      cooldowns[i] = actions[i].cooldown;
      currentTime += castTime;
      for (let j = 0; j < cooldowns.length; j++) {
        cooldowns[j] = Math.max(0, cooldowns[j] - castTime);
      }
      break;
    }
  }

  return result;
};

const resolveRskValue = (
  targets: number,
  asHealing: boolean,
  talents: Map<spell, boolean>,
  stats: Stats
): number => {
  if (talents.get(TALENTS.RUSHING_WIND_KICK) === true) {
    const rwk = TALENTS.RUSHING_WIND_KICK;
    const rwkBaseDamage = calculateSpellDamage(rwk, talents, stats);
    const rwkDamage = rwkBaseDamage * (1 + rwk.custom.damageIncrease * Math.min(targets, rwk.custom.maxDamageTargets));
    if (asHealing) {
      const atHealing = calculateAncientTeachingsHealing(rwkDamage, talents, false, rwk);
      // assuming 4.5 rems on avg for efficiency
      const directHealing = calculateSpellHealing(rwk, talents, stats) * rwk.custom.maxHealingTargets * 0.9;
      return atHealing + directHealing;
    }
    return rwkDamage;
  }
  const rskDamage = calculateSpellDamage(SPELLS.RISING_SUN_KICK, talents, stats);
  return asHealing
    ? calculateAncientTeachingsHealing(rskDamage, talents, true, SPELLS.RISING_SUN_KICK)
    : rskDamage;
};

const bokProcsReset = (hits: number): boolean => {
  const totmResetChance = TALENTS.TEACHINGS_OF_THE_MONASTERY.custom.resetChance;
  for (let i = 0; i < hits; i++) if (Math.random() < totmResetChance) return true;
  return false;
};

const chosenRsk = (talents: Map<spell, boolean>): spell & { cooldown: number } => {
  return (
    talents.get(TALENTS.RUSHING_WIND_KICK) === true 
      ? TALENTS.RUSHING_WIND_KICK
      : SPELLS.RISING_SUN_KICK
    // typescript for whatever reason doesn't want to see .cooldown -is- available
  ) as spell & { cooldown: number };
}

const sckDamagePerCast = (baseValue: number, targets: number): number =>
  targets <= 5
    ? baseValue * targets
    : baseValue * targets * Math.sqrt(5 / targets);

export const simulateMeleeRotationAt2Stacks = (
  totalTime: number,
  targets: number,
  asHealing: boolean,
  params: SimulationParams
): DamagePoint[] => {
  const { talents, stats } = params;
  const rskValue = resolveRskValue(targets, asHealing, talents, stats);
  const tpDamage = calculateSpellDamage(SPELLS.TIGER_PALM, talents, stats);
  const bokDamage = calculateSpellDamage(SPELLS.BLACKOUT_KICK, talents, stats);
  const tpValue = asHealing
    ? calculateAncientTeachingsHealing(tpDamage, talents, true, SPELLS.TIGER_PALM)
    : tpDamage;
  const bokValue = asHealing
    ? calculateAncientTeachingsHealing(bokDamage, talents, true, SPELLS.BLACKOUT_KICK)
    : bokDamage;
  const bokCleaveTargets = Math.min(targets - 1, 2);
  const bokCleaveEffectiveness = TALENTS.WAY_OF_THE_CRANE.custom.blackoutKickEffectiveness;

  const actions: RotationAction[] = [
    {
      // rsk/rwk
      priority: 0,
      cooldown: chosenRsk(talents).cooldown,
      getValue: () => rskValue,
    },
    {
      // bok at 2 stacks
      priority: 1,
      cooldown: SPELLS.BLACKOUT_KICK.cooldown,
      canCast: (state) => state.totmStacks >= 2,
      getValue: (state) => {
        const waves = 1 + state.totmStacks;
        const mainTargetVal = bokValue * waves;
        const cleaveVal = mainTargetVal * bokCleaveEffectiveness * bokCleaveTargets;
        return mainTargetVal + cleaveVal;
      },
      onCast: (state, cooldowns) => {
        const hits = (1 + state.totmStacks) * (1 + bokCleaveTargets);
        state.totmStacks = 0;
        if (bokProcsReset(hits)) cooldowns[0] = 0;
      },
    },
    {
      // tp
      priority: 2,
      cooldown: 0,
      getValue: () => tpValue,
      onCast: (state) => { state.totmStacks += 2; },
    },
  ];

  return runRotation(actions, totalTime, { totmStacks: 0 });
};

export const simulateMeleeRotation = (
  totalTime: number,
  targets: number,
  asHealing: boolean,
  params: SimulationParams
): DamagePoint[] => {
  const { talents, stats } = params;
  const rskValue = resolveRskValue(targets, asHealing, talents, stats);
  const tpDamage = calculateSpellDamage(SPELLS.TIGER_PALM, talents, stats);
  const bokDamage = calculateSpellDamage(SPELLS.BLACKOUT_KICK, talents, stats);
  const tpValue = (
    asHealing 
      ? calculateAncientTeachingsHealing(tpDamage, talents, true, SPELLS.TIGER_PALM) 
      : tpDamage
  );
  const bokValue = (
    asHealing 
      ? calculateAncientTeachingsHealing(bokDamage, talents, true, SPELLS.BLACKOUT_KICK) 
      : bokDamage
  );
  const bokCleaveTargets = Math.min(targets - 1, 2);
  const bokCleaveEffectiveness = TALENTS.WAY_OF_THE_CRANE.custom.blackoutKickEffectiveness;
  const totmMaxStacks = TALENTS.TEACHINGS_OF_THE_MONASTERY.custom.maxStacks;

  const actions: RotationAction[] = [
    {
      // rsk/rwk
      priority: 0,
      cooldown: chosenRsk(talents).cooldown,
      getValue: () => rskValue,
    },
    {
      // bok
      priority: 1,
      cooldown: SPELLS.BLACKOUT_KICK.cooldown,
      canCast: (state) => state.totmStacks >= totmMaxStacks,
      getValue: (state) => {
        const waves = 1 + state.totmStacks;
        const mainTargetVal = bokValue * waves;
        const cleaveVal = mainTargetVal * bokCleaveEffectiveness * bokCleaveTargets;
        return mainTargetVal + cleaveVal;
      },
      onCast: (state, cooldowns) => {
        const hits = (1 + state.totmStacks) * (1 + bokCleaveTargets);
        state.totmStacks = 0;
        if (bokProcsReset(hits)) cooldowns[0] = 0;
      },
    },
    {
      // tp
      priority: 2,
      cooldown: 0, // SPELLS.TIGER_PALM.cooldown
      getValue: () => tpValue,
      onCast: (state) => { state.totmStacks += 2; },
    },
  ];

  return runRotation(actions, totalTime, { totmStacks: 0 });
};

export const simulateSpinningCraneKick = (
  totalTime: number,
  targets: number,
  asHealing: boolean,
  params: SimulationParams
): DamagePoint[] => {
  const { talents, stats } = params;
  const baseValue = calculateSpellDamage(SPELLS.SPINNING_CRANE_KICK, talents, stats);

  const actions: RotationAction[] = [
    {
      // sck
      priority: 0,
      cooldown: 0,
      getValue: () => {
        const raw = sckDamagePerCast(baseValue, targets);
        return asHealing ? calculateWayOfTheCraneHealing(raw, talents) : raw;
      },
    },
  ];

  return runRotation(actions, totalTime);
};

export const calculateJadeEmpowermentData = (
  targets: number,
  talents: Map<spell, boolean>,
  stats: Stats
): { damage: number; healing: number } => {
  const jadeEmpowerment = TALENTS.JADE_EMPOWERMENT;
  const cjl = SPELLS.CRACKLING_JADE_LIGHTNING;
  const effectiveTargets = Math.min(targets, 5);
  const jeMultiplier = (1 + jadeEmpowerment.custom.spellpowerIncrease / 100)
    * (1 + jadeEmpowerment.custom.chainVal * (effectiveTargets - 1));
  const channelData = calculateAncientTeachingsData(cjl, talents, stats);
  return {
    damage: channelData.damage * jeMultiplier,
    healing: channelData.healing * jeMultiplier,
  };
};

export const simulateJadeEmpowerment = (
  totalTime: number,
  targets: number,
  asHealing: boolean,
  params: SimulationParams
): DamagePoint[] => {
  const { talents, stats } = params;
  const tickInterval = 1.5; // not really 1.5s, actual is every 0.75 but graphing it is weird here
  const ticksPerChannel = SPELLS.CRACKLING_JADE_LIGHTNING.castTime / tickInterval;
  const jeData = calculateJadeEmpowermentData(targets, talents, stats);
  const tickValue = (asHealing ? jeData.healing : jeData.damage) / ticksPerChannel;

  const actions: RotationAction[] = [
    {
      // cjl
      priority: 0,
      cooldown: 0,
      castTime: tickInterval,
      getValue: () => tickValue,
    },
  ];

  return runRotation(actions, totalTime);
};

export const simulateRSKWithSCKAndBok = (
  totalTime: number,
  targets: number,
  asHealing: boolean,
  params: SimulationParams
): DamagePoint[] => {
  const { talents, stats } = params;
  const rskValue = resolveRskValue(targets, asHealing, talents, stats);
  const sckBase = calculateSpellDamage(SPELLS.SPINNING_CRANE_KICK, talents, stats);
  const bokDamage = calculateSpellDamage(SPELLS.BLACKOUT_KICK, talents, stats);
  const bokCleaveTargets = Math.min(targets - 1, 2);
  const bokCleaveEffectiveness = TALENTS.WAY_OF_THE_CRANE.custom.blackoutKickEffectiveness;
  const bokValue = asHealing
    ? calculateAncientTeachingsHealing(bokDamage, talents, true, SPELLS.BLACKOUT_KICK)
    : bokDamage;

  const actions: RotationAction[] = [
    {
      // rsk/rwk
      priority: 0,
      cooldown: chosenRsk(talents).cooldown,
      getValue: () => rskValue,
    },
    {
      // bok on cooldown, no totm stacks
      priority: 1,
      cooldown: SPELLS.BLACKOUT_KICK.cooldown,
      getValue: () => bokValue + bokValue * bokCleaveEffectiveness * bokCleaveTargets,
    },
    {
      // sck
      priority: 2,
      cooldown: 0,
      getValue: () => {
        const raw = sckDamagePerCast(sckBase, targets);
        return asHealing ? calculateWayOfTheCraneHealing(raw, talents) : raw;
      },
    },
  ];

  return runRotation(actions, totalTime);
};

export const simulateRSKWithSCK = (
  totalTime: number,
  targets: number,
  asHealing: boolean,
  params: SimulationParams
): DamagePoint[] => {
  const { talents, stats } = params;
  const rskValue = resolveRskValue(targets, asHealing, talents, stats);
  const sckBase = calculateSpellDamage(SPELLS.SPINNING_CRANE_KICK, talents, stats);

  const actions: RotationAction[] = [
    {
      // rsk/rwk
      priority: 0,
      cooldown: chosenRsk(talents).cooldown,
      getValue: () => rskValue,
    },
    {
      // sck
      priority: 1,
      cooldown: 0,
      getValue: () => {
        const raw = sckDamagePerCast(sckBase, targets);
        return asHealing ? calculateWayOfTheCraneHealing(raw, talents) : raw;
      },
    },
  ];

  return runRotation(actions, totalTime);
};
