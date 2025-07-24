import STVsSpinning from "./STVsSpinning";
import { PageMetadata } from "@components/PageMetadata/PageMetadata";

const title = "Single Target Rotation vs. Spinning Crane Kick";
const description = "Evaluate simulated single target rotation (Tiger Palm, Blackout Kick, Rising Sun Kick + resets) damage output compared to Spinning Crane Kick";
export const metadata = PageMetadata(title, description);

export default function Page() {
  return <STVsSpinning title={title} description={description} />;
}