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

export const calcSpellpower = (baseValue: number, intellect: number) => {
  return (baseValue / intellect) * 100;
}