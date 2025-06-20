import spell from '../../data/spells/spell.ts';

interface SpecLike {
  spells: Record<string, spell>;
  talents?: Record<string, spell>;
  getSpell?: (spellName: string) => spell | undefined;
  getTalent?: (talentName: string) => spell | undefined;
}

export function attachGetters<T extends SpecLike>(spec: T): T {
  spec.getSpell = function (spellName: string): spell | undefined {
    const spellList = Object.values(this.spells) as spell[];
    return this.spells[spellName] || spellList.find(s => s.name === spellName);
  };

  spec.getTalent = function (talentName: string): spell | undefined {
    if (!this.talents) return undefined;
    const talentList = Object.values(this.talents) as spell[];
    return this.talents[talentName] || talentList.find(t => t.name === talentName);
  };

  return spec;
}
