import React, { useState } from 'react';
import TimelineVisualizer from '../components/TimelineVisualizer/TimelineVisualizer.tsx';
import SpecializationSelect from '../components/SpecializationSelect/SpecializationSelect.tsx';
import SpellButtons from '../components/SpellButtons/SpellButtons.tsx';
import SpellButton from '../components/SpellButtons/SpellButton.tsx';
import { Button, Typography, FormControl, InputLabel, OutlinedInput } from '@mui/material';
import { spell } from '../data/spell.ts';
import { v4 as uuidv4 } from 'uuid';
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from '@mui/icons-material/Add';
import PageTitle from "../components/PageTitle/PageTitle.tsx"

const Timeline = () => {

    const [selectedSpec, setSelectedSpec] = useState('Mistweaver Monk');
    const [spellList, setSpellList] = useState<spell[]>([]);
    const [currentRotation, setCurrentRotation] = useState<any[]>([]); // For the current rotation being built
    const [rotations, setRotations] = useState<any[][]>([]); // List to store up to 3 rotations
    
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
        if (rotations.length < 3) {
        setRotations((prevRotations) => [...prevRotations, currentRotation]);
        setCurrentRotation([]); // Clear current rotation
        } else {
            alert('You can only add up to 3 rotations!');
        }
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <PageTitle title="Spell Timeline"/>
            <h3>Timeline Setup</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <SpecializationSelect selectedSpec={selectedSpec} onSpecChange={handleSpecChange} />
                <SpellButtons selectedSpec={selectedSpec} addSpellToTable={addSpellToRotation} />
            </div>

            {/* Only show the Current Rotation section if a specialization is selected */}
            {selectedSpec && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 5 }}>
                    <FormControl fullWidth variant="outlined" sx={{ flexGrow: 1 }}>
                        <InputLabel shrink>Current Rotation</InputLabel>
                        <OutlinedInput
                            notched
                            readOnly
                            label="Current Rotation"
                            sx={{
                                minHeight: 56, // Matches the default TextField height
                                display: 'flex',
                                alignItems: 'center',
                                paddingX: 1,
                                overflowX: 'auto', // Enables scrolling if needed
                                whiteSpace: 'nowrap',
                            }}
                            inputComponent="div" // Treats input as a div to allow buttons inside
                            inputProps={{
                                style: { display: 'flex', gap: 5, alignItems: 'center', flexWrap: 'nowrap' },
                                children:
                                    currentRotation.length > 0 ? (
                                        currentRotation.map((spell, index) => (
                                            <SpellButton
                                                key={index}
                                                selectedSpell={spell}
                                                action={removeSpellFromRotation}
                                                isRemove={true}
                                            />
                                        ))
                                    ) : (
                                        <Typography variant="body2" color="textSecondary">
                                            No spells added
                                        </Typography>
                                    ),
                            }}
                        />
                    </FormControl>

                    {/* Conditionally render Add and Delete buttons based on currentRotation */}
                    {currentRotation.length > 0 && (
                        <>
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
                        </>
                    )}
                </div>
            )}

            {/* Conditionally render the Clear All Rotations button based on the rotations state */}
            {rotations.length > 0 && (
                <Button
                    variant="contained"
                    color="error"
                    onClick={clearAllRotations}
                    sx={{ marginTop: '15px' }}
                >
                    Clear All Rotations
                </Button>
            )}
                    
            {/* Render TimelineVisualizer with up to 3 rotations */}
            <TimelineVisualizer rotations={rotations} />
        </div>
    );
};

export default Timeline;
