import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogActions,
    TextField,
    Box,
    Typography,
    Alert,
    Divider,
    Stack,
} from "@mui/material";
import { Bug, SEVERITY_COLORS, STATUS } from "@data/bugs";
import SpellButton from "@components/SpellButtons/SpellButton";
import { BugChips } from "@components/BugChips/BugChips";
import SwirlButton from "@components/Buttons/SwirlButton";
import SpellLink from "@components/SpellLink/SpellLink";
import { FONT, ICON } from "@components/Theme/tokens";

// served by scripts/bug-update-server.mjs (npm run bugs)
const UPDATE_URL = "http://localhost:3111/update";

interface BugUpdateWorkflowProps {
    open: boolean;
    onClose: () => void;
    bugs: Bug[];
    originalIndices: number[];
    specKey: string;
    specName: string;
}

enum WorkflowStep {
    BUILD_INPUT = "BUILD_INPUT",
    BUG_REVIEW = "BUG_REVIEW",
    COMPLETE = "COMPLETE",
}

interface BugUpdate {
    reviewIndex: number;
    index: number;
    build: string;
    status?: string;
}

const BugUpdateWorkflow: React.FC<BugUpdateWorkflowProps> = ({
    open,
    onClose,
    bugs,
    originalIndices,
    specKey,
    specName,
}) => {
    const [step, setStep] = useState<WorkflowStep>(WorkflowStep.BUILD_INPUT);
    const [buildNumber, setBuildNumber] = useState("");
    const [currentBugIndex, setCurrentBugIndex] = useState(0);
    const [bugUpdates, setBugUpdates] = useState<BugUpdate[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [savedFiles, setSavedFiles] = useState<string[]>([]);

    const resetWorkflow = () => {
        setStep(WorkflowStep.BUILD_INPUT);
        setBuildNumber("");
        setCurrentBugIndex(0);
        setBugUpdates([]);
        setSaveError(null);
        setSavedFiles([]);
    };

    const handleClose = () => {
        resetWorkflow();
        onClose();
    };

    const startReview = () => {
        if (!buildNumber.trim()) return;
        setBugUpdates([]);
        setStep(WorkflowStep.BUG_REVIEW);
    };

    const handleBugResponse = (action: 'fixed' | 'removed' | 'unknown' | 'broken') => {
        let updates = bugUpdates;

        // i guess don't really do anything for unknown, just skip
        if (action !== 'unknown') {
            const update: BugUpdate = {
                reviewIndex: currentBugIndex,
                index: originalIndices[currentBugIndex],
                build: buildNumber.trim(),
            };
            if (action === 'fixed') update.status = STATUS.FIXED;
            if (action === 'removed') update.status = STATUS.REMOVED;
            updates = [...bugUpdates, update];
            setBugUpdates(updates);
        }

        if (currentBugIndex < bugs.length - 1) {
            setCurrentBugIndex(currentBugIndex + 1);
        } else {
            saveUpdates(updates);
        }
    };

    const handleSkipRest = () => {
        saveUpdates(bugUpdates);
    };

    const handlePrevious = () => {
        if (currentBugIndex > 0) {
            setBugUpdates(prev => prev.filter(update => update.reviewIndex < currentBugIndex - 1));
            setCurrentBugIndex(currentBugIndex - 1);
        }
    };

    const saveUpdates = async (updates: BugUpdate[]) => {
        setStep(WorkflowStep.COMPLETE);
        setSaveError(null);
        setIsSaving(true);

        try {
            const response = await fetch(UPDATE_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ spec: specKey, updates }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error);
            setSavedFiles(result.files);
        } catch (err) {
            setSaveError(err instanceof TypeError
                ? "Could not reach the bug update server. Start it with `npm run bugs`, then retry."
                : (err as Error).message);
        }

        setIsSaving(false);
    };

    const currentBug = bugs[currentBugIndex];
    const progress = bugs.length > 0 ? Math.round(((currentBugIndex + 1) / bugs.length) * 100) : 0;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: "background.paper",
                    backgroundImage: "none",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    overflow: "hidden",
                },
            }}
        >
            {/* Severity accent bar — only shown during bug review */}
            {step === WorkflowStep.BUG_REVIEW && currentBug && (
                <Box sx={{ height: 3, background: SEVERITY_COLORS[currentBug.severity] }} />
            )}

            {/* Header */}
            <Box sx={{
                px: 3,
                pt: 2.5,
                pb: 2,
                backgroundColor: step === WorkflowStep.BUG_REVIEW && currentBug
                    ? `${SEVERITY_COLORS[currentBug.severity]}0d`
                    : undefined,
            }}>
                {step === WorkflowStep.BUG_REVIEW && currentBug ? (
                    <>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                            <SpellButton selectedSpell={currentBug.spell} size={ICON.xl} />
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                                    {currentBug.spell.name}
                                </Typography>
                                <Typography variant="h6" fontWeight={600} lineHeight={1.3}>
                                    {currentBug.title}
                                </Typography>
                            </Box>
                        </Box>
                        <BugChips bug={currentBug} />
                        {/* Progress bar */}
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                                {currentBugIndex + 1} of {bugs.length}
                            </Typography>
                            <Box sx={{ width: "100%", height: 3, bgcolor: "divider", borderRadius: 1, overflow: "hidden", mt: 0.5 }}>
                                <Box sx={{ width: `${progress}%`, height: "100%", bgcolor: "primary.main", transition: "width 0.3s ease" }} />
                            </Box>
                        </Box>
                    </>
                ) : (
                    <Typography variant="h6" fontWeight={600}>
                        {step === WorkflowStep.BUILD_INPUT && "Enter Build Number"}
                        {step === WorkflowStep.COMPLETE && "Update Complete"}
                    </Typography>
                )}
            </Box>

            <Divider />

            <DialogContent sx={{ p: 0 }}>
                <Box sx={{ px: 3, py: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                    {step === WorkflowStep.BUILD_INPUT && (
                        <>
                            <TextField
                                fullWidth
                                label="Build Number"
                                value={buildNumber}
                                onChange={(e) => setBuildNumber(e.target.value)}
                                placeholder="e.g., 66220"
                                autoFocus
                                onKeyPress={(e) => { if (e.key === "Enter" && buildNumber.trim()) startReview(); }}
                            />
                            <Typography variant="caption" color="text.secondary">
                                This build number will be added to buildsTested for bugs that are still broken.
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                You will review {bugs.length} open {bugs.length === 1 ? 'bug' : 'bugs'} for {specName}.
                            </Typography>
                        </>
                    )}

                    {step === WorkflowStep.BUG_REVIEW && currentBug && (
                        <>
                            {currentBug.description && (
                                <Box sx={{ pl: 2, borderLeft: "2px solid", borderColor: SEVERITY_COLORS[currentBug.severity], pr: 1.5, py: 0.5 }}>
                                    <Typography variant="body1" color="text.primary" fontWeight={600} sx={{ display: "block", mb: 0.5 }}>
                                        Description
                                    </Typography>
                                    <Typography component="div" variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, whiteSpace: "pre-line" }}>
                                        {currentBug.description}
                                    </Typography>
                                </Box>
                            )}
                            {currentBug.notes && (
                                <Box sx={{ pl: 2, borderLeft: "2px solid", borderColor: SEVERITY_COLORS[currentBug.severity], pr: 1.5, py: 0.5 }}>
                                    <Typography variant="body1" color="text.primary" fontWeight={600} sx={{ display: "block", mb: 0.5 }}>
                                        Notes
                                    </Typography>
                                    <Typography component="div" variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, whiteSpace: "pre-line" }}>
                                        {currentBug.notes}
                                    </Typography>
                                </Box>
                            )}
                            <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", pt: 1 }}>
                                Is this bug still broken in build {buildNumber}?
                            </Typography>
                        </>
                    )}

                    {step === WorkflowStep.COMPLETE && (
                        <>
                            {isSaving ? (
                                <Typography variant="body1" color="text.secondary">
                                    Saving updates...
                                </Typography>
                            ) : saveError ? (
                                <Alert severity="error" sx={{ borderRadius: 1 }}>
                                    {saveError}
                                </Alert>
                            ) : (
                                <>
                                    <Alert severity="success" sx={{ borderRadius: 1 }}>
                                        Review complete! {bugUpdates.length} bug(s) updated.
                                    </Alert>
                                    {savedFiles.map(file => (
                                        <Typography key={file} sx={{ fontFamily: "monospace", fontSize: FONT.small, color: "text.secondary" }}>
                                            {file}
                                        </Typography>
                                    ))}
                                </>
                            )}
                        </>
                    )}
                </Box>
            </DialogContent>

            <Divider />
            <DialogActions sx={{ px: 2, py: 0.75 }}>
                {step === WorkflowStep.BUILD_INPUT && (
                    <>
                        <SwirlButton onClick={handleClose}>Cancel</SwirlButton>
                        <SwirlButton onClick={startReview} disabled={!buildNumber.trim()} color="primary">Start Review</SwirlButton>
                    </>
                )}
                {step === WorkflowStep.BUG_REVIEW && (
                    <>
                        <SwirlButton onClick={handlePrevious} disabled={currentBugIndex === 0}>Previous</SwirlButton>
                        <SwirlButton onClick={handleSkipRest}>Skip Rest</SwirlButton>
                        <Box sx={{ flex: 1 }} />
                        <SwirlButton onClick={() => handleBugResponse('fixed')} color="success">No (Fixed)</SwirlButton>
                        <SwirlButton onClick={() => handleBugResponse('removed')} color="info">Removed</SwirlButton>
                        <SwirlButton onClick={() => handleBugResponse('unknown')} color="warning">I Don't Know</SwirlButton>
                        <SwirlButton onClick={() => handleBugResponse('broken')} color="error">Yes (Broken)</SwirlButton>
                    </>
                )}
                {step === WorkflowStep.COMPLETE && (
                    <>
                        {saveError && <SwirlButton onClick={() => saveUpdates(bugUpdates)}>Retry</SwirlButton>}
                        <SwirlButton onClick={handleClose} color="primary">Done</SwirlButton>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default BugUpdateWorkflow;
