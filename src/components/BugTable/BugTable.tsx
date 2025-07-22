import React, { useState, useMemo } from "react";
import {
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Box,
    Typography,
    Chip,
} from "@mui/material";
import SpellButton from "../SpellButtons/SpellButton.tsx";
import { GetTitle } from "../../util/stringManipulation.tsx";
import { Bug, SEVERITY_COLORS, STATUS } from "../../data/bugs/bugs.ts";

interface BugTableProps {
    bugs: Bug[];
    iconSize: number;
    onRowClick: (bug: Bug) => void;
}

const BugTable: React.FC<BugTableProps> = ({ bugs, iconSize, onRowClick }) => {
    const [sortBy, setSortBy] = useState<string>("");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

    const severityWidth = 6;
    const spellWidth = 200;
    const titleWidth = 450;
    const tagsWidth = 200;

    const hideOverflowSx = {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        py: 1,
        px: 1,
    };

    const cellBaseSx = {
        border: 0,
        ...hideOverflowSx,
    };

    const headerSx = {
        fontWeight: "bold",
        fontSize: "1rem",
        cursor: "pointer",
        userSelect: "none",
        transition: "color 0.2s",
        ...cellBaseSx,
    };

    const sortedBugs = useMemo(() => {
        if (!sortBy) return bugs;
        return [...bugs].sort((a, b) => {
            let aValue: string = "";
            let bValue: string = "";

            switch (sortBy) {
                case "spell":
                    aValue = a.spell?.name || "";
                    bValue = b.spell?.name || "";
                    break;
                case "title":
                    aValue = a.title || "";
                    bValue = b.title || "";
                    break;
                case "lastBuildTested":
                    aValue = a.lastBuildTested || "";
                    bValue = b.lastBuildTested || "";
                    break;
                case "tags":
                    aValue = (a.tags || []).join(",");
                    bValue = (b.tags || []).join(",");
                    break;
                default:
                    aValue = "";
                    bValue = "";
            }

            if (aValue < bValue) return sortDir === "asc" ? -1 : 1;
            if (aValue > bValue) return sortDir === "asc" ? 1 : -1;
            return 0;
        });
    }, [bugs, sortBy, sortDir]);

    const handleSort = (column: string) => {
        if (sortBy === column) {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortDir("asc");
        }
    };

    const getSortArrow = (column: string) => {
        if (sortBy !== column) return "";
        return sortDir === "asc" ? " ▲" : " ▼";
    };

    return (
        <TableContainer
            component={Card}
            sx={{
                boxShadow: 6,
                borderRadius: 1,
                p: 0,
                mb: 0,
                border: "1px solid",
                borderColor: "divider",
                width: "100%",
                mx: "auto",
                overflowX: "auto",
                minWidth: 600,
            }}
        >
            <Table sx={{ minWidth: 600 }}>
                <TableHead>
                    <TableRow>
                        <TableCell
                            sx={{ width: severityWidth, p: 0, border: 0 }}
                        />
                        <TableCell
                            sx={{
                                ...headerSx,
                                minWidth: spellWidth,
                                width: spellWidth,
                                maxWidth: spellWidth,
                            }}
                            onClick={() => handleSort("spell")}
                        >
                            {GetTitle("Spell")}
                            {getSortArrow("spell")}
                        </TableCell>
                        <TableCell
                            sx={{
                                ...headerSx,
                                minWidth: titleWidth,
                                width: titleWidth,
                                maxWidth: titleWidth,
                            }}
                            onClick={() => handleSort("title")}
                        >
                            {GetTitle("Title")}
                            {getSortArrow("title")}
                        </TableCell>
                        <TableCell
                            sx={{
                                ...headerSx,
                                minWidth: tagsWidth,
                                width: tagsWidth,
                                maxWidth: tagsWidth,
                            }}
                            onClick={() => handleSort("tags")}
                        >
                            {GetTitle("Tags")}
                            {getSortArrow("tags")}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedBugs.map((bug, idx) => (
                        <TableRow
                            key={idx}
                            hover
                            sx={{
                                cursor: "pointer",
                                transition: "box-shadow 0.2s",
                                "&:hover": {
                                    boxShadow: 4,
                                    backgroundColor: "action.hover",
                                },
                            }}
                            onClick={() => onRowClick(bug)}
                        >
                            <TableCell
                                sx={{
                                    background: SEVERITY_COLORS[bug.severity],
                                    width: severityWidth,
                                    minWidth: severityWidth,
                                    maxWidth: severityWidth,
                                    height: 30,
                                    p: 0,
                                    py: 0.5,
                                    border: 0,
                                }}
                            />
                            <TableCell
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    border: 0,
                                    minWidth: spellWidth,
                                    maxWidth: spellWidth,
                                    ...hideOverflowSx,
                                }}
                            >
                                {bug.spell && (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                        }}
                                    >
                                        <SpellButton
                                            selectedSpell={bug.spell}
                                            action={() => {}}
                                            size={iconSize}
                                            showName
                                        />
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                transition: "color 0.2s ease",
                                                color:
                                                    bug.status === STATUS.FIXED
                                                        ? "#43a047"
                                                        : "inherit",
                                            }}
                                        >
                                            {GetTitle(bug.spell.name)}
                                        </Typography>
                                    </Box>
                                )}
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: 0,
                                    minWidth: titleWidth,
                                    maxWidth: titleWidth,
                                    ...hideOverflowSx,
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        transition: "color 0.2s ease",
                                        color:
                                            bug.status === STATUS.FIXED
                                                ? "#43a047"
                                                : "inherit",
                                    }}
                                >
                                    {GetTitle(bug.title)}
                                </Typography>
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: 0,
                                    minWidth: tagsWidth,
                                    maxWidth: tagsWidth,
                                    ...hideOverflowSx,
                                }}
                            >
                                <Box sx={{ gap: 0.5, display: "flex", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
                                    {bug.tags.map((tag) => {
                                        return (
                                            <Chip
                                                key={tag.name}
                                                label={GetTitle(tag.name)}
                                                size="small"
                                                variant="outlined"
                                                sx={tag.color ? { borderColor: tag.color, color: tag.color } : undefined}
                                            />
                                        );
                                    })}
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default BugTable;
