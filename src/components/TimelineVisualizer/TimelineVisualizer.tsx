import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useTheme } from "@mui/material/styles";
import { spell } from '../../data/spell.ts';

const GCD = 1.5;
const RECT_HEIGHT = 100;
const ROW_PADDING = 20;
const ROW_TOTAL_HEIGHT = RECT_HEIGHT + ROW_PADDING;
const TRANSITION_DURATION = 500;

interface TimelineVisualizerProps {
  rotations: spell[][];
}

export default function TimelineVisualizer({ rotations = [] }: TimelineVisualizerProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (rotations.length === 0) return;

    const width = 1200;
    const height = ROW_TOTAL_HEIGHT * rotations.length + 50;
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("background-color", theme.palette.background);

    svg.selectAll("*").remove();

    const g = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

    let totalTime = 0;
    let imageIndex = 0;

    rotations.forEach((rotation, rotationIndex) => {
      let time = 0;
      const y = rotationIndex * ROW_TOTAL_HEIGHT;

      rotation.forEach((ability) => {
        const duration = Math.max(ability.castTime || GCD, GCD);
        const x = time * 100;

        // Background rectangle
        g.append("rect")
          .attr("x", x)
          .attr("y", y)
          .attr("width", duration * 100)
          .attr("height", RECT_HEIGHT)
          .attr("fill", "none")
          .attr("stroke", "white")
          .attr("opacity", 0)
          .transition()
          .duration(TRANSITION_DURATION)
          .attr("opacity", 1);

        // Blue rect from bottom up halfway
        g.append("rect")
          .attr("x", x)
          .attr("y", y + RECT_HEIGHT / 2) // start at bottom
          .attr("width", (GCD - 0.01) * 100)
          .attr("height", RECT_HEIGHT / 2)
          .attr("fill", "none")
          .attr("stroke", "blue")
          .attr("stroke-dasharray", "4,4")
          .attr("opacity", 0)
          .transition()
          .duration(TRANSITION_DURATION)
          .attr("opacity", 1);


        // Icon border and clipping
        const borderSize = 50;
        const borderX = x - 25;
        const borderY = y + (RECT_HEIGHT - borderSize) / 2;
        const clipId = `clip-${rotationIndex}-${imageIndex}`;

        g.append("clipPath")
          .attr("id", clipId)
          .append("rect")
          .attr("x", borderX)
          .attr("y", borderY)
          .attr("width", borderSize)
          .attr("height", borderSize)
          .attr("rx", 8)
          .attr("ry", 8);

        g.append("rect")
          .attr("x", borderX)
          .attr("y", borderY)
          .attr("width", borderSize)
          .attr("height", borderSize)
          .attr("rx", 8)
          .attr("ry", 8)
          .attr("fill", "none")
          .attr("stroke", "#575757")
          .attr("stroke-width", 1)
          .attr("opacity", 0)
          .transition()
          .duration(TRANSITION_DURATION)
          .attr("opacity", 1);

        // Zoomed image
        const zoomFactor = 1.1;
        const zoomedSize = borderSize * zoomFactor;
        const offset = (zoomedSize - borderSize) / 2;

        g.append("image")
          .attr("x", borderX - offset)
          .attr("y", borderY - offset)
          .attr("width", zoomedSize)
          .attr("height", zoomedSize)
          .attr("clip-path", `url(#${clipId})`)
          .attr("opacity", 0)
          .attr("href", `/icons/${ability.icon}.png`)
          .on("error", function () {
            d3.select(this).attr("href", `https://wow.zamimg.com/images/wow/icons/large/${ability.icon}.jpg`);
          })
          .transition()
          .duration(TRANSITION_DURATION)
          .attr("opacity", 1);


        time += duration;
        imageIndex++;
      });

      totalTime = Math.max(totalTime, rotation.reduce((acc, ability) => acc + Math.max(ability.castTime || GCD, GCD), 0));
    });

    const roundedTime = Math.ceil(totalTime * 2) / 2;
    const xScale = d3.scaleLinear().domain([0, roundedTime]).range([0, roundedTime * 100]);

    svg.append("g")
      .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(roundedTime * 2).tickFormat(d3.format(".1f")));
  }, [rotations]);

  return rotations.length > 0 ? <svg ref={svgRef} /> : null;
}
