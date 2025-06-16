import React, { useState } from 'react';
import TimelineVisualizer from '../components/TimelineVisualizer/TimelineVisualizer.tsx';
import SpecializationSelect from '../components/SpecializationSelect/SpecializationSelect.tsx';
import SpellButtons from '../components/SpellButtons/SpellButtons.tsx';
import SpellButton from '../components/SpellButtons/SpellButton.tsx';
import { Button, Typography, FormControl, InputLabel, OutlinedInput, Box, Card, Stack, Divider, FormControlLabel, Switch } from '@mui/material';
import { spell } from '../data/spell.ts';
import { getSpec } from '../data/class.ts';
import { v4 as uuidv4 } from 'uuid';
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from '@mui/icons-material/Add';
import PageTitle from "../components/PageTitle/PageTitle.tsx";
import { toRomanNumeral } from '../util/toRomanNumeral.ts';
import { GetTitle } from '../util/stringManipulation.tsx';
import { SelectChangeEvent } from '@mui/material/Select';
import { useSpec } from '../context/SpecContext.tsx';

const Timeline = () => {
    const { spec: selectedSpec, setSpec } = useSpec();
    const [spellList, setSpellList] = useState<spell[]>([]);
    const [currentRotation, setCurrentRotation] = useState<any[]>([]);
    const [rotations, setRotations] = useState<any[][]>([]);
    const [condense, setCondense] = useState(true);

    const handleSetCondense = (value: boolean) => {
        setCondense(value);
    };

    const handleSpecChange = (event: SelectChangeEvent<string>) => {
        if (spellList.length === 0) {
            setSpec(event.target.value as string);
        } else {
            clearTable();
            setSpec(event.target.value as string);
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

    // Prebuilt Rotations JSX
    const PrebuiltRotations = () => {
        const [specName, className] = selectedSpec.split(' ');
        const spec = getSpec(specName, className);
        const prebuiltRotations = spec?.prebuiltRotations || [];

        const addUUIDsToRotation = (rotation) => {
            return rotation.spells.map(spell => ({
                ...spell,
                uuid: spell.uuid || uuidv4(),
            }));
        };

        return (
            <FormControl
                fullWidth
                variant="outlined"
                sx={{
                    maxWidth: "100%",
                    width: "100%",
                    alignItems: "center",
                }}
            >
                <InputLabel shrink htmlFor="prebuilt-rotations-outlined">
                    {GetTitle("Prebuilt Rotations")}
                </InputLabel>
                <OutlinedInput
                    id="prebuilt-rotations-outlined"
                    label={GetTitle("Prebuilt Rotations")}
                    readOnly
                    notched
                    inputComponent="div"
                    inputProps={{
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            padding: 0,
                            height: "100%",
                            boxSizing: "border-box",
                            width: "100%",
                        },
                        children: (
                            <Box sx={{ width: "auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                {prebuiltRotations.map((rotation, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            p: 1,
                                            border: "1px solid",
                                            borderColor: "divider",
                                            borderRadius: 1,
                                            backgroundColor: "background.paper",
                                            width: "auto",
                                            maxWidth: "100%",
                                            margin: 0.5,
                                            cursor: "pointer",
                                            transition: "box-shadow 0.2s",
                                            justifyContent: "center",
                                            "&:hover": {
                                                boxShadow: 3,
                                                backgroundColor: "action.hover",
                                            },
                                            gap: 0.5,
                                        }}
                                        onClick={() => setCurrentRotation(addUUIDsToRotation(rotation))}
                                    >
                                        {rotation.spells.map((spell, i) => (
                                            <SpellButton key={spell.uuid || i} selectedSpell={spell} action={() => { }} />
                                        ))}
                                    </Box>
                                ))}
                            </Box>
                        ),
                    }}
                    sx={{
                        height: "auto",
                        alignItems: "flex-start",
                        py: 1,
                        width: "100%",
                    }}
                />
            </FormControl>
        );
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <PageTitle title={GetTitle("Spell Timeline!")} />
            <h1 style={{ marginBottom: "0px" }}>{GetTitle("Spell Timeline!")}</h1>

            {/* warn for horizontal mode on mobile */}
            <Box sx={{ display: { xs: "block", md: "none" }, mb: 2, px: 2, textAlign: "center" }}>
                <Typography variant="body2" color="textSecondary">
                    {GetTitle("For the best experience, rotate your device to")}{" "}
                    <b>{GetTitle("horizontal (landscape)")}</b>{" "}
                    {GetTitle("mode.")}
                </Typography>
            </Box>

            <Card variant="outlined"
                sx={{
                    overflowX: { xs: 'auto', md: 'visible' },
                    maxWidth: { xs: '90%', sm: '90%', md: 600 },
                    width: { xs: "90%", sm: "90%", md: "100%" },
                    mx: "auto",
                    mb: { xs: 4, sm: 6 },
                    boxSizing: "border-box",
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', p: 2, }}>
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

                    <Divider sx={{ mx: -2, my: 2, width: "auto" }} />

                    <SpellButtons selectedSpec={selectedSpec} addSpellToTable={addSpellToRotation} />
                    
                    <Divider sx={{ mx: -2, my: 2, width: "auto" }} />

                    <PrebuiltRotations />

                    <Divider sx={{ mx: -2, my: 2, width: "auto" }} />

                    <Box sx={{ mt: 0 }}>
                        {selectedSpec && (
                            <Stack direction="column" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                                <FormControl fullWidth variant="outlined" sx={{ flexGrow: 1 }}>
                                    <InputLabel shrink>{GetTitle("Current Rotation")}</InputLabel>
                                    <OutlinedInput
                                        notched
                                        readOnly
                                        label={GetTitle("Current Rotation")}
                                        inputComponent="div"
                                        inputProps={{
                                            style: { width: "100%", height: "100%" },
                                            children: (
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        gap: 0.5,
                                                        width: "100%"
                                                    }}
                                                >
                                                    {currentRotation.length > 0 ? (
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
                                                    )}
                                                </Box>
                                            ),
                                        }}
                                    />
                                </FormControl>
                                <Stack direction="row" spacing={1}>
                                    <Button variant="contained" color="primary" onClick={finalizeRotation} disabled={currentRotation.length === 0}>
                                        <AddIcon />
                                    </Button>
                                    <Button variant="contained" color="error" onClick={clearCurrentRotation} disabled={currentRotation.length === 0}>
                                        <DeleteIcon />
                                    </Button>
                                    <Button variant="contained" color="error" onClick={clearAllRotations} disabled={rotations.length === 0} sx={{ textTransform: "none" }}>
                                        {GetTitle("CLEAR ALL ROTATIONS")}
                                    </Button>
                                </Stack>
                            </Stack>
                        )}
                    </Box>
                </Box>
            </Card>

            <TimelineVisualizer selectedSpec={selectedSpec} condense={condense} rotations={rotations} />
        </div>
    );
};

export default Timeline;
