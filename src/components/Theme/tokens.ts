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

// two tiers: surface glass sits on the page, bar glass is the fixed app bar/footer
export const BLUR = {
    surface: "blur(8px)",
    bar: "blur(12px)",
};

// 1.25 ratio steps
export const FONT = {
    display: "2rem",
    heading: "1.5rem",
    subhead: "1.125rem",
    body: "0.875rem",
    small: "0.78rem",
    micro: "0.7rem",
};

// spell icons are the layout's basic unit; call sites used 18/22/24/30/32/36/40/48 before this
export const ICON = {
    xs: 18,
    sm: 24,
    md: 32,
    lg: 40,
    xl: 48,
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

// Shared tinted-control ladder: `66` border at rest -> full accent on hover, `14` wash.
// Derive from here; don't re-inline these alphas.
export const TINT = {
    restBorder: "66",
    divider: "44",
    wash: "14",
    hoverWash: "2e",
};

// hex suffixes only work on hex accents; anything else (rgba(), var()) goes through color-mix
export const tintAlpha = (accent: string, suffix: string): string =>
    accent.startsWith("#")
        ? accent + suffix
        : `color-mix(in srgb, ${accent} ${Math.round((parseInt(suffix, 16) / 255) * 100)}%, transparent)`;

export const tintedControl = (accent: string, selected = false) => ({
    color: accent,
    border: "1px solid",
    borderColor: selected ? accent : accent + TINT.restBorder,
    borderRadius: `${RADIUS.control}px`,
    transition: "border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease",
    "&:hover": { borderColor: accent },
});

// Disabled = remove the fill, never add grey, never a blanket opacity.
export const tintedDisabled = {
    borderColor: HAIRLINE,
    color: "text.disabled",
};
