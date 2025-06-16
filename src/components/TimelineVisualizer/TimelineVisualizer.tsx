import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useTheme } from "@mui/material/styles";
import { calculateCastTime, spell, GCD } from '../../data/spell.ts';
import { applyBuffEffects } from '../../data/buffs.ts';
import { FormatIconImg, FormatIconLink } from '../../util/FormatIconImg.ts';
import { toRomanNumeral } from "../../util/toRomanNumeral.ts";
import { GetTitle } from "../../util/stringManipulation.tsx";

const RECT_HEIGHT = 100;
const RECT_HEIGHT_CONDENSED = 35;
const ROW_PADDING = 20;
const ROW_TOTAL_HEIGHT = RECT_HEIGHT + ROW_PADDING;
const ROW_TOTAL_HEIGHT_CONDENSED = RECT_HEIGHT_CONDENSED + ROW_PADDING;
const TRANSITION_DURATION = 500;
const OFF_GCD_STACK_HEIGHT = 60;
const IMAGE_OFFSET = 25;

const GREY = "#575757";
const LIGHT_GREY = "#a3a3a3";
const ORANGE = "#f8b700";
const LIGHT_ORANGE = "#ffde00";
const WHITE = "#ffffff";

interface TimelineVisualizerProps {
  selectedSpec: string;
  rotations: spell[][];
  condense: boolean;
}

interface IconProps {
  graph: any,
  x: number,
  y: number,
  ability: spell,
  xOffset: number,
  rotationIndex: number,
  imageIndex: number;
}

