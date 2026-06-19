import React from "react";
import { Box, Typography } from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import SpellButton from "@components/SpellButtons/SpellButton";
import SwirlTable, { SwirlColumn } from "@components/SwirlTable/SwirlTable";
import { Bug, SEVERITY_COLORS, STATUS, STATUS_COLORS } from "@data/bugs";
import { extractTextFromReactNode } from "@util/extractTextFromReactNode";
import { AttachFile } from "@mui/icons-material";

interface BugTableProps {
    bugs: Bug[];
    iconSize: number;
    onRowClick: (bug: Bug) => void;
}

// builds #s for ptr are lower than live as of 6/19, ugly fix to sort builds including the full patch num at the top as they are technically newer for ptr version
// genuinely hate this impl and will remove it once build #s go above but probably need a diff permanent fix for later
const parseBuild = (entry: string): { patch: number[]; build: number } => {
    const parts = entry.split(".");
    const build = parseInt(parts[parts.length - 1]);
    const patch = parts.slice(0, -1).map(Number);
    return { patch, build };
};

const compareBuilds = (a: string, b: string): number => {
    const { patch: patchA, build: buildA } = parseBuild(a);
    const { patch: patchB, build: buildB } = parseBuild(b);
    const len = Math.max(patchA.length, patchB.length);
    for (let i = 0; i < len; i++) {
        const diff = (patchA[i] ?? 0) - (patchB[i] ?? 0);
        if (diff !== 0) return diff;
    }
    return buildA - buildB;
};

const getLatestBuild = (bug: Bug): number => {
    const latest = bug.buildsTested.reduce<string | undefined>((latest, entry) =>
        !latest || compareBuilds(entry, latest) > 0 ? entry : latest, undefined);
    return latest ? parseBuild(latest).build : 0;
};

const getLatestBuildSortValue = (bug: Bug): number => {
    const latest = bug.buildsTested.reduce<string | undefined>((latest, entry) =>
        !latest || compareBuilds(entry, latest) > 0 ? entry : latest, undefined);
    if (!latest) return 0;
    const { patch, build } = parseBuild(latest);
    const patchScore = patch.reduce((acc, n) => acc * 1000 + n, 0);
    return patchScore * 1e9 + build;
};

const BugTable: React.FC<BugTableProps> = ({ bugs, iconSize, onRowClick }) => {
    const columns: SwirlColumn<Bug>[] = [
        {
            key: "spell",
            label: "Spell",
            width: "250px",
            sortValue: bug => bug.spell?.name ?? "",
            render: bug => bug.spell ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
                    <SpellButton selectedSpell={bug.spell} size={iconSize} showName />
                    <Typography
                        variant="body2"
                        sx={{
                            color: STATUS_COLORS[bug.status ?? STATUS.OPEN],
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, minWidth: 0,
                        }}
                    >
                        {bug.spell.name}
                    </Typography>
                </Box>
            ) : null,
        },
        {
            key: "title",
            label: "Title",
            width: "2fr",
            sortValue: bug => extractTextFromReactNode(bug.title).toLowerCase(),
            render: bug => (
                <Typography variant="body2" component="div" sx={{ color: STATUS_COLORS[bug.status ?? STATUS.OPEN] }}>
                    {bug.title}
                </Typography>
            ),
        },
        {
            key: "build",
            label: "Build",
            width: "80px",
            align: "center",
            sortValue: bug => getLatestBuildSortValue(bug),
            render: bug => (
                <Typography variant="body2" sx={{ color: STATUS_COLORS[bug.status ?? STATUS.OPEN], fontFamily: "monospace", textAlign: "center" }}>
                    {getLatestBuild(bug) || "—"}
                </Typography>
            ),
        },
        {
            key: "logs",
            label: "Logs",
            width: "60px",
            align: "center",
            sortValue: bug => (bug.logs?.length ?? 0),
            render: bug => bug.logs && bug.logs.length > 0 ? (
                <AttachFile sx={{ fontSize: "1.1rem", color: "primary.main", opacity: 0.8 }} />
            ) : null,
        },
    ];

    return (
        <Box sx={{ width: "80%", mx: "auto" }}>
            <SwirlTable
                rows={bugs}
                rowKey={(_, i) => String(i)}
                columns={columns}
                onRowClick={onRowClick}
                accentColor={bug => SEVERITY_COLORS[bug.severity]}
                defaultSortKey="build"
                defaultSortDir="desc"
            />
        </Box>
    );
};

export default BugTable;
