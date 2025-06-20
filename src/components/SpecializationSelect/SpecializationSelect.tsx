import React from 'react';
import './SpecializationSelect.css'
import { FormControl, InputLabel, MenuItem } from '@mui/material';
import Select from '@mui/material/Select';
import { specialization, getSpecs, getSpecializationByKey } from '../../data/class/class.ts';
import { GetTitle } from "../../util/stringManipulation.tsx";
import SpecDisplay from "./SpecDisplay.tsx";

interface SpecializationSelectProps {
  selectedSpec: specialization;
  onSpecChange: (spec: specialization) => void;
  size?: "small" | "medium";
}

const SpecializationSelect: React.FC<SpecializationSelectProps> = ({
  selectedSpec,
  onSpecChange,
  size = "medium"
}) => {

  return (
    <FormControl sx={{ minWidth: 150 }} size={size}>
      <InputLabel id="spec-select-label">{GetTitle("Specialization")}</InputLabel>
      <Select
        labelId="spec-select-label"
        id="spec-select"
        value={`${selectedSpec.class}:${selectedSpec.name}`}
        onChange={(e) => {
          const spec = getSpecializationByKey(e.target.value as string);
          if (spec) onSpecChange(spec);
        }}
        autoWidth
        label={GetTitle("Specialization")}
      >
        {getSpecs().map((spec, index) => (
          <MenuItem key={index} value={`${spec.class}:${spec.name}`}>
            <SpecDisplay spec={spec} />
          </MenuItem>
        ))}
      </Select>

    </FormControl>
  );
};

export default SpecializationSelect;
