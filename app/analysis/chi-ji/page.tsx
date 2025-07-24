import ChiJiPage from "./ChiJiPage";
import { GetTitle } from "@util/stringManipulation";
import { PageMetadata } from "@components/PageMetadata/PageMetadata";

const title = GetTitle("Chi-Ji 'Simulation'");
const description = GetTitle("Simulate the theoretical HPS outcome of rotations that affect Chi-Ji with tuning knobs for stats, enemy count, and talent choices");

export const metadata = PageMetadata({
  title,
  description,
});

export default function Page() {
  return <ChiJiPage title={title} description={description} />;
}