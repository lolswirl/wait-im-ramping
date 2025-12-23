"use client";
import React, { useState, useEffect } from "react";
import { Box, Container, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";

import PageHeader from "@components/PageHeader/PageHeader";
import BugTable from "@components/BugTable/BugTable";
import BugDialog from "@components/BugDialog/BugDialog";
import BugFilters from "@components/BugFilters/BugFilters";

import { CLASSES, specialization, getSpecializationByKey } from "@data/class";
import { Bug } from "@data/bugs";

import { useBugFilters } from "@hooks/useBugFilters";
import { GetTitle, pluralize } from "@util/stringManipulation";

const BugsPage: React.FC<{ title: string; description: string }> = ({ title, description }) => {
    const searchParams = useSearchParams();
    
    const getInitialSpec = (): specialization => {
        const specParam = searchParams.get('spec');
        if (specParam) {
            const urlSpec = getSpecializationByKey(specParam);
            if (urlSpec) return urlSpec;
        }
        return CLASSES.MONK.SPECS.MISTWEAVER;
    };

    const [selectedSpec, setSelectedSpec] = useState<specialization>(getInitialSpec());
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

    useEffect(() => {
        const specParam = searchParams.get('spec');
        if (specParam) {
            const urlSpec = getSpecializationByKey(specParam);
            if (urlSpec && urlSpec !== selectedSpec) {
                setSelectedSpec(urlSpec);
            }
        }
    }, [searchParams, selectedSpec]);

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
            <Box sx={{ mx: "auto" }}>
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
                        <div>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ textAlign: "center", mt: 2 }}
                            >
                                {filtered.length}/{bugs.length} {pluralize(bugs.length, "bug")}
                            </Typography>
                        </div>
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
