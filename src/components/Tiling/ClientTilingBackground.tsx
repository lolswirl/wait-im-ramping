"use client";
import { useThemeContext } from "@context/ThemeContext";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Tiling = dynamic(() => import("./Tiling"), { ssr: false });
const GridTiling = dynamic(() => import("./GridTiling"), { ssr: false });

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