import React, { useState } from 'react';
import TimelineVisualizer from '../components/TimelineVisualizer/TimelineVisualizer.tsx';
import SpecializationSelect from '../components/SpecializationSelect/SpecializationSelect.tsx';
import SpellButtons from '../components/SpellButtons/SpellButtons.tsx';
import SpellButton from '../components/SpellButtons/SpellButton.tsx';
import { Button, Typography, FormControl, InputLabel, OutlinedInput, Box, Card, Stack, Divider, FormControlLabel, Switch } from '@mui/material';
import spell from '../data/spells/spell.ts';
import { specialization } from '../data/class/class.ts';
import { v4 as uuidv4 } from 'uuid';
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from '@mui/icons-material/Add';
import PageTitle from "../components/PageTitle/PageTitle.tsx";
import { toRomanNumeral } from '../util/toRomanNumeral.ts';
import { GetTitle } from '../util/stringManipulation.tsx';
import { useSpec } from '../context/SpecContext.tsx';

const Timeline = () => {
    const { spec, setSpec } = useSpec();
    const [spellList, setSpellList] = useState<spell[]>([]);
    const [currentRotation, setCurrentRotation] = useState<any[]>([]);
    const [rotations, setRotations] = useState<any[][]>([]);
    const [condense, setCondense] = useState(true);

    const handleSetCondense = (value: boolean) => {
        setCondense(value);
    };

    const handleSpecChange = (newSpec: specialization) => {
        if (spellList.length === 0) {
          setSpec(newSpec);
        } else {
          clearTable();
          setSpec(newSpec);
          console.warn("You cannot change specialization while spells are in the table. Table cleared.");
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

    const PrebuiltRotations = () => {
        if (!spec) return null;

        if (!spec?.rotations) {
            return <Typography>No rotations available for {spec.name}</Typography>;
        }

        // rotations is an object, convert to entries array: [rotationName, spell[]]
        const rotationEntries = Object.entries(spec.rotations) as [string, spell[]][];

        const addUUIDsToRotation = (spells: spell[]) => {
            return spells.map(spell => ({
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
                    inputComponent="span"
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
                                {rotationEntries.map(([rotationName, spells], index) => (
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
                                        onClick={() => setCurrentRotation(addUUIDsToRotation(spells))}
                                    >
                                        {spells.map((spell, i) => (
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
                    mb: { xs: 2, sm: 3 },
                    boxSizing: "border-box",
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', p: 2, }}>
                    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <SpecializationSelect selectedSpec={spec} onSpecChange={handleSpecChange} />
                        <FormControl
                            variant="outlined"
                            sx={{
                                minWidth: 120,
                                maxWidth: 250,
                                ml: 2,
                            }}
                        >
                            <InputLabel shrink htmlFor="options-outlined">
                                {GetTitle("Options")}
                            </InputLabel>
                            <OutlinedInput
                                id="options-outlined"
                                label={GetTitle("Options")}
                                notched
                                readOnly
                                inputComponent="span"
                                inputProps={{
                                    style: {
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                        width: "100%",
                                        minHeight: 44,
                                        padding: 0,
                                    },
                                    children: (
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
                                            sx={{ ml: 1 }}
                                        />
                                    ),
                                }}
                                sx={{
                                    height: "auto",
                                    alignItems: "center",
                                    py: 1,
                                    width: "100%",
                                }}
                            />
                        </FormControl>
                    </Stack>

                    <Divider sx={{ mx: -2, my: 2, width: "auto" }} />

                    <SpellButtons selectedSpec={spec} addSpellToTable={addSpellToRotation} />
                    
                    <Divider sx={{ mx: -2, my: 2, width: "auto" }} />

                    <PrebuiltRotations />

                    <Divider sx={{ mx: -2, my: 2, width: "auto" }} />

                    <Box sx={{ mt: 0 }}>
                        {spec && (
                            <Stack direction="column" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                                <FormControl fullWidth variant="outlined" sx={{ flexGrow: 1, m: 0 }}>
                                    <InputLabel shrink>{GetTitle("Current Rotation")}</InputLabel>
                                    <OutlinedInput
                                        notched
                                        readOnly
                                        label={GetTitle("Current Rotation")}
                                        inputComponent="span"
                                        inputProps={{
                                            style: { width: "100%", height: "100%" },
                                            children: (
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        gap: 0.5,
                                                        width: "100%",
                                                        p: 0,
                                                        boxSizing: "border-box",
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
                                        sx={{
                                            height: "auto",
                                            alignItems: "center",
                                            py: 0,
                                            width: "100%",
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

            <TimelineVisualizer selectedSpec={spec} condense={condense} rotations={rotations} />
        </div>
    );
};

export default Timeline;
