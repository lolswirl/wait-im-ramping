import { RAINBOW_COLORS } from "@components/Buttons/RainbowCard";

export const SURFACES = {
    bg: "#0f0f0f",
    surface: "#171717",
    raised: "#1e1e1e",
};

export const HAIRLINE = "rgba(255,255,255,0.10)";
export const HAIRLINE_SOFT = "rgba(255,255,255,0.05)";

export const INK = {
    primary: "rgba(255,255,255,0.92)",
    secondary: "rgba(255,255,255,0.60)",
    muted: "rgba(255,255,255,0.40)",
};

export const RADIUS = {
    card: 8,
    control: 4,
};

export const CONTENT_WIDTH = {
    narrow: 600,
    wide: 1100,
};

export interface Section {
    key: string;
    label: string;
    path: string;
    color: string;
}

export const SECTIONS: Section[] = [
    { key: "home", label: "Home", path: "/", color: RAINBOW_COLORS[0] },
    { key: "ramp", label: "When do I ramp?", path: "/when-do-i-ramp", color: RAINBOW_COLORS[1] },
    { key: "timeline", label: "Timeline", path: "/timeline", color: RAINBOW_COLORS[2] },
    { key: "analysis", label: "Analysis", path: "/analysis", color: RAINBOW_COLORS[3] },
    { key: "bugs", label: "Bugs", path: "/bugs", color: RAINBOW_COLORS[4] },
];

export const CHART_COLORS = ["#3b82f6", "#d97706", "#f43f5e", "#15803d", "#a855f7"];

export const sectionForPath = (pathname: string | null): Section => {
    if (!pathname || pathname === "/") return SECTIONS[0];
    const match = SECTIONS.find(s => s.path !== "/" && pathname.startsWith(s.path));
    return match ?? SECTIONS[0];
};
