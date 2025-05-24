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
import Tiling from "./components/Tiling/Tiling.tsx";
import GridTiling from "./components/Tiling/GridTiling.tsx";

import { useThemeContext } from './components/Theme/ThemeContext.tsx';

function App() {
  const { themeMode } = useThemeContext();
  const tile = themeMode === 'dark' ? "/tile_transparent.png" : "/tile_inverted.png";

  const [useGrid, setUseGrid] = React.useState(false);

  React.useEffect(() =>  {
    setUseGrid(Math.random() < 0.5);
  }, []);

  return (
    <Router>
      <div className="App">    
        <AppBar/>
        {useGrid ? (
          <GridTiling patternSrc={tile} />
        ) : (
          <Tiling patternSrc={tile} />
        )}
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
