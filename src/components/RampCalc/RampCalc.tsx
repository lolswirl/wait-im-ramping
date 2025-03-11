import React, { useState } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { spell } from '../../data/spell.ts';
import { v4 as uuidv4 } from 'uuid';

import SpecializationSelect from '../SpecializationSelect/SpecializationSelect.tsx';
import SpellButtons from '../SpellButtons/SpellButtons.tsx';
import SpellTable from '../SpellTable/SpellTable.tsx';

interface RampCalcProps {
	onTotalCastTimeChange: (totalTime: number) => void;
}

export default function RampCalc({ onTotalCastTimeChange }: RampCalcProps) {
	const [selectedSpec, setSelectedSpec] = useState('');
	const [lockedSpec, setLockedSpec] = useState<string | null>(null);
	const [spellList, setSpellList] = useState<spell[]>([]);
	const [haste, setHaste] = useState<number | "">("");
	
	const handleSpecChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		if (spellList.length === 0) {
			setSelectedSpec(event.target.value as string);
			setLockedSpec(null); // Reset the lock if the table is empty
		} else {
			clearTable();
			setSelectedSpec(event.target.value as string);
			console.warn("You cannot change specialization while spells are in the table. Clear the table first.");
		}
	};

	const addSpellToTable = (spell: spell, empowerLevel: number) => {
		if (!lockedSpec) {
			setLockedSpec(selectedSpec);
		}

		if (lockedSpec && lockedSpec !== selectedSpec) {
			console.warn("You can only add spells from the first selected specialization. Clear the table to change.");
			return; 
		}

		setSpellList((prevSpellList) => [
			...prevSpellList,
			{
				...spell,
				uuid: uuidv4(),
				...(spell.hasOwnProperty("empowerLevel") ? { empowerLevel } : {}),
			},
		]);
	};

	const removeSpellFromTable = (index: number) => {
		const updatedSpellList = spellList.filter((_, i) => i !== index);
		setSpellList(updatedSpellList);

		if (updatedSpellList.length === 0) {
			setLockedSpec(null);
		}
	};

	const clearTable = () => {
		setSpellList([]);
		setLockedSpec(null);
	};

	return (
		<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
			<div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
				<SpecializationSelect selectedSpec={selectedSpec} onSpecChange={handleSpecChange} />
				<TextField
					label="Haste"
					type="number"
					value={haste}
					onChange={(e) => {
						const newValue = e.target.value;
						setHaste(newValue === "" ? "" : parseFloat(newValue)); // Allow empty input
					}}
					onBlur={() => {
						setHaste((prev) => (prev === "" ? 0 : prev)); // Reset empty to 0 when focus is lost
					}}
					error={selectedSpec !== "" && haste === ""}
					sx={{ width: '12ch' }}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								%
							</InputAdornment>
						),
					}}
				/>
			</div>
			<SpellButtons selectedSpec={selectedSpec} addSpellToTable={addSpellToTable} />
			<SpellTable 
				spellList={spellList} 
				setSpellList={setSpellList}
				removeSpellFromTable={removeSpellFromTable}
				selectedSpec={selectedSpec}
				haste={haste === "" ? 0 : haste}
				onTotalCastTimeChange={onTotalCastTimeChange}
				clearTable={clearTable}
			/>
		</div>
	);
}
