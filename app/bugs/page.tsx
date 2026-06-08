import { Suspense } from "react";
import Bugs from "./Bugs";
import { PageMetadata } from "@components/PageMetadata/PageMetadata";
import Loading from "@components/Loading/Loading";

const title = "Bugs";
const description = "Current known bugs and issues";

export function generateMetadata() {
    return PageMetadata(title, description);
}

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <Bugs title={title} description="Current known bugs and issues" />
        </Suspense>
    );
}