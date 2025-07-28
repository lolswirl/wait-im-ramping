import { useMemo, useState } from "react";
import { Bug, STATUS, SEVERITY, Tags } from "@data/bugs/bugs";
import { specialization } from "@data/class/class";

export const useBugFilters = (bugs: Bug[], selectedSpec: specialization) => {
    const [selectedSeverity, setSelectedSeverity] = useState<string>("All");
    const [selectedStatus, setSelectedStatus] = useState<string>(STATUS.OPEN);
    const [searchText, setSearchText] = useState<string>("");

    const sortedBugs = useMemo(() => {
        return [...bugs].sort((a, b) => {
            const aBuild = a.lastBuildTested ? parseInt(a.lastBuildTested) : 0;
            const bBuild = b.lastBuildTested ? parseInt(b.lastBuildTested) : 0;
            return bBuild - aBuild;
        });
    }, [bugs]);

    const allTags = useMemo(() => {
        const tagSet = new Set<Tags>();
        bugs.forEach((bug) => {
            for (const tag of bug.tags) tagSet.add(tag);
        });
        return [...tagSet].sort();
    }, [bugs]);

    const severities = useMemo(
        () => ["All", ...(Object.values(SEVERITY).reverse() as string[])],
        []
    );
    const statuses = useMemo(
        () => ["All", ...(Object.values(STATUS) as string[])],
        []
    );

    const filtered = useMemo(() => {
        let filtered = sortedBugs;
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
                    bug.tags.some((tag) => tag.name.toLowerCase().includes(search))
                );
            });
        }
        return filtered;
    }, [sortedBugs, selectedSeverity, searchText, selectedStatus, selectedSpec]);

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
