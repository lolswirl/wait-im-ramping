import { SCHOOLS } from "@data/shared/schools";

export default interface spell {
  name: string;
  id: number;
  uuid?: string;
  icon: string;
  castTime?: number;
  cooldown?: number;
  hasted?: boolean;
  gcd?: boolean;
  empowerLevel?: number;
  school?: (typeof SCHOOLS)[keyof typeof SCHOOLS];

  value?: {
    healing?: number;
    damage?: number;
    spellpower?: number;
  }

  custom?: {
    [key: string]: any;
  };
}

export const GCD = 1.5;
export const GCD_CAP = 0.75;

export const calculateGCD = (haste: number): number => {
  const hasteMultiplier = 1 + (haste / 100);
  const adjustedGCD = GCD / hasteMultiplier;
  return Math.max(GCD_CAP, adjustedGCD);
};

export const calculateCastTime = (spell: spell, haste: number | undefined): number => {
  let baseCastTime = spell.castTime ?? 0;
  if (baseCastTime === 0) {
    if (spell.gcd !== false) {
      baseCastTime = GCD;
    }
    else {
      baseCastTime = 0;
    }
  }

  let castTime = baseCastTime;
  if (spell.hasted !== false) {
    const hasteValue = haste ?? 0;
    castTime /= (1 + hasteValue / 100);
  }

  if (spell.empowerLevel) {
    castTime *= spell.empowerLevel / 5;
  }

  return castTime;
};

export const calculateEffectiveCastTime = (spell: spell, haste: number): { 
  castTime: number; 
  effectiveTime: number; 
  isGCDConstrained: boolean 
} => {
  const castTime = calculateCastTime(spell, haste);
  
  if (spell.gcd === false) {
    return { 
      castTime, 
      effectiveTime: castTime, 
      isGCDConstrained: false 
    };
  }
  
  const gcd = calculateGCD(haste);
  const effectiveTime = Math.max(castTime, gcd);
  const isGCDConstrained = castTime < gcd;
  
  return { castTime, effectiveTime, isGCDConstrained };
};

export const calcSpellpower = (baseValue: number, intellect: number) => {
  return (baseValue / intellect) * 100;
}