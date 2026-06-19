const isNonProd = (): boolean => {
    const branch = process.env.NEXT_PUBLIC_CF_PAGES_BRANCH;
    return !!branch && branch !== 'main' && branch !== 'master';
};

export const wowheadSpellUrl = (id: number, spellModifier?: number): string => {
    const ptr = isNonProd() ? "ptr/" : "";
    return `https://www.wowhead.com/${ptr}spell=${id}${spellModifier ? `?spellModifier=${spellModifier}` : ""}`;
};

export const wowheadItemUrl = (id: number): string => {
    const ptr = isNonProd() ? "ptr/" : "";
    return `https://www.wowhead.com/${ptr}item=${id}`;
};

export const iconLocalUrl = (icon: string): string => {
    return icon ? `/icons/${icon}.png` : "";
};

export const iconFallbackUrl = (icon: string): string => {
    return `https://wow.zamimg.com/images/wow/icons/large/${icon}.jpg`;
};
