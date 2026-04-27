import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import WarningChip from "@components/WarningChip/WarningChip";
import { GlassTooltip } from "@components/Glass";
import { GetTitle } from "@util/stringManipulation";
import { Bug, STATUS, SEVERITY_COLORS, STATUS_COLORS, STATUS_BADGES } from "@data/bugs";

interface BugChipsProps {
    bug: Bug;
    showTooltip?: boolean;
}

export const BugChips: React.FC<BugChipsProps> = ({ bug, showTooltip = true }) => {
    return (
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            {bug.status && bug.status !== STATUS.OPEN && (
                <WarningChip
                    message={GetTitle(bug.status)}
                    showIcon={true}
                    icon={STATUS_BADGES[bug.status]}
                    borderColor={STATUS_COLORS[bug.status]}
                    fontSize="0.75rem"
                />
            )}
            <WarningChip
                message={GetTitle(bug.severity + " Severity")}
                borderColor={SEVERITY_COLORS[bug.severity]}
                fontSize="0.75rem"
            />
            {(() => {
                const builds = bug.buildsTested;
                if (!builds || builds.length === 0) return null;
                
                const latestBuild = builds[builds.length - 1];
                const hasMultipleBuilds = builds.length > 1;
                const tooltipContent = showTooltip && hasMultipleBuilds ? (
                    <Stack spacing={0.25} sx={{ py: 0.25 }}>
                        <Typography variant="caption" sx={{ fontSize: '0.7rem', opacity: 0.7, mb: 0.25 }}>
                            {GetTitle("Build History:")}
                        </Typography>
                        <Stack spacing={0} sx={{ textAlign: "center" }}>
                            {[...builds].reverse().map((build, index) => (
                                <Box 
                                    key={index}
                                    sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 0.25
                                    }}
                                >
                                    <Typography 
                                        variant="caption" 
                                        sx={{ 
                                            fontSize: '0.75rem',
                                            fontFamily: 'monospace',
                                            opacity: index === 0 ? 1 : 0.8,
                                            fontWeight: 400,
                                        }}
                                    >
                                        {build}
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Stack>
                ) : null;
                
                const chipMessage = `Build #${latestBuild}`;
                
                const chip = (
                    <WarningChip
                        message={GetTitle(chipMessage)}
                        borderColor="#eaeaea"
                        fontSize="0.75rem"
                        showIcon={hasMultipleBuilds}
                        icon={<ExpandMore/>}
                        iconPosition="right"
                    />
                );

                return showTooltip && hasMultipleBuilds ? (
                    <GlassTooltip title={tooltipContent} placement="bottom">
                        <Box component="span" display="inline-flex">
                            {chip}
                        </Box>
                    </GlassTooltip>
                ) : chip;
            })()}
            {bug.tags?.map((tag) => (
                <WarningChip
                    key={tag.name}
                    message={GetTitle(tag.name)}
                    size="small"
                    borderColor={tag.color}
                    fontSize="0.75rem"
                />
            ))}
        </Stack>
    );
};
