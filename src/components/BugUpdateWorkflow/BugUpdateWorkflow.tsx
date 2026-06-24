import React, { useState, useEffect, useRef } from "react";
import {
    Dialog,
    DialogContent,
    DialogActions,
    TextField,
    Box,
    Typography,
    IconButton,
    Alert,
    Divider,
    Stack,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Bug, SEVERITY_COLORS, STATUS } from "@data/bugs";
import SpellButton from "@components/SpellButtons/SpellButton";
import { BugChips } from "@components/BugChips/BugChips";
import { GlassBox } from "@components/Glass/Box/GlassBox";
import SwirlButton from "@components/Buttons/SwirlButton";
import SpellLink from "@components/SpellLink/SpellLink";

interface BugUpdateWorkflowProps {
    open: boolean;
    onClose: () => void;
    bugs: Bug[];
    originalIndices: number[];
    specKey: string;
    bugsFilePath?: string;
}

enum WorkflowStep {
    SOURCE_INPUT = "SOURCE_INPUT",
    BUILD_INPUT = "BUILD_INPUT",
    BUG_REVIEW = "BUG_REVIEW",
    COMPLETE = "COMPLETE",
}

interface BugUpdate {
    index: number;
    oldBuild: string | undefined;
    newBuild?: string;
    oldStatus: string | undefined;
    newStatus?: string;
}

