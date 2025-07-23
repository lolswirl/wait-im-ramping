import React from 'react';
import IconButtonBase from './IconButtonBase';
import type Spell from "@data/spells/spell"

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
    const safeEmpowerLevel = empowerLevel ?? 0;
    return (
        <IconButtonBase
            icon={selectedSpell.icon}
            name={selectedSpell.name}
            onClick={() => action(selectedSpell, safeEmpowerLevel)}
            size={size}
            {...rest}
        />
    );
};

export default SpellButton;
