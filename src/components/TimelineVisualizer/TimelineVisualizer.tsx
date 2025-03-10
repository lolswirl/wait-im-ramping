import React, { useEffect, useState } from "react";
import { Scatter } from "react-chartjs-2";
import { Chart as ChartJS, LinearScale, PointElement, Tooltip, LineElement } from "chart.js";
import { spell } from "../../data/spell.ts";

ChartJS.register(LinearScale, PointElement, Tooltip, LineElement);

const GCD = 1.5;

interface TimelineVisualizerProps {
  rotations?: any[][];
}

const TimelineVisualizer: React.FC<TimelineVisualizerProps> = ({
  rotations = [],
}) => {
  const [iconImages, setIconImages] = useState<{ [key: string]: HTMLCanvasElement }>({});

  useEffect(() => {
    const loadImages = async () => {
      const images: { [key: string]: HTMLCanvasElement } = {};

      for (const rotation of rotations) {
        for (const spell of rotation) {
          if (!spell || images[spell.icon]) continue;

          const img = new Image();
          img.src = `https://wow.zamimg.com/images/wow/icons/large/${spell.icon}.jpg`;
          await new Promise((resolve) => (img.onload = resolve));

          const canvas = document.createElement("canvas");
          canvas.width = 40;
          canvas.height = 40;
          const ctx = canvas.getContext("2d");

          if (ctx) {
            ctx.beginPath();
            ctx.moveTo(8, 0);
            ctx.lineTo(32, 0);
            ctx.quadraticCurveTo(40, 0, 40, 8);
            ctx.lineTo(40, 32);
            ctx.quadraticCurveTo(40, 40, 32, 40);
            ctx.lineTo(8, 40);
            ctx.quadraticCurveTo(0, 40, 0, 32);
            ctx.lineTo(0, 8);
            ctx.quadraticCurveTo(0, 0, 8, 0);
            ctx.closePath();
            ctx.clip();

            ctx.drawImage(img, 0, 0, 40, 40);

            ctx.strokeStyle = "#575757";
            ctx.lineWidth = 1;
            ctx.strokeRect(0, 0, 40, 40);
          }

          images[spell.icon] = canvas;
        }
      }
      setIconImages(images);
    };

    loadImages();
  }, [rotations]);

  const allData: { x: number; y: number; spell: spell; rotationIndex: number }[] = [];
  let maxTime = 0;

  const xShift = 0.25;
  const spacingBetweenRotations = 0.25;

  const mockRotation = [{}];

  const allRotations = [mockRotation, ...rotations];

  allRotations.forEach((rotation, rotationIndex) => {
    let currentTime = 0;

    const yPosition = rotationIndex === 0 ? 0 : rotationIndex * spacingBetweenRotations;

    if (rotationIndex === 0) {
      allData.push({
        x: 0,
        y: yPosition,
        spell: {} as spell,
        rotationIndex,
      });
    }

    rotation.forEach((spell) => {
      if (!spell) return;
      allData.push({
        x: currentTime,
        y: yPosition,
        spell,
        rotationIndex,
      });
      currentTime += Math.max(spell.castTime || GCD, GCD);
    });

    maxTime = Math.max(maxTime, currentTime);
  });

  const adjustedData = allData.map(({ x, y, spell, rotationIndex }) => ({
    x: x + xShift,
    y,
    spell,
    rotationIndex,
  }));

  const data = {
    datasets: [
      {
        label: "Rotations Timeline",
        data: adjustedData.map(({ x, y }) => ({ x, y })),
        pointStyle: adjustedData.map(({ spell }) => {
          return spell.icon && iconImages[spell.icon] ? iconImages[spell.icon] : null;
        }),
        pointRadius: adjustedData.map(({ spell }) => {
          return spell.icon && iconImages[spell.icon] ? 20 : 0;
        }),
      },
      ...adjustedData
        .map(({ x, y, spell, rotationIndex }) => {
          if (rotationIndex === 0 || !spell) return null;

          return {
            label: `Cast Time Box - ${spell.icon}`,
            data: [
              { x: x - xShift, y: y + 0.1 },
              { x: x - xShift, y: y - 0.1 },
              { x: x - xShift + Math.max(spell.castTime || GCD, GCD), y: y - 0.1 },
              { x: x - xShift + Math.max(spell.castTime || GCD, GCD), y: y + 0.1 },
              { x: x - xShift, y: y + 0.1 },
            ],
            borderColor: "grey",
            borderWidth: 1,
            borderDash: [5, 5],
            showLine: true,
            fill: false,
            pointRadius: 0,
            type: "line",
            tension: 0,
            custom: { legendLabel: "Cast Time" },
          };
        })
        .filter(Boolean),
      ...adjustedData
        .map(({ x, y, spell, rotationIndex }) => {
          if (rotationIndex === 0 || !spell) return null;

          return {
            label: `Global Cooldown Box - ${spell.icon}`,
            data: [
              { x: x - xShift, y: y },
              { x: x - xShift + GCD - 0.01, y: y },
              { x: x - xShift + GCD - 0.01, y: y - 0.1 },
            ],
            borderColor: "blue",
            borderWidth: 1,
            borderDash: [5, 5],
            showLine: true,
            fill: false,
            pointRadius: 0,
            type: "line",
            tension: 0,
            custom: { legendLabel: "GCD" },
          };
        })
        .filter(Boolean),
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        min: 0,
        max: maxTime + 2,
        title: {
          display: true,
          text: "Time (seconds)",
        },
        ticks: {
          stepSize: 0.5,
        },
        grid: {
          drawOnChartArea: true,
          drawTicks: true,
        },
      },
      y: {
        display: false,
      },
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 20,
      },
    },
    plugins: {
      tooltip: {
        enabled: false,
      },
      legend: {
        display: false,
        labels: {
          generateLabels: function (chart) {
            const originalLabels = ChartJS.defaults.plugins.legend.labels.generateLabels(chart);
            return originalLabels.filter(label => {
              return label.text !== 'Rotations Timeline';
            });
          },
        },
      },
    },
    hover: {
      mode: null,
    },
    animation: {
      duration: 0,
    },
  };

  return (
    <div style={{ width: "80%", height: "300px", display: "flex", justifyContent: "center" }}>
      {rotations.length > 0 ? <Scatter data={data} options={options} /> : null}
    </div>
  );
};

export default TimelineVisualizer;