const BugUpdateWorkflow: React.FC<BugUpdateWorkflowProps> = ({ 
    open, 
    onClose, 
    bugs, 
    originalIndices,
    specKey,
}) => {
    const [step, setStep] = useState<WorkflowStep>(WorkflowStep.SOURCE_INPUT);
    const [originalSource, setOriginalSource] = useState<string>("");
    const [buildNumber, setBuildNumber] = useState("");
    const [currentBugIndex, setCurrentBugIndex] = useState(0);
    const [bugUpdates, setBugUpdates] = useState<BugUpdate[]>([]);
    const [sourceCode, setSourceCode] = useState<string>("");
    const [copySuccess, setCopySuccess] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const textFieldRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (sourceCode && textFieldRef.current) {
            const input = textFieldRef.current.querySelector('textarea');
            if (input) {
                input.scrollTop = 0;
            }
        }
    }, [sourceCode]);

    const resetWorkflow = () => {
        setStep(WorkflowStep.SOURCE_INPUT);
        setOriginalSource("");
        setBuildNumber("");
        setCurrentBugIndex(0);
        setBugUpdates([]);
        setSourceCode("");
        setCopySuccess(false);
    };

    const handleClose = () => {
        resetWorkflow();
        onClose();
    };

    const proceedToBuildInput = () => {
        if (!originalSource.trim()) return;
        setStep(WorkflowStep.BUILD_INPUT);
    };

    const startReview = () => {
        if (!buildNumber.trim()) return;
        setBugUpdates([]);
        setStep(WorkflowStep.BUG_REVIEW);
    };
    const handleBugResponse = (action: 'fixed' | 'removed' | 'unknown' | 'broken') => {
        const currentBug = bugs[currentBugIndex];
        const oldBuild = currentBug.buildsTested?.[currentBug.buildsTested.length - 1];
        
        if (action === 'broken') {
            const update: BugUpdate = {
                index: originalIndices[currentBugIndex],
                oldBuild,
                newBuild: buildNumber.trim(),
                oldStatus: currentBug.status,
            };
            setBugUpdates(prev => [...prev, update]);
        } else if (action === 'fixed') {
            const update: BugUpdate = {
                index: originalIndices[currentBugIndex],
                oldBuild,
                newBuild: buildNumber.trim(),
                oldStatus: currentBug.status,
                newStatus: STATUS.FIXED,
            };
            setBugUpdates(prev => [...prev, update]);
        } else if (action === 'removed') {
            const update: BugUpdate = {
                index: originalIndices[currentBugIndex],
                oldBuild,
                newBuild: buildNumber.trim(),
                oldStatus: bugs[currentBugIndex].status,
                newStatus: STATUS.REMOVED,
            };
            setBugUpdates(prev => [...prev, update]);
        }
        // i guess don't really do anything for unknown, just skip

        if (currentBugIndex < bugs.length - 1) {
            setCurrentBugIndex(currentBugIndex + 1);
        } else {
            generateUpdatedCode();
        }
    };

    const handleSkipRest = () => {
        generateUpdatedCode();
    };

    const handlePrevious = () => {
        if (currentBugIndex > 0) {
            const currentOriginalIndex = originalIndices[currentBugIndex];
            const previousOriginalIndex = originalIndices[currentBugIndex - 1];
            setBugUpdates(prev => prev.filter(update => 
                update.index !== currentOriginalIndex && update.index !== previousOriginalIndex
            ));
            setCurrentBugIndex(currentBugIndex - 1);
        }
    };
    
    // ty claude for these holy moly
    const findArrayBoundaries = (source: string, arrayStart: number) => {
        const exportIdx = source.indexOf('\nexport default', arrayStart);
        if (exportIdx === -1) return -1;
        // Walk backwards from export to find the closing ];
        for (let i = exportIdx - 1; i >= arrayStart; i--) {
            if (source[i] === ']') return i;
        }
        return -1;
    };

    const parseIndividualBugs = (arrayContent: string): string[] => {
        const bugs: string[] = [];
        let currentBug = '';
        let depth = 0;
        let inString = false;
        let stringChar = '';
        
        for (let i = 0; i < arrayContent.length; i++) {
            const char = arrayContent[i];
            const prevChar = i > 0 ? arrayContent[i - 1] : '';
            
            if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
                if (!inString) {
                    inString = true;
                    stringChar = char;
                } else if (char === stringChar) {
                    inString = false;
                }
            }
            
            if (!inString) {
                if (char === '{') {
                    if (depth === 0) currentBug = char;
                    else currentBug += char;
                    depth++;
                } else if (char === '}') {
                    depth--;
                    currentBug += char;
                    if (depth === 0) {
                        bugs.push(currentBug);
                        currentBug = '';
                    }
                } else if (depth > 0) {
                    currentBug += char;
                }
            } else if (depth > 0) {
                currentBug += char;
            }
        }
        
        return bugs;
    };

    const updateBugBuildNumber = (bugText: string, newBuild: string): string => {
        const buildsTestedRegex = /buildsTested:\s*\[(.*?)\]/;
        const buildsTestedMatch = bugText.match(buildsTestedRegex);
        
        if (buildsTestedMatch) {
            const buildsStr = buildsTestedMatch[1];
            const builds = buildsStr.split(',').map(b => b.trim().replace(/"/g, '')).filter(b => b);
            
            if (!builds.includes(newBuild)) {
                builds.push(newBuild);
            }
            
            const newBuildsStr = `buildsTested: [${builds.map(b => `"${b}"`).join(", ")}]`;
            return bugText.replace(buildsTestedRegex, newBuildsStr);
        }
        
        const severityMatch = bugText.match(/(severity:\s*SEVERITY\.[A-Z]+,)/);
        if (severityMatch) {
            return bugText.replace(severityMatch[0], `${severityMatch[0]}\n        buildsTested: ["${newBuild}"],`);
        }
        
        return bugText;
    };

    const updateBugStatus = (bugText: string, newStatus: string): string => {
        const statusValue = newStatus.toUpperCase();
        const statusRegex = /status:\s*STATUS\.[A-Z]+,/;
        
        if (statusRegex.test(bugText)) {
            return bugText.replace(statusRegex, `status: STATUS.${statusValue},`);
        }
        
        const lastCommaIndex = bugText.lastIndexOf(',');
        if (lastCommaIndex !== -1) {
            return bugText.substring(0, lastCommaIndex + 1) + 
                   `\n        status: STATUS.${statusValue},` + 
                   bugText.substring(lastCommaIndex + 1);
        }
        
        return bugText;
    };

    const generateUpdatedCode = async () => {
        setIsGenerating(true);
        setStep(WorkflowStep.COMPLETE);
        
        const bugsArrayStart = originalSource.indexOf('const BUGS: Bug[] = [');
        if (bugsArrayStart === -1) {
            setSourceCode("Error: Could not find 'const BUGS: Bug[] = [' in the source code.");
            setIsGenerating(false);
            return;
        }
        
        const afterArrayStart = bugsArrayStart + 'const BUGS: Bug[] = ['.length;
        const arrayEndIndex = findArrayBoundaries(originalSource, afterArrayStart);
        
        if (arrayEndIndex === -1) {
            setSourceCode("Error: Could not find the end of BUGS array.");
            setIsGenerating(false);
            return;
        }
        
        const arrayContent = originalSource.substring(afterArrayStart, arrayEndIndex);
        const parsedBugs = parseIndividualBugs(arrayContent);
        
        bugUpdates.forEach(update => {
            if (update.index >= parsedBugs.length) return;
            
            let bugText = parsedBugs[update.index];
            
            if (update.newBuild) {
                bugText = updateBugBuildNumber(bugText, update.newBuild);
            }
            
            if (update.newStatus) {
                bugText = updateBugStatus(bugText, update.newStatus);
            }
            
            parsedBugs[update.index] = bugText;
        });
        
        const beforeArray = originalSource.substring(0, afterArrayStart);
        const afterArray = originalSource.substring(arrayEndIndex);
        const indentedBugs = parsedBugs.map(bug => '    ' + bug);
        const newArrayContent = '\n' + indentedBugs.join(',\n') + (parsedBugs.length > 0 ? ',' : '') + '\n';
        
        setSourceCode(beforeArray + newArrayContent + afterArray);
        setIsGenerating(false);
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(sourceCode);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
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
                            <SpellButton selectedSpell={currentBug.spell} size={48} />
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
                        {step === WorkflowStep.SOURCE_INPUT && "Paste Bugs Source Code"}
                        {step === WorkflowStep.BUILD_INPUT && "Enter Build Number"}
                        {step === WorkflowStep.COMPLETE && "Update Complete"}
                    </Typography>
                )}
            </Box>

            <Divider />

            <DialogContent sx={{ p: 0 }}>
                <Box sx={{ px: 3, py: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                    {step === WorkflowStep.SOURCE_INPUT && (
                        <>
                            <Typography variant="body2" color="text.secondary">
                                Paste the entire content of your bugs.tsx file here. This will be used to generate the updated version with new build numbers.
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={15}
                                value={originalSource}
                                onChange={(e) => setOriginalSource(e.target.value)}
                                placeholder="Paste your bugs.tsx file content here..."
                                autoFocus
                                sx={{ "& .MuiInputBase-root": { fontFamily: "monospace", fontSize: "0.85rem", alignItems: "flex-start" } }}
                            />
                            <Typography variant="caption" color="text.secondary">
                                You will review {bugs.length} open {bugs.length === 1 ? 'bug' : 'bugs'} for {specKey}.
                            </Typography>
                        </>
                    )}

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
                                You will review {bugs.length} open {bugs.length === 1 ? 'bug' : 'bugs'} for {specKey}.
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
                            {isGenerating ? (
                                <Typography variant="body1" color="text.secondary">
                                    Generating updated code...
                                </Typography>
                            ) : (
                                <>
                                    <Alert severity="success" sx={{ borderRadius: 1 }}>
                                        Review complete! {bugUpdates.length} bug(s) updated.
                                    </Alert>
                                    <Typography variant="body2" color="text.secondary">
                                        Copy the updated code below and replace your entire bugs.tsx file content:
                                    </Typography>
                                    <Box sx={{ position: "relative" }}>
                                        <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 2 }} onClick={copyToClipboard}>
                                            <GlassBox sx={{ cursor: "pointer" }}>
                                                <IconButton size="small" sx={{ color: copySuccess ? "success.main" : "primary.light", p: 0.5 }}>
                                                    <ContentCopyIcon fontSize="small" />
                                                </IconButton>
                                            </GlassBox>
                                        </Box>
                                        <TextField
                                            ref={textFieldRef}
                                            fullWidth
                                            multiline
                                            minRows={20}
                                            maxRows={25}
                                            value={sourceCode}
                                            onChange={(e) => setSourceCode(e.target.value)}
                                            InputProps={{ style: { fontFamily: "monospace", fontSize: "0.85rem" } }}
                                            sx={{
                                                "& .MuiInputBase-root": { alignItems: "flex-start" },
                                                "& .MuiInputBase-input": { whiteSpace: "pre", overflowWrap: "normal", overflowX: "auto" },
                                            }}
                                        />
                                    </Box>
                                    {copySuccess && (
                                        <Typography variant="caption" color="success.main">
                                            Copied to clipboard!
                                        </Typography>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </Box>
            </DialogContent>

            <Divider />
            <DialogActions sx={{ px: 2, py: 0.75 }}>
                {step === WorkflowStep.SOURCE_INPUT && (
                    <>
                        <SwirlButton onClick={handleClose}>Cancel</SwirlButton>
                        <SwirlButton onClick={proceedToBuildInput} disabled={!originalSource.trim()} color="primary">Next</SwirlButton>
                    </>
                )}
                {step === WorkflowStep.BUILD_INPUT && (
                    <>
                        <SwirlButton onClick={() => setStep(WorkflowStep.SOURCE_INPUT)}>Back</SwirlButton>
                        <Box sx={{ flex: 1 }} />
                        <SwirlButton onClick={handleClose}>Cancel</SwirlButton>
                        <SwirlButton onClick={startReview} disabled={!buildNumber.trim()} color="primary">Start Review</SwirlButton>
                    </>
                )}
                {step === WorkflowStep.BUG_REVIEW && (
                    <>
                        <SwirlButton onClick={handlePrevious} disabled={currentBugIndex === 0}>Previous</SwirlButton>
                        <SwirlButton onClick={handleSkipRest}>Skip Rest</SwirlButton>
                        <Box sx={{ flex: 1 }} />
                        <SwirlButton onClick={() => handleBugResponse('fixed')} color="success" textColor="success">No (Fixed)</SwirlButton>
                        <SwirlButton onClick={() => handleBugResponse('removed')} color="info" textColor="info">Removed</SwirlButton>
                        <SwirlButton onClick={() => handleBugResponse('unknown')} color="warning" textColor="warning">I Don't Know</SwirlButton>
                        <SwirlButton onClick={() => handleBugResponse('broken')} color="error" textColor="error">Yes (Broken)</SwirlButton>
                    </>
                )}
                {step === WorkflowStep.COMPLETE && (
                    <SwirlButton onClick={handleClose} color="primary">Done</SwirlButton>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default BugUpdateWorkflow;
