let CAPS = false;

export const GetTitle = (str: string): string => {
    if (str === undefined || str === null) {
        return "";
    }
    return CAPS ? str : lower(str);
}

export const getCapsMode = (): boolean => {
    return CAPS;
}

export const setCapsMode = (enabled: boolean): void => {
    CAPS = enabled;
}

export function Capitalize(str: string) {
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export function lower(str: string) {
    return str.toLowerCase();
}

export function pluralize(count: number | boolean, singular: string, plural?: string): string {
    const isPlural = typeof count === 'boolean' ? count : count !== 1;
    
    if (!isPlural) {
        return singular;
    }
    
    if (plural) {
        return plural;
    }
    
    const lastChar = singular.slice(-1).toLowerCase();
    const lastTwoChars = singular.slice(-2).toLowerCase();
    
    if (lastChar === 's' || lastChar === 'x' || lastChar === 'z' || 
        lastTwoChars === 'ch' || lastTwoChars === 'sh') {
        return singular + 'es';
    }
    
    if (lastChar === 'y' && !'aeiou'.includes(singular.slice(-2, -1).toLowerCase())) {
        return singular.slice(0, -1) + 'ies';
    }
    
    if (lastChar === 'f') {
        return singular.slice(0, -1) + 'ves';
    }
    
    if (lastTwoChars === 'fe') {
        return singular.slice(0, -2) + 'ves';
    }
    
    return singular + 's';
}

export const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 54, g: 162, b: 235 }; // fallback blue
};

export const rgbToHex = (r: number, g: number, b: number) => {
    const toHex = (value: number) => {
        const hex = value.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};
