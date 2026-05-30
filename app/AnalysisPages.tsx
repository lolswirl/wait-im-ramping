import DamageComparison from "./analysis/mw-damage/DamageComparison";
import ChiJiPage from "./analysis/chi-ji/ChiJiPage";
import HotJS from "./analysis/heart-of-the-jade-serpent/HotJS";
import RisingSunKickResets from "./analysis/rising-sun-kick-resets/RisingSunKickResets";
import Conduit from "./analysis/celestial-conduit/Conduit";
import HarmonicSurge from "./analysis/harmonic-surge/HarmonicSurge";
import SheilunVsDocJ from "./analysis/sheilun-vs-docj/SheilunVsDocJ";
import SheilunsGiftBreakdown from "./analysis/sheiluns-gift-breakdown/SheilunsGiftBreakdown";
import RushingWindKickComparison from "./analysis/rushing-wind-kick/RushingWindKick";
import MistyCoalescence from "./analysis/misty-coalescence/MistyCoalescence";
import AbsorbVsDRCompare from "./analysis/external-comparison/AbsorbVsDRCompare";
import WhenDoIRamp from "./when-do-i-ramp/WhenDoIRamp";
import Timeline from "./timeline/Timeline";

export interface AnalysisPage {
  label: string;
  path: string;
  preview: string;
  description: string;
  extra?: string;
  tags: string[];
  createdDate: string;
  component: React.ComponentType<{ title: string; description: string }>;
}

export const externalComparison = { 
  label: "Absorb vs. Damage Reduction", 
  path: "/analysis/external-comparison", 
  preview: "/previews/external-comparison.png",
  description: "Compare the effectiveness of Damage Reduction to find how damage can scale past Absorbs",
  tags: ["Damage Reduction"],
  createdDate: "2025-03-10",
  component: AbsorbVsDRCompare
};


export const mwDamage = { 
  label: "Mistweaver Damage Comparison", 
  path: "/analysis/mw-damage", 
  preview: "/previews/mw-damage.png",
  description: "Evaluate formulated damage output of various Mistweaver rotations",
  tags: ["Rotation", "Damage"],
  createdDate: "2025-03-26",
  component: DamageComparison
};

export const harmonicSurge = { 
  label: "Harmonic Surge", 
  path: "/analysis/harmonic-surge", 
  preview: "/previews/harmonic-surge.png",
  description: "Analyze Harmonic Surge's spellpower output compared to the other Ancient Teachings abilities",
  tags: ["Procs", "Monk"],
  createdDate: "2025-06-28",
  component: HarmonicSurge
};

export const risingSunKickResets = { 
  label: "Rising Sun Kick Resets", 
  path: "/analysis/rising-sun-kick-resets", 
  preview: "/previews/rising-sun-kick-resets.png",
  description: "Find the probabilities of Rising Sun Kick resets based on various input rotations",
  tags: ["Probability", "Monk", "Rotation"],
  createdDate: "2025-07-10",
  component: RisingSunKickResets
};

export const chiJi = {
  label: 'Chi-Ji "Simulation"',
  path: "/analysis/chi-ji",
  preview: "/previews/chi-ji.png",
  description: "Simulate the theoretical HPS of various rotations done inside of Chi-Ji",
  tags: ["Healing", "Monk", "Rotation"],
  createdDate: "2025-07-12",
  component: ChiJiPage
};

export const heartOfTheJadeSerpent = {
  label: 'Heart of the Jade Serpent',
  path: "/analysis/heart-of-the-jade-serpent",
  preview: "/previews/heart-of-the-jade-serpent.png",
  description: "Analyze the effects of Heart of the Jade Serpent's increased cooldown recovery rate to find how many extra casts are received during a fight",
  tags: ["Monk"],
  createdDate: "2025-08-01",
  component: HotJS
};

export const celestialConduit = {
  label: 'Celestial Conduit Comparison',
  path: "/analysis/celestial-conduit",
  preview: "/previews/celestial-conduit.png",
  description: "Analyze Celestial Conduit's output compared to other spells and abilities",
  tags: ["Monk"],
  createdDate: "2025-09-16",
  component: Conduit
};

export const mistyCoalescence = {
  label: 'Misty Coalescence',
  path: "/analysis/misty-coalescence",
  preview: "/previews/misty-coalescence.png",
  description: "Visually graph Renewing Mist's healing increase based on group size with Misty Coalescence",
  tags: ["Healing", "Monk"],
  createdDate: "2026-1-25",
  component: MistyCoalescence
};

export const jadefireTeachingsRwk = {
  label: 'Jadefire Teachings vs Rushing Wind Kick',
  path: "/analysis/rushing-wind-kick",
  preview: "/previews/jft-rwk.png",
  description: "Comparison of Rising Sun Kick (Jadefire Teachings) and Rushing Wind Kick damage and healing output",
  tags: ["Healing", "Monk"],
  createdDate: "2026-02-15",
  component: RushingWindKickComparison
};

export const sheilunVsDocj = {
  label: "Sheilun's Gift vs Dance of Chi-Ji",
  path: "/analysis/sheilun-vs-docj",
  preview: "/previews/sg-docj.png",
  description: "Comparing the healing output of Sheilun's Gift main target to a Dance of Chi-Ji proc (1 Friendly Only)",
  tags: ["Healing", "Monk"],
  createdDate: "2026-04-15",
  component: SheilunVsDocJ
};

export const sheilunsGiftBreakdown = {
  label: "Sheilun's Gift Breakdown",
  path: "/analysis/sheiluns-gift-breakdown",
  preview: "/previews/sg-breakdown.png",
  description: "Detailed breakdown of Sheilun's Gift's healing distribution",
  tags: ["Healing", "Monk"],
  createdDate: "2026-04-22",
  component: SheilunsGiftBreakdown
};

export const whenDoIRamp = {
  label: "When Do I Ramp?",
  path: "/when-do-i-ramp",
  preview: "/previews/when-do-i-ramp.png",
  description: "Calculate ramp timings for spell cast efficiency and planning",
  tags: ["Healing", "Damage", "Rotation"],
  createdDate: "2025-02-28",
  component: WhenDoIRamp
};

export const spellTimeline = {
  label: "Spell Timeline",
  path: "/timeline",
  preview: "/previews/timeline.png",
  description: "Create customized timelines for spell casts and cooldowns",
  tags: ["Healing", "Damage", "Rotation"],
  createdDate: "2025-03-10",
  component: Timeline
};

export const analysisPages: AnalysisPage[] = [
  externalComparison,
  mwDamage,
  harmonicSurge,
  risingSunKickResets,
  chiJi,
  heartOfTheJadeSerpent,
  celestialConduit,
  mistyCoalescence,
  jadefireTeachingsRwk,
  sheilunVsDocj,
  sheilunsGiftBreakdown,
  whenDoIRamp,
  spellTimeline,
];