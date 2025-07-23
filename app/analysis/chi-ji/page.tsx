import ChiJiHPS from "./ChiJiPage";
import { GetTitle } from "@util/stringManipulation";

const title = GetTitle("Chi-Ji 'Simulation'");
const description = GetTitle("Simulate the theoretical HPS outcome of rotations that affect Chi-Ji with tuning knobs for stats, enemy count, and talent choices");

export const metadata = {
  title,
  description,
};

export default function Page() {
  return <ChiJiHPS title={title} description={description} />;
}