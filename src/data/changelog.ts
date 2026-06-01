export interface ChangelogEntry {
    date: string;
    text: string;
}

export const CHANGELOG: ChangelogEntry[] = [
    { date: "2026-06-01", text: "Refreshed more designs across the entire site - fonts, tables, home page, buttons, data selections, and more! This will be ever-changing over time, and expect to see more updates as they come in." },
    { date: "2026-05-31", text: "Added Spell Reference table that hands spellpower values for all relevant spells and talents in one place" },
    { date: "2026-05-29", text: "Updated spellpower calculations across the site to be more accurate and use coefficients with aura multipliers instead of interpolated values" },
    { date: "2026-05-28", text: "Fixed a bug with Mistweaver's Blackout Kick Cleave and added 2x TP rotation to the Damage Comparison", },
    { date: "2026-05-27", text: "App and Footer Bars match the rest of the site", },
    { date: "2026-05-25", text: "Add Rushing Wind Kick to the Damage Comparison", },
    { date: "2026-05-22", text: "New, rainbow logo!", },
    { date: "2026-05-21", text: "Reworked display of When Do I Ramp and Spell Timeline" },
    { date: "2026-05-19", text: "Reworked display of Damage Comparison Analysis" },
    { date: "2026-04-22", text: "New Sheilun's Gift Analysis Pages - Breakdown and Single Target comparison with Dance of Chi-Ji" },
    { date: "2026-04-21", text: "Added 12.0.5 numerical tuning changes" },
    { date: "2026-04-13", text: "Added Spell links to Wowhead and Export Bugs to Excel button" },
    { date: "2026-04-08", text: "Talents stop working in dungeons finally fixed for Mistweaver!" },
    { date: "2026-04-06", text: "Refreshed more elements across the site" },
    { date: "2026-03-31", text: "Refreshed front page, added changelog :)" },
    { date: "2026-03-31", text: "Added logs directly to bug entries instead of through notes section" },
    { date: "2026-03-30", text: "Added more Mistweaver bugs" },
    { date: "2026-03-30", text: "Initialize changelog tracking" },
    { date: "2025-02-28", text: "Site Launched!" },
];
