import React from "react";
import { Card, CardProps } from "@mui/material";

export const RAINBOW_GRADIENT = "linear-gradient(90deg, #7ee5ff 0%, #89ff7f 33%, #ffd700 66%, #ff69b4 100%)";

interface RainbowCardProps extends Omit<CardProps, "ref"> {
    href?: string;
}

const RainbowCard: React.FC<RainbowCardProps> = ({ sx, children, href, ...rest }) => {
    const linkProps = href ? { component: "a" as React.ElementType, href } : {};

    return (
        <Card
            {...linkProps}
            sx={[
                (theme) => ({
                    border: "1px solid transparent",
                    background: `linear-gradient(${theme.palette.background.paper}, ${theme.palette.background.paper}) padding-box, linear-gradient(${theme.palette.divider}, ${theme.palette.divider}) border-box`,
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    cursor: href ? "pointer" : "default",
                    textDecoration: "none",
                    "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: 3,
                        background: `linear-gradient(${theme.palette.background.paper}, ${theme.palette.background.paper}) padding-box, ${RAINBOW_GRADIENT} border-box`,
                    },
                }),
                ...(Array.isArray(sx) ? sx : [sx]),
            ]}
            {...rest}
        >
            {children}
        </Card>
    );
};

export default RainbowCard;
