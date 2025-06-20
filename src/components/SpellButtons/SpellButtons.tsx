import React, { useState } from 'react';
import type Spell from "../../data/spells/spell.ts"
import { CLASSES, specialization } from '../../data/class/class.ts';
import EmpowerLevelButtons from '../EmpowerLevel/EmpowerLevel.tsx';
import SpellButton from './SpellButton.tsx';

interface SpellButtonsProps {
  selectedSpec: specialization;
  addSpellToTable: (spell: Spell, empowerLevel: number) => void;
}

const SpellButtons: React.FC<SpellButtonsProps> = ({ selectedSpec, addSpellToTable }) => {
  const [empowerLevel, setEmpowerLevel] = useState<number>(1);
  if (!selectedSpec) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div
        style={{
          display: 'flex',
          gap: 5,
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {Object.values(selectedSpec.spells).map((spell) => (
          <SpellButton
            key={spell.id}
            selectedSpell={spell}
            empowerLevel={empowerLevel}
            action={addSpellToTable}
          />
        ))}
      </div>

      {selectedSpec === CLASSES.EVOKER.SPECS.PRESERVATION && (
        <EmpowerLevelButtons empowerLevel={empowerLevel} setEmpowerLevel={setEmpowerLevel} />
      )}
    </div>
  );
};

export default SpellButtons;
