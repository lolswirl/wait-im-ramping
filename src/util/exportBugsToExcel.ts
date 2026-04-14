import { Bug, SEVERITY_ORDER, STATUS } from "@data/bugs";
import { extractTextFromReactNode } from "./extractTextFromReactNode";
import * as XLSX from "xlsx";

export const exportBugsToExcel = (bugs: Bug[], fileName: string = "bugs.xlsx") => {
    const openBugs = bugs.filter(bug => bug.status !== STATUS.FIXED && bug.status !== STATUS.REMOVED);

    const sortedBugs = [...openBugs].sort((a, b) => {
        return SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity);
    });

    const headers = ["Type", "Ability/Talent", "Misc", "Description", "Build", "Notes + Logs", "Priority"];

    const rows = sortedBugs.map(bug => {
        const type = "Bug";
        const spellName = bug.spell.name;
        const descriptionNode = bug.description || bug.title;
        const description = extractTextFromReactNode(descriptionNode);
        const build = bug.lastBuildTested || "";
        
        let notesAndLogs = bug.notes || "";
        if (bug.logs && bug.logs.length > 0) {
            const logsText = bug.logs.map(log => {
                if (log.label) {
                    return `${log.label}:\n${log.url}`;
                }
                return log.url;
            }).join("\n\n");
            notesAndLogs = notesAndLogs 
                ? `${notesAndLogs}\n\n${logsText}` 
                : logsText;
        }
        
        const priority = bug.severity;

        return [type, spellName, "", description, build, notesAndLogs, priority];
    });

    const wsData = [headers.map(h => h.toUpperCase()), ...rows];

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    ws['!cols'] = [
        { wch: 10 },  // type
        { wch: 30 },  // spell
        { wch: 10 },  // misc (do we even need this anymore?)
        { wch: 60 },  // description
        { wch: 10 },  // build #
        { wch: 60 },  // notes + logs
        { wch: 15 },  // severity
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bugs");

    XLSX.writeFile(wb, fileName);
};
