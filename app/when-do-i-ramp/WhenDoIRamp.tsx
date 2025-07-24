"use client";
import * as React from "react";
import { useState } from "react";
import { Typography } from "@mui/material";

import RampCalc from "@components/RampCalc/RampCalc";
import PageHeader from '@components/PageHeader/PageHeader';
import { GetTitle } from "@util/stringManipulation";

const WhenDoIRamp: React.FC<{ title: string; description: string }> = ({ title, description }) => {
    const [totalCastTime, setTotalCastTime] = useState(0);

    const handleTotalCastTimeChange = (newTotalTime: number) => {
        setTotalCastTime(newTotalTime);
    };

     return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <PageHeader
                title={title}
                subtitle={description}
            />
            <RampCalc onTotalCastTimeChange={handleTotalCastTimeChange} />
            {totalCastTime > 0 && (
                <Typography
                    variant="h1"
                    sx={{
                        mb: 0,
                        fontWeight: 'bold',
                        color: 'text.primary',
                        fontSize: '2em',
                    }}
                >
                    {GetTitle(`Start ramping ~${Math.ceil(totalCastTime)}s before a mechanic`)}
                </Typography>
            )}
        </div>
    );
};

export default WhenDoIRamp;
