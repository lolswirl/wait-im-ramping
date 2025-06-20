import React, { useState } from 'react';
import { TextField, InputAdornment, Card, Box, Stack, Divider } from '@mui/material';
import spell from '../../data/spells/spell.ts';
import { v4 as uuidv4 } from 'uuid';

import SpecializationSelect from '../SpecializationSelect/SpecializationSelect.tsx';
import SpellButtons from '../SpellButtons/SpellButtons.tsx';
import SpellTable from '../SpellTable/SpellTable.tsx';
import { GetTitle } from "../../util/stringManipulation.tsx";
import { useSpec } from '../../context/SpecContext.tsx';
import { specialization } from '../../data/class/class.ts';

interface RampCalcProps {
  onTotalCastTimeChange: (totalTime: number) => void;
}

export default function RampCalc({ onTotalCastTimeChange }: RampCalcProps) {
  const { spec, setSpec } = useSpec();
  const [lockedSpecName, setLockedSpecName] = useState<string | null>(null);
  const [spellList, setSpellList] = useState<spell[]>([]);
  const [haste, setHaste] = useState<number | "">(30);

  const handleSpecChange = (newSpec: specialization) => {
    if (spellList.length === 0) {
      setSpec(newSpec);
      setLockedSpecName(null);
    } else {
      clearTable();
      setSpec(newSpec);
      console.warn("You cannot change specialization while spells are in the table. Table cleared.");
    }
  };

  const addSpellToTable = (spell: spell, empowerLevel: number) => {
    if (!spec) {
      console.warn("No specialization selected");
      return;
    }

    if (!lockedSpecName) {
      setLockedSpecName(spec.name);
    }

    if (lockedSpecName && lockedSpecName !== spec.name) {
      console.warn("You can only add spells from the first selected specialization. Clear the table to change.");
      return;
    }

    setSpellList(prevSpellList => [
      ...prevSpellList,
      {
        ...spell,
        uuid: uuidv4(),
        ...(spell.hasOwnProperty("empowerLevel") ? { empowerLevel } : {}),
      },
    ]);
  };

  const removeSpellFromTable = (index: number) => {
    const updatedSpellList = spellList.filter((_, i) => i !== index);
    setSpellList(updatedSpellList);

    if (updatedSpellList.length === 0) {
      setLockedSpecName(null);
    }
  };

  const clearTable = () => {
    setSpellList([]);
    setLockedSpecName(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Card
        variant="outlined"
        sx={{
          maxWidth: 600,
          width: { xs: "90%", sm: "90%", md: "100%" },
          mx: "auto",
          boxSizing: "border-box",
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', p: 2 }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <SpecializationSelect selectedSpec={spec} onSpecChange={handleSpecChange} />
            <TextField
              label={GetTitle("Haste")}
              type="number"
              value={haste}
              onChange={(e) => {
                const newValue = e.target.value;
                setHaste(newValue === "" ? "" : parseFloat(newValue));
              }}
              onBlur={() => {
                setHaste((prev) => (prev === "" ? 0 : prev));
              }}
              error={haste === ""}
              sx={{ m: 0, width: '12ch' }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    %
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
          <Divider sx={{ mx: -2, my: 2, width: "auto" }} />
          <SpellButtons selectedSpec={spec} addSpellToTable={addSpellToTable} />
        </Box>
      </Card>
      <SpellTable
        spellList={spellList}
        setSpellList={setSpellList}
        removeSpellFromTable={removeSpellFromTable}
        selectedSpec={spec!}
        haste={haste === "" ? 0 : haste}
        onTotalCastTimeChange={onTotalCastTimeChange}
        clearTable={clearTable}
      />
    </div>
  );
}