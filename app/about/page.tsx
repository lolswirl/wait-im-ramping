import React from "react";
import { Typography, Card, CardContent, Divider, Link, Stack, Box, Chip } from "@mui/material";
import { PageMetadata } from "@components/PageMetadata/PageMetadata";
import { DiscordSVG, TwitchSVG } from "@components/AppBar/FooterBar";

const title = "About";
const description = "Learn more about the creator of Wait, I'm Ramping!";
export const metadata = PageMetadata(title, description);

const swirlImg = "/swirl.png";
const mistweaverLogo = "/mistweaver-bad.png";

const imageStyle = {
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
                sx={{
                  ...imageStyle,
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                }}
              />
              <Typography variant="body1" paragraph align="left" sx={{ mb: 0 }}>
                hi, i&apos;m swirl :) — a gamer and software engineer who enjoys digging into how healing{" "}
                works across different games, mostly aligned with world of warcraft.{" "}
                i&apos;ve been playing wow since cataclysm, and started maining mistweaver monk{" "}
                in mists of pandaria.
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="body1" paragraph align="left" sx={{ mb: 0 }}>
                ever since, competitive healing has been a major focus in my gameplay.{" "}
                i&apos;ve reached world rank 20 in raid, earned multiple 0.1% titles in mythic+{" "}
                season to season. on another note, i am the mistweaver guide writer for wowhead{" "}
                and i&apos;m currently a mistweaver veteran and moderator in peak of serenity.{" "}
                i love helping other healers improve and enjoy the role more!
              </Typography>
              <Box
                component="img"
                src={mistweaverLogo}
                alt="mistweaver"
                sx={{
                  ...imageStyle,
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                }}
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
              <b>𖦹 wait, i&apos;m ramping!</b>{" "}
              is a site full of tools to help world of warcraft healers plan, visualize, and{" "}
              fine-tune their healing. it includes various components such as a ramp timer calculator,{" "}
              a spell timeline visualizer, many tools that compare spells and cooldowns{" "}
              (that i&apos;ve implemented :p), and much more.
            </Typography>
            <Typography variant="body1" paragraph align="left">
              i created this website as a way to share useful info for planning and optimizing{" "}
              healing — whether you&apos;re trying to clean up your sequencing, or satiate the desire{" "}
              to understand your spells a bit better.
            </Typography>
            <Typography variant="body1" paragraph align="left">
              i have a tons of ideas for this website&apos;s future. if you want to see anything{" "}
              specific implemented, feel free to reach out in my{" "}
              <Link
                href="https://discord.gg/ZU5rhXtbNd"
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
                sx={{ textDecoration: "none" }}
              >
                <Chip
                  icon={<DiscordSVG style={{ marginLeft: 5, marginTop: 1, height: "1em", width: "1em" }} />}
                  label="discord"
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{
                    borderColor: "#7289da",
                    color: "#7289da",
                    fontWeight: "bold",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.1)",
                    },
                  }}
                />
              </Link>{" "}
              or during my{" "}
              <Link
                href="https://www.twitch.tv/lolswirl"
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
                sx={{ textDecoration: "none" }}
              >
                <Chip
                  icon={<TwitchSVG style={{ marginLeft: 5, marginTop: 1, height: "1em", width: "1em" }} />}
                  label="twitch"
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{
                    borderColor: "#9147ff",
                    color: "#9147ff",
                    fontWeight: "bold",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.1)",
                    },
                  }}
                />
              </Link>{" "}
              streams for any suggestions!
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;