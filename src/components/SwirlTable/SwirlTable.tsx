"use client";
import React, { useState, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import RainbowCard from "@components/Buttons/RainbowCard";

export interface SwirlColumn<T> {
    key: string;
    label: React.ReactNode;
    render: (row: T) => React.ReactNode;
    align?: "left" | "right" | "center";
    width?: string | number;
    sortValue?: (row: T) => string | number;
}

interface SwirlTableProps<T> {
    columns: SwirlColumn<T>[];
    rows: T[];
    rowKey: (row: T, index: number) => string;
    onRowClick?: (row: T) => void;
    accentColor?: (row: T) => string | undefined;
    defaultSortKey?: string;
    defaultSortDir?: "asc" | "desc";
}

function SwirlTable<T>({
    columns,
    rows,
    rowKey,
    onRowClick,
    accentColor,
    defaultSortKey,
    defaultSortDir = "asc",
}: SwirlTableProps<T>) {
    const [sortKey, setSortKey] = useState<string>(defaultSortKey ?? "");
    const [sortDir, setSortDir] = useState<"asc" | "desc">(defaultSortDir);

    const sortableColumns = columns.filter(c => c.sortValue !== undefined);

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortDir(d => d === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortDir("asc");
        }
    };

    const sorted = useMemo(() => {
        if (!sortKey) return rows;
        const col = columns.find(c => c.key === sortKey);
        if (!col?.sortValue) return rows;
        return [...rows].sort((a, b) => {
            const av = col.sortValue!(a);
            const bv = col.sortValue!(b);
            if (av < bv) return sortDir === "asc" ? -1 : 1;
            if (av > bv) return sortDir === "asc" ? 1 : -1;
            return 0;
        });
    }, [rows, sortKey, sortDir, columns]);

    const gridTemplateColumns = columns.map(c =>
        c.width ? (typeof c.width === "number" ? `${c.width}px` : c.width) : "1fr"
    ).join(" ");

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0, width: "100%" }}>
            {/* header */}
            <Box sx={{
                display: "grid",
                gridTemplateColumns: accentColor ? `4px ${gridTemplateColumns}` : gridTemplateColumns,
                py: 0.75,
                borderRadius: 1,
                backgroundColor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
            }}>
                {accentColor && <Box />}
                {columns.map(col => {
                    const isSortable = col.sortValue !== undefined;
                    return (
                        <Box
                            key={col.key}
                            onClick={isSortable ? () => handleSort(col.key) : undefined}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: col.align === "right" ? "flex-end" : col.align === "center" ? "center" : "flex-start",
                                gap: 0.5,
                                cursor: isSortable ? "pointer" : "default",
                                userSelect: "none",
                                "&:hover": isSortable ? { opacity: 0.7 } : {},
                                px: 1.5,
                            }}
                        >
                            <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
                                {col.label}
                            </Typography>
                            {isSortable && sortKey === col.key && (
                                sortDir === "asc"
                                    ? <KeyboardArrowUpIcon sx={{ fontSize: "0.9rem", color: "text.disabled" }} />
                                    : <KeyboardArrowDownIcon sx={{ fontSize: "0.9rem", color: "text.disabled" }} />
                            )}
                        </Box>
                    );
                })}
            </Box>

            {/* rows */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, pt: 0.5 }}>
                {sorted.map((row, i) => {
                    const accent = accentColor?.(row);
                    return (
                        <RainbowCard
                            key={rowKey(row, i)}
                            onClick={onRowClick ? () => onRowClick(row) : undefined}
                            sx={{
                                display: "grid",
                                gridTemplateColumns: accent !== undefined ? `4px ${gridTemplateColumns}` : gridTemplateColumns,
                                alignItems: "center",
                                cursor: onRowClick ? "pointer" : "default",
                                overflow: "hidden",
                                ...(accent ? { borderLeft: `3px solid ${accent}` } : {}),
                            }}
                        >
                            {accent !== undefined && (
                                <Box sx={{ width: 4, alignSelf: "stretch", backgroundColor: accent }} />
                            )}
                            {columns.map(col => (
                                <Box
                                    key={col.key}
                                    sx={{
                                        px: 1.5,
                                        py: 1.25,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: col.align === "right" ? "flex-end" : col.align === "center" ? "center" : "flex-start",
                                        minWidth: 0,
                                    }}
                                >
                                    {col.render(row)}
                                </Box>
                            ))}
                        </RainbowCard>
                    );
                })}
            </Box>
        </Box>
    );
}

export default SwirlTable;
