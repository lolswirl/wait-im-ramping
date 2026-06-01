"use client";
import { notFound } from "next/navigation";
import { analysisPages } from "../../AnalysisPages";

export default function AnalysisPageClient({ slug }: { slug: string }) {
    const page = analysisPages.find((p) => p.path === `/analysis/${slug}`);
    if (!page) notFound();

    const Component = page.component;
    return <Component title={page.label} description={page.description} />;
}
