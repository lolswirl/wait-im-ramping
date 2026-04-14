import React from "react";
import { Box, FormControl, InputLabel, MenuItem, Select, TextField, IconButton } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { useRouter, useSearchParams } from "next/navigation";
import { GetTitle } from "@util/stringManipulation";
import SpecializationSelect from "@components/SpecializationSelect/SpecializationSelect";
import { specialization } from "@data/class";
import { SEVERITY_COLORS } from "@data/bugs";
import { GlassTooltip } from "@components/GlassTooltip/GlassTooltip";

interface BugFiltersProps {
    selectedSpec: specialization;
    setSelectedSpec: (spec: specialization) => void;
    search: string;
    onSearchChange: (val: string) => void;
    status: string;
    onStatusChange: (val: string) => void;
    severity: string;
    onSeverityChange: (val: string) => void;
    statuses: string[];
    severities: string[];
    onExportToExcel?: () => void;
}

const BugFilters: React.FC<BugFiltersProps> = ({
    selectedSpec,
    setSelectedSpec,
    search,
    onSearchChange,
    status,
    onStatusChange,
    severity,
    onSeverityChange,
    statuses,
    severities,
    onExportToExcel,
}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const filtersHeight = 45;

    const handleSpecChange = (newSpec: specialization) => {
        setSelectedSpec(newSpec);
        const params = new URLSearchParams(searchParams.toString());
        params.set('spec', newSpec.key);
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    return (
        <Box sx={{ mb: 1.5, display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap", width: "100%" }}>
            <SpecializationSelect
                selectedSpec={selectedSpec}
                onSpecChange={handleSpecChange}
                height={45}
            />
            <Box sx={{ flexGrow: 1, minWidth: 200, maxWidth: 300 }}>
                <TextField
                    variant="outlined"
                    size="small"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={GetTitle("Search bugs...")}
                    fullWidth
                    slotProps={{
                        input: {
                            style: {
                                height: filtersHeight,
                            },
                        },
                    }}
                />
            </Box>

            <FormControl size="small">
                <InputLabel id="status-select-label">{GetTitle("Status")}</InputLabel>
                <Select
                    labelId="status-select-label"
                    id="status-select"
                    value={status}
                    label={GetTitle("Status")}
                    onChange={(e) => onStatusChange(e.target.value)}
                    sx={{ height: filtersHeight }}
                    MenuProps={{
                        slotProps: {
                            paper: {
                                sx: {
                                    backgroundColor: "rgba(0, 0, 0, 0.3) !important",
                                    backdropFilter: "blur(8px)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                    backgroundImage: 'none',
                                }
                            }
                        }
                    }}
                >
                    {statuses.map((status) => (
                        <MenuItem 
                            key={status} 
                            value={status}
                            sx={{
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                },
                                '&.Mui-selected': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    },
                                },
                            }}
                        >
                            {GetTitle(status)}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 75 }}>
                <InputLabel id="severity-select-label">{GetTitle("Severity")}</InputLabel>
                <Select
                    labelId="severity-select-label"
                    id="severity-select"
                    value={severity}
                    label={GetTitle("Severity")}
                    onChange={(e) => onSeverityChange(e.target.value)}
                    sx={{ height: filtersHeight }}
                    MenuProps={{
                        slotProps: {
                            paper: {
                                sx: {
                                    backgroundColor: "rgba(0, 0, 0, 0.3) !important",
                                    backdropFilter: "blur(8px)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                    backgroundImage: 'none',
                                }
                            }
                        }
                    }}
                >
                    {severities.map((severity) => (
                        <MenuItem 
                            key={severity} 
                            value={severity} 
                            sx={{ 
                                borderBottom: `3px solid ${SEVERITY_COLORS[severity]}`,
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                },
                                '&.Mui-selected': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    },
                                },
                            }}
                        >
                            {GetTitle(severity)}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {onExportToExcel && (
                <Box sx={{ marginLeft: "auto" }}>
                    <GlassTooltip title={GetTitle("Export to Excel")}>
                        <IconButton
                            onClick={onExportToExcel}
                            sx={{
                                height: filtersHeight,
                                width: filtersHeight,
                                border: "1px solid rgba(255, 255, 255, 0.23)",
                                borderRadius: 1,
                                color: "primary.light",
                                "&:hover": {
                                    backgroundColor: "rgba(144, 202, 249, 0.08)",
                                    borderColor: "primary.light",
                                }
                            }}
                        >
                            <DownloadIcon />
                        </IconButton>
                    </GlassTooltip>
                </Box>
            )}
        </Box>
    );
};

export default BugFilters;
