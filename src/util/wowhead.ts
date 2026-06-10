export const wowheadSpellUrl = (id: number, spellModifier?: number): string => {
    return `https://www.wowhead.com/spell=${id}${spellModifier ? `?spellModifier=${spellModifier}` : ""}`;
};

export const wowheadItemUrl = (id: number): string => {
    return `https://www.wowhead.com/item=${id}`;
};

export const iconLocalUrl = (icon: string): string => {
    return icon ? `/icons/${icon}.png` : "";
};

export const iconFallbackUrl = (icon: string): string => {
    return `https://wow.zamimg.com/images/wow/icons/large/${icon}.jpg`;
};
