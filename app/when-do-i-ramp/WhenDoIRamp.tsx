"use client";
import * as React from "react";
import { useState } from "react";
import { Typography, Card } from "@mui/material";

import RampCalc from "@components/RampCalc/RampCalc";
import PageHeader from '@components/PageHeader/PageHeader';
import { T } from "@util/T";

const WhenDoIRamp: React.FC<{ title: string; description: string }> = ({ title, description }) => {
    const [totalCastTime, setTotalCastTime] = useState(0);

    const handleTotalCastTimeChange = (newTotalTime: number) => {
        setTotalCastTime(newTotalTime);
    };

     return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
            <PageHeader
                title={title}
                subtitle={description}
            />
            <RampCalc onTotalCastTimeChange={handleTotalCastTimeChange} />
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
