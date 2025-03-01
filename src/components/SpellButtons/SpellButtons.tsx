import React, { useState } from 'react';
import { Button, Tooltip } from '@mui/material';
import { spell } from '../../data/spell.ts';
import { classes } from '../../data/class.ts';
import EmpowerLevelButtons from '../EmpowerLevel/EmpowerLevel.tsx';

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
            <Tooltip key={spell.id} title={spell.name} arrow >
              <Button 
                onClick={() => addSpellToTable(spell, empowerLevel)}
                style={{ 
                  minWidth: 25, 
                  minHeight: 25, 
                  width: 40, 
                  height: 40, 
                  padding: 0, 
                  borderRadius: '8px', 
                  overflow: 'hidden',
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                  transition: 'transform 0.2s',
                  border: '1px solid #575757'
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <img 
                  src={`https://wow.zamimg.com/images/wow/icons/large/${spell.icon}.jpg`} 
                  alt={spell.name} 
                  width={40} 
                  height={40} 
                  style={{
                    borderRadius: '8px',
                    objectFit: 'cover',
                  }}
                />
              </Button>
            </Tooltip>
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
