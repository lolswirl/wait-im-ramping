"use client";
import React, { useState, useEffect } from "react";
import { Box, Container, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";

import PageHeader from "@components/PageHeader/PageHeader";
import SwirlLink from "@components/SwirlLink/SwirlLink";
import BugTable from "@components/BugTable/BugTable";
import BugDialog from "@components/BugDialog/BugDialog";
import BugFilters from "@components/BugFilters/BugFilters";
import BugUpdateWorkflow from "@components/BugUpdateWorkflow/BugUpdateWorkflow";

import { CLASSES, specialization, getSpecializationByKey } from "@data/class";
import { Bug, STATUS } from "@data/bugs";

import { useBugFilters } from "@hooks/useBugFilters";
import T from "@util/T";
import { pluralize } from "@util/stringManipulation";
import { exportBugsToExcel } from "@util/exportBugsToExcel";

const BugsPage: React.FC<{ title: React.ReactNode; description: React.ReactNode }> = ({ title, description }) => {
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
    const [bugUpdateOpen, setBugUpdateOpen] = useState(false);

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

    const handleExportToExcel = () => {
        const fileName = `${selectedSpec.name.toLowerCase().replace(/\s+/g, '-')}-bugs.xlsx`;
        exportBugsToExcel(filtered, fileName);
    };

    const handleOpenBugUpdate = () => {
        setBugUpdateOpen(true);
    };

    const handleCloseBugUpdate = () => {
        setBugUpdateOpen(false);
    };

    const openBugs = bugs.filter(bug => !bug.status || bug.status === STATUS.OPEN);
    const openBugIndices = bugs
        .map((bug, index) => (!bug.status || bug.status === STATUS.OPEN ? index : -1))
        .filter(index => index !== -1);

    return (
        <Container sx={{ mb: 3 }}>
            <PageHeader 
                title={title}
                subtitle={
                    <>{description}<br />Don't see your spec's bugs? Report them <SwirlLink href="https://github.com/lolswirl/wait-im-ramping/issues" target="_blank" sx={{ fontSize: "0.85rem" }}>here</SwirlLink>!</>
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
                    onExportToExcel={handleExportToExcel}
                    onOpenBugUpdate={handleOpenBugUpdate}
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
                            onClose={handleDialogClose}
                        />
                        <BugUpdateWorkflow
                            open={bugUpdateOpen}
                            onClose={handleCloseBugUpdate}
                            bugs={openBugs}
                            originalIndices={openBugIndices}
                            specKey={selectedSpec.name}
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
                        <T>No bugs found for the selected filters.</T>
                    </Typography>
                )}
            </Box>
        </Container>
    );
};

export default BugsPage;
