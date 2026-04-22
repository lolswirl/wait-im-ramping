import SheilunsGiftBreakdown from "./SheilunsGiftBreakdown";
import { PageMetadata } from "@components/PageMetadata/PageMetadata";
import { sheilunsGiftBreakdown } from "../../AnalysisPages";

const title = sheilunsGiftBreakdown.label;
const description = sheilunsGiftBreakdown.description;
export const metadata = PageMetadata(title, description);

export default function Page() {
  return <SheilunsGiftBreakdown title={title} description={description} />;
}
