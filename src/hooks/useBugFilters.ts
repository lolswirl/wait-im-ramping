import { useMemo, useState } from "react";
import { Bug, STATUS, SEVERITY } from "../data/bugs/bugs.ts";
import { specialization } from "../data/class/class.ts";

export const useBugFilters = (bugs: Bug[], selectedSpec: specialization) => {
    const [selectedSeverity, setSelectedSeverity] = useState<string>("All");
    const [selectedStatus, setSelectedStatus] = useState<string>(STATUS.OPEN);
    const [searchText, setSearchText] = useState<string>("");

    const allTags = useMemo(() => {
        const tagSet = new Set<string>();
        bugs.forEach((bug) => {
            for (const tag of bug.tags) tagSet.add(tag);
        });
        return [...tagSet].sort();
    }, [bugs]);

    const severities = useMemo(
        () => ["All", ...Object.values(SEVERITY).reverse()],
        []
    );
    const statuses = useMemo(() => ["All", ...Object.values(STATUS)], []);

    const filtered = useMemo(() => {
        let filtered = bugs;
        if (selectedStatus !== "All") {
            filtered = filtered.filter(
                (bug) => (bug.status || STATUS.OPEN) === selectedStatus
            );
        }
        if (selectedSeverity !== "All") {
            filtered = filtered.filter(
                (bug) => bug.severity === selectedSeverity
            );
        }
        if (searchText.trim()) {
            const search = searchText.trim().toLowerCase();
            filtered = filtered.filter((bug) => {
                const spellNames = [
                    bug.spell?.name,
                    ...(bug.affectedSpells
                        ? bug.affectedSpells.map((spell) => spell.name)
                        : []),
                ]
                    .filter(Boolean)
                    .map((n) => n.toLowerCase());
                return (
                    spellNames.some((name) => name.includes(search)) ||
                    bug.title.toLowerCase().includes(search) ||
                    bug.description.toLowerCase().includes(search) ||
                    (selectedSpec?.name?.toLowerCase?.() || "").includes(
                        search
                    ) ||
                    bug.tags.some((tag) => tag.toLowerCase().includes(search))
                );
            });
        }
        return filtered;
    }, [bugs, selectedSeverity, searchText, selectedStatus, selectedSpec]);

    const isDefault =
        searchText === "" &&
        selectedStatus === STATUS.OPEN &&
        selectedSeverity === "All";

    const clearAllFilters = () => {
        setSelectedSeverity("All");
        setSelectedStatus(STATUS.OPEN);
        setSearchText("");
    };

    return {
        selectedSeverity,
        setSelectedSeverity,
        selectedStatus,
        setSelectedStatus,
        searchText,
        setSearchText,
        allTags,
        severities,
        statuses,
        isDefault,
        clearAllFilters,
        filtered,
    };
};
