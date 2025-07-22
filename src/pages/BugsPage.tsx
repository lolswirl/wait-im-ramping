import React, { useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import PageHeader from "../components/PageHeader/PageHeader.tsx";
import BugTable from "../components/BugTable/BugTable.tsx";
import BugDialog from "../components/BugDialog/BugDialog.tsx";
import { CLASSES, specialization } from "../data/class/class.ts";
import { Bug } from "../data/bugs/bugs.ts";
import { useBugFilters } from "../hooks/useBugFilters.ts";
import { GetTitle } from "../util/stringManipulation.tsx";
import BugFilters from "../components/BugFilters/BugFilters.tsx";

const BugsPage: React.FC = () => {
    const [selectedSpec, setSelectedSpec] = useState<specialization>(
        CLASSES.MONK.SPECS.MISTWEAVER
    );
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedBug, setSelectedBug] = useState<Bug | null>(null);

    const bugs = selectedSpec.bugs || [];
    const iconSize = 32;

    const {
        selectedSeverity,
        setSelectedSeverity,
        selectedStatus,
        setSelectedStatus,
        searchText,
        setSearchText,
        severities,
        statuses,
        filtered,
    } = useBugFilters(bugs, selectedSpec);

    const handleRowClick = (bug: Bug) => {
        setSelectedBug(bug);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedBug(null);
    };

    return (
        <Container sx={{ mb: 3 }}>
            <PageHeader 
                title={"Bugs"}
                subtitle={
                    [
                        "Compiled list of bugs and issues for every specialization. ",
                        "Don't see your spec's bugs? Report them <a href=\"https://github.com/lolswirl/wait-im-ramping/issues\" target=\"_blank\">here</a>!",
                    ]
                }
                marginBottom={3}
            />
            <Box sx={{ maxWidth: 900, mx: "auto" }}>
                <BugFilters
                    selectedSpec={selectedSpec}
                    setSelectedSpec={setSelectedSpec}
                    search={searchText}
                    onSearchChange={setSearchText}
                    status={selectedStatus}
                    onStatusChange={setSelectedStatus}
                    severity={selectedSeverity}
                    onSeverityChange={setSelectedSeverity}
                    statuses={statuses}
                    severities={severities}
                />
                {filtered.length > 0 ? (
                    <>
                        <BugTable
                            bugs={filtered}
                            iconSize={iconSize}
                            onRowClick={handleRowClick}
                        />
                        <BugDialog
                            open={dialogOpen}
                            bug={selectedBug}
                            selectedSpec={selectedSpec}
                            onClose={handleDialogClose}
                        />
                    </>
                ) : (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textAlign: "center", mt: 2 }}
                    >
                        {GetTitle("No bugs found for the selected filters.")}
                    </Typography>
                )}
            </Box>
        </Container>
    );
};

export default BugsPage;
