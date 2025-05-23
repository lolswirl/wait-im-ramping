import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useTheme } from "@mui/material/styles";
import { spell } from '../../data/spell.ts';
import { FormatIconImg, FormatIconLink } from '../../util/FormatIconImg.ts';

const GCD = 1.5;
const RECT_HEIGHT = 100;
const ROW_PADDING = 20;
const ROW_TOTAL_HEIGHT = RECT_HEIGHT + ROW_PADDING;
const TRANSITION_DURATION = 500;
const OFF_GCD_STACK_HEIGHT = 60;

interface TimelineVisualizerProps {
  rotations: spell[][];
}

export default function TimelineVisualizer({ rotations = [] }: TimelineVisualizerProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const theme = useTheme();

  // State for container width (page width or container width)
  const [containerWidth, setContainerWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setContainerWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (rotations.length === 0) return;

    // Calculate max totalTime ignoring off-GCD instants (like before)
    let totalTime = 0;
    rotations.forEach(rotation => {
      let time = 0;
      rotation.forEach(ability => {
        const isOffGCDInstant = (ability.castTime === 0 || ability.castTime === undefined) && ability.gcd === false;
        if (!isOffGCDInstant) {
          time += Math.max(ability.castTime || GCD, GCD);
        }
      });
      totalTime = Math.max(totalTime, time);
    });
    const roundedTime = Math.ceil(totalTime * 2) / 2;

    // Margins
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const availableWidth = containerWidth - margin.left - margin.right;

    // Calculate scale to fit the timeline inside availableWidth
    // Make sure scale is never below a minimum (e.g., 40 px/sec) for readability
    const MIN_SCALE = 40;
    let scale = availableWidth / roundedTime;
    if (scale < MIN_SCALE) scale = MIN_SCALE;

    const width = roundedTime * scale;
    const height = ROW_TOTAL_HEIGHT * rotations.length + 100;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height)
      .style("background-color", theme.palette.background.default || theme.palette.background);

    svg.selectAll("*").remove();

    const g = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

    rotations.forEach((rotation, rotationIndex) => {
      let time = 0;
      let imageIndex = 0;

      let offGCDStackMap: { [time: number]: number } = {};

      rotation.forEach(ability => {
        const duration = Math.max(ability.castTime || GCD, GCD);
        const isOffGCDInstant = (ability.castTime === 0 || ability.castTime === undefined) && ability.gcd === false;
        const x = time * scale;

        const baseY = rotationIndex * ROW_TOTAL_HEIGHT;
        let yOffset = 0;

        if (isOffGCDInstant) {
          const t = +time.toFixed(3);
          const count = offGCDStackMap[t] || 0;
          yOffset = -(count + 1) * OFF_GCD_STACK_HEIGHT;
          offGCDStackMap[t] = count + 1;
        }

        const maxStackBelow = Math.max(
          0,
          ...Object.entries(offGCDStackMap)
            .filter(([t]) => parseFloat(t) <= time)
            .map(([, count]) => count)
        );
        const baseYOffset = maxStackBelow * OFF_GCD_STACK_HEIGHT;
        const y = isOffGCDInstant ? baseY + yOffset : baseY + baseYOffset;

        if (!isOffGCDInstant) {
          g.append("rect")
            .attr("x", x)
            .attr("y", y)
            .attr("width", duration * scale)
            .attr("height", RECT_HEIGHT)
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("opacity", 0)
            .transition()
            .duration(TRANSITION_DURATION)
            .attr("opacity", 1);

          g.append("rect")
            .attr("x", x)
            .attr("y", y + RECT_HEIGHT / 2)
            .attr("width", (GCD - 0.01) * scale)
            .attr("height", RECT_HEIGHT / 2)
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-dasharray", "4,4")
            .attr("opacity", 0)
            .transition()
            .duration(TRANSITION_DURATION)
            .attr("opacity", 1);
        }

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
          .attr("href", FormatIconImg(ability.icon))
          .on("error", function () {
            d3.select(this).attr("href", FormatIconLink(ability.icon));
          })
          .transition()
          .duration(TRANSITION_DURATION)
          .attr("opacity", 1);

        if (!isOffGCDInstant) {
          time += duration;
        }

        imageIndex++;
      });
    });

    const xScale = d3.scaleLinear().domain([0, roundedTime]).range([0, roundedTime * scale]);
    svg.append("g")
      .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(roundedTime * 2).tickFormat(d3.format(".1f")));

  }, [rotations, containerWidth, theme.palette.background]);

  return rotations.length > 0 ? <svg ref={svgRef} /> : null;
}
