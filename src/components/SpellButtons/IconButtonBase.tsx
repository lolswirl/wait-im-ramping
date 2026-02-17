"use client";
import React, { useEffect, useState } from "react";

import { FormatIconImg, FormatIconLink } from "@util/FormatIconImg";
import { GetTitle } from "@util/stringManipulation";

interface IconButtonBaseProps {
    icon: string;
    name: string;
    id?: number;
    onClick?: () => void;
    size?: number;
    [key: string]: any;
}

const IconButtonBase: React.FC<IconButtonBaseProps> = ({
    icon,
    name,
    id,
    onClick,
    size = 40,
    ...rest
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [src, setSrc] = useState("");

    useEffect(() => {
        const img = new Image();
        const localSrc = FormatIconImg(icon);
        const fallbackSrc = FormatIconLink(icon);
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
        borderRadius: "8px",
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
            alt={GetTitle(name)}
            width={size}
            height={size}
            style={{
                borderRadius: "8px",
                objectFit: "cover",
                transform: "scale(1.1)",
                transformOrigin: "center",
                pointerEvents: "none",
            }}
        />
    );

    const button = id ? (
        <a
            href={`https://www.wowhead.com/spell=${id}`}
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
