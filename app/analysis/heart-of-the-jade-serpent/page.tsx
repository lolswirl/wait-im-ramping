import HotJS from "./HotJS";
import { PageMetadata } from "@components/PageMetadata/PageMetadata";

const title = "Heart of the Jade Serpent";
const description = "Analyze the effects of Heart of the Jade Serpent's increased cooldown recovery rate to find how many extra casts are received during a fight";
export const metadata = PageMetadata(title, description);

export default function Page() {
    return <HotJS title={title} description={description} />;
}