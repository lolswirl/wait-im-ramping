export interface spell {
    name: string;
    id: number;
    uuid?: string;
    icon: string;
    castTime: number;
    gcd?: boolean;
    empowerLevel?: number;
}