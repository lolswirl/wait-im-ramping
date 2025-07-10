import React from "react";
import { Typography, Card, CardContent, Divider, Link, Stack, Box } from "@mui/material";
import PageTitle from "../components/PageTitle/PageTitle.tsx";
import { GetTitle } from "../util/stringManipulation.tsx";
import swirlImg from "../assets/swirl.png";
import mistweaverLogo from "../assets/mistweaver-bad.png";

const pageTitle = GetTitle("about");

const imageStyle: React.CSSProperties = {
  width: 128,
  height: 128,
  borderRadius: "8px",
  objectFit: "cover",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
  border: "1px solid #575757",
  backgroundColor: "transparent",
  transition: "transform 0.3s ease",
};

const About = () => {

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
      <PageTitle title={pageTitle} />

      <Card
        variant="outlined"
        sx={{
          maxWidth: 600,
          width: { xs: "90%", sm: "90%", md: "100%" },
          mx: "auto",
          mt: 4,
          mb: { xs: 4, sm: 6 },
          boxSizing: "border-box",
        }}
      >
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h4" gutterBottom align="left">
              about me
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                component="img"
                src={swirlImg}
                alt="swirl"
                sx={imageStyle}
                onMouseOver={e => (e.currentTarget.style.transform = "scale(1.1)")}
                onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
              />
              <Typography variant="body1" paragraph align="left" sx={{ mb: 0 }}>
                hi, i'm swirl — a gamer and software engineer who enjoys digging into how healing{" "}
                works across different games, mostly aligned with world of warcraft.{" "}
                i’ve been playing wow since cataclysm, and started maining mistweaver monk{" "}
                in mists of pandaria.
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="body1" paragraph align="left" sx={{ mb: 0 }}>
                ever since, competitive healing has been a major focus in my gameplay.{" "}
                i've reached world rank 20 in raid, earned multiple 0.1% titles in mythic+{" "}
                season to season, and i'm currently a mistweaver veteran in peak of serenity.{" "}
                i love helping other healers improve and enjoy the role more!
              </Typography>
              <Box
                component="img"
                src={mistweaverLogo}
                alt="mistweaver"
                sx={imageStyle}
                onMouseOver={e => (e.currentTarget.style.transform = "scale(1.1)")}
                onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
              />
            </Stack>
            <Divider
              sx={{
                position: "relative",
                left: "50%",
                right: "50%",
                width: "calc(100% + 32px)",
                transform: "translateX(-50%)",
                my: 2,
                mx: 0,
              }}
            />
            <Typography variant="h4" gutterBottom align="left">
              about this project
            </Typography>
            <Typography variant="body1" paragraph align="left">
              <b>wait, i'm ramping!</b>{" "}
              is a site full of tools to help world of warcraft healers plan, visualize, and{" "}
              fine-tune their healing. it includes a ramp timer calculator, a spell timeline{" "}
              visualizer, and graphs that compare healing spells and cooldowns (that i've implemented :p).
            </Typography>
            <Typography variant="body1" paragraph align="left">
              i created this website as a way to share useful tools for planning and optimizing{" "}
              healing — whether you're trying to clean up your ramp windows, or just trying to{" "}
              understand your spells a bit better.
            </Typography>
            <Typography variant="body1" paragraph align="left">
              i have a lot of ideas for future features,{" "}
              so feel free to reach out in my{" "}
              <Link
                href="https://discord.gg/ZU5rhXtbNd"
                target="_blank"
                rel="noopener noreferrer"
                color="#7289da"
                underline="hover"
              >
                discord
              </Link>{" "}
              or during my{" "}
              <Link
                href="https://www.twitch.tv/lolswirl"
                target="_blank"
                rel="noopener noreferrer"
                color="#9147ff"
                underline="hover"
              >
                twitch
              </Link>{" "}
              streams if you have any suggestions!
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;