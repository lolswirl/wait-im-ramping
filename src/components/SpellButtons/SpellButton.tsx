

import React from 'react';
import IconButtonBase from './IconButtonBase.tsx';

import type Spell from "../../data/spells/spell.ts"

interface SpellButtonProps {
    selectedSpell: Spell;
    action: (spell: Spell, empowerLevel: number) => void;
    empowerLevel?: number;
    isRemove?: boolean;
    size?: number;
    showName?: boolean;
    [key: string]: any;
}

const SpellButton: React.FC<SpellButtonProps> = ({
    selectedSpell,
    action,
    empowerLevel,
    isRemove = false,
    size = 40,
    showName = false,
    ...rest
}) => {
    empowerLevel = empowerLevel || 0;
    return (
        <IconButtonBase
            icon={selectedSpell.icon}
            name={selectedSpell.name}
            onClick={() => action(selectedSpell, empowerLevel)}
            size={size}
            {...rest}
        />
    );
};

export default SpellButton;
