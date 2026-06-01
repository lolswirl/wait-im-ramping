import React, { useState, useEffect, useRef } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    IconButton,
    Alert,
    Card,
    CardContent,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Bug, SEVERITY_COLORS, STATUS } from "@data/bugs";
import { T } from "@util/T";
import SpellButton from "@components/SpellButtons/SpellButton";
import { BugChips } from "@components/BugChips/BugChips";
import { GlassBox } from "@components/Glass/Box/GlassBox";

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
        let braceCount = 1;
        let squareBraceCount = 1;
        let inString = false;
        let stringChar = '';
        
        for (let i = arrayStart; i < source.length; i++) {
            const char = source[i];
            const prevChar = i > 0 ? source[i - 1] : '';
            
            if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
                if (!inString) {
                    inString = true;
                    stringChar = char;
                } else if (char === stringChar) {
                    inString = false;
                }
                continue;
            }
            
            if (inString) continue;
            
            if (char === '{') braceCount++;
            if (char === '}') braceCount--;
            if (char === '[') squareBraceCount++;
            if (char === ']') {
                squareBraceCount--;
                if (squareBraceCount === 0 && braceCount === 1) {
                    return i;
                }
            }
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
                    backgroundColor: "rgba(20, 20, 30, 0.95)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: 1,
                }
            }}
        >
            <DialogTitle>
                {step === WorkflowStep.SOURCE_INPUT && "Paste Bugs Source Code"}
                {step === WorkflowStep.BUILD_INPUT && "Enter Build Number"}
                {step === WorkflowStep.BUG_REVIEW && `${("Bug Review")} (${currentBugIndex + 1} / ${bugs.length})`}
                {step === WorkflowStep.COMPLETE && "Update Complete"}
            </DialogTitle>

            <DialogContent>
                {step === WorkflowStep.SOURCE_INPUT && (
                    <Box sx={{ pt: 2 }}>
                        <Typography variant="body2" sx={{ mb: 2, color: "rgba(255,255,255,0.7)" }}>
                            Paste the entire content of your bugs.tsx file here. This will be used to generate the updated version with new build numbers.
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={15}
                            value={originalSource}
                            onChange={(e) => setOriginalSource(e.target.value)}
                            placeholder={("Paste your bugs.tsx file content here...")}
                            autoFocus
                            sx={{
                                "& .MuiInputBase-root": {
                                    fontFamily: "monospace",
                                    fontSize: "0.85rem",
                                    backgroundColor: "rgba(50, 50, 50, 0.85)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: 1,
                                    "&:hover": {
                                        backgroundColor: "rgba(55, 55, 55, 0.9)",
                                    },
                                }
                            }}
                        />
                        <Typography variant="caption" sx={{ mt: 1, display: "block", color: "info.main" }}>
                            You will review {bugs.length} open {bugs.length === 1 ? 'bug' : 'bugs'} for {specKey}.
                        </Typography>
                    </Box>
                )}

                {step === WorkflowStep.BUILD_INPUT && (
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            fullWidth
                            label={("Build Number")}
                            value={buildNumber}
                            onChange={(e) => setBuildNumber(e.target.value)}
                            placeholder={("e.g., 66220")}
                            autoFocus
                            onKeyPress={(e) => {
                                if (e.key === "Enter" && buildNumber.trim()) {
                                    startReview();
                                }
                            }}
                            sx={{
                                "& .MuiInputBase-root": {
                                    backgroundColor: "rgba(50, 50, 50, 0.85)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: 1,
                                    "&:hover": {
                                        backgroundColor: "rgba(55, 55, 55, 0.9)",
                                    },
                                }
                            }}
                        />
                        <Typography variant="caption" sx={{ mt: 1, display: "block", color: "rgba(255,255,255,0.7)" }}>
                            This build number will be added to buildsTested for bugs that are still broken.
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 2, color: "info.main" }}>
                            You will review {bugs.length} open {bugs.length === 1 ? 'bug' : 'bugs'} for {specKey}.
                        </Typography>
                    </Box>
                )}

                {step === WorkflowStep.BUG_REVIEW && currentBug && (
                    <Box sx={{ pt: 2 }}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" color="rgba(255,255,255,0.7)">
                                Progress: {progress}% ({currentBugIndex + 1} of {bugs.length})
                            </Typography>
                            <Box
                                sx={{
                                    width: "100%",
                                    height: 4,
                                    backgroundColor: "rgba(255,255,255,0.1)",
                                    borderRadius: 1,
                                    overflow: "hidden",
                                    mt: 0.5,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: `${progress}%`,
                                        height: "100%",
                                        backgroundColor: "primary.main",
                                        transition: "width 0.3s ease",
                                    }}
                                />
                            </Box>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                            <SpellButton selectedSpell={currentBug.spell} size={56} />
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ mb: 0.5, color: "white" }}>
                                    {currentBug.spell.name}
                                </Typography>
                                <BugChips bug={currentBug} />
                            </Box>
                        </Box>

                        <Typography variant="h6" sx={{ mb: 2, color: "white", lineHeight: 1.3 }}>
                            {currentBug.title}
                        </Typography>

                        {currentBug.description && (
                            <Card
                                sx={{
                                    backgroundColor: "rgba(50, 50, 50, 0.85)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: 1,
                                    backdropFilter: "blur(1px)",
                                    transition: "all 0.2s ease",
                                    mb: 1.5,
                                    "&:hover": {
                                        backgroundColor: "rgba(55, 55, 55, 0.9)",
                                        border: `1px solid ${SEVERITY_COLORS[currentBug.severity]}`,
                                    }
                                }}
                            >
                                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                                    <Typography
                                        variant="overline"
                                        sx={{
                                            color: "#f48fb1",
                                            fontWeight: 800,
                                            fontSize: '0.75rem',
                                            letterSpacing: 1.2,
                                            mb: 1.5,
                                            mt: 0,
                                            lineHeight: 1,
                                            display: "block",
                                            textTransform: "none",
                                        }}
                                    >
                                        Description
                                    </Typography>
                                    <Typography
                                        component="div"
                                        variant="body2"
                                        sx={{
                                            whiteSpace: "pre-line",
                                            color: "rgba(255,255,255,0.95)",
                                            fontWeight: 400,
                                            lineHeight: 1.7,
                                            fontSize: "0.9rem",
                                        }}
                                    >
                                        {currentBug.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        )}

                        {currentBug.notes && (
                            <Card
                                sx={{
                                    backgroundColor: "rgba(50, 50, 50, 0.85)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: 1,
                                    backdropFilter: "blur(1px)",
                                    transition: "all 0.2s ease",
                                    mb: 1.5,
                                    "&:hover": {
                                        backgroundColor: "rgba(55, 55, 55, 0.9)",
                                        border: `1px solid ${SEVERITY_COLORS[currentBug.severity]}`,
                                    }
                                }}
                            >
                                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                                    <Typography
                                        variant="overline"
                                        sx={{
                                            color: "#ce93d8",
                                            fontWeight: 800,
                                            fontSize: '0.75rem',
                                            letterSpacing: 1.2,
                                            mb: 1.5,
                                            mt: 0,
                                            lineHeight: 1,
                                            display: "block",
                                            textTransform: "none",
                                        }}
                                    >
                                        Notes
                                    </Typography>
                                    <Typography
                                        component="div"
                                        variant="body2"
                                        sx={{
                                            whiteSpace: "pre-line",
                                            color: "rgba(255,255,255,0.95)",
                                            fontWeight: 400,
                                            lineHeight: 1.7,
                                            fontSize: "0.9rem",
                                        }}
                                    >
                                        {currentBug.notes}
                                    </Typography>
                                </CardContent>
                            </Card>
                        )}

                        <Typography variant="h6" sx={{ mt: 3, mb: 1, textAlign: "center", color: "white" }}>
                            Is this bug still broken in build {buildNumber}?
                        </Typography>
                    </Box>
                )}

                {step === WorkflowStep.COMPLETE && (
                    <Box sx={{ pt: 2 }}>
                        {isGenerating ? (
                            <Typography variant="body1" sx={{ mb: 2, color: "info.main" }}>
                                Generating updated code...
                            </Typography>
                        ) : (
                            <>
                                <Alert severity="success" sx={{ mb: 2, borderRadius: 1 }}>
                                    Review complete! {bugUpdates.length} bug(s) updated.
                                </Alert>
                                
                                <Typography variant="body2" sx={{ mb: 2, color: "rgba(255,255,255,0.7)" }}>
                                    Copy the updated code below and replace your entire bugs.tsx file content:
                                </Typography>
                                
                                <Box sx={{ position: "relative" }}>
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: 8,
                                            right: 8,
                                            zIndex: 2,
                                            cursor: "pointer",
                                        }}
                                        onClick={copyToClipboard}
                                    >
                                        <GlassBox>
                                            <IconButton
                                                size="small"
                                                sx={{
                                                    color: copySuccess ? "success.main" : "primary.light",
                                                    p: 0.5,
                                                }}
                                            >
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
                                        InputProps={{
                                            style: {
                                                fontFamily: "monospace",
                                                fontSize: "0.85rem",
                                            }
                                        }}
                                        sx={{
                                            "& .MuiInputBase-root": {
                                                backgroundColor: "rgba(50, 50, 50, 0.85)",
                                                border: "1px solid rgba(255,255,255,0.1)",
                                                borderRadius: 1,
                                                alignItems: "flex-start",
                                                "&:hover": {
                                                    backgroundColor: "rgba(55, 55, 55, 0.9)",
                                                },
                                            },
                                            "& .MuiInputBase-input": {
                                                whiteSpace: "pre",
                                                overflowWrap: "normal",
                                                overflowX: "auto",
                                            }
                                        }}
                                    />
                                </Box>

                                {copySuccess && (
                                    <Typography variant="caption" sx={{ mt: 1, display: "block", color: "success.main" }}>
                                        Copied to clipboard!
                                    </Typography>
                                )}
                            </>
                        )}
                    </Box>
                )}
            </DialogContent>

            <DialogActions>
                {step === WorkflowStep.SOURCE_INPUT && (
                    <>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button
                            onClick={proceedToBuildInput}
                            variant="contained"
                            disabled={!originalSource.trim()}
                        >
                            Next
                        </Button>
                    </>
                )}

                {step === WorkflowStep.BUILD_INPUT && (
                    <>
                        <Button onClick={() => setStep(WorkflowStep.SOURCE_INPUT)}>Back</Button>
                        <Box sx={{ flex: 1 }} />
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button
                            onClick={startReview}
                            variant="contained"
                            disabled={!buildNumber.trim()}
                        >
                            Start Review
                        </Button>
                    </>
                )}

                {step === WorkflowStep.BUG_REVIEW && (
                    <>
                        <Button onClick={handlePrevious} disabled={currentBugIndex === 0}>
                            Previous
                        </Button>
                        <Button onClick={handleSkipRest}>
                            Skip Rest
                        </Button>
                        <Box sx={{ flex: 1 }} />
                        <Button
                            onClick={() => handleBugResponse('fixed')}
                            variant="outlined"
                            color="success"
                            sx={{ minWidth: 120 }}
                        >
                            No (Fixed)
                        </Button>
                        <Button
                            onClick={() => handleBugResponse('removed')}
                            variant="outlined"
                            color="info"
                            sx={{ minWidth: 120 }}
                        >
                            Removed
                        </Button>
                        <Button
                            onClick={() => handleBugResponse('unknown')}
                            variant="outlined"
                            color="warning"
                            sx={{ minWidth: 120 }}
                        >
                            I Don't Know
                        </Button>
                        <Button
                            onClick={() => handleBugResponse('broken')}
                            variant="contained"
                            color="error"
                            sx={{ minWidth: 120 }}
                        >
                            Yes (Broken)
                        </Button>
                    </>
                )}

                {step === WorkflowStep.COMPLETE && (
                    <>
                        <Button onClick={handleClose} variant="contained">
                            Done
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default BugUpdateWorkflow;
