const risingSunKickPreview = "/previews/rising-sun-kick-resets.png";
const externalComparisonPreview = "/previews/external-comparison.png";
const jadeEmpowermentSheilunsPreview = "/previews/jade-empowerment-sheiluns.png";
const jadeEmpowermentDocjPreview = "/previews/jade-empowerment-docj.png";
const stSpinningPreview = "/previews/st-spinning.png";
const harmonicSurgePreview = "/previews/harmonic-surge.png";
const chijiPreview = "/previews/chi-ji.png";
const hotjsPreview = "/previews/heart-of-the-jade-serpent.png";
const conduitPreview = "/previews/celestial-conduit.png";

export interface AnalysisPage {
  label: string;
  path: string;
  preview: string;
  description: string;
  tags: string[];
  createdDate: string;
}

export const analysisPages: AnalysisPage[] = [
  { 
    label: "Absorb vs. Damage Reduction", 
    path: "/analysis/external-comparison", 
    preview: externalComparisonPreview,
    description: "Compare the effectiveness of Damage Reduction to find how damage can scale past Absorbs",
    tags: ["Damage Reduction"],
    createdDate: "2025-03-10"
  },
  { 
    label: "Sheilun's Gift vs. Jade Empowerment", 
    path: "/analysis/jade-empowerment-sheiluns", 
    preview: jadeEmpowermentSheilunsPreview,
    description: "Analyze the spellpower differences between Sheilun's Gift's stacks and Jade Empowerment's chaining",
    tags: ["Healing", "Monk"],
    createdDate: "2025-03-10"
  },
  { 
    label: "Jade Empowerment vs. Dance of Chi-Ji", 
    path: "/analysis/jade-empowerment-docj", 
    preview: jadeEmpowermentDocjPreview,
    description: "Compare the spellpower output of Jade Empowerment and Dance of Chi-Ji on different target counts",
    tags: ["Healing", "Monk"],
    createdDate: "2025-03-26"
  },
  { 
    label: "Single Target Rotation vs. Spinning Crane Kick", 
    path: "/analysis/st-spinning", 
    preview: stSpinningPreview,
    description: "Evaluate simulated single target rotation damage output compared to Spinning Crane Kick",
    tags: ["Rotation", "Damage"],
    createdDate: "2025-03-26"
  },
  { 
    label: "Harmonic Surge", 
    path: "/analysis/harmonic-surge", 
    preview: harmonicSurgePreview,
    description: "Analyze Harmonic Surge's spellpower output compared to the other Ancient Teachings abilities",
    tags: ["Procs", "Monk"],
    createdDate: "2025-06-28"
  },
  { 
    label: "Rising Sun Kick Resets", 
    path: "/analysis/rising-sun-kick-resets", 
    preview: risingSunKickPreview,
    description: "Find the probabilities of Rising Sun Kick resets based on various input rotations",
    tags: ["Probability", "Monk", "Rotation"],
    createdDate: "2025-07-10"
  },
  {
    label: 'Chi-Ji "Simulation"',
    path: "/analysis/chi-ji",
    preview: chijiPreview,
    description: "Simulate the theoretical HPS of various rotations done inside of Chi-Ji",
    tags: ["Healing", "Monk", "Rotation"],
    createdDate: "2025-07-12"
  },
  {
    label: 'Heart of the Jade Serpent',
    path: "/analysis/heart-of-the-jade-serpent",
    preview: hotjsPreview,
    description: "Analyze the effects of Heart of the Jade Serpent's increased cooldown recovery rate to find how many extra casts are received during a fight",
    tags: ["Monk"],
    createdDate: "2025-08-01"
  },
  {
    label: 'Celestial Conduit Comparison',
    path: "/analysis/celestial-conduit",
    preview: conduitPreview,
    description: "Analyze Celestial Conduit's output compared to other spells and abilities",
    tags: ["Monk"],
    createdDate: "2025-09-16"
  },
];