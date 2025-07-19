import React from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Stack,
    Typography
} from '@mui/material';
import { Add, DeleteForever, DeleteTwoTone } from '@mui/icons-material';
import SpellButton from '../SpellButtons/SpellButton.tsx';
import { GetTitle } from '../../util/stringManipulation.tsx';
import { toRomanNumeral } from '../../util/toRomanNumeral.ts';
import type Spell from "../../data/spells/spell.ts";
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface CurrentRotationControlProps {
    currentRotation: Spell[];
    onRemoveSpell: (spell: Spell) => void;
    onFinalizeRotation: () => void;
    onClearCurrentRotation: () => void;
    onClearAllRotations: () => void;
    hasRotations: boolean;
    onReorderRotation?: (newRotation: Spell[]) => void;
}

const CurrentRotationControl: React.FC<CurrentRotationControlProps> = ({
    currentRotation,
    onRemoveSpell,
    onFinalizeRotation,
    onClearCurrentRotation,
    onClearAllRotations,
    hasRotations,
    onReorderRotation,
}) => {
    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const reordered = Array.from(currentRotation);
        const [removed] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, removed);
        if (onReorderRotation) onReorderRotation(reordered);
    };

    return (
        <Stack direction="column" alignItems="center" spacing={2} sx={{ mb: 1 }}>
            <Card variant="outlined" sx={{ width: "100%", mb: 2 }}>
                <CardContent sx={{ p: 0, height: 60 }}>
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="rotation-droppable" direction="horizontal">
                            {(provided) => (
                                <Box
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        height: 60,
                                        gap: 0.5,
                                        p: 0,
                                    }}
                                >
                                    {currentRotation.length > 0 ? (
                                        currentRotation.map((spell, idx) => (
                                            <Draggable key={spell.uuid} draggableId={spell.uuid} index={idx}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{
                                                            display: 'inline-block',
                                                            opacity: snapshot.isDragging ? 0.7 : 1,
                                                            position: 'relative',
                                                            verticalAlign: 'middle',
                                                            ...provided.draggableProps.style,
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
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))
                                    ) : (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                height: "100%", // <-- Fill parent height
                                                m: 0,
                                                p: 0,
                                            }}
                                        >
                                            <Typography variant="body2" color="textSecondary">
                                                {GetTitle("No spells added")}
                                            </Typography>
                                        </Box>
                                    )}
                                    {provided.placeholder}
                                </Box>
                            )}
                        </Droppable>
                    </DragDropContext>
                </CardContent>
            </Card>
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