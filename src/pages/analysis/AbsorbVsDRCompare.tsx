import React, { useState, useEffect, useMemo } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { TextField, Box, Container, Typography, useTheme } from "@mui/material";
import PageHeader from "../../components/PageHeader/PageHeader.tsx";
import { GetTitle } from "../../util/stringManipulation.tsx";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AbsorbVsDRCompare: React.FC = () => {
  const [absorbValue, setAbsorbValue] = useState(9.6);
  const [damageReduction, setDamageReduction] = useState(40.5);
  const [maxXAxis, setMaxXAxis] = useState(30);
  const [intersectionPoint, setIntersectionPoint] = useState<{ x: number | null; y: number | null }>({ x: null, y: null });

  const theme = useTheme();

  const damageValues = useMemo(() => Array.from({ length: maxXAxis }, (_, i) => i * 1000000), [maxXAxis]);

  const absorbDamageIntake = useMemo(() => {
    return damageValues.map(
      (value) => (value <= absorbValue * 1000000 ? 0 : value - absorbValue * 1000000)
    );
  }, [absorbValue, damageValues]);

  const reductionDamageIntake = useMemo(() => {
    return damageValues.map((value) => value * (1 - damageReduction / 100));
  }, [damageReduction, damageValues]);

  useEffect(() => {
    let intersectX: number | null = null;
    let intersectY: number | null = null;
  
    for (let i = 0; i < damageValues.length; i++) {
      if (reductionDamageIntake[i] < absorbDamageIntake[i]) {
        intersectX = damageValues[i] / 1000000;
        intersectY = reductionDamageIntake[i] / 1000000;
        break;
      }
    }
  
    setIntersectionPoint({
      x: intersectX,
      y: intersectY,
    });
  }, [absorbValue, damageReduction, damageValues, absorbDamageIntake, reductionDamageIntake]);

  const chartData = useMemo(() => ({
    labels: damageValues.map((value) => `${value / 1000000}M`),
    datasets: [
      {
        label: GetTitle(`${absorbValue}M Absorb`),
        data: absorbDamageIntake.map((value) => value / 1000000),
        borderColor: "rgba(255, 99, 132, 0.6)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
      {
        label: GetTitle(`${damageReduction}% damage reduction`),
        data: reductionDamageIntake.map((value) => value / 1000000),
        borderColor: "rgba(53, 162, 235, 0.6)",
        backgroundColor: "rgba(53, 162, 235, 0.2)",
        fill: true,
      },
      {
        label: GetTitle("No mitigation"),
        data: damageValues.map((value) => value / 1000000),
        borderColor: "rgba(75, 192, 192, 0.6)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: false,
        borderDash: [5, 5],
      },
    ],
  }), [absorbValue, damageReduction, absorbDamageIntake, reductionDamageIntake, damageValues]);

  return (
    <Container sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
      <PageHeader
        title={"Absorb vs. Damage Reduction!"}
        subtitle={"Compare the effectiveness of Damage Reduction to find how damage can scale past Absorbs"}
      />

      <Box sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center" }}>
        <Line
          data={chartData}
          options={{
            responsive: true,
            scales: {
              x: {
                title: { display: true, text: GetTitle("Incoming Damage (Million)") },
                max: 50,
                grid: {
                  color: theme.custom.chart.gridColor,
                },
              },
              y: {
                title: { display: true, text: GetTitle("Damage Taken (Million)") },
                max: maxXAxis,
                grid: {
                  color: theme.custom.chart.gridColor,
                },
              },
            },
          }}
        />
      </Box>

      <Box sx={{ display: "flex", gap: 2, width: "75%", justifyContent: "center" }}>
        <TextField
          label={GetTitle("Absorb Value (Million)")}
          variant="outlined"
          value={absorbValue}
          onChange={(e) => setAbsorbValue(parseFloat(e.target.value) || 0)}
          type="number"
          fullWidth
        />
        <TextField
          label={GetTitle("Damage Reduction (%)")}
          variant="outlined"
          value={damageReduction}
          onChange={(e) => setDamageReduction(parseFloat(e.target.value) || 0)}
          type="number"
          fullWidth
        />
        <TextField
          label={GetTitle("Max Axis (Million)")}
          variant="outlined"
          value={maxXAxis}
          onChange={(e) => setMaxXAxis(parseFloat(e.target.value) || 10)}
          type="number"
          fullWidth
        />
      </Box>

      {intersectionPoint && (
        <Typography variant="body1">
          {GetTitle(
            `Damage Reduction becomes better than Absorb at ${intersectionPoint.x}M damage (${intersectionPoint.y}M damage intake).`
          )}
        </Typography>
      )}
    </Container>
  );
};

export default AbsorbVsDRCompare;
