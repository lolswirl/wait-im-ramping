export interface spell {
    name: string;
    id: number;
    uuid?: string;
    icon: string;
    castTime?: number;
    hasted?: boolean;
    gcd?: boolean;
    empowerLevel?: number;

    value?: {
        healing?: number;
        damage?: number;
        spellpower?: number;
    }

    custom?: {
        [key: string]: any;
    };
}