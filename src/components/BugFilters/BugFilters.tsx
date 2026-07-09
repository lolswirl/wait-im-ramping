import React from "react";
import { Box, TextField, IconButton, InputAdornment, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import BuildIcon from "@mui/icons-material/Build";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter, useSearchParams } from "next/navigation";
import { T } from "@util/T";
import SpecializationSelect from "@components/SpecializationSelect/SpecializationSelect";
import { GlassSelect, GlassTooltip } from "@components/Glass";
import { specialization } from "@data/class";
import { SEVERITY_COLORS } from "@data/bugs";
import { useIsLocalhost } from "@hooks/useIsLocalhost";

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
    onOpenBugUpdate?: () => void;
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
    onOpenBugUpdate,
}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isLocalhost = useIsLocalhost();

    const handleSpecChange = (newSpec: specialization) => {
        setSelectedSpec(newSpec);
        const params = new URLSearchParams(searchParams.toString());
        params.set('spec', newSpec.key);
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    return (
        <Box sx={{ mb: 1, display: "flex", alignItems: "flex-end", gap: 1, flexWrap: "wrap", width: "80%", mx: "auto" }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 600, opacity: 0.45, px: 0.5 }}>spec</Typography>
                <SpecializationSelect
                    selectedSpec={selectedSpec}
                    onSpecChange={handleSpecChange}
                    short
                    withLabel
                />
            </Box>

            <Box sx={{ flexGrow: 1, minWidth: 200, maxWidth: 300, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 600, opacity: 0.45, px: 0.5 }}>search</Typography>
                <TextField
                    variant="outlined"
                    size="small"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={T("Search bugs...")}
                    fullWidth
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            height: 42,
                            fontSize: '0.8rem',
                            '& fieldset': { borderColor: 'divider' },
                            '&:hover fieldset': { borderColor: 'text.secondary' },
                            '&.Mui-focused fieldset': { borderColor: 'text.secondary' },
                        },
                    }}
                    slotProps={{
                        input: {
                            endAdornment: search ? (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => onSearchChange('')}
                                        edge="end"
                                        size="small"
                                        sx={{
                                            height: 32,
                                            width: 32,
                                            border: "1px solid rgba(244, 67, 54, 0.23)",
                                            borderRadius: 1,
                                            color: "error.light",
                                            "&:hover": {
                                                backgroundColor: "rgba(244, 67, 54, 0.08)",
                                                borderColor: "error.light",
                                            }
                                        }}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            ) : null,
                        },
                    }}
                />
            </Box>

            <GlassSelect
                value={status}
                onChange={onStatusChange}
                label="status"
                options={statuses.map(s => ({ value: s, label: s }))}
            />

            <GlassSelect
                value={severity}
                onChange={onSeverityChange}
                label="severity"
                options={severities.map(s => ({
                    value: s,
                    label: s,
                    sx: { borderBottom: `2px solid ${SEVERITY_COLORS[s] ?? 'transparent'}` },
                }))}
            />

            {onExportToExcel && (
                <Box sx={{ marginLeft: "auto" }}>
                    <GlassTooltip title={"Export to Excel"}>
                        <IconButton
                            onClick={onExportToExcel}
                            sx={{
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

            {isLocalhost && onOpenBugUpdate && (
                <Box>
                    <GlassTooltip title={"Update Bugs"}>
                        <IconButton
                            onClick={onOpenBugUpdate}
                            sx={{
                                border: "1px solid rgba(255, 165, 0, 0.23)",
                                borderRadius: 1,
                                color: "warning.light",
                                "&:hover": {
                                    backgroundColor: "rgba(255, 165, 0, 0.08)",
                                    borderColor: "warning.light",
                                }
                            }}
                        >
                            <BuildIcon />
                        </IconButton>
                    </GlassTooltip>
                </Box>
            )}
        </Box>
    );
};

export default BugFilters;
