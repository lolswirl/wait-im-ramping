import "./App.css";
import * as React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./pages/Home.tsx";
import Graphs from "./pages/graphs/Graphs.tsx";
import AbsorbVsDRCompare from "./pages/graphs/AbsorbVsDRCompare.tsx";
import SheilunVSJadeEmpowerment from "./pages/graphs/SheilunVSJadeEmpowerment.tsx";
import Timeline from "./pages/Timeline.tsx";
import AppBar from "./components/AppBar/AppBar.tsx"

function App() {

  return (
    <Router>
      <div className="App">
        <AppBar></AppBar>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/graphs" element={<Graphs />} />
          <Route path="/graphs/external-comparison" element={<AbsorbVsDRCompare />} />
          <Route path="/graphs/spellpower-comparison" element={<SheilunVSJadeEmpowerment />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
