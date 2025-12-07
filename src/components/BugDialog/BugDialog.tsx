import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Box,
    Chip,
    Stack,
    Card,
    CardContent,
    Grid,
    Link,
} from "@mui/material";
import SpellButton from "@components/SpellButtons/SpellButton";
import { GetTitle } from "@util/stringManipulation";
import { Bug, STATUS, SEVERITY_COLORS, STATUS_COLORS, STATUS_BADGES } from "@data/bugs";
import { specialization } from "@data/class";
import SwirlButton from "@components/Buttons/SwirlButton";

interface BugDialogProps {
    open: boolean;
    bug: Bug | null;
    selectedSpec: specialization;
    onClose: () => void;
}

const parseNotesWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, index) => {
        if (part.match(urlRegex)) {
            let displayText = part;
            try {
                const url = new URL(part);
                displayText = url.hostname + (url.pathname !== '/' ? '/...' : '');
            } catch (e) {
                displayText = part.length > 50 ? part.substring(0, 47) + '...' : part;
            }
            
            return (
                <Link
                    key={index}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                        color: "primary",
                        textDecoration: "none",
                        fontWeight: 500,
                        "&:hover": {
                            textDecoration: "underline",
                            color: "primary.light",
                        }
                    }}
                >
                    {displayText}
                </Link>
            );
        }
        return <span key={index}>{GetTitle(part)}</span>;
    });
};

