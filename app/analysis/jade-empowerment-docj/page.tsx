import JadeEmpowermentVsDocJ from "./JadeEmpowermentVsDocJ";
import { PageMetadata } from "@components/PageMetadata/PageMetadata";

const title = "Jade Empowerment vs. Dance of Chi-Ji";
const description = "Compare the spellpower output of Jade Empowerment and Dance of Chi-Ji on varying target counts";
export const metadata = PageMetadata(title, description);

export default function Page() {
  return <JadeEmpowermentVsDocJ title={title} description={description} />;
}