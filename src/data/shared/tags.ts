import { STATS, STAT_COLORS } from '@data/shared/stats';

export interface Tags {
    name: string;
    color: string;
}

export const TAGS: Record<string, Tags> = {
    // general
    HEALING_INCREASE: { name: "Healing Increase", color: "#fff871" },
    SPELL_QUEUE: { name: "Spell Queue", color: "#ff8c00" },
    PETS: { name: "Pets", color: "#ff5445" },
    
    // stats
    MASTERY: { name: STATS.MASTERY, color: STAT_COLORS.MASTERY },
    HASTE: { name: STATS.HASTE, color: STAT_COLORS.HASTE },
    VERS: { name: STATS.VERS, color: STAT_COLORS.VERS },
    CRIT: { name: STATS.CRIT, color: STAT_COLORS.CRIT },

    // hero tree
    CONDUIT: { name: "Conduit of the Celestials", color: "#7ee5ff" },
    MOH: { name: "Master of Harmony", color: "#89ff7f" },
};