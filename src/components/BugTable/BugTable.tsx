import React from "react";
import { Box, Typography } from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import SpellButton from "@components/SpellButtons/SpellButton";
import SwirlTable, { SwirlColumn } from "@components/SwirlTable/SwirlTable";
import { Bug, SEVERITY_COLORS, STATUS, STATUS_COLORS, getLatestBuild, getBuildSortValue } from "@data/bugs";
import { extractTextFromReactNode } from "@util/extractTextFromReactNode";
import { AttachFile } from "@mui/icons-material";

interface BugTableProps {
    bugs: Bug[];
    iconSize: number;
    onRowClick: (bug: Bug) => void;
}

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
            sortValue: bug => getBuildSortValue(bug.buildsTested),
            render: bug => (
                <Typography variant="body2" sx={{ color: STATUS_COLORS[bug.status ?? STATUS.OPEN], fontFamily: "monospace", textAlign: "center" }}>
                    {getLatestBuild(bug.buildsTested) || "—"}
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
