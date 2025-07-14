import React, { useEffect, useState } from 'react';
import { Button, Tooltip } from '@mui/material';
import type Spell from "../../data/spells/spell.ts"
import { FormatIconImg, FormatIconLink } from '../../util/FormatIconImg.ts';
import { GetTitle } from '../../util/stringManipulation.tsx';

interface SpellButtonProps {
  selectedSpell: Spell;
  action: (spell: Spell, empowerLevel: number) => void;
  empowerLevel?: number;
  isRemove?: boolean; 
}

const SpellButton: React.FC<SpellButtonProps> = ({ selectedSpell, action, empowerLevel, isRemove = false }) => {
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
    <Tooltip key={selectedSpell.id} title={GetTitle(selectedSpell.name)} arrow disableInteractive>
      <Button
        onClick={() => action(selectedSpell, empowerLevel)}
        sx={{
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
        }}
        onMouseOver={() => setIsHovered(true)}
        onMouseOut={() => setIsHovered(false)}
      >
        <div
          style={{
            position: 'relative',
            width: '40px',
            height: '40px',
            borderRadius: '8px',
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
      </Button>
    </Tooltip>
  );
};

export default SpellButton;
