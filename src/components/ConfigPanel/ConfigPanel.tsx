"use client";
import React, { useState, useRef } from "react";
import { Box, Collapse, Typography, useTheme } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

export interface ConfigSection {
    key: string;
    title: string;
    summary: React.ReactNode;
    content: React.ReactNode;
    icon?: React.ReactNode;
    defaultOpen?: boolean;
}

interface ConfigPanelProps {
    sections: ConfigSection[];
    accent?: string;
    onReset?: () => void;
    sx?: object;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ sections, accent, onReset, sx }) => {
    const theme = useTheme();
    const accentColor = accent ?? theme.palette.primary.main;
    const [activeKey, setActiveKey] = useState<string | null>(
        (sections.find(s => s.defaultOpen) ?? sections[0])?.key ?? null
    );

    const active = sections.find(s => s.key === activeKey);
    const lastActiveRef = useRef(active);
    if (active) lastActiveRef.current = active;

    return (
        <Box sx={{ width: "100%", ...sx }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {sections.map(section => {
                    const isActive = section.key === activeKey;
                    return (
                        <Box
                            key={section.key}
                            onClick={() => setActiveKey(isActive ? null : section.key)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    setActiveKey(isActive ? null : section.key);
                                }
                            }}
                            sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 1,
                                px: 1.5,
                                py: 0.75,
                                borderRadius: 1,
                                border: "1px solid",
                                borderColor: isActive ? accentColor : "divider",
                                backgroundColor: isActive ? accentColor + "14" : "background.paper",
                                cursor: "pointer",
                                userSelect: "none",
                                whiteSpace: "nowrap",
                                transition: "border-color 0.15s ease, background-color 0.15s ease",
                                "&:hover": { borderColor: accentColor + "88" },
                            }}
                        >
                            <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: 0.5, color: "text.disabled" }}>
                                {section.title}
                            </Typography>
                            {section.icon && (
                                <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                                    {section.icon}
                                </Box>
                            )}
                            <Typography component="div" sx={{ fontSize: "0.8rem", fontFamily: "monospace", color: "text.primary" }}>
                                {section.summary}
                            </Typography>
                            <ExpandMore sx={{
                                fontSize: 15,
                                color: "text.disabled",
                                transform: isActive ? "rotate(180deg)" : "none",
                                transition: "transform 0.2s",
                            }} />
                        </Box>
                    );
                })}
                {onReset && (
                    <Box
                        onClick={onReset}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                onReset();
                            }
                        }}
                        sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            ml: "auto",
                            px: 1,
                            cursor: "pointer",
                            userSelect: "none",
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            color: "text.disabled",
                            "&:hover": { color: "text.primary" },
                        }}
                    >
                        reset
                    </Box>
                )}
            </Box>

            <Collapse in={active !== undefined}>
                <Box sx={{
                    mt: 1,
                    p: 2,
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "divider",
                    backgroundColor: "background.paper",
                }}>
                    {(active ?? lastActiveRef.current)?.content}
                </Box>
            </Collapse>
        </Box>
    );
};

export default ConfigPanel;
