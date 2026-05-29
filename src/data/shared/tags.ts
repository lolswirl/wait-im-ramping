import { STATS, STAT_COLORS } from '@data/shared/stats';
import { HERO_TREES } from '@data/heroTalents';

export interface Tags {
    name: string;
    color: string;
}

export const TAGS: Record<string, Tags> = {
    // general
    HEALING_INCREASE: { name: "Healing Increase", color: "#fff871" },
    SPELL_QUEUE: { name: "Spell Queue", color: "#ff8c00" },
    PETS: { name: "Pets", color: "#ff5445" },
    ITEMS: { name: "Items", color: "#00bfff" },
    TRINKETS: { name: "Trinkets", color: "#1e90ff" },
    TIER: { name: "Tier", color: "#ff69b4" },
    APEX: { name: "Apex", color: "#ff9a2f" },
    TOOLTIP: { name: "Tooltip", color: "#2fbaff" },
    
    // stats
    MASTERY: { name: STATS.MASTERY, color: STAT_COLORS.MASTERY },
    HASTE: { name: STATS.HASTE, color: STAT_COLORS.HASTE },
    VERS: { name: STATS.VERS, color: STAT_COLORS.VERS },
    CRIT: { name: STATS.CRIT, color: STAT_COLORS.CRIT },

    // hero tree tags created from heroTalents datapoints
    ...Object.fromEntries(
        Object.values(HERO_TREES).map(t => [t.shortName.toUpperCase(), { name: t.name, color: t.color }])
    ),
};