import React, { useState } from 'react';
import TimelineVisualizer from '../components/TimelineVisualizer/TimelineVisualizer.tsx';
import SpecializationSelect from '../components/SpecializationSelect/SpecializationSelect.tsx';
import SpellButtons from '../components/SpellButtons/SpellButtons.tsx';
import SpellButton from '../components/SpellButtons/SpellButton.tsx';
import { Button, Typography, FormControl, InputLabel, OutlinedInput, Box, Card, Stack, Divider, FormControlLabel, Switch } from '@mui/material';
import { spell } from '../data/spell.ts';
import { v4 as uuidv4 } from 'uuid';
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from '@mui/icons-material/Add';
import PageTitle from "../components/PageTitle/PageTitle.tsx"
import { toRomanNumeral } from '../util/toRomanNumeral.ts';

const Timeline = () => {

    const [selectedSpec, setSelectedSpec] = useState('Mistweaver Monk');
    const [spellList, setSpellList] = useState<spell[]>([]);
    const [currentRotation, setCurrentRotation] = useState<any[]>([]);
    const [rotations, setRotations] = useState<any[][]>([]);
    const [condense, setCondense] = useState(true);
    
    const handleSetCondense = (value: boolean) => {
        setCondense(value);
    };
    
    const handleSpecChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        if (spellList.length === 0) {
            setSelectedSpec(event.target.value as string);
        } else {
            clearTable();
            setSelectedSpec(event.target.value as string);
            console.warn("You cannot change specialization while spells are in the table. Clear the table first.");
        }
        setCurrentRotation([]);
        clearAllRotations();
    };

    const clearTable = () => {
        setSpellList([]);
    };

    // Function to add spell to current rotation
    const addSpellToRotation = (spell: spell, empowerLevel: number) => {
        setCurrentRotation((prevRotation) => [
        ...prevRotation,
        {
            ...spell,
            ...(spell.hasOwnProperty("empowerLevel") ? { empowerLevel } : {}),
            uuid: uuidv4(), // Ensure each spell added has a unique uuid
        },
        ]);
    };

    // Function to remove spell from current rotation by uuid
    const removeSpellFromRotation = (spell: spell, empowerLevel: number) => {
            setCurrentRotation((prevRotation) =>
            prevRotation.filter((rotSpell) => rotSpell.uuid !== spell.uuid)
        );
    };

    // Function to finalize and add the current rotation to the list of rotations
    const finalizeRotation = () => {
        setRotations((prevRotations) => [...prevRotations, currentRotation]);
        setCurrentRotation([]); // Clear current rotation
    };

    // Function to clear all rotations
    const clearAllRotations = () => {
        setRotations([]); // Clear the rotations array
        setCurrentRotation([]);
    };

    const clearCurrentRotation = () => {
        setCurrentRotation([]);
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'}}>
            <PageTitle title="Spell Timeline"/>
            <h1 style={{ marginBottom: "0px" }}>Spell Timeline</h1>

            <Card variant="outlined" sx={{ width: 'fit-content', maxWidth: '100%', overflowX: 'auto', }}>
                <Box sx={{ p: 2 }}>
                    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <SpecializationSelect selectedSpec={selectedSpec} onSpecChange={handleSpecChange} />
                        <Card variant="outlined" sx={{ width: 'fit-content', overflowX: 'auto', }}> 
                            <Box sx={{ p: 2 }}>
                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={condense}
                                                onChange={(e) => handleSetCondense(e.target.checked)}
                                                color="primary"
                                                size="small"
                                            />
                                        }
                                        label="Condensed"
                                    />
                                </div>
                            </Box>
                        </Card>
                    </Stack>
                    <SpellButtons selectedSpec={selectedSpec} addSpellToTable={addSpellToRotation} />
                </Box>
                <Divider />
                <Box sx={{ p: 2 }}>
                    {selectedSpec && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 5 }}>
                            <FormControl fullWidth variant="outlined" sx={{ flexGrow: 1 }}>
                                <InputLabel shrink>Current Rotation</InputLabel>
                                <OutlinedInput
                                    notched
                                    readOnly
                                    label="Current Rotation"
                                    sx={{
                                        minHeight: 56,
                                        display: 'flex',
                                        alignItems: 'center',
                                        paddingX: 1,
                                        overflowX: 'auto',
                                        whiteSpace: 'nowrap',
                                    }}
                                    inputComponent="div"
                                    inputProps={{
                                        style: { display: 'flex', gap: 5, alignItems: 'center', flexWrap: 'nowrap' },
                                        children:
                                            currentRotation.length > 0 ? (
                                                currentRotation.map((spell, index) => (
                                                    <Box position="relative" display="inline-block">
                                                        <SpellButton
                                                            key={index}
                                                            selectedSpell={spell}
                                                            action={removeSpellFromRotation}
                                                            isRemove={true}
                                                        />
                                                        {spell.empowerLevel && (
                                                            <Box
                                                                style={{
                                                                    position: "absolute",
                                                                    bottom: -2,
                                                                    right: -2,
                                                                    backgroundColor: "rgba(0, 0, 0, 0.75)",
                                                                    color: "white",
                                                                    fontSize: "0.75rem",
                                                                    fontWeight: "bold",
                                                                    padding: "2px 4px",
                                                                    borderRadius: "4px",
                                                                }}
                                                            >
                                                                {toRomanNumeral(spell.empowerLevel)}
                                                            </Box>
                                                        )}
                                                    </Box>
                                                ))
                                            ) : (
                                                <Typography variant="body2" color="textSecondary">
                                                    No spells added
                                                </Typography>
                                            ),
                                    }}
                                />
                            </FormControl>
                            <div style={{ display: 'flex', alignItems: 'right', flexDirection: 'row', gap: 5, marginTop: 5 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={finalizeRotation}
                                    disabled={currentRotation.length === 0}
                                    sx={{
                                        width: 'auto', // Button width adjusts to content
                                        height: '40px', // Ensures button height matches the text field height
                                        whiteSpace: 'nowrap', // Prevents text from wrapping
                                    }}
                                >
                                    <AddIcon />
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={clearCurrentRotation}
                                    disabled={currentRotation.length === 0}
                                    sx={{
                                        width: 'auto', // Button width adjusts to content
                                        height: '40px', // Ensures button height matches the text field height
                                        whiteSpace: 'nowrap', // Prevents text from wrapping
                                    }}
                                >
                                    <DeleteIcon />
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={clearAllRotations}
                                    disabled={rotations.length == 0}
                                >
                                    Clear All Rotations
                                </Button>
                            </div>
                        </div>
                    )}
                </Box>
            </Card>
            <TimelineVisualizer selectedSpec={selectedSpec} condense={condense} rotations={rotations} />
        </div>
    );
};

export default Timeline;
