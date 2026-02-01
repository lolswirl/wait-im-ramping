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
    Tooltip,
} from "@mui/material";
import SpellButton from "@components/SpellButtons/SpellButton";
import { GetTitle } from "@util/stringManipulation";
import { Bug, SEVERITY, SEVERITY_COLORS, SEVERITY_ORDER, STATUS, STATUS_COLORS } from "@data/bugs";

interface BugTableProps {
    bugs: Bug[];
    iconSize: number;
    onRowClick: (bug: Bug) => void;
}

const BugTable: React.FC<BugTableProps> = ({ bugs, iconSize, onRowClick }) => {
    const [sortBy, setSortBy] = useState<string>("");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

    const severityWidth = 6;
    const spellWidth = 210;
    const titleWidth = 450;
    const tagsWidth = 200;
    const buildWidth = 55;

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
            let aValue: string | number = "";
            let bValue: string | number = "";

            switch (sortBy) {
                case "severity":
                    aValue = SEVERITY_ORDER.indexOf(a.severity);
                    bValue = SEVERITY_ORDER.indexOf(b.severity);
                    break;
                case "spell":
                    aValue = a.spell?.name || "";
                    bValue = b.spell?.name || "";
                    break;
                case "title":
                    aValue = a.title || "";
                    bValue = b.title || "";
                    break;
                case "lastBuildTested":
                    aValue = parseInt(a.lastBuildTested || "0");
                    bValue = parseInt(b.lastBuildTested || "0");
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
                        <Tooltip title={GetTitle(`Sort by Severity${getSortArrow("severity")}`)} arrow>
                            <TableCell
                                sx={{ 
                                    width: severityWidth, 
                                    p: 0, 
                                    border: 0,
                                    cursor: "pointer",
                                    transition: "opacity 0.2s",
                                    "&:hover": {
                                        opacity: 0.7,
                                    }
                                }}
                                onClick={() => handleSort("severity")}
                            />
                        </Tooltip>
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
                                minWidth: buildWidth,
                                width: buildWidth,
                                maxWidth: buildWidth,
                            }}
                            onClick={() => handleSort("lastBuildTested")}
                        >
                            {GetTitle("Build")}
                            {getSortArrow("lastBuildTested")}
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
                                            size={iconSize}
                                            showName
                                        />
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                transition: "color 0.2s ease",
                                                color: STATUS_COLORS[bug.status ?? STATUS.OPEN],
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
                                        color: STATUS_COLORS[bug.status ?? STATUS.OPEN],
                                    }}
                                >
                                    {GetTitle(bug.title)}
                                </Typography>
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: 0,
                                    minWidth: buildWidth,
                                    maxWidth: buildWidth,
                                    ...hideOverflowSx,
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        transition: "color 0.2s ease",
                                        color: STATUS_COLORS[bug.status ?? STATUS.OPEN],
                                    }}
                                >
                                    {bug.lastBuildTested || "—"}
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
                                    {bug.tags?.map((tag) => {
                                        return (
                                            <Chip
                                                key={tag.name}
                                                label={GetTitle(tag.name)}
                                                size="small"
                                                variant="outlined"
                                                sx={{
                                                    backgroundColor: tag.color ? `${tag.color}20` : "rgba(255,255,255,0.08)",
                                                    ...(tag.color ? { borderColor: tag.color, color: tag.color } : undefined)
                                                }}
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
