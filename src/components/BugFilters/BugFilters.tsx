import React from "react";
import { Box, TextField, InputAdornment, Typography } from "@mui/material";
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
import { CONTROL_HEIGHT, FONT } from "@components/Theme/tokens";
import { SwirlIconButton } from "@components/Buttons/SwirlIconButton";

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
                <Typography variant="caption" sx={{ fontSize: FONT.micro, fontWeight: 600, opacity: 0.45, px: 0.5 }}>spec</Typography>
                <SpecializationSelect
                    selectedSpec={selectedSpec}
                    onSpecChange={handleSpecChange}
                    short
                    withLabel
                    height={CONTROL_HEIGHT}
                />
            </Box>

            <Box sx={{ flexGrow: 1, minWidth: 200, maxWidth: 300, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <Typography variant="caption" sx={{ fontSize: FONT.micro, fontWeight: 600, opacity: 0.45, px: 0.5 }}>search</Typography>
                <TextField
                    variant="outlined"
                    size="small"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={T("Search bugs...")}
                    fullWidth
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            height: CONTROL_HEIGHT,
                            fontSize: FONT.small,
                            '& fieldset': { borderColor: 'divider' },
                            '&:hover fieldset': { borderColor: 'text.secondary' },
                            '&.Mui-focused fieldset': { borderColor: 'text.secondary' },
                        },
                    }}
                    slotProps={{
                        input: {
                            endAdornment: search ? (
                                <InputAdornment position="end">
                                    <SwirlIconButton
                                        onClick={() => onSearchChange('')}
                                        edge="end"
                                        tint="danger"
                                        width={32}
                                        height={32}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </SwirlIconButton>
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
                        <SwirlIconButton
                            onClick={onExportToExcel}
                            tint="primary"
                            width={CONTROL_HEIGHT}
                            height={CONTROL_HEIGHT}
                        >
                            <DownloadIcon />
                        </SwirlIconButton>
                    </GlassTooltip>
                </Box>
            )}

            {isLocalhost && onOpenBugUpdate && (
                <Box>
                    <GlassTooltip title={"Update Bugs"}>
                        <SwirlIconButton
                            onClick={onOpenBugUpdate}
                            tint="warning"
                            width={CONTROL_HEIGHT}
                            height={CONTROL_HEIGHT}
                        >
                            <BuildIcon />
                        </SwirlIconButton>
                    </GlassTooltip>
                </Box>
            )}
        </Box>
    );
};

export default BugFilters;
