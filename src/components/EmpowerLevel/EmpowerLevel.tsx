import React from "react";
import { Button, Box } from "@mui/material";

import { toRomanNumeral } from "@util/toRomanNumeral";

interface EmpowerLevelButtonsProps {
    setEmpowerLevel: (level: number) => void;
    iconSize?: number;
    levels?: number[];
}

const EmpowerLevelButtons: React.FC<EmpowerLevelButtonsProps> = ({
    setEmpowerLevel,
    iconSize = 36,
    levels = [1, 2, 3, 4, 5],
}) => {
    return (
        <Box sx={{ display: "flex", gap: 1.5 }}>
            {levels.map((level) => (
                <Button
                    key={level}
                    variant="outlined"
                    onClick={() => setEmpowerLevel(level)}
                    sx={{
                        minWidth: 36,
                        minHeight: 36,
                        width: iconSize,
                        height: iconSize,
                        borderRadius: 2,
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        p: 0,
                        transition: "all 0.2s ease-in-out",
                        borderColor: "divider",
                        backgroundColor: "background.paper",
                        color: "text.primary",
                        boxShadow: 1,
                        "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: 2,
                            borderColor: "primary.main",
                            backgroundColor: "action.hover",
                        },
                        "&:active": {
                            transform: "translateY(0px)",
                            boxShadow: 1,
                        },
                    }}
                >
                    {toRomanNumeral(level)}
                </Button>
            ))}
        </Box>
    );
};

export default EmpowerLevelButtons;
