import React from "react";
import { Box, Typography } from "@mui/material";
import SpellButton from "@components/SpellButtons/SpellButton";
import SwirlTable, { SwirlColumn } from "@components/SwirlTable/SwirlTable";
import { Bug, SEVERITY_COLORS, STATUS, STATUS_COLORS, getLatestBuild, getBuildSortValue } from "@data/bugs";
import { extractTextFromReactNode } from "@util/extractTextFromReactNode";
import { AttachFile } from "@mui/icons-material";
import { FONT } from "@components/Theme/tokens";

interface BugTableProps {
    bugs: Bug[];
    iconSize: number;
    onRowClick: (bug: Bug) => void;
}

const BugTable: React.FC<BugTableProps> = ({ bugs, iconSize, onRowClick }) => {
    const columns: SwirlColumn<Bug>[] = [
        {
            key: "title",
            label: "Bug",
            width: "1fr",
            sortValue: bug => extractTextFromReactNode(bug.title).toLowerCase(),
            render: bug => (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0, width: "100%" }}>
                    <SpellButton selectedSpell={bug.spell} size={iconSize} showName />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" component="div" sx={{ color: STATUS_COLORS[bug.status ?? STATUS.OPEN], fontWeight: 500 }}>
                            {bug.title}
                        </Typography>
                        <Typography sx={{ fontSize: FONT.micro, color: "text.disabled" }}>
                            {bug.spell.name}
                        </Typography>
                    </Box>
                    {bug.logs && bug.logs.length > 0 && (
                        <AttachFile sx={{ fontSize: "1rem", color: "primary.main", opacity: 0.8, flexShrink: 0 }} />
                    )}
                </Box>
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
