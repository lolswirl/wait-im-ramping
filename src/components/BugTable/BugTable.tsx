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
} from "@mui/material";
import { GlassTooltip } from "@components/Glass";
import LinkIcon from "@mui/icons-material/Link";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SpellButton from "@components/SpellButtons/SpellButton";
import { T } from "@util/T";
import { Bug, SEVERITY_COLORS, SEVERITY_ORDER, STATUS, STATUS_COLORS } from "@data/bugs";
import { extractTextFromReactNode } from "@util/extractTextFromReactNode";

interface BugTableProps {
    bugs: Bug[];
    iconSize: number;
    onRowClick: (bug: Bug) => void;
}

const BugTable: React.FC<BugTableProps> = ({ bugs, iconSize, onRowClick }) => {
    const [sortBy, setSortBy] = useState<string>("");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

    const severityWidth = 6;
    const spellWidth = 213;
    const titleWidth = 450;
    const buildWidth = 70;
    const logsWidth = 70;

    const getLatestBuild = (bug: Bug): number => {
        return parseInt(bug.buildsTested[bug.buildsTested.length - 1]);
    };

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
                    aValue = extractTextFromReactNode(a.title).toLowerCase();
                    bValue = extractTextFromReactNode(b.title).toLowerCase();
                    break;
                case "lastBuildTested":
                    aValue = getLatestBuild(a);
                    bValue = getLatestBuild(b);
                    break;
                case "tags":
                    aValue = (a.tags || []).join(",");
                    bValue = (b.tags || []).join(",");
                    break;
                case "logs":
                    aValue = (a.logs || []).length;
                    bValue = (b.logs || []).length;
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
        if (sortBy !== column) return null;
        return sortDir === "asc" ? (
            <KeyboardArrowUpIcon sx={{ fontSize: "1.25rem", verticalAlign: "middle", ml: 0.5 }} />
        ) : (
            <KeyboardArrowDownIcon sx={{ fontSize: "1.25rem", verticalAlign: "middle", ml: 0.5 }} />
        );
    };

    return (
        <TableContainer
            component={Card}
            sx={{
                boxShadow: "none",
                borderRadius: 1,
                p: 0,
                mb: 0,
                border: "1px solid",
                borderColor: "divider",
                width: "80%",
                mx: "auto",
                overflowX: "auto",
                minWidth: 600,
            }}
        >
            <Table sx={{ minWidth: 600 }}>
                <TableHead>
                    <TableRow>
                        <GlassTooltip title={T("Sort by Severity")}>
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
                        </GlassTooltip>
                        <TableCell
                            sx={{
                                ...headerSx,
                                minWidth: spellWidth,
                                width: spellWidth,
                                maxWidth: spellWidth,
                            }}
                            onClick={() => handleSort("spell")}
                        >
                            <T>Spell</T>
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
                            <T>Title</T>
                            {getSortArrow("title")}
                        </TableCell>
                        <TableCell
                            sx={{
                                ...headerSx,
                                minWidth: buildWidth,
                                width: buildWidth,
                                maxWidth: buildWidth,
                                textAlign: "center",
                            }}
                            onClick={() => handleSort("lastBuildTested")}
                        >
                            <T>Build</T>
                            {getSortArrow("lastBuildTested")}
                        </TableCell>
                        <GlassTooltip title={T("Logs available")}>
                            <TableCell
                                sx={{
                                    ...headerSx,
                                    minWidth: logsWidth,
                                    width: logsWidth,
                                    maxWidth: logsWidth,
                                    textAlign: "center",
                                }}
                                onClick={() => handleSort("logs")}
                            >
                                <T>Logs</T>
                                {getSortArrow("logs")}
                            </TableCell>
                        </GlassTooltip>
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
                                    border: 0,
                                    minWidth: spellWidth,
                                    maxWidth: spellWidth,
                                    py: 1,
                                    px: 1,
                                    overflow: "visible",
                                }}
                            >
                                {bug.spell && (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            width: "100%",
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
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                                flex: 1,
                                                minWidth: 0,
                                            }}
                                        >
                                            <T>{bug.spell.name}</T>
                                        </Typography>
                                    </Box>
                                )}
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: 0,
                                    minWidth: titleWidth,
                                    maxWidth: titleWidth,
                                    width: titleWidth,
                                    py: 1,
                                    px: 1,
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    component="div"
                                    sx={{
                                        color: STATUS_COLORS[bug.status ?? STATUS.OPEN],
                                    }}
                                >
                                    <T>{bug.title}</T>
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
                                {(() => {
                                    return (
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                transition: "color 0.2s ease",
                                                color: STATUS_COLORS[bug.status ?? STATUS.OPEN],
                                                textAlign: "center",
                                                fontFamily: "monospace",
                                            }}
                                        >
                                            {getLatestBuild(bug) || "—"}
                                        </Typography>
                                    );
                                })()}
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: 0,
                                    minWidth: logsWidth,
                                    maxWidth: logsWidth,
                                    textAlign: "center",
                                    px: 0,
                                    py: 1,
                                }}
                            >
                                {bug.logs && bug.logs.length > 0 && (
                                    <LinkIcon
                                        sx={{
                                            fontSize: "1.1rem",
                                            color: "primary.main",
                                            opacity: 0.8,
                                        }}
                                    />
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default BugTable;
