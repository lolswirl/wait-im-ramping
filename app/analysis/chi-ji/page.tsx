import ChiJiPage from "./ChiJiPage";
import { PageMetadata } from "@components/PageMetadata/PageMetadata";

const title = "Chi-Ji 'Simulation'";
const description = "Simulate the theoretical HPS outcome of rotations that affect Chi-Ji with tuning knobs for stats, enemy count, and talent choices";

export const metadata = PageMetadata(title, description);

export default function Page() {
  return <ChiJiPage title={title} description={description} />;
}