const CAPS = false;

export const GetTitle = (str: string): string => {
    return CAPS ? str : lower(str);
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