import React, { useState } from 'react';
import { spell } from '../../data/spell.ts';
import { classes } from '../../data/class.ts';
import EmpowerLevelButtons from '../EmpowerLevel/EmpowerLevel.tsx';
import SpellButton from './SpellButton.tsx';

interface SpellButtonsProps {
  selectedSpec: string;
  addSpellToTable: (spell: spell, empowerLevel: number) => void;
}

const SpellButtons: React.FC<SpellButtonsProps> = ({ selectedSpec, addSpellToTable }) => {
  const [empowerLevel, setEmpowerLevel] = useState<number>(1);

  const specializations = classes.reduce((acc, classObj) => {
    classObj.specializations.forEach((spec) => {
      acc[`${spec.name} ${classObj.name}`] = spec.spells;
    });
    return acc;
  }, {} as Record<string, spell[]>);

  return (
    <>
      {selectedSpec && (
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {specializations[selectedSpec]?.map((spell) => (
            <SpellButton key={spell.id} selectedSpell={spell} action={ addSpellToTable }/>
          ))}
        </div>
      )}
      
      {selectedSpec === "Preservation Evoker" && (
        <EmpowerLevelButtons empowerLevel={empowerLevel} setEmpowerLevel={setEmpowerLevel} />
      )}
    </>
  );
};

export default SpellButtons;
