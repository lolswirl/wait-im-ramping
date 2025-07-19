import "./css/App.css";
import * as React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react"

import { useThemeContext } from './context/ThemeContext.tsx';
import AppBar from "./components/AppBar/AppBar.tsx"
import FooterBar from "./components/AppBar/FooterBar.tsx";

import Tiling from "./components/Tiling/Tiling.tsx";
import GridTiling from "./components/Tiling/GridTiling.tsx";
import tileTransparent from "./assets/tile_transparent.png";
import tileInverted from "./assets/tile_inverted.png";

import { analysisPages } from "./pages/analysis/AnalysisPages.tsx";
import Home from "./pages/Home.tsx";
import NotFound from "./pages/NotFound.tsx";
import About from "./pages/About.tsx";
import WhenDoIRamp from "./pages/WhenDoIRamp.tsx";
import Timeline from "./pages/Timeline.tsx";
import MissingIcons from "./components/MissingIcons/MissingIcons.tsx";
import Bugs from "./pages/Bugs.tsx";

function App() {
  const { themeMode } = useThemeContext();
  const tile = themeMode === 'dark' ? tileTransparent : tileInverted;

  const [useGrid, setUseGrid] = React.useState(false);

  React.useEffect(() =>  {
    setUseGrid(Math.random() < 0.5);
  }, []);

  return (
      <Router>
        <div className="App">    
          <div id="root">
            <div className="app-content">
              <AppBar />
              {useGrid ? (
                <GridTiling patternSrc={tile} />
              ) : (
                <Tiling patternSrc={tile} />
              )}
              <Analytics />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/when-do-i-ramp" element={<WhenDoIRamp />} />
                <Route path="/timeline" element={<Timeline />} />
                <Route path="/missing" element={<MissingIcons />} />
                <Route path="/bugs" element={<Bugs />} />
                {analysisPages.map(({ path, element }) => (
                  <Route key={path} path={path} element={element} />
                ))}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <FooterBar />
          </div>
        </div>
      </Router>
  );
}

export default App;
