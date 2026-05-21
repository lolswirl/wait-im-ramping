"use client";
import { useState } from "react";
import { Card, Box, Stack, Divider, Typography } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

import PageHeader from '@components/PageHeader/PageHeader';
import SpecializationSelect from '@components/SpecializationSelect/SpecializationSelect';
import SpellButtons from '@components/SpellButtons/SpellButtons';
import SpellTable from '@components/SpellTable/SpellTable';
import WarningChip from '@components/WarningChip/WarningChip';
import SwirlField from '@components/SwirlField/SwirlField';

import { CLASSES, specialization } from '@data/class';
import spell from '@data/spells/spell';

import { T } from "@util/T";
import { useSpec } from '@context/SpecContext';

const WhenDoIRamp: React.FC<{ title: string; description: string }> = ({ title, description }) => {
    const { spec, setSpec } = useSpec();
    const [lockedSpecName, setLockedSpecName] = useState<string | null>(null);
    const [spellList, setSpellList] = useState<spell[]>([]);
    const [haste, setHaste] = useState<number | "">(30);
    const [totalCastTime, setTotalCastTime] = useState(0);

    const handleSpecChange = (newSpec: specialization) => {
        if (spellList.length === 0) {
            setSpec(newSpec);
            setLockedSpecName(null);
        } else {
            clearTable();
            setSpec(newSpec);
        }
    };

    const addSpellToTable = (spell: spell, empowerLevel: number) => {
        if (!spec) return;
        if (!lockedSpecName) setLockedSpecName(spec.name);
        if (lockedSpecName && lockedSpecName !== spec.name) return;
        setSpellList(prev => [
            ...prev,
            {
                ...spell,
                uuid: uuidv4(),
                ...(spell.hasOwnProperty("empowerLevel") ? { empowerLevel } : {}),
            },
        ]);
    };

    const removeSpellFromTable = (index: number) => {
        const updated = spellList.filter((_, i) => i !== index);
        setSpellList(updated);
        if (updated.length === 0) setLockedSpecName(null);
    };

    const clearTable = () => {
        setSpellList([]);
        setLockedSpecName(null);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <PageHeader title={title} subtitle={description} />

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
                        <SwirlField label="Haste" value={haste} onChange={setHaste} suffix="%" />
                    </Stack>

                    {spec !== CLASSES.MONK.SPECS.MISTWEAVER && (
                        <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'center' }}>
                            <WarningChip message="This spec has limited support for cast time reductions and haste buff gains" showIcon borderColor='#ffa726' />
                        </Box>
                    )}

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
                onTotalCastTimeChange={setTotalCastTime}
                clearTable={clearTable}
            />

            {totalCastTime > 0 && (
                <Card variant="outlined" sx={{
                    maxWidth: 600,
                    width: { xs: '90%', sm: '90%', md: '100%' },
                    mx: 'auto',
                    boxSizing: 'border-box',
                    px: 2,
                    py: 1.5,
                }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, textAlign: 'center' }}>
                        <T>Start ramping ~{Math.ceil(totalCastTime)}s before a mechanic</T>
                    </Typography>
                </Card>
            )}
        </div>
    );
};

export default WhenDoIRamp;
