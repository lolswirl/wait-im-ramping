import Analysis from "../Analysis.tsx";
import AbsorbVsDRCompare from "./AbsorbVsDRCompare.tsx";
import SheilunVSJadeEmpowerment from "./SheilunVSJadeEmpowerment.tsx";
import JadeEmpowermentVsDocJ from "./JadeEmpowermentVsDocJ.tsx";
import STvsSCK from "./STvsSCK.tsx";
import HarmonicSurge from "./HarmonicSurge.tsx";
import RisingSunKickResets from "./RisingSunKickResets.tsx";

import risingStunKickPreview from '../../assets/previews/rising-sun-kick-resets.png';
import externalComparisonPreview from '../../assets/previews/external-comparison.png';
import jadeEmpowermentSheilunsPreview from '../../assets/previews/jade-empowerment-sheiluns.png';
import jadeEmpowermentDocjPreview from '../../assets/previews/jade-empowerment-docj.png';
import stSpinningPreview from '../../assets/previews/st-spinning.png';
import harmonicSurgePreview from '../../assets/previews/harmonic-surge.png';

export interface AnalysisPage {
  label: string;
  path: string;
  element: React.ReactElement;
  preview: string;
  description: string;
  tags: string[];
  createdDate: string;
}

export const analysisPages: AnalysisPage[] = [
  { 
    label: "Analysis", 
    path: "/analysis", 
    element: <Analysis />,
    preview: "",
    description: "",
    tags: [],
    createdDate: "2024-01-01"
  },
  { 
    label: "Absorb vs. Damage Reduction", 
    path: "/analysis/external-comparison", 
    element: <AbsorbVsDRCompare />,
    preview: externalComparisonPreview,
    description: "Compare the effectiveness of Damage Reduction to find how damage can scale past Absorbs",
    tags: ["Damage Reduction"],
    createdDate: "2025-03-10"
  },
  { 
    label: "Sheilun's Gift vs. Jade Empowerment", 
    path: "/analysis/jade-empowerment-sheiluns", 
    element: <SheilunVSJadeEmpowerment />,
    preview: jadeEmpowermentSheilunsPreview,
    description: "Analyze the spellpower differences between Sheilun's Gift's stacks and Jade Empowerment's chaining",
    tags: ["Healing", "Monk"],
    createdDate: "2025-03-10"
  },
  { 
    label: "Jade Empowerment vs. Dance of Chi-Ji", 
    path: "/analysis/jade-empowerment-docj", 
    element: <JadeEmpowermentVsDocJ />,
    preview: jadeEmpowermentDocjPreview,
    description: "Compare the spellpower output of Jade Empowerment and Dance of Chi-Ji on different target counts",
    tags: ["Healing", "Monk"],
    createdDate: "2025-03-26"
  },
  { 
    label: "Single Target Rotation vs. Spinning Crane Kick", 
    path: "/analysis/st-spinning", 
    element: <STvsSCK />,
    preview: stSpinningPreview,
    description: "Evaluate simulated single target rotation damage output compared to Spinning Crane Kick",
    tags: ["Rotation", "Damage"],
    createdDate: "2025-03-26"
  },
  { 
    label: "Harmonic Surge", 
    path: "/analysis/harmonic-surge", 
    element: <HarmonicSurge />,
    preview: harmonicSurgePreview,
    description: "Analyze Harmonic Surge's spellpower output compared to the other Ancient Teachings abilities",
    tags: ["Procs", "Monk"],
    createdDate: "2025-06-28"
  },
  { 
    label: "Rising Sun Kick Resets", 
    path: "/analysis/rising-sun-kick-resets", 
    element: <RisingSunKickResets />,
    preview: risingStunKickPreview,
    description: "Find the probabilities of Rising Sun Kick resets based on various input rotations",
    tags: ["Probability", "Monk", "Rotation"],
    createdDate: "2025-07-10"
  },
];