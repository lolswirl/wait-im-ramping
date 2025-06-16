import React, { useState } from 'react';
import { TextField, InputAdornment, Card, Box, Stack } from '@mui/material';
import { spell } from '../../data/spell.ts';
import { v4 as uuidv4 } from 'uuid';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import SpecializationSelect from '../SpecializationSelect/SpecializationSelect.tsx';
import SpellButtons from '../SpellButtons/SpellButtons.tsx';
import SpellTable from '../SpellTable/SpellTable.tsx';
import { GetTitle } from "../../util/stringManipulation.tsx";
import { useSpec } from '../../context/SpecContext.tsx';

interface RampCalcProps {
    onTotalCastTimeChange: (totalTime: number) => void;
}

export default function RampCalc({ onTotalCastTimeChange }: RampCalcProps) {
    const { spec: selectedSpec, setSpec } = useSpec();
    const [lockedSpec, setLockedSpec] = useState<string | null>(null);
    const [spellList, setSpellList] = useState<spell[]>([]);
    const [haste, setHaste] = useState<number | "">(30);

    const handleSpecChange = (event: SelectChangeEvent<string>) => {
        if (spellList.length === 0) {
            setSpec(event.target.value as string);
            setLockedSpec(null); // Reset the lock if the table is empty
        } else {
            clearTable();
            setSpec(event.target.value as string);
            console.warn("You cannot change specialization while spells are in the table. Clear the table first.");
        }
    };

    const addSpellToTable = (spell: spell, empowerLevel: number) => {
        if (!lockedSpec) {
            setLockedSpec(selectedSpec);
        }

        if (lockedSpec && lockedSpec !== selectedSpec) {
            console.warn("You can only add spells from the first selected specialization. Clear the table to change.");
            return; 
        }

        setSpellList((prevSpellList) => [
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
            setLockedSpec(null);
        }
    };

    const clearTable = () => {
        setSpellList([]);
        setLockedSpec(null);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Card variant="outlined" sx={{ width: 'fit-content', maxWidth: '100%', overflowX: 'auto', }}>
                <Box sx={{ p: 2 }}>
                    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <SpecializationSelect selectedSpec={selectedSpec} onSpecChange={handleSpecChange} />
                        <TextField
                            label={GetTitle("Haste")}
                            type="number"
                            value={haste}
                            onChange={(e) => {
                                const newValue = e.target.value;
                                setHaste(newValue === "" ? "" : parseFloat(newValue)); // Allow empty input
                            }}
                            onBlur={() => {
                                setHaste((prev) => (prev === "" ? 0 : prev)); // Reset empty to 0 when focus is lost
                            }}
                            error={selectedSpec !== "" && haste === ""}
                            sx={{ m: 1, width: '12ch' }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        %
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Stack>
                    <SpellButtons selectedSpec={selectedSpec} addSpellToTable={addSpellToTable} />
                </Box>
            </Card>
            <SpellTable 
                spellList={spellList} 
                setSpellList={setSpellList}
                removeSpellFromTable={removeSpellFromTable}
                selectedSpec={selectedSpec}
                haste={haste === "" ? 0 : haste}
                onTotalCastTimeChange={onTotalCastTimeChange}
                clearTable={clearTable}
            />
        </div>
    );
}
