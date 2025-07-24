"use client";
import React, { useState } from "react";
import { Box, Container, Typography } from "@mui/material";

import PageHeader from "@components/PageHeader/PageHeader";
import BugTable from "@components/BugTable/BugTable";
import BugDialog from "@components/BugDialog/BugDialog";
import BugFilters from "@components/BugFilters/BugFilters";

import { CLASSES, specialization } from "@data/class/class";
import { Bug } from "@data/bugs/bugs";

import { useBugFilters } from "@hooks/useBugFilters";
import { GetTitle } from "@util/stringManipulation";

const BugsPage: React.FC<{ title: string; description: string }> = ({ title, description }) => {
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
                title={title}
                subtitle={
                    [
                        description,
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
