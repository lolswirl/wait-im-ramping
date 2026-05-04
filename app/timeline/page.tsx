import Timeline from "./Timeline";
import { PageMetadata } from "@components/PageMetadata/PageMetadata";
import { spellTimeline } from "../AnalysisPages";

export const metadata = PageMetadata(spellTimeline.label, spellTimeline.description);

export default function Page() {
  return <Timeline title={spellTimeline.label} description={spellTimeline.description} />;
}