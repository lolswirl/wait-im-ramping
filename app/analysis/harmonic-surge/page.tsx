import HarmonicSurge from "./HarmonicSurge";
import { PageMetadata } from "@components/PageMetadata/PageMetadata";

const title = "Harmonic Surge";
const description = "Analyze Harmonic Surge's spellpower output compared to the other Ancient Teachings abilities";
export const metadata = PageMetadata(title, description);

export default function Page() {
  return <HarmonicSurge title={title} description={description} />;
}