import React from 'react';
import './SpecializationSelect.css'
import { FormControl, InputLabel, MenuItem } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { FormatIconImg, FormatIconLink } from '../../util/FormatIconImg.ts';
import { classes } from '../../data/class.ts';
import { GetTitle } from "../../util/stringManipulation.tsx";

interface SpecializationSelectProps {
  selectedSpec: string;
  onSpecChange: (event: SelectChangeEvent<string>) => void;
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
      <InputLabel id="spec-select-label">{GetTitle("Specialization")}</InputLabel>
      <Select
        labelId="spec-select-label"
        id="spec-select"
        value={selectedSpec}
        onChange={onSpecChange}
        autoWidth
        label={GetTitle("Specialization")}
      >
        {allSpecializations.map((specObj, index) => (
          <MenuItem key={index} value={`${specObj.name} ${specObj.className}`}>
            <div className="spec">
              <img
                src={FormatIconImg(specObj.icon)}
                alt={GetTitle(`${specObj.name} ${specObj.className}`)}
                className="spec_icon"
                style={{
                  borderRadius: '8px',
                  objectFit: 'cover',
                  border: '1px solid #575757'
                }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = FormatIconLink(specObj.icon);
                }}
              />
              {GetTitle(specObj.name)}
            </div>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SpecializationSelect;
