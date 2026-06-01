import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Box,
    Stack,
    Card,
    CardContent,
    Link,
} from "@mui/material";
import SpellLink from "@components/SpellLink/SpellLink";
import { T } from "@util/T";
import { formatLogUrl } from "@util/stringManipulation";
import { Bug, SEVERITY_COLORS } from "@data/bugs";
import SwirlButton from "@components/Buttons/SwirlButton";
import { BugChips } from "@components/BugChips/BugChips";

interface BugDialogProps {
    open: boolean;
    bug: Bug | null;
    onClose: () => void;
}

const BugDialog: React.FC<BugDialogProps> = ({
    open,
    bug,
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
                    backgroundColor: "rgba(26, 26, 26, 0.75)",
                    backdropFilter: "blur(8px)",
                    borderRadius: 1,
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    overflow: "hidden",
                    minWidth: 400,
                    maxWidth: 680,
                    backgroundImage: 'none',
                },
            }}
        >
            <DialogTitle
                sx={{
                    background: `linear-gradient(135deg, rgba(40,40,40,0.6) 0%, rgba(30,30,30,0.7) 0%)`,
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
                <Stack spacing={1.2}>
                    <Typography component="div" variant="h5">
                        <SpellLink 
                            spell={bug.spell}
                            size={32}
                            gap={1.5}
                            textSx={{ fontWeight: 700 }}
                        />
                    </Typography>
                    <Typography
                        component="div"
                        variant="h6"
                        sx={{
                            color: "white", 
                            lineHeight: 1.3,
                            letterSpacing: "-0.01em"
                        }}
                    >
                        {bug.title}
                    </Typography>
                    <BugChips bug={bug} />
                </Stack>
            </DialogTitle>

            <DialogContent
                sx={{
                    p: 0,
                    backgroundColor: "transparent",
                    color: "white",
                }}
            >
                <Box p={2}>
                    <Stack spacing={1.5}>
                            {bug.description && (
                                <Card
                                    sx={{
                                        backgroundColor: "rgba(50, 50, 50, 0.85)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        borderRadius: 1,
                                        backdropFilter: "blur(1px)",
                                        transition: "all 0.2s ease",
                                        width: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        "&:hover": {
                                            backgroundColor: "rgba(55, 55, 55, 0.9)",
                                            border: "1px solid " + SEVERITY_COLORS[bug.severity],
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
                                                flex: 1
                                            }}
                                        >
                                            {bug.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            )}

                            {bug.notes && (
                                <Card
                                    sx={{
                                        backgroundColor: "rgba(50, 50, 50, 0.85)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        borderRadius: 1,
                                        backdropFilter: "blur(4px)",
                                        transition: "all 0.2s ease",
                                        "&:hover": {
                                            backgroundColor: "rgba(55, 55, 55, 0.9)",
                                            border: "1px solid " + SEVERITY_COLORS[bug.severity],
                                        }
                                    }}
                                >
                                    <CardContent sx={{ p: 2, "&:last-child": { pb: 2, pt: 2 } }}>
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
                                                wordBreak: "break-word",
                                                overflowWrap: "break-word"
                                            }}
                                        >
                                            {bug.notes}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            )}

                            {bug.logs && bug.logs.length > 0 && (
                                <Card
                                    sx={{
                                        backgroundColor: "rgba(50, 50, 50, 0.85)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        borderRadius: 1,
                                        backdropFilter: "blur(1px)",
                                        transition: "all 0.2s ease",
                                        "&:hover": {
                                            backgroundColor: "rgba(55, 55, 55, 0.9)",
                                            border: "1px solid " + SEVERITY_COLORS[bug.severity],
                                        }
                                    }}
                                >
                                    <CardContent sx={{ p: 2, "&:last-child": { pb: 2, pt: 2 } }}>
                                        <Typography
                                            variant="overline"
                                            sx={{
                                                color: "#ffcc80",
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
                                            Logs
                                        </Typography>
                                        <Stack spacing={1}>
                                            {bug.logs.map((log, index) => (
                                                <Box 
                                                    key={index}
                                                    sx={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: 0.5,
                                                        p: 1.5,
                                                        backgroundColor: "rgba(255, 255, 255, 0.03)",
                                                        borderRadius: 1,
                                                        border: "1px solid rgba(255,255,255,0.08)",
                                                        transition: "all 0.2s ease",
                                                        "&:hover": {
                                                            backgroundColor: "rgba(255, 255, 255, 0.06)",
                                                            border: "1px solid " + SEVERITY_COLORS[bug.severity],
                                                        }
                                                    }}
                                                >
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            color: "rgba(255,255,255,0.7)",
                                                            fontWeight: 600,
                                                            fontSize: "0.7rem",
                                                            textTransform: "uppercase",
                                                            letterSpacing: 0.5,
                                                        }}
                                                    >
                                                        {log.label}
                                                    </Typography>
                                                    <Link
                                                        href={log.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        sx={{
                                                            color: "primary.main",
                                                            textDecoration: "none",
                                                            fontWeight: 500,
                                                            fontSize: "0.85rem",
                                                            wordBreak: "break-all",
                                                            "&:hover": {
                                                                textDecoration: "underline wavy",
                                                                color: "primary.light",
                                                            }
                                                        }}
                                                    >
                                                        {formatLogUrl(log.url)}
                                                    </Link>
                                                </Box>
                                            ))}
                                        </Stack>
                                    </CardContent>
                                </Card>
                            )}
                    </Stack>
                </Box>
            </DialogContent>

            <DialogActions 
                sx={{ 
                    px: 3, 
                    py: 1, 
                    backgroundColor: "transparent",
                    borderTop: "1px solid rgba(255,255,255,0.12)",
                    justifyContent: "flex-end"
                }}
            >
                <SwirlButton onClick={onClose}>
                    Close
                </SwirlButton>
            </DialogActions>
        </Dialog>
    );
};

export default BugDialog;