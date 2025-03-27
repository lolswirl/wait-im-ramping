import "./App.css";
import * as React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react"

import Home from "./pages/Home.tsx";
import Graphs from "./pages/graphs/Graphs.tsx";
import AbsorbVsDRCompare from "./pages/graphs/AbsorbVsDRCompare.tsx";
import SheilunVSJadeEmpowerment from "./pages/graphs/SheilunVSJadeEmpowerment.tsx";
import JadeEmpowermentVsDocJ from "./pages/graphs/JadeEmpowermentVsDocJ.tsx";
import STvsSCK from "./pages/graphs/STvsSCK.tsx";
import Timeline from "./pages/Timeline.tsx";
import AppBar from "./components/AppBar/AppBar.tsx"

function App() {

  return (
    <Router>
      <div className="App">
        <AppBar></AppBar>
        <Analytics/>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/graphs" element={<Graphs />} />
          <Route path="/graphs/external-comparison" element={<AbsorbVsDRCompare />} />
          <Route path="/graphs/jade-empowerment-sheiluns" element={<SheilunVSJadeEmpowerment />} />
          <Route path="/graphs/jade-empowerment-docj" element={<JadeEmpowermentVsDocJ />} />
          <Route path="/graphs/st-spinning" element={<STvsSCK />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
