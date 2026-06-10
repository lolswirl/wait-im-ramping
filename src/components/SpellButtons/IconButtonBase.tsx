"use client";
import React, { useEffect, useState } from "react";

import { iconLocalUrl, iconFallbackUrl, wowheadSpellUrl } from "@util/wowhead";
import { T } from "@util/T";

interface IconButtonBaseProps {
    icon: string;
    name: string;
    id?: number;
    spellModifier?: number;
    onClick?: () => void;
    size?: number;
    tooltip?: boolean;
    [key: string]: any;
}

const IconButtonBase: React.FC<IconButtonBaseProps> = ({
    icon,
    name,
    id,
    spellModifier,
    onClick,
    size = 40,
    tooltip: _tooltip,
    ...rest
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [src, setSrc] = useState("");

    useEffect(() => {
        const img = new Image();
        const localSrc = iconLocalUrl(icon);
        const fallbackSrc = iconFallbackUrl(icon);
        img.onload = () => setSrc(localSrc);
        img.onerror = () => setSrc(fallbackSrc);
        img.src = localSrc;
    }, [icon]);

    const handleClick = (e: React.MouseEvent) => {
        if (onClick) {
            e.preventDefault();
            onClick();
        }
    };

    const commonStyle = {
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
        transform: isHovered ? "scale(1.1)" : "scale(1)",
        backgroundColor: "transparent",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
        color: "inherit",
        verticalAlign: "middle",
    } as React.CSSProperties;

    const imageContent = src && (
        <img
            src={src}
            alt={(name)}
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
    );

    const button = id ? (
        <a
            href={wowheadSpellUrl(id, spellModifier)}
            target={onClick ? undefined : "_blank"}
            rel={onClick ? undefined : "noopener noreferrer"}
            onClick={onClick ? handleClick : undefined}
            onMouseOver={() => setIsHovered(true)}
            onMouseOut={() => setIsHovered(false)}
            {...rest}
            style={commonStyle}
        >
            {imageContent}
        </a>
    ) : (
        <div
            onClick={handleClick}
            onMouseOver={() => setIsHovered(true)}
            onMouseOut={() => setIsHovered(false)}
            {...rest}
            style={commonStyle}
        >
            {imageContent}
        </div>
    );
    
    return button;
};

export default IconButtonBase;
