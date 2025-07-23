import React, { useEffect, useState } from 'react';
import { Tooltip } from '@mui/material';
import { FormatIconImg, FormatIconLink } from '../../util/FormatIconImg';
import { GetTitle } from '../../util/stringManipulation';

interface IconButtonBaseProps {
    icon: string;
    name: string;
    onClick?: () => void;
    size?: number;
    tooltip?: boolean;
    [key: string]: any;
}

const IconButtonBase: React.FC<IconButtonBaseProps> = ({
    icon,
    name,
    onClick,
    size = 40,
    tooltip = true,
    ...rest
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [src, setSrc] = useState('');

    useEffect(() => {
        const img = new Image();
        const localSrc = FormatIconImg(icon);
        const fallbackSrc = FormatIconLink(icon);
        img.onload = () => setSrc(localSrc);
        img.onerror = () => setSrc(fallbackSrc);
        img.src = localSrc;
    }, [icon]);

    const button = (
        <div
            onClick={onClick}
            onMouseOver={() => setIsHovered(true)}
            onMouseOut={() => setIsHovered(false)}
            {...rest}
            style={{
                minWidth: size + 2,
                minHeight: size + 2,
                width: size + 2,
                height: size + 2,
                padding: 0,
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.3s ease',
                border: '1px solid #575757',
                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {src && (
                <img
                    src={src}
                    alt={GetTitle(name)}
                    width={size}
                    height={size}
                    style={{
                        borderRadius: '8px',
                        objectFit: 'cover',
                        transform: 'scale(1.1)',
                        transformOrigin: 'center',
                    }}
                />
            )}
        </div>
    );
    return tooltip ? (
        <Tooltip title={GetTitle(name)} arrow disableInteractive>
            {button}
        </Tooltip>
    ) : button;
};

export default IconButtonBase;
