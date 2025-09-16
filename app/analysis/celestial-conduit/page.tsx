import Conduit from "./Conduit";
import { PageMetadata } from "@components/PageMetadata/PageMetadata";

const title = "Celestial Conduit Comparison";
const description = "Analyze Celestial Conduit's output compared to other spells and abilities";
export const metadata = PageMetadata(title, description);

export default function Page() {
  return <Conduit title={title} description={description} />;
}