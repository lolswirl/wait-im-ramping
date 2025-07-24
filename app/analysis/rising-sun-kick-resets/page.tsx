import RisingSunKickResets from "./RisingSunKickResets";
import { PageMetadata } from "@components/PageMetadata/PageMetadata";

const title = "Rising Sun Kick Resets";
const description = "Find the probabilities of Rising Sun Kick resets based on input rotations";
export const metadata = PageMetadata(title, description);

export default function Page() {
  return <RisingSunKickResets title={title} description={description} />;
}