"use client";
import { useState, useEffect, useRef } from "react";
import { Card, Box, Typography } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

import PageHeader from '@components/PageHeader/PageHeader';
import SpecializationSelect from '@components/SpecializationSelect/SpecializationSelect';
import SpellButtons from '@components/SpellButtons/SpellButtons';
import SpellTable from '@components/SpellTable/SpellTable';
import WarningChip from '@components/WarningChip/WarningChip';
import StatsCard from '@components/StatsCard/StatsCard';
import ConfigPanel from '@components/ConfigPanel/ConfigPanel';
import { CONTENT_WIDTH } from '@components/Theme/tokens';

import { CLASSES, specialization, getSpecializationByKey } from '@data/class';
import spell from '@data/spells/spell';
import { getSpellById } from '@data/spells';

import { useSpec } from '@context/SpecContext';
import { encodeShare, decodeShare } from '@util/rotationShare';

const WhenDoIRamp: React.FC<{ title: React.ReactNode; description: React.ReactNode }> = ({ title, description }) => {
    const { spec, setSpec } = useSpec();
    const [lockedSpecName, setLockedSpecName] = useState<string | null>(null);
    const [spellList, setSpellList] = useState<spell[]>([]);
    const [haste, setHaste] = useState<number | "">(30);
    const [totalCastTime, setTotalCastTime] = useState(0);
    const skipUrlSync = useRef(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const encoded = params.get('r');
        if (!encoded) return;
        const payload = decodeShare(encoded, true);
        if (!payload) return;
        const linkedSpec = getSpecializationByKey(payload.spec!);
        if (!linkedSpec) return;
        const hydratedSpells = (payload.rotations[0] ?? []).flatMap(id => {
            const s = getSpellById(id);
            return s ? [{ ...s, uuid: uuidv4() }] : [];
        });
        skipUrlSync.current = true;
        localStorage.setItem('selectedSpec', linkedSpec.key);
        setSpec(linkedSpec);
        setLockedSpecName(linkedSpec.name);
        setSpellList(hydratedSpells);
    }, []);

    useEffect(() => {
        if (skipUrlSync.current) {
            skipUrlSync.current = false;
            return;
        }
        const params = new URLSearchParams(window.location.search);
        if (spellList.length === 0) {
            params.delete('r');
        } else {
            params.set('r', encodeShare([{ steps: spellList }], spec.key));
        }
        const next = params.toString() ? `?${params.toString()}` : window.location.pathname;
        window.history.replaceState(null, '', next);
    }, [spellList]); // eslint-disable-line react-hooks/exhaustive-deps

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

            <Box sx={{ maxWidth: CONTENT_WIDTH.narrow, width: { xs: "90%", sm: "90%", md: "100%" }, mx: "auto" }}>
                <ConfigPanel
                    accent={spec.color}
                    sections={[
                        {
                            key: "spec",
                            title: "spec",
                            summary: spec.name.toLowerCase(),
                            content: <SpecializationSelect short withLabel selectedSpec={spec} onSpecChange={handleSpecChange} />,
                        },
                        {
                            key: "stats",
                            title: "stats",
                            summary: `${haste === "" ? 0 : haste}% haste`,
                            content: (
                                <StatsCard
                                    fields={["haste"]}
                                    options={{ intellect: 0, mastery: 0, crit: 0, versatility: 0, haste: haste === "" ? 0 : haste }}
                                    onOptionsChange={(updater: any) => {
                                        const prev = { intellect: 0, mastery: 0, crit: 0, versatility: 0, haste: haste === "" ? 0 : haste };
                                        const next = typeof updater === "function" ? updater(prev) : updater;
                                        setHaste(next.haste);
                                    }}
                                />
                            ),
                        },
                    ]}
                />

                {spec !== CLASSES.MONK.SPECS.MISTWEAVER && (
                    <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'center' }}>
                        <WarningChip message="This spec has limited support for cast time reductions and haste buff gains" showIcon borderColor='#ffa726' />
                    </Box>
                )}

                <Card variant="outlined" sx={{ mt: 1.5, p: 2, boxSizing: "border-box" }}>
                    <SpellButtons selectedSpec={spec} addSpellToTable={addSpellToTable} />
                </Card>
            </Box>

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
                    maxWidth: CONTENT_WIDTH.narrow,
                    width: { xs: '90%', sm: '90%', md: '100%' },
                    mx: 'auto',
                    boxSizing: 'border-box',
                    px: 2,
                    py: 1.5,
                }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, textAlign: 'center' }}>
                        Start ramping ~{Math.ceil(totalCastTime)}s before a mechanic
                    </Typography>
                </Card>
            )}
        </div>
    );
};

export default WhenDoIRamp;
