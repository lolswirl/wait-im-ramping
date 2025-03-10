import "./App.css";
import * as React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AppBar, Toolbar, Typography } from "@mui/material";

import Home from "./pages/Home.tsx";
import Graphs from "./pages/graphs/Graphs.tsx";
import AbsorbVsDRCompare from "./pages/graphs/AbsorbVsDRCompare.tsx";
import SheilunVSJadeEmpowerment from "./pages/graphs/SheilunVSJadeEmpowerment.tsx";
import Timeline from "./pages/Timeline.tsx";
import NavBar from "./components/NavBar/NavBar.tsx"

function App() {

  return (
    <Router>
      <div className="App">
        <AppBar position="static">
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" component="div">
              When do I ramp?
            </Typography>
            <NavBar></NavBar>
          </Toolbar>
        </AppBar>

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
