import { Suspense } from "react";
import Bugs from "./Bugs";
import { PageMetadata } from "@components/PageMetadata/PageMetadata";
import Loading from "@components/Loading/Loading";
import { getSpecializationByKey } from "@data/class";

const title = "Bugs";

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props) {
    const params = await searchParams;
    const specParam = params.spec;
    const spec = typeof specParam === 'string' ? getSpecializationByKey(specParam) : null;
    
    const description = spec 
        ? `Current known bugs and issues for ${spec.name} ${spec.class}`
        : "Current known bugs and issues";
    
    return PageMetadata(title, description);
}

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <Bugs title={title} description="Current known bugs and issues" />
        </Suspense>
    );
}