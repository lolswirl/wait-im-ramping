"use client";
import { useEffect, useState } from "react";
import Tiling from "./Tiling";
import GridTiling from "./GridTiling";

export default function ClientTilingBackground() {
  const [useGrid, setUseGrid] = useState(false);
  const tile = "/tile_transparent.png";

  useEffect(() => {
    setUseGrid(Math.random() < 0.5);
  }, []);

  return useGrid ? (
    <GridTiling patternSrc={tile} />
  ) : (
    <Tiling patternSrc={tile} />
  );
}