const BugDialog: React.FC<BugDialogProps> = ({
    open,
    bug,
    selectedSpec,
    onClose,
}) => {
    if (!bug) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: "rgba(26, 26, 26, 0.3)",
                    backdropFilter: "blur(8px)",
                    borderRadius: 1,
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
                    overflow: "hidden",
                    minWidth: 400,
                    maxWidth: 680,
                },
            }}
        >
            <DialogTitle
                sx={{
                    background: `linear-gradient(135deg, rgba(40,40,40,0.9) 0%, rgba(30,30,30,0.95) 100%)`,
                    color: "white",
                    px: 3,
                    py: 2.5,
                    borderBottom: "1px solid rgba(255,255,255,0.12)",
                    position: "relative",
                    overflow: "hidden",
                    "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "3px",
                        background: `linear-gradient(90deg, ${SEVERITY_COLORS[bug.severity]}, ${SEVERITY_COLORS[bug.severity]}80)`,
                    }
                }}
            >
                <Box display="flex" alignItems="center" gap={2.5} mb={1.5}>
                    {bug.spell && (
                        <Box sx={{ position: "relative" }}>
                            <SpellButton
                                spell={bug.spell}
                                selectedSpell={bug.spell}
                                action={() => {}}
                                size={52}
                            />
                        </Box>
                    )}
                    <Box flex={1}>
                        <Typography
                            variant="h5"
                            sx={{ 
                                fontWeight: 700, 
                                color: "white", 
                                mb: 0.5,
                                lineHeight: 1.2,
                                letterSpacing: "-0.01em"
                            }}
                        >
                            {GetTitle(bug.title)}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            {bug.status !== STATUS.OPEN && (
                                <Chip
                                    label={`${STATUS_BADGES[bug.status ?? STATUS.OPEN]} ${GetTitle(bug.status ?? STATUS.OPEN)}`}
                                    sx={{
                                        backgroundColor: STATUS_COLORS[bug.status ?? STATUS.OPEN],
                                        color: "#fff",
                                        fontWeight: 700,
                                        fontSize: '0.7rem',
                                        height: 24,
                                        "& .MuiChip-label": {
                                            px: 1.5
                                        }
                                    }}
                                    size="small"
                                />
                            )}
                        </Stack>
                    </Box>
                </Box>

                <Grid container spacing={1} sx={{ mt: 0.5, justifyContent: "flex-start", gap: 2 }}>
                    <Grid>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: "rgba(255,255,255,0.6)",
                                    fontWeight: 600,
                                    fontSize: '0.7rem',
                                    letterSpacing: 0.5,
                                }}
                            >
                                {GetTitle("Severity")}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: SEVERITY_COLORS[bug.severity],
                                    fontWeight: 700,
                                    fontSize: '0.8rem',
                                }}
                            >
                                {GetTitle(bug.severity)}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: "rgba(255,255,255,0.6)",
                                    fontWeight: 600,
                                    fontSize: '0.7rem',
                                    letterSpacing: 0.5,
                                }}
                            >
                                {GetTitle("Spec")}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: selectedSpec.color,
                                    fontWeight: 700,
                                    fontSize: '0.8rem',
                                }}
                            >
                                {GetTitle(selectedSpec.name)}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: "rgba(255,255,255,0.6)",
                                    fontWeight: 600,
                                    fontSize: '0.7rem',
                                    letterSpacing: 0.5,
                                }}
                            >
                                {GetTitle("Build")}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#ffb74d",
                                    fontWeight: 700,
                                    fontSize: '0.8rem',
                                }}
                            >
                                {bug.lastBuildTested ? GetTitle(bug.lastBuildTested) : GetTitle("Not specified")}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </DialogTitle>

            <DialogContent
                sx={{
                    p: 0,
                    backgroundColor: "rgba(18, 18, 18, 0.85)",
                    color: "white",
                }}
            >
                <Box p={2}>
                    <Grid container spacing={1.5} sx={{ height: "100%" }}>
                        <Grid size={{ xs: 12, md: 7 }} sx={{ display: "flex" }}>
                            <Card
                                sx={{
                                    backgroundColor: "rgba(45, 45, 45, 0.7)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: 1,
                                    backdropFilter: "blur(4px)",
                                    transition: "all 0.2s ease",
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    "&:hover": {
                                        backgroundColor: "rgba(50, 50, 50, 0.8)",
                                        border: "1px solid rgba(255,255,255,0.15)",
                                    }
                                }}
                            >
                                <CardContent sx={{ p: 2, "&:last-child": { pb: 2, pt: 2 }, flex: 1, display: "flex", flexDirection: "column" }}>
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
                                        {GetTitle("Description")}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            whiteSpace: "pre-line",
                                            color: "rgba(255,255,255,0.95)",
                                            fontWeight: 400,
                                            lineHeight: 1.7,
                                            fontSize: "0.9rem",
                                            flex: 1
                                        }}
                                    >
                                        {GetTitle(bug.description || bug.title)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid size={{ xs: 12, md: 5 }} sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                            <Card
                                sx={{
                                    backgroundColor: "rgba(45, 45, 45, 0.7)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: 1,
                                    mb: bug.notes ? 2 : 0,
                                    backdropFilter: "blur(4px)",
                                    transition: "all 0.2s ease",
                                    flex: bug.notes ? "none" : 1,
                                    "&:hover": {
                                        backgroundColor: "rgba(50, 50, 50, 0.8)",
                                        border: "1px solid rgba(255,255,255,0.15)",
                                    }
                                }}
                            >
                                <CardContent sx={{ p: 2, "&:last-child": { pb: 2, pt: 2 }, height: bug.notes ? "auto" : "100%", display: "flex", flexDirection: "column" }}>
                                    <Typography
                                        variant="overline"
                                        sx={{
                                            color: "#90caf9",
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
                                        {GetTitle("Affected Spells")}
                                    </Typography>
                                    <Stack direction="row" sx={{ gap: 0.75, flexWrap: "wrap", flex: bug.notes ? "none" : 1, alignItems: bug.notes ? "flex-start" : "center" }}>
                                        <SpellButton
                                            selectedSpell={bug.spell}
                                            action={() => {}}
                                            size={38}
                                        />
                                        {bug.affectedSpells?.map((spell, i) => (
                                            <SpellButton
                                                key={i}
                                                selectedSpell={spell}
                                                action={() => {}}
                                                size={38}
                                            />
                                        ))}
                                    </Stack>
                                </CardContent>
                            </Card>

                            {bug.notes && (
                                <Card
                                    sx={{
                                        backgroundColor: "rgba(45, 45, 45, 0.7)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        borderRadius: 1,
                                        backdropFilter: "blur(4px)",
                                        transition: "all 0.2s ease",
                                        flex: 1,
                                        minHeight: 0,
                                        "&:hover": {
                                            backgroundColor: "rgba(50, 50, 50, 0.8)",
                                            border: "1px solid rgba(255,255,255,0.15)",
                                        }
                                    }}
                                >
                                    <CardContent sx={{ 
                                        p: 2, 
                                        "&:last-child": { pb: 2, pt: 2 }, 
                                        height: "100%", 
                                        display: "flex", 
                                        flexDirection: "column",
                                        minHeight: 0,
                                        overflow: "hidden"
                                    }}>
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
                                                flexShrink: 0,
                                            }}
                                        >
                                            {GetTitle("Notes")}
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
                                                flex: 1,
                                                overflow: "auto",
                                                wordBreak: "break-word",
                                                overflowWrap: "break-word",
                                                minHeight: 0,
                                                paddingRight: "4px",
                                                "&::-webkit-scrollbar": {
                                                    width: "6px",
                                                },
                                                "&::-webkit-scrollbar-track": {
                                                    background: "rgba(255,255,255,0.1)",
                                                    borderRadius: "3px",
                                                },
                                                "&::-webkit-scrollbar-thumb": {
                                                    background: "rgba(255,255,255,0.3)",
                                                    borderRadius: "3px",
                                                    "&:hover": {
                                                        background: "rgba(255,255,255,0.5)",
                                                    }
                                                }
                                            }}
                                        >
                                            {parseNotesWithLinks(bug.notes)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            )}
                        </Grid>
                    </Grid>

                    {bug.tags && bug.tags.length > 0 && (
                        <Box mt={1.5} p={2} sx={{ 
                            backgroundColor: "rgba(35, 35, 35, 0.6)",
                            borderRadius: 1,
                            border: "1px solid rgba(255,255,255,0.08)"
                        }}>
                            <Typography
                                variant="overline"
                                sx={{ 
                                    color: "#a5d6a7", 
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
                                {GetTitle("Tags")}
                            </Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                {bug.tags.map((tag) => (
                                    <Chip
                                        key={tag.name}
                                        label={GetTitle(tag.name)}
                                        size="small"
                                        sx={{
                                            backgroundColor: tag.color ? `${tag.color}20` : "rgba(255,255,255,0.08)",
                                            color: tag.color || "rgba(255,255,255,0.9)",
                                            border: `1px solid ${tag.color || "rgba(255,255,255,0.2)"}`,
                                            fontWeight: 600,
                                            fontSize: "0.75rem",
                                            "&:hover": {
                                                backgroundColor: tag.color ? `${tag.color}35` : "rgba(255,255,255,0.15)",
                                                transform: "translateY(-1px)",
                                            },
                                            transition: "all 0.2s ease"
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}
                </Box>
            </DialogContent>

            <DialogActions 
                sx={{ 
                    px: 3, 
                    py: 2.5, 
                    backgroundColor: "rgba(25, 25, 25, 0.9)",
                    borderTop: "1px solid rgba(255,255,255,0.12)",
                    justifyContent: "flex-end"
                }}
            >
                <SwirlButton onClick={onClose}>
                    {GetTitle("Close")}
                </SwirlButton>
            </DialogActions>
        </Dialog>
    );
};

export default BugDialog;