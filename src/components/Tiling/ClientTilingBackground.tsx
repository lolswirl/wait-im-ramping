"use client";
import { useThemeContext } from "@context/ThemeContext";
import { useEffect, useState } from "react";
import Tiling from "./Tiling";
import GridTiling from "./GridTiling";

export default function ClientTilingBackground() {
  const [useGrid, setUseGrid] = useState(false);
  const { themeMode } = useThemeContext();
  const tile = themeMode === "dark"
      ? "/tile_transparent.png"
      : "/tile_inverted.png";

  useEffect(() => {
    setUseGrid(Math.random() < 0.5);
  }, []);

  return useGrid ? (
    <GridTiling patternSrc={tile} />
  ) : (
    <Tiling patternSrc={tile} />
  );
}