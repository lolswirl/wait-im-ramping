import { IconButton, IconButtonProps } from "@mui/material";

interface ColoredIconButtonProps extends Omit<IconButtonProps, 'sx'> {
    hoverColor?: string;
    enableLift?: boolean;
    initialColor?: string;
    children: React.ReactNode;
    href?: string;
    target?: string;
    rel?: string;
}

export const ColoredIconButton = ({ 
    hoverColor = "rgba(255, 255, 255, 0.8)", 
    enableLift = false,
    initialColor = "white",
    children, 
    ...props 
}: ColoredIconButtonProps) => {
    return (
        <IconButton
            {...props}
            sx={{
                color: initialColor,
                transition: "all 0.3s ease",
                backgroundColor: "transparent",
                "&:hover": {
                    color: hoverColor,
                    transform: enableLift ? "translateY(-2px)" : "none",
                    backgroundColor: "transparent",
                },
            }}
        >
            {children}
        </IconButton>
    );
};
