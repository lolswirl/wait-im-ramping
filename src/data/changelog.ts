import { date } from "@util/stringManipulation";

export interface ChangelogEntry {
    date: Date;
    text: string;
}

export function change(d: Date, text: string): ChangelogEntry {
    return { date: d, text };
}

export const CHANGELOG: ChangelogEntry[] = [
    change(date(2026, 6, 15), "Added Restoration Shaman (thanks Harrek and Smazo!) and Holy Paladin (thanks Clarius!) bugs"),
    change(date(2026, 6, 1), "Refreshed more designs across the entire site - fonts, tables, home page, buttons, data selections, and more! This will be ever-changing over time, and expect to see more updates as they come in."),
    change(date(2026, 5, 31), "Added Spell Reference table that hands spellpower values for all relevant spells and talents in one place"),
    change(date(2026, 5, 29), "Updated spellpower calculations across the site to be more accurate and use coefficients with aura multipliers instead of interpolated values"),
    change(date(2026, 5, 28), "Fixed a bug with Mistweaver's Blackout Kick Cleave and added 2x TP rotation to the Damage Comparison"),
    change(date(2026, 5, 27), "App and Footer Bars match the rest of the site"),
    change(date(2026, 5, 25), "Add Rushing Wind Kick to the Damage Comparison"),
    change(date(2026, 5, 22), "New, rainbow logo!"),
    change(date(2026, 5, 21), "Reworked display of When Do I Ramp and Spell Timeline"),
    change(date(2026, 5, 19), "Reworked display of Damage Comparison Analysis"),
    change(date(2026, 4, 22), "New Sheilun's Gift Analysis Pages - Breakdown and Single Target comparison with Dance of Chi-Ji"),
    change(date(2026, 4, 21), "Added 12.0.5 numerical tuning changes"),
    change(date(2026, 4, 13), "Added Spell links to Wowhead and Export Bugs to Excel button"),
    change(date(2026, 4, 8), "Talents stop working in dungeons finally fixed for Mistweaver!"),
    change(date(2026, 4, 6), "Refreshed more elements across the site"),
    change(date(2026, 3, 31), "Refreshed front page, added changelog :)"),
    change(date(2026, 3, 31), "Added logs directly to bug entries instead of through notes section"),
    change(date(2026, 3, 30), "Added more Mistweaver bugs"),
    change(date(2026, 3, 30), "Initialize changelog tracking"),
    change(date(2025, 2, 28), "Site Launched!"),
];
