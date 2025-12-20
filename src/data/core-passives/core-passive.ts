export default interface CorePassive {
    name: string;
    id: number;
    icon: string;
    effects?: CorePassiveEffect[];
}

export interface CorePassiveEffect {
    type: string;
    value?: number | string;
    pvpMultiplier?: number;
    affectedSpells?: number[];
}
