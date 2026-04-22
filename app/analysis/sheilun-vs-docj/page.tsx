import SheilunVsDocJ from "./SheilunVsDocJ";
import { PageMetadata } from "@components/PageMetadata/PageMetadata";
import { sheilunVsDocj } from "../../AnalysisPages";

const title = sheilunVsDocj.label;
const description = sheilunVsDocj.description;
export const metadata = PageMetadata(title, description);

export default function Page() {
  return <SheilunVsDocJ title={title} description={description} />;
}
