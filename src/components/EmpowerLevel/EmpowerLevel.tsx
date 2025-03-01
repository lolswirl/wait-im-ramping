import React from 'react';
import { Button } from '@mui/material';
import { toRoman } from '../../util/toRoman.ts'

interface EmpowerLevelButtonsProps {
  empowerLevel: number;
  setEmpowerLevel: (level: number) => void;
}

const EmpowerLevelButtons: React.FC<EmpowerLevelButtonsProps> = ({ empowerLevel, setEmpowerLevel }) => {
  return (
    <div style={{ display: 'flex', gap: 5, marginTop: 10 }}>
      {[1, 2, 3, 4, 5].map((level) => (
        <Button
          key={level}
          onClick={() => setEmpowerLevel(level)}
          style={{
            minWidth: 25,
            minHeight: 25,
            width: 40,
            height: 40,
            borderRadius: '8px',
            backgroundColor: empowerLevel === level ? '#33937f' : '#ddd',
            color: empowerLevel === level ? 'white' : 'black',
            border: '1px solid #000000',
            fontSize: '11x',
            fontWeight: 'bold',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
            transition: 'transform 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {toRoman(level)}
        </Button>
      ))}
    </div>
  );
};

export default EmpowerLevelButtons;
