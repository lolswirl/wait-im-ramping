import React, { useState } from 'react';
import TimelineVisualizer from '../components/TimelineVisualizer/TimelineVisualizer.tsx';
import SpecializationSelect from '../components/SpecializationSelect/SpecializationSelect.tsx';
import SpellButtons from '../components/SpellButtons/SpellButtons.tsx';
import SpellButton from '../components/SpellButtons/SpellButton.tsx';
import { Button, Typography, FormControl, InputLabel, OutlinedInput, Box, Card, Stack, Divider, FormControlLabel, Switch } from '@mui/material';
import { spell } from '../data/spell.ts';
import { classes, getSpec } from '../data/class.ts';
import { v4 as uuidv4 } from 'uuid';
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from '@mui/icons-material/Add';
import PageTitle from "../components/PageTitle/PageTitle.tsx";
import { toRomanNumeral } from '../util/toRomanNumeral.ts';
import { GetTitle } from '../util/stringManipulation.tsx';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const Timeline = () => {
    const [selectedSpec, setSelectedSpec] = useState('Mistweaver Monk');
    const [specName, className] = selectedSpec.split(' ');
    const [spellList, setSpellList] = useState<spell[]>([]);
    const [currentRotation, setCurrentRotation] = useState<any[]>([]);
    const [rotations, setRotations] = useState<any[][]>([]);
    const [condense, setCondense] = useState(true);

    const spec = getSpec(specName, className);
    const prebuiltRotations = spec?.prebuiltRotations || [];

    const handleSetCondense = (value: boolean) => {
        setCondense(value);
    };

    const handleSpecChange = (event: SelectChangeEvent<string>) => {
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

    const addSpellToRotation = (spell: spell, empowerLevel: number) => {
        setCurrentRotation(prevRotation => [
            ...prevRotation,
            {
                ...spell,
                ...(spell.hasOwnProperty("empowerLevel") ? { empowerLevel } : {}),
                uuid: uuidv4(),
            },
        ]);
    };

    const removeSpellFromRotation = (spell: spell, empowerLevel: number) => {
        setCurrentRotation(prevRotation =>
            prevRotation.filter(rotSpell => rotSpell.uuid !== spell.uuid)
        );
    };

    const finalizeRotation = () => {
        setRotations(prevRotations => [...prevRotations, currentRotation]);
        setCurrentRotation([]);
    };

    const clearAllRotations = () => {
        setRotations([]);
        setCurrentRotation([]);
    };

    const clearCurrentRotation = () => {
        setCurrentRotation([]);
    };

    const loadPrebuiltRotation = (spellNames: string[]) => {
        const resolved = spellNames
            .map(name => spellList.find(sp => sp.name === name))
            .filter(Boolean)
            .map(spell => ({ ...spell, uuid: uuidv4() })) as spell[];

        setCurrentRotation(resolved);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <PageTitle title={GetTitle("Spell Timeline")} />
            <h1 style={{ marginBottom: "0px" }}>{GetTitle("Spell Timeline")}</h1>

            <Card variant="outlined" sx={{ width: 'fit-content', maxWidth: '100%', overflowX: 'auto' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, flex: 2 }}>
                        <Box>
                            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                <SpecializationSelect selectedSpec={selectedSpec} onSpecChange={handleSpecChange} />
                                <Card variant="outlined">
                                    <Box sx={{ p: 2 }}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={condense}
                                                    onChange={(e) => handleSetCondense(e.target.checked)}
                                                    color="primary"
                                                    size="small"
                                                />
                                            }
                                            label={GetTitle("Condensed")}
                                        />
                                    </Box>
                                </Card>
                            </Stack>
                        </Box>
                        
                        <Divider />

                        <Box>
                            <SpellButtons selectedSpec={selectedSpec} addSpellToTable={addSpellToRotation} />

                            <Box sx={{ mt: 2 }}>
                                {selectedSpec && (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 5 }}>
                                        <FormControl fullWidth variant="outlined" sx={{ flexGrow: 1 }}>
                                            <InputLabel shrink>{GetTitle("Current Rotation")}</InputLabel>
                                            <OutlinedInput
                                                notched
                                                readOnly
                                                label={GetTitle("Current Rotation")}
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
                                                                <Box position="relative" display="inline-block" key={spell.uuid}>
                                                                    <SpellButton
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
                                                                {GetTitle("No spells added")}
                                                            </Typography>
                                                        ),
                                                }}
                                            />
                                        </FormControl>
                                        <div style={{ display: 'flex', flexDirection: 'row', gap: 5, marginTop: 5 }}>
                                            <Button variant="contained" color="primary" onClick={finalizeRotation} disabled={currentRotation.length === 0}>
                                                <AddIcon />
                                            </Button>
                                            <Button variant="contained" color="error" onClick={clearCurrentRotation} disabled={currentRotation.length === 0}>
                                                <DeleteIcon />
                                            </Button>
                                            <Button variant="contained" color="error" onClick={clearAllRotations} disabled={rotations.length === 0} sx={{ textTransform: "none" }}>
                                                {GetTitle("CLEAR ALL ROTATIONS")}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </Box>
                        </Box>
                    </Box>

                    <Divider orientation="vertical" flexItem />

                    {/* Right Column: Prebuilt Rotations */}
                    <Box sx={{ p: 2, minWidth: 200 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            {GetTitle("Prebuilt Rotations")}
                        </Typography>
                        {(() => {
                            const [specName, className] = selectedSpec.split(' ');
                            const spec = getSpec(specName, className);
                            const prebuiltRotations = spec?.prebuiltRotations || [];

                            const addUUIDsToRotation = (rotation) => {
                                return rotation.spells.map(spell => ({
                                    ...spell,
                                    uuid: spell.uuid || uuidv4(),
                                }));
                            };

                            return prebuiltRotations.map((rotation, index) => (
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        gap: 0.5,
                                        mb: 1,
                                        flexWrap: 'nowrap',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        padding: 1,
                                    }}
                                    onClick={() => setCurrentRotation(addUUIDsToRotation(rotation))}
                                >
                                    {rotation.spells.map((spell, i) => (
                                        <SpellButton key={spell.uuid || i} selectedSpell={spell} action={() => { }} />
                                    ))}
                                </Button>
                            ));
                        })()}
                    </Box>
                </Box>
            </Card>

            <TimelineVisualizer selectedSpec={selectedSpec} condense={condense} rotations={rotations} />
        </div>
    );
};

export default Timeline;
