import "./css/App.css";
import * as React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

import { useThemeContext } from "./context/ThemeContext";
import AppBar from "./components/AppBar/AppBar";
import FooterBar from "./components/AppBar/FooterBar";

import Tiling from "./components/Tiling/Tiling";
import GridTiling from "./components/Tiling/GridTiling";

import { analysisPages } from "./pages/analysis/AnalysisPages";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import WhenDoIRamp from "./pages/WhenDoIRamp";
import Timeline from "./pages/Timeline";
import MissingIcons from "./components/MissingIcons/MissingIcons";
import BugsPage from "./pages/BugsPage";

function App() {
    const { themeMode } = useThemeContext();
    const tile = themeMode === "dark"
      ? "/tile_transparent.png"
      : "/tile_inverted.png";

    const [useGrid, setUseGrid] = React.useState(false);

    React.useEffect(() => {
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
                            <Route
                                path="/when-do-i-ramp"
                                element={<WhenDoIRamp />}
                            />
                            <Route path="/timeline" element={<Timeline />} />
                            <Route path="/missing" element={<MissingIcons />} />
                            <Route path="/bugs" element={<BugsPage />} />
                            {analysisPages.map(({ path, element }) => (
                                <Route
                                    key={path}
                                    path={path}
                                    element={element}
                                />
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
