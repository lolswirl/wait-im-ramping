"use client";

import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import type spell from "@data/spells/spell";
import { FormatIconImg, FormatIconLink } from "@util/FormatIconImg";
import { GetTitle } from "@util/stringManipulation";

interface SpellLinkProps {
    spell: spell;
    size?: number;
    sx?: any;
    textSx?: any;
}

const SpellLink: React.FC<SpellLinkProps> = ({ 
    spell, 
    size = 18,
    sx,
    textSx
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [src, setSrc] = useState("");

    useEffect(() => {
        const img = new Image();
        const localSrc = FormatIconImg(spell.icon);
        const fallbackSrc = FormatIconLink(spell.icon);
        img.onload = () => setSrc(localSrc);
        img.onerror = () => setSrc(fallbackSrc);
        img.src = localSrc;
    }, [spell.icon]);

    return (
        <Box
            component="a"
            href={spell.id ? `https://www.wowhead.com/spell=${spell.id}` : undefined}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.3,
                textDecoration: "none",
                cursor: "pointer",
                transition: "opacity 0.2s ease",
                verticalAlign: "middle",
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
                    borderRadius: "4px",
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
                        alt={GetTitle(spell.name)}
                        width={size}
                        height={size}
                        style={{
                            borderRadius: "4px",
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
                    textDecoration: isHovered ? "underline" : "none",
                    ...textSx,
                }}
            >
                {GetTitle(spell.name)}
            </Box>
        </Box>
    );
};

export default SpellLink;
