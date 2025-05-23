import React, { useEffect, useState } from 'react';
import { Button, Tooltip } from '@mui/material';
import { spell } from '../../data/spell.ts';
import { FormatIconImg, FormatIconLink } from '../../util/FormatIconImg.ts';

interface SpellButtonProps {
  selectedSpell: spell;
  action: (spell: spell, empowerLevel: number) => void;
  isRemove?: boolean; // Optional flag to trigger hover effect
}

const SpellButton: React.FC<SpellButtonProps> = ({ selectedSpell, action, isRemove = false }) => {
  const [empowerLevel] = useState<number>(1);
  const [isHovered, setIsHovered] = useState(false); // Track hover state
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
    <Tooltip key={selectedSpell.id} title={selectedSpell.name} arrow disableInteractive>
      <Button
        onClick={() => action(selectedSpell, empowerLevel)}
        sx={{
          minWidth: 25,
          minHeight: 25,
          width: 40,
          height: 40,
          padding: 0,
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
          transition: 'transform 0.3s ease', // Smooth transition for transform
          border: '1px solid #575757',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)', // Scale effect on hover
          backgroundColor: 'transparent', // Ensure button has no background
        }}
        onMouseOver={() => setIsHovered(true)} // Set hover state to true
        onMouseOut={() => setIsHovered(false)} // Reset hover state to false
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
            alt={selectedSpell.name}
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
