import "./App.css";
import * as React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react"

import Home from "./pages/Home.tsx";
import Graphs from "./pages/graphs/Graphs.tsx";
import Timeline from "./pages/Timeline.tsx";
import AppBar from "./components/AppBar/AppBar.tsx"
import Tiling from "./components/Tiling/Tiling.tsx";
import GridTiling from "./components/Tiling/GridTiling.tsx";

import { useThemeContext } from './components/Theme/ThemeContext.tsx';
import { graphPages } from "./pages/graphs/GraphPages.tsx";

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
          {graphPages.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
