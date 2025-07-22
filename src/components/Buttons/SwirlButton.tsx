import React from "react";
import { Button, useTheme } from "@mui/material";
import { GetTitle } from "../../util/stringManipulation.tsx";

interface SwirlButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    href?: string;
    selected?: boolean;
    sx?: object;
    textColor?: string;
    color?: string;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    startIcon?: React.ReactNode;
}

const resolveColor = (color: string, theme: any) => {
    if (!color || color === "inherit") return "#90caf9";
    if (theme.palette[color]) return theme.palette[color].main;
    return color;
};

const resolveTextColor = (color: string, theme: any) => {
    if (!color || color === "inherit") return "#ffffff";
    if (theme.palette[color]) return theme.palette[color].main;
    return color;
};

const SwirlButton: React.FC<SwirlButtonProps> = ({
    children,
    onClick,
    href,
    selected,
    sx,
    textColor = "#ffffff",
    color = "inherit",
    type = "button",
    disabled = false,
    startIcon = null,
}) => {
    const theme = useTheme();

    return (
        <Button
            component={href ? "a" : "button"}
            href={href}
            onClick={onClick}
            disabled={disabled}
            startIcon={startIcon}
            sx={{
                color: resolveTextColor(textColor, theme),
                fontWeight: 400,
                textTransform: "none",
                position: "relative",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    bgcolor: resolveColor(color, theme),
                    borderRadius: 1,
                    transform: selected ? "scaleX(1)" : "scaleX(0)",
                    transition: "transform 0.3s ease",
                    zIndex: 2,
                },
                "&:hover::before": {
                    transform: "scaleX(1)",
                    bgcolor: resolveColor(color, theme),
                },
                ...sx,
            }}
            type={type}
        >
            {typeof children === "string" ? GetTitle(children) : children}
        </Button>
    );
};

export default SwirlButton;