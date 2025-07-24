"use client";
import * as React from "react";
import { useState } from "react";
import RampCalc from "../../src/components/RampCalc/RampCalc";
import PageHeader from '../../src/components/PageHeader/PageHeader';
import { GetTitle } from "../../src/util/stringManipulation";
import { Typography } from "@mui/material";

const Home = () => {
    const [totalCastTime, setTotalCastTime] = useState(0);

    const handleTotalCastTimeChange = (newTotalTime: number) => {
        setTotalCastTime(newTotalTime);
    };

     return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <PageHeader
                title={"When Do I Ramp?"}
                subtitle={"Calculate ramp timings for spell cast efficiency and planning"}
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

export default Home;
