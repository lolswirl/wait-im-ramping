import AbsorbVsDRCompare from "./AbsorbVsDRCompare";
import { PageMetadata } from "@components/PageMetadata/PageMetadata";

const title = "Absorb vs. Damage Reduction";
const description = "Compare the effectiveness of Damage Reduction to find how damage can scale past Absorbs";
export const metadata = PageMetadata(title, description);

export default function Page() {
  return <AbsorbVsDRCompare title={title} description={description} />;
}