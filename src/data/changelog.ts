export interface ChangelogEntry {
    date: string;
    text: string;
}

export const CHANGELOG: ChangelogEntry[] = [
    { date: "2026-03-31", text: "Refreshed front page, added changelog :)" },
    { date: "2026-03-31", text: "Added logs directly to bug entries instead of through notes section" },
    { date: "2026-03-30", text: "Added more Mistweaver bugs" },
];
