import React, { useState } from "react";
import EmpowerLevelDialog from "@components/EmpowerLevel/EmpowerLevelDialog";
import type SPELL from "@data/spells/spell";
import { specialization } from "@data/class";
import SpellButton from "@components/SpellButtons/SpellButton";

interface SpellButtonsProps {
    selectedSpec?: specialization;
    spells?: SPELL[];
    addSpellToTable: (spell: SPELL, empowerLevel: number) => void;
}

const SpellButtons: React.FC<SpellButtonsProps> = ({
    selectedSpec,
    spells,
    addSpellToTable,
}) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedSpell, setSelectedSpell] = useState<SPELL | null>(null);

    let spellList: SPELL[] = [];
    if (spells) {
        spellList = Object.values(spells);
    } else if (selectedSpec) {
        spellList = Object.values(selectedSpec.spells);
    }

    if (spellList.length === 0) return null;

    const handleSpellClick = (spell: SPELL, empowerLevel: number = 0) => {
        if (spell.hasOwnProperty("empowerLevel")) {
            setSelectedSpell(spell);
            setDialogOpen(true);
        } else {
            addSpellToTable(spell, empowerLevel);
        }
    };

    const handleEmpowerLevelSelect = (level: number) => {
        if (selectedSpell) {
            addSpellToTable(selectedSpell, level);
        }
        handleDialogClose();
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setTimeout(() => {
            setSelectedSpell(null);
        }, 200);
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <div
                style={{
                    display: "flex",
                    gap: 5,
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {spellList.map((spell) => (
                    <SpellButton
                        key={spell.id}
                        selectedSpell={spell}
                        action={handleSpellClick}
                    />
                ))}
            </div>

            <EmpowerLevelDialog
                open={dialogOpen}
                spell={selectedSpell}
                onSelect={handleEmpowerLevelSelect}
                onClose={handleDialogClose}
            />
        </div>
    );
};

export default SpellButtons;
