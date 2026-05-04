import WhenDoIRamp from "./WhenDoIRamp";
import { PageMetadata } from "@components/PageMetadata/PageMetadata";
import { whenDoIRamp } from "../AnalysisPages";

export const metadata = PageMetadata(whenDoIRamp.label, whenDoIRamp.description);

export default function Page() {
  return <WhenDoIRamp title={whenDoIRamp.label} description={whenDoIRamp.description} />;
}