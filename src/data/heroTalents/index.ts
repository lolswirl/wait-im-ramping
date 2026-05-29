export interface HeroTreeInfo {
    name: string;
    shortName: string;
    color: string;
    icon: string;
}

export const HERO_TREES = {
    CONDUIT_OF_THE_CELESTIALS: {
        name: "Conduit of the Celestials",
        shortName: "Conduit",
        color: "#67ecaf",
        icon: "conduit_of_the_celestials", // ph
    },
    MASTER_OF_HARMONY: {
        name: "Master of Harmony",
        shortName: "MoH",
        color: "#6ed4cd",
        icon: "master_of_harmony", // ph
    },
    HERALD_OF_THE_SUN: {
        name: "Herald of the Sun",
        shortName: "Herald",
        color: "#ffd700",
        icon: "herald_of_the_sun", // ph
    },
    LIGHTSMITH: {
        name: "Lightsmith",
        shortName: "Lightsmith",
        color: "#c0c0c0",
        icon: "lightsmith", // ph
    },
    TOTEMIC: {
        name: "Totemic",
        shortName: "Totemic",
        color: "#ff8876",
        icon: "totemic", // ph
    },
    FARSEER: {
        name: "Farseer",
        shortName: "Farseer",
        color: "#2546d4",
        icon: "farseer", // ph
    },
} satisfies Record<string, HeroTreeInfo>;

export type HeroTree = typeof HERO_TREES[keyof typeof HERO_TREES];
