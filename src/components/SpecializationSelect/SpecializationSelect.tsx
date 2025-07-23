"use client";
import React, { useState } from 'react';
import './SpecializationSelect.css'
import { FormControl, InputLabel, MenuItem, Popover, Box, MenuList } from '@mui/material';
import Select from '@mui/material/Select';
import { specialization, getSpecs, getSpecializationByKey } from '../../data/class/class';
import { GetTitle } from "../../util/stringManipulation";
import SpecDisplay from "./SpecDisplay";

interface SpecializationSelectProps {
  selectedSpec: specialization;
  onSpecChange: (spec: specialization) => void;
  size?: "small" | "medium";
  short?: boolean;
  height?: number;
}

const SpecializationSelect: React.FC<SpecializationSelectProps> = ({
  selectedSpec,
  onSpecChange,
  size = "medium",
  short = false,
  height = 50,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSpecChange = (spec: specialization) => {
    onSpecChange(spec);
    handleClose();
  };

  if (short) {
    return (
      <>
        <Box 
          onClick={handleClick}
          sx={{ 
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            transition: 'transform 0.3s ease',
            '&:hover': {
              opacity: 0.8,
              transform: 'scale(1.1)',
            }
          }}
        >
          <SpecDisplay spec={selectedSpec} short={true} />
        </Box>
        
        <Popover
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          PaperProps={{
            sx: {
              maxHeight: 400,
              width: 'fit-content',
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              borderRadius: 2,
            },
          }}
        >
          <MenuList dense>
            {getSpecs().map((spec, index) => (
              <MenuItem 
                key={index} 
                onClick={() => handleSpecChange(spec)}
                selected={selectedSpec.class === spec.class && selectedSpec.name === spec.name}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(25, 118, 210, 0.12)',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.2)',
                    },
                  },
                }}
              >
                <SpecDisplay spec={spec} />
              </MenuItem>
            ))}
          </MenuList>
        </Popover>
      </>
    );
  }

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
        sx={{ height: height }}
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