export default function TimelineVisualizer({ selectedSpec, rotations = [], condense }: TimelineVisualizerProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const theme = useTheme();
  const ogcdImages: IconProps[] = [];

  const [containerWidth, setContainerWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setContainerWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function createGlow(svg) {
    const defs = svg.append("defs");

    const glow = defs.append("filter")
      .attr("id", "glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");

    glow.append("feGaussianBlur")
      .attr("stdDeviation", 2)
      .attr("result", "blur");

    glow.append("feFlood")
      .attr("flood-color", GREY)
      .attr("result", "whiteGlow");

    glow.append("feComposite")
      .attr("in", "whiteGlow")
      .attr("in2", "blur")
      .attr("operator", "in")
      .attr("result", "glowEffect");

    glow.append("feMerge")
      .selectAll("feMergeNode")
      .data(["glowEffect", "SourceGraphic"])
      .enter()
      .append("feMergeNode")
      .attr("in", d => d);
  }

  function drawCast(graph, x, y, duration, scale, castFirst: boolean) {
    graph.append("rect")
      .attr("x", x)
      .attr("y", y)
      .attr("width", duration * scale)
      .attr("height", condense ? RECT_HEIGHT_CONDENSED : RECT_HEIGHT)
      .attr("fill", condense ? ORANGE : "none")
      .attr("opacity", 0)
      .attr("rx", condense ? 9 : 0)
      .attr("ry", condense ? 9 : 0)
      .attr("stroke", condense ? LIGHT_ORANGE : WHITE)
      .attr("filter", condense ? "url(#glow)" : "")
      .transition()
      .duration(TRANSITION_DURATION)
      .attr("opacity", 1);
  }
  
  function drawGCD(graph, x, y, gcd, scale, GCDFirst: boolean) {
    graph.append("rect")
      .attr("x", x)
      .attr("y", y + (condense ? -1 : RECT_HEIGHT / 2) )
      .attr("width", (condense ? gcd : gcd - 0.01) * scale)
      .attr("height", (condense ? RECT_HEIGHT_CONDENSED + 2 : RECT_HEIGHT / 2))
      .attr("fill", condense ? GREY : "none")
      .attr("stroke", condense ? LIGHT_GREY : ORANGE)
      .attr("stroke-dasharray", condense ? "" : "5,5")
      .attr("opacity", 0)
      .attr("rx", condense ? 9 : 0)
      .attr("ry", condense ? 9 : 0)
      .transition()
      .duration(TRANSITION_DURATION)
      .attr("opacity", 1);
  }

  function drawIcon(graph, x, y, ability, xOffset, rotationIndex, imageIndex ) {
    const imageSize = 50;
    const borderX = x - (condense ? 1 : IMAGE_OFFSET) + xOffset;
    const borderY = y + ((condense ? RECT_HEIGHT_CONDENSED : RECT_HEIGHT) - imageSize) / 2;
    const clipId = `clip-${rotationIndex}-${imageIndex}`;

    graph.append("clipPath")
      .attr("id", clipId)
      .append("rect")
      .attr("x", borderX)
      .attr("y", borderY)
      .attr("width", imageSize)
      .attr("height", imageSize)
      .attr("rx", 8)
      .attr("ry", 8);

    graph.append("rect")
      .attr("x", borderX)
      .attr("y", borderY)
      .attr("width", imageSize)
      .attr("height", imageSize)
      .attr("rx", 8)
      .attr("ry", 8)
      .attr("fill", "none")
      .attr("stroke", GREY)
      .attr("stroke-width", 1)
      .attr("opacity", 0)
      .transition()
      .duration(TRANSITION_DURATION)
      .attr("opacity", 1);

    const zoomFactor = 1.1;
    const zoomedSize = imageSize * zoomFactor;
    const offset = (zoomedSize - imageSize) / 2;

    graph.append("image")
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

    if (ability.empowerLevel) {
      const roman = toRomanNumeral(ability.empowerLevel);
      const labelGroup = graph.append("g")
          .attr("class", "empower-label");

      const text = labelGroup.append("text")
          .text(roman)
          .style("fill", "white")
          .style("font-size", "0.75rem")
          .style("font-weight", "bold")
          .attr("text-anchor", "end")
          .attr("x", borderX + imageSize)
          .attr("y", borderY + imageSize);

      const bbox = text.node().getBBox();

      labelGroup.insert("rect", "text")
          .attr("x", bbox.x - 2)
          .attr("y", bbox.y - 2)
          .attr("width", bbox.width + 4)
          .attr("height", bbox.height + 4)
          .attr("rx", 4)
          .attr("ry", 4)
          .style("fill", "rgba(0, 0, 0, 0.75)");
    }
  }

  useEffect(() => {
    if (rotations.length === 0) return;
  
    let totalTime = 0;
    rotations.forEach(rotation => {
      let time = 0;
      rotation.forEach(ability => {
        const isOffGCDInstant = (ability.castTime === 0 || ability.castTime === undefined) && ability.gcd === false;
        if (!isOffGCDInstant) {
          time += calculateCastTime(ability, undefined);
        }
      });
      totalTime = Math.max(totalTime, time);
    });
    const roundedTime = Math.ceil(totalTime * 2) / 2;

    // Margins
    const margin = { top: 50, right: 20, bottom: 75, left: 50 };
    const availableWidth = containerWidth - margin.left - margin.right;

    // calculate scale to fit the timeline inside availableWidth
    // make sure scale is never below a minimum (e.g., 40 px/sec) for readability
    const MIN_SCALE = 40;
    let scale = availableWidth / roundedTime;
    if (scale < MIN_SCALE) scale = MIN_SCALE;

    const width = roundedTime * scale;
    const height = (condense ? ROW_TOTAL_HEIGHT_CONDENSED : ROW_TOTAL_HEIGHT) * rotations.length + 130;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height)
      .style("background-color", theme.palette.background.default || theme.palette.background);

    svg.selectAll("*").remove();

    createGlow(svg);

    const g = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

    const legend = svg.append("g")
      .attr("class", "legend");

    const legendItems = [
      { label: GetTitle("GCD"), shape: "rect", color: condense ? GREY : ORANGE },
      { label: GetTitle("Cast"), shape: "rect", color: condense ? ORANGE : WHITE }
    ];

    // Position at top-right with padding
    const legendPadding = 10;
    const legendX = width + margin.left - 150;
    const legendY = legendPadding;

    legend.attr("transform", `translate(${legendX}, ${legendY})`);

    legendItems.forEach((item, i) => {
      const y = i * 20;

      const gItem = legend.append("g").attr("transform", `translate(0, ${y})`);

      gItem.append("rect")
        .attr("x", 0)
        .attr("y", -7)
        .attr("width", 20)
        .attr("height", 14)
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("fill", item.color);

      gItem.append("text")
        .attr("x", 30)
        .attr("y", 4)
        .text(item.label)
        .style("font-size", "0.8rem")
        .style("fill", LIGHT_GREY);
    });

    rotations.forEach(async (rotation, rotationIndex) => {
      let time = 0;
      let imageIndex = 0;

      let offGCDStackMap: { [time: number]: number } = {};

      const updatedSpells = await applyBuffEffects(selectedSpec, rotation);

      updatedSpells.forEach(ability => {

        const duration = calculateCastTime(ability, undefined);
        const isOffGCDInstant = (ability.castTime === 0 || ability.castTime === undefined) && ability.gcd === false;
        const x = time * scale;

        const baseY = rotationIndex * (condense ? ROW_TOTAL_HEIGHT_CONDENSED : ROW_TOTAL_HEIGHT);
        let yOffset = 0;

        let iconXOffset = Object.keys(offGCDStackMap).length * 55;

        if (isOffGCDInstant) {
          const t = +time.toFixed(3);
          const count = offGCDStackMap[t] || 0;
          offGCDStackMap[t] = count + 1;
        } else {
          offGCDStackMap = {};
        }

        const y = baseY + yOffset;

        if (!isOffGCDInstant) {
          
          const gcd = ability.custom?.replaceGCD ?? GCD;
          if (duration > gcd) {
            drawCast(g, x, y, duration, scale, true);
            drawGCD(g, x, y, gcd, scale, false);
          } else if (duration < gcd) {
            drawGCD(g, x, y, gcd, scale, true);
            drawCast(g, x, y, duration, scale, false);
          } else {
            drawCast(g, x, y, duration, scale, true);
            drawGCD(g, x, y, gcd, scale, true);
          }

          drawIcon(g, x, y, ability, iconXOffset, rotationIndex, imageIndex )
        } else {
          const icon: IconProps = {
            graph: g,
            x,
            y,
            ability,
            xOffset: iconXOffset,
            rotationIndex,
            imageIndex
          }
          ogcdImages.push(icon);
        }

        if (!isOffGCDInstant) {
          time += duration;
        }

        imageIndex++;
      });
      
      ogcdImages.forEach((icon) => {
        drawIcon(
          icon.graph,
          icon.x,
          icon.y,
          icon.ability,
          icon.xOffset,
          icon.rotationIndex,
          icon.imageIndex
        );
      });
    });

    const xScale = d3.scaleLinear().domain([0, roundedTime]).range([0, roundedTime * scale]);
    svg.append("g")
      .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(roundedTime * 2).tickFormat(d3.format(".1f")));

  }, [rotations, containerWidth, theme.palette.background, condense]);

  return (
    <>
      {rotations.length > 0 && (
        <svg ref={svgRef} />
      )}
    </>
  );
}
