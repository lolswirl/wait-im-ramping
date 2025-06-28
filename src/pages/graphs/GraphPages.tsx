import Graphs from "./Graphs.tsx";
import AbsorbVsDRCompare from "./AbsorbVsDRCompare.tsx";
import SheilunVSJadeEmpowerment from "./SheilunVSJadeEmpowerment.tsx";
import JadeEmpowermentVsDocJ from "./JadeEmpowermentVsDocJ.tsx";
import STvsSCK from "./STvsSCK.tsx";
import HarmonicSurge from "./HarmonicSurge.tsx";

export const graphPages = [
  { label: "Graphs", path: "/graphs", element: <Graphs /> },
  { label: "Absorb vs. Damage Reduction", path: "/graphs/external-comparison", element: <AbsorbVsDRCompare /> },
  { label: "Sheilun's Gift vs. Jade Empowerment", path: "/graphs/jade-empowerment-sheiluns", element: <SheilunVSJadeEmpowerment /> },
  { label: "Jade Empowerment vs. Dance of Chi-Ji", path: "/graphs/jade-empowerment-docj", element: <JadeEmpowermentVsDocJ /> },
  { label: "ST Rotation vs. Spinning Crane Kick", path: "/graphs/st-spinning", element: <STvsSCK /> },
  { label: "Harmonic Surge", path: "/graphs/harmonic-surge", element: <HarmonicSurge /> },
];