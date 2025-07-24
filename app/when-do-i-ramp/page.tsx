import WhenDoIRamp from "./WhenDoIRamp";
import { PageMetadata } from "@components/PageMetadata/PageMetadata";

const title = "When Do I Ramp?";
const description = "Calculate ramp timings for spell cast efficiency and planning";
export const metadata = PageMetadata(title, description);

export default function Page() {
  return <WhenDoIRamp title={title} description={description} />;
}