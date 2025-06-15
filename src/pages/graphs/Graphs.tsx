import React from "react";
import { Card, CardActionArea, CardContent, Container, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { graphPages } from "./GraphPages.tsx";
import { GetTitle } from "../../util/stringManipulation.tsx";

const Graphs = () => {
  const navigate = useNavigate();

  // Filter out any entry with label "Graphs" (case-insensitive)
  const filteredGraphPages = graphPages.filter(
    (graph) => graph.label.toLowerCase() !== "graphs"
  );

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        {GetTitle("Graphs")}
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {filteredGraphPages.map((graph) => (
          <Grid item xs={12} sm={6} md={4} key={graph.path}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardActionArea onClick={() => navigate(graph.path)} sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" align="center">
                    {GetTitle(graph.label)}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Graphs;
