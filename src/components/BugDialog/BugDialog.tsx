import React from "react";
import {
    Dialog,
    DialogContent,
    DialogActions,
    Typography,
    Box,
    Stack,
    Divider,
} from "@mui/material";
import SpellLink from "@components/SpellLink/SpellLink";
import SwirlLink from "@components/SwirlLink/SwirlLink";
import { formatLogUrl } from "@util/stringManipulation";
import { Bug, SEVERITY_COLORS } from "@data/bugs";
import SwirlButton from "@components/Buttons/SwirlButton";
import { BugChips } from "@components/BugChips/BugChips";

interface BugDialogProps {
    open: boolean;
    bug: Bug | null;
    onClose: () => void;
}

const Section: React.FC<{ label: string; children: React.ReactNode; severityColor: string }> = ({ label, children, severityColor }) => (
    <Box sx={{
        pl: 2,
        borderLeft: "2px solid",
        borderColor: severityColor,
        pr: 1.5,
        py: 0.5,
    }}>
        <Typography variant="body1" color="text.primary" fontWeight={600} sx={{ display: "block", mb: 0.5 }}>
            {label}
        </Typography>
        {children}
    </Box>
);

const BugDialog: React.FC<BugDialogProps> = ({ open, bug, onClose }) => {
    if (!bug) return null;

    const severityColor = SEVERITY_COLORS[bug.severity];

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: "background.paper",
                    backgroundImage: "none",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    overflow: "hidden",
                    minWidth: 400,
                    maxWidth: 680,
                },
            }}
        >
            <Box sx={{ height: 3, background: severityColor }} />

            <Box sx={{ px: 3, pt: 2.5, pb: 2, backgroundColor: `${severityColor}0d` }}>
                <Stack spacing={0.75}>
                    <SpellLink spell={bug.spell} size={18} textSx={{ fontSize: "0.78rem", color: "text.secondary" }} noLink />
                    <Typography variant="h6" fontWeight={600} lineHeight={1.3}>
                        {bug.title}
                    </Typography>
                    <BugChips bug={bug} />
                </Stack>
            </Box>

            <DialogContent sx={{ p: 0 }}>
                <Divider />
                <Box sx={{ px: 3, py: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                    {bug.description && (
                        <Section label="Description" severityColor={severityColor}>
                            <Typography component="div" variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                {bug.description}
                            </Typography>
                        </Section>
                    )}
                    {bug.notes && (
                        <Section label="Notes" severityColor={severityColor}>
                            <Typography component="div" variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                {bug.notes}
                            </Typography>
                        </Section>
                    )}
                    {bug.logs && bug.logs.length > 0 && (
                        <Section label="Logs" severityColor={severityColor}>
                            <Stack spacing={0.75}>
                                {bug.logs.map((log, i) => (
                                    <Box key={i} sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                                        {log.label && (
                                            <>
                                                <Typography variant="caption" color="text.disabled">{log.label}</Typography>
                                                <Typography variant="caption" color="text.disabled">—</Typography>
                                            </>
                                        )}
                                        <SwirlLink href={log.url} target="_blank" sx={{ fontSize: "0.85rem", wordBreak: "break-all" }}>
                                            {formatLogUrl(log.url)}
                                        </SwirlLink>
                                    </Box>
                                ))}
                            </Stack>
                        </Section>
                    )}
                </Box>
            </DialogContent>

            <Divider />
            <DialogActions sx={{ px: 2, py: 0.75 }}>
                <SwirlButton onClick={onClose}>Close</SwirlButton>
            </DialogActions>
        </Dialog>
    );
};

export default BugDialog;
