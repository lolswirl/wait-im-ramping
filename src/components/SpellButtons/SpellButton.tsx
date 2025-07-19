import React, { useEffect, useState } from 'react';
import { Tooltip } from '@mui/material';
import type Spell from "../../data/spells/spell.ts"
import { FormatIconImg, FormatIconLink } from '../../util/FormatIconImg.ts';
import { GetTitle } from '../../util/stringManipulation.tsx';

interface SpellButtonProps {
    selectedSpell: Spell;
    action: (spell: Spell, empowerLevel: number) => void;
    empowerLevel?: number;
    isRemove?: boolean;
    [key: string]: any;
}

const SpellButton: React.FC<SpellButtonProps> = ({
    selectedSpell,
    action,
    empowerLevel,
    isRemove = false,
    ...rest
}) => {
    empowerLevel = empowerLevel || 0;
    const [isHovered, setIsHovered] = useState(false);
    const [src, setSrc] = useState('');

    useEffect(() => {
        const img = new Image();
        const localSrc = FormatIconImg(selectedSpell.icon);
        const fallbackSrc = FormatIconLink(selectedSpell.icon);
        img.onload = () => setSrc(localSrc);
        img.onerror = () => setSrc(fallbackSrc);
        img.src = localSrc;
    }, [selectedSpell.icon]);

    return (
        <Tooltip title={GetTitle(selectedSpell.name)} arrow disableInteractive>
            <div
                onClick={() => action(selectedSpell, empowerLevel)}
                onMouseOver={() => setIsHovered(true)}
                onMouseOut={() => setIsHovered(false)}
                {...rest}
                style={{
                    minWidth: 25,
                    minHeight: 25,
                    width: 42,
                    height: 42,
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
                <img
                    src={src}
                    alt={GetTitle(selectedSpell.name)}
                    width={40}
                    height={40}
                    style={{
                        borderRadius: '8px',
                        objectFit: 'cover',
                        transform: 'scale(1.1)',
                        transformOrigin: 'center',
                    }}
                />
            </div>
        </Tooltip>
    );
};

export default SpellButton;
