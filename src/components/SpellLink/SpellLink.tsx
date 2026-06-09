"use client";

import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import type spell from "@data/spells/spell";
import { FormatIconImg, FormatIconLink } from "@util/FormatIconImg";

export interface WowLinkProps {
    name: string;
    icon: string;
    href?: string;
    size?: number;
    gap?: number;
    sx?: any;
    textSx?: any;
    noLink?: boolean;
}

export const WowLink: React.FC<WowLinkProps> = ({
    name,
    icon,
    href,
    size = 18,
    gap = 0.5,
    sx,
    textSx,
    noLink = false,
}) => {
    const [src, setSrc] = useState("");

    useEffect(() => {
        const img = new Image();
        const localSrc = FormatIconImg(icon);
        const fallbackSrc = FormatIconLink(icon);
        img.onload = () => setSrc(localSrc);
        img.onerror = () => setSrc(fallbackSrc);
        img.src = localSrc;
    }, [icon]);

    return (
        <Box
            component="a"
            suppressHydrationWarning
            href={noLink ? undefined : href}
            target={noLink ? undefined : "_blank"}
            rel={noLink ? undefined : "noopener noreferrer"}
            onClick={noLink ? (e: React.MouseEvent) => e.preventDefault() : undefined}
            sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: gap,
                textDecoration: "none",
                cursor: "pointer",
                transition: "opacity 0.2s ease",
                verticalAlign: "middle",
                marginTop: -0.3,
                ...sx,
            }}
        >
            <Box
                sx={{
                    minWidth: size + 2,
                    minHeight: size + 2,
                    width: size + 2,
                    height: size + 2,
                    padding: 0,
                    borderRadius: "3px",
                    overflow: "hidden",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                    transition: "transform 0.3s ease",
                    border: "1px solid #575757",
                    backgroundColor: "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}
            >
                {src && (
                    <img
                        src={src}
                        alt={name}
                        width={size}
                        height={size}
                        style={{
                            borderRadius: "3px",
                            objectFit: "cover",
                            transform: "scale(1.1)",
                            transformOrigin: "center",
                            pointerEvents: "none",
                        }}
                    />
                )}
            </Box>
            <Box
                component="span"
                sx={{
                    color: "primary.light",
                    fontWeight: "inherit",
                    textDecoration: "none",
                    "a:hover &": { textDecoration: "underline wavy" },
                    ...textSx,
                }}
            >
                {name}
            </Box>
        </Box>
    );
};

interface SpellLinkProps {
    spell: spell;
    size?: number;
    gap?: number;
    sx?: any;
    textSx?: any;
    noLink?: boolean;
}

const SpellLink: React.FC<SpellLinkProps> = ({ spell, ...rest }) => (
    <WowLink
        name={spell.name}
        icon={spell.icon}
        href={spell.id ? `https://www.wowhead.com/spell=${spell.id}` : undefined}
        {...rest}
    />
);

export default SpellLink;
