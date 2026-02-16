import HotJS from "./HotJS";
import { PageMetadata } from "@components/PageMetadata/PageMetadata";

const title = "Heart of the Jade Serpent";
const description = "Calculate extra ability casts from Heart of the Jade Serpent's cooldown reduction";
export const metadata = PageMetadata(title, description);

export default function Page() {
    return <HotJS title={title} description={description} />;
}