import MistyCoalescence from "./MistyCoalescence";
import { PageMetadata } from "@components/PageMetadata/PageMetadata";

const title = "Misty Coalescence";
const description = "Visually graph Renewing Mist's healing increase based on group size with Misty Coalescence";
export const metadata = PageMetadata(title, description);

export default function Page() {
  return <MistyCoalescence title={title} description={description} />;
}
