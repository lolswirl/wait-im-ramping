import React, { useState, useEffect, useMemo } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { TextField, Box, Container, Typography } from "@mui/material";
import PageTitle from "../../components/PageTitle/PageTitle.tsx"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AbsorbVsDRCompare: React.FC = () => {
  const [absorbValue, setAbsorbValue] = useState(8);
  const [damageReduction, setDamageReduction] = useState(40.5);
  const [maxXAxis, setMaxXAxis] = useState(30); // New state for max x-axis
  const [intersectionPoint, setIntersectionPoint] = useState<{ x: number; y: number } | null>(null);

  const damageValues = useMemo(() => Array.from({ length: maxXAxis }, (_, i) => i * 1000000), [maxXAxis]);

  const absorbDamageIntake = useMemo(() => {
    return damageValues.map(
      (value) => (value <= absorbValue * 1000000 ? 0 : value - absorbValue * 1000000)
    );
  }, [absorbValue, damageValues]);

  const reductionDamageIntake = useMemo(() => {
    return damageValues.map(
      (value) => value * (1 - damageReduction / 100)
    );
  }, [damageReduction, damageValues]);

  useEffect(() => {
    let intersectX = null;
    let intersectY = null;
    for (let i = 0; i < damageValues.length; i++) {
      if (reductionDamageIntake[i] < absorbDamageIntake[i]) {
        intersectX = damageValues[i] / 1000000;
        intersectY = reductionDamageIntake[i] / 1000000;
        break;
      }
    }
    setIntersectionPoint(intersectX && intersectY ? { x: intersectX, y: intersectY } : null);
  }, [absorbValue, damageReduction]);

  const chartData = useMemo(() => ({
    labels: damageValues.map((value) => `${value / 1000000}M`),
    datasets: [
      {
        label: `${absorbValue}M Absorb`,
        data: absorbDamageIntake.map((value) => value / 1000000),
        borderColor: "rgba(255, 99, 132, 0.6)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
      {
        label: `${damageReduction}% damage reduction`,
        data: reductionDamageIntake.map((value) => value / 1000000),
        borderColor: "rgba(53, 162, 235, 0.6)",
        backgroundColor: "rgba(53, 162, 235, 0.2)",
        fill: true,
      },
      {
        label: "No mitigation",
        data: damageValues.map((value) => value / 1000000),
        borderColor: "rgba(75, 192, 192, 0.6)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: false,
        borderDash: [5, 5],
      },
    ],
  }), [absorbValue, damageReduction, absorbDamageIntake, reductionDamageIntake]);

  return (
    <Container sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 800, marginTop: 4, alignItems: "center" }}>
      <PageTitle title="External Comparison"/>
      <Box sx={{ display: "flex", gap: 2, width: "50%" }}>
        <TextField
          label="Absorb Value (Million)"
          variant="outlined"
          value={absorbValue}
          onChange={(e) => setAbsorbValue(parseFloat(e.target.value) || 0)}
          type="number"
          fullWidth
        />
        <TextField
          label="Damage Reduction (%)"
          variant="outlined"
          value={damageReduction}
          onChange={(e) => setDamageReduction(parseFloat(e.target.value) || 0)}
          type="number"
          fullWidth
        />
        <TextField
          label="Max Axis (Million)"
          variant="outlined"
          value={maxXAxis}
          onChange={(e) => setMaxXAxis(parseFloat(e.target.value) || 10)}
          type="number"
          fullWidth
        />
      </Box>

      <Box sx={{ height: 500, width: "100%" }}>
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: "Absorb vs. Damage Reduction Comparison",
              },
            },
            scales: {
              x: {
                title: { display: true, text: "Incoming Damage (Million)" },
                max: 50,
              },
              y: {
                title: { display: true, text: "Damage Taken (Million)" },
                max: maxXAxis,
              },
            },
          }}
        />
      </Box>

      {intersectionPoint && (
        <Typography variant="body1">
          Damage Reduction becomes better than Absorb at <strong>{intersectionPoint.x}M damage</strong> ({intersectionPoint.y}M damage intake).
        </Typography>
      )}
    </Container>
  );
};

export default AbsorbVsDRCompare;
