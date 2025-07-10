import React from 'react';
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    OutlinedInput,
    Stack,
    Typography
} from '@mui/material';
import { Add, DeleteForever, DeleteTwoTone } from '@mui/icons-material';
import SpellButton from '../SpellButtons/SpellButton.tsx';
import { GetTitle } from '../../util/stringManipulation.tsx';
import { toRomanNumeral } from '../../util/toRomanNumeral.ts';
import type Spell from "../../data/spells/spell.ts"

interface CurrentRotationControlProps {
    currentRotation: Spell[];
    onRemoveSpell: (spell: Spell) => void;
    onFinalizeRotation: () => void;
    onClearCurrentRotation: () => void;
    onClearAllRotations: () => void;
    hasRotations: boolean;
}

const CurrentRotationControl: React.FC<CurrentRotationControlProps> = ({
    currentRotation,
    onRemoveSpell,
    onFinalizeRotation,
    onClearCurrentRotation,
    onClearAllRotations,
    hasRotations,
}) => {
    return (
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
                                    p: 1,
                                    boxSizing: "border-box",
                                }}
                            >
                                {currentRotation.length > 0 ? (
                                    currentRotation.map((spell) => (
                                        <Box 
                                            key={spell.uuid} 
                                            sx={{ 
                                                position: 'relative',
                                                display: 'inline-block'
                                            }}
                                        >
                                            <SpellButton
                                                selectedSpell={spell}
                                                action={() => onRemoveSpell(spell)}
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
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={onFinalizeRotation} 
                    disabled={currentRotation.length === 0}
                    startIcon={<Add />}
                    sx={{ textTransform: "none" }}
                >
                    {GetTitle("Add Rotation")}
                </Button>
                <Button 
                    variant="contained" 
                    color="error" 
                    onClick={onClearCurrentRotation} 
                    disabled={currentRotation.length === 0}
                    startIcon={<DeleteTwoTone />}
                    sx={{ textTransform: "none" }}
                >
                    {GetTitle("Clear Current")}
                </Button>
                <Button 
                    variant="contained" 
                    color="error" 
                    onClick={onClearAllRotations} 
                    disabled={!hasRotations}
                    startIcon={<DeleteForever />}
                    sx={{ textTransform: "none" }}
                >
                    {GetTitle("Clear All")}
                </Button>
            </Stack>
        </Stack>
    );
};

export default CurrentRotationControl;