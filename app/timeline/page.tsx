import Timeline from "./Timeline";
import { PageMetadata } from "@components/PageMetadata/PageMetadata";

const title = "Spell Timeline";
const description = "Create customized timelines for spell casts and cooldowns to analyze cast efficiencies and sunken time costs";
export const metadata = PageMetadata(title, description);

export default function Page() {
  return <Timeline title={title} description={description} />;
}