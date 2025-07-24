import Bugs from "./Bugs";
import { PageMetadata } from "@components/PageMetadata/PageMetadata";

const title = "Bugs";
const description = "Compiled list of bugs and issues for every specialization";
export const metadata = PageMetadata(title, description);

export default function Page() {
  return <Bugs title={title} description={description} />;
}