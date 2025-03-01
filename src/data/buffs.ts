import { spell } from '../data/spell.ts';
import { classes } from '../data/class.ts';

export const applyBuffEffects = async (spec: string, spellList: spell[]): Promise<spell[]> => {
  const [specName, className] = spec.split(" ");

  const classData = classes.find((cls) => cls.name === className);
  const specData = classData?.specializations.find((s) => s.name === specName);

  if (!specData) return spellList;

  try {
    // Dynamic import based on the specialization path
    const { applyBuffs } = await import(`./spells/classes/${className.toLowerCase()}/${specName.toLowerCase()}/buffs.ts`);
    return applyBuffs ? applyBuffs(spellList) : spellList;
  } catch (error) {
    console.warn(`No buff file found for ${spec}, using default spells.`);
    return spellList;
  }
};
