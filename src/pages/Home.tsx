import * as React from "react";
import { useState } from "react";
import RampCalc from "../components/RampCalc/RampCalc.tsx";
import PageTitle from "../components/PageTitle/PageTitle.tsx"

const Home = () => {
  const [totalCastTime, setTotalCastTime] = useState(0);

  const handleTotalCastTimeChange = (newTotalTime: number) => {
    setTotalCastTime(newTotalTime);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
      <PageTitle title="When do I ramp?"/>
      <h1 style={{ marginBottom: "0px" }}>When do I ramp?</h1>
      
      <RampCalc onTotalCastTimeChange={handleTotalCastTimeChange} />
      
      {totalCastTime > 0 && (
        <h1 style={{ marginTop: "0px" }}>Start ramping ~{Math.ceil(totalCastTime)}s before a mechanic</h1>
      )}
    </div>
  );
};

export default Home;
