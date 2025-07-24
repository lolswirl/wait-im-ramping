import SheilunVSJadeEmpowerment from "./SheilunVSJadeEmpowerment";
import { PageMetadata } from "@components/PageMetadata/PageMetadata";

const title = "Sheilun's Gift vs. Jade Empowerment";
const description = "Analyze the spellpower differences between Sheilun's Gift's stacks and Jade Empowerment's chaining";
export const metadata = PageMetadata(title, description);

export default function Page() {
  return <SheilunVSJadeEmpowerment title={title} description={description} />;
}