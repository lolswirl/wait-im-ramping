import React from 'react';
import './SpecializationSelect.css'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { FormatIconImg, FormatIconLink } from '../../util/FormatIconImg.ts';
import { classes } from '../../data/class.ts';

interface SpecializationSelectProps {
  selectedSpec: string;
  onSpecChange: (event: React.ChangeEvent<{ value: unknown }>) => void;
}

const SpecializationSelect: React.FC<SpecializationSelectProps> = ({ selectedSpec, onSpecChange }) => {

  const allSpecializations = classes.flatMap((classObj) =>
    classObj.specializations.map((specialization) => ({
      name: specialization.name,
      className: classObj.name,
      icon: specialization.icon,
    }))
  );

  return (
    <FormControl sx={{ m: 1, minWidth: 150 }}>
      <InputLabel id="spec-select-label">Specialization</InputLabel>
      <Select
        labelId="spec-select-label"
        id="spec-select"
        value={selectedSpec}
        onChange={onSpecChange}
        autoWidth
        label="Specialization"
      >
        {allSpecializations.map((specObj, index) => (
          <MenuItem key={index} value={`${specObj.name} ${specObj.className}`}>
            <div className="spec">
              <img
                src={FormatIconImg(specObj.icon)}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = FormatIconLink(specObj.icon);
                }}
                alt={`${specObj.name} ${specObj.className}`}
                className="spec_icon"
                style={{
                  borderRadius: '8px',
                  objectFit: 'cover',
                  border: '1px solid #575757'
                }}
              />
              {specObj.name}
            </div>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SpecializationSelect;
