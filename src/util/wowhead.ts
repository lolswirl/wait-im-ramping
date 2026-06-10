export const wowheadSpellUrl = (id: number, spellModifier?: number): string => {
    return `https://www.wowhead.com/spell=${id}${spellModifier ? `?spellModifier=${spellModifier}` : ""}`;
};
