import DamageComparison from "./DamageComparison";
import { PageMetadata } from "@components/PageMetadata/PageMetadata";

const title = "Mistweaver Damage Comparison";
const description = "Evaluate simulated single target rotation (Tiger Palm, Blackout Kick, Rising Sun Kick + resets) damage output compared to Spinning Crane Kick and Jade Empowerment";
export const metadata = PageMetadata(title, description);

export default function Page() {
  return <DamageComparison title={title} description={description} />;
}