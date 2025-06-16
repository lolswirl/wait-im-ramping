import React from 'react';
import './SpecializationSelect.css'
import { FormControl, InputLabel, MenuItem } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { classes } from '../../data/class.ts';
import { GetTitle } from "../../util/stringManipulation.tsx";
import SpecDisplay from "./SpecDisplay.tsx";

interface SpecializationSelectProps {
  selectedSpec: string;
  onSpecChange: (event: SelectChangeEvent<string>) => void;
  size?: "small" | "medium";
}

const SpecializationSelect: React.FC<SpecializationSelectProps> = ({
  selectedSpec,
  onSpecChange,
  size = "medium"
}) => {
  const allSpecializations = classes.flatMap((classObj) =>
    classObj.specializations.map((specialization) => ({
      name: specialization.name,
      className: classObj.name,
      icon: specialization.icon,
    }))
  );

  return (
    <FormControl sx={{ minWidth: 150 }} size={size}>
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
            <SpecDisplay specObj={specObj} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SpecializationSelect;
