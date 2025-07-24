import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Box,
    Chip,
} from "@mui/material";
import SpellButton from "../SpellButtons/SpellButton";
import { GetTitle } from "../../util/stringManipulation";
import { Bug, STATUS, SEVERITY_COLORS } from "../../data/bugs/bugs";
import { specialization } from "../../data/class/class";
import SwirlButton from "../Buttons/SwirlButton";

interface BugDialogProps {
    open: boolean;
    bug: Bug | null;
    selectedSpec: specialization;
    onClose: () => void;
}

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
                    position: "relative",
                    backgroundColor: "rgba(26, 26, 26, 0)",
                    backdropFilter: "blur(8px)",
                    color: "white",
                    px: 3,
                    py: 2.5,
                    borderRadius: 3,
                    fontSize: "1rem",
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                    boxShadow: "0 2px 24px rgba(0,0,0,0.25)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    minWidth: 400,
                    maxWidth: 600,
                },
            }}
        >
            <DialogTitle sx={{ color: "white", px: 0, pt: 0, pb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box>
                        {bug.spell && (
                            <SpellButton
                                spell={bug.spell}
                                selectedSpell={bug.spell}
                                action={() => {}}
                                size={40}
                            />
                        )}
                    </Box>
                    <Box>
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: "bold", color: "white" }}
                        >
                            {GetTitle(bug.title)}
                        </Typography>
                        <Chip
                            label={GetTitle(bug.severity)}
                            sx={{
                                backgroundColor: SEVERITY_COLORS[bug.severity],
                                color: "#fff",
                                fontWeight: "bold",
                                ml: 1,
                            }}
                            size="small"
                        />
                        {bug.status === STATUS.FIXED && (
                            <Chip
                                label={GetTitle(STATUS.FIXED)}
                                sx={{
                                    ml: 1,
                                    backgroundColor: "#43a047",
                                    color: "#fff",
                                    fontWeight: "bold",
                                }}
                                size="small"
                            />
                        )}
                    </Box>
                </Box>
            </DialogTitle>

            <DialogContent
                dividers
                sx={{ px: 0, color: "white", background: "transparent" }}
            >
                <Box
                    sx={{
                        mb: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    <b>{GetTitle("Spells Affected:")}</b>
                    {bug.spell && (
                        <SpellButton
                            selectedSpell={bug.spell}
                            action={() => {}}
                            size={32}
                        />
                    )}
                    {bug.affectedSpells &&
                        bug.affectedSpells.map((spell, i) => (
                            <SpellButton
                                key={i}
                                selectedSpell={spell}
                                action={() => {}}
                                size={32}
                            />
                        ))}
                </Box>

                <Typography variant="subtitle1" sx={{ mb: 1, color: "white" }}>
                    <b>{GetTitle("Specialization:")}</b>{" "}
                    {GetTitle(selectedSpec.name)}
                </Typography>

                <Typography variant="subtitle1" sx={{ mb: 1, color: "white" }}>
                    <b>{GetTitle("Last Build Tested:")}</b>{" "}
                    {bug.lastBuildTested ? GetTitle(bug.lastBuildTested) : "-"}
                </Typography>

                <Typography variant="body1" sx={{ mb: 1, color: "white" }}>
                    <b>{GetTitle("Description:")}</b>
                </Typography>

                <Typography
                    variant="body2"
                    sx={{ mt: 1, whiteSpace: "pre-line", color: "white" }}
                >
                    {GetTitle(bug.description)}
                </Typography>

                {bug.notes && (
                    <Box sx={{ mt: 2 }}>
                        <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: "bold", mb: 0.5, color: "white" }}
                        >
                            {GetTitle("Notes:")}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ whiteSpace: "pre-line", color: "white" }}
                        >
                            {GetTitle(bug.notes)}
                        </Typography>
                    </Box>
                )}

                <Box sx={{ mb: 1, mt: 2, gap: 0.5, display: "flex" }}>
                    {bug.tags.map((tag) => (
                        <Chip
                            key={tag.name}
                            label={GetTitle(tag.name)}
                            size="small"
                            variant="outlined"
                            sx={tag.color ? { borderColor: tag.color, color: tag.color } : undefined}
                        />
                    ))}
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 0, pb: 0 }}>
                <SwirlButton onClick={onClose}>
                    {GetTitle("Close")}
                </SwirlButton>
            </DialogActions>
        </Dialog>
    );
};

export default BugDialog;
