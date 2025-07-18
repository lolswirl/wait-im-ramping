import React from "react";
import Box from "@mui/material/Box";
import PageHeader from "../components/PageHeader/PageHeader.tsx";
import mistweaverLogo from "../assets/mistweaver-bad.png";

const NotFound: React.FC = () => (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
        <Box
            component="img"
            src={mistweaverLogo}
            alt="mistweaver"
            sx={{
                width: 256,
                height: 256,
                borderRadius: "8px",
                objectFit: "cover",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                border: "1px solid #575757",
                backgroundColor: "transparent",
                transition: "transform 0.3s ease",
            }}
            onMouseOver={e => (e.currentTarget.style.transform = "scale(1.1)")}
            onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
        />
        <PageHeader
            title="404 - whoops!"
            subtitle={[
                "The page you are looking for does not exist.",
                "Try a new page on the navigation menu or return to the home page."
            ]}
        />
    </div>
);

export default NotFound;