import RushingWindKickComparison from "./RushingWindKick";
import { PageMetadata } from "@components/PageMetadata/PageMetadata";

const title = "Jadefire Teachings vs Rushing Wind Kick";
const description = "Comparison of Rising Sun Kick (Jadefire Teachings) and Rushing Wind Kick damage and healing output";
export const metadata = PageMetadata(title, description);

export default function Page() {
  return (
    <RushingWindKickComparison
      title={title}
      description={description}
    />
  );
}
