import * as React from "react";
import { useState } from "react";
import RampCalc from "../components/RampCalc/RampCalc.tsx";
import PageHeader from '../components/PageHeader/PageHeader.tsx';
import { GetTitle } from "../util/stringManipulation.tsx";

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
                <h1 style={{ marginTop: "0px" }}>
                    {GetTitle(`Start ramping ~${Math.ceil(totalCastTime)}s before a mechanic`)}
                </h1>
            )}
        </div>
    );
};

export default Home;
