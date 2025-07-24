import spell from '@data/spells/spell';
import { specialization } from '@data/class/class';

export const applyBuffEffects = async (spec: specialization, spellList: spell[]): Promise<spell[]> => {
  if (!spec?.buffs) return spellList;

  try {
    const result = await spec.buffs(spellList);
    return result ?? spellList;
  } catch (error) {
    console.warn(`Failed to apply buffs for spec "${spec.name}":`, error);
    return spellList;
  }
};