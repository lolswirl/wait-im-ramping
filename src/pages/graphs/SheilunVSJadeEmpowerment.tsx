import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Box, Container } from "@mui/material";
import PageTitle from "../../components/PageTitle/PageTitle.tsx"

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SheilunVSJadeEmpowerment: React.FC = () => {

  const sheilunSpellpowerPerStack = 684.9;

  const jeSpellpowerCalc = (value: number) => 154.5 * (value / 100) * 1.9;
  const jeBaseSpellpower = 2500;
  const jeChainValue = jeBaseSpellpower * 0.15;
  const jeValues = Array.from({length: 5}, (_, i) => 2500 + i * jeChainValue);
  const jeSpellpowers = jeValues.map(value => jeSpellpowerCalc(value));
  
  const xValues = Array.from({ length: 10 }, (_, i) => i + 1);
  
  const sheilunSpellpowers = xValues.map(i => sheilunSpellpowerPerStack * i);

  const chartData = {
    labels: xValues.map(value => `${value}`),
    datasets: [
      {
        label: "Sheilun's Gift",
        data: sheilunSpellpowers,
        borderColor: "rgba(255, 99, 132, 0.6)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: false,
      },
      ...jeValues.map((value, index) => ({
        label: `JE ${index + 1} Target`,
        data: Array(xValues.length).fill(jeSpellpowers[index]),
        borderColor: `rgba(${50 + index * 40}, 162, 235, 0.6)`,
        backgroundColor: `rgba(${50 + index * 40}, 162, 235, 0.2)`,
        fill: false,
      })),
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Spellpower Comparison",
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Sheilun's Gift Stacks",
        },
      },
      y: {
        title: {
          display: true,
          text: "Spellpower",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <Container sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 4, alignItems: "center", justifyContent: "center" }}>
      <PageTitle title="Spellpower Comparison"/>
      <Box sx={{ height: 500, width: "80%", display: "flex", justifyContent: "center" }}>
        <Line data={chartData} options={chartOptions} />
      </Box>
    </Container>
  );
};

export default SheilunVSJadeEmpowerment;
