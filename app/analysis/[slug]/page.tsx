import { notFound } from "next/navigation";
import { PageMetadata } from "@components/PageMetadata/PageMetadata";
import { analysisPages } from "../../AnalysisPages";

export async function generateStaticParams() {
  return analysisPages.map((page) => ({
    slug: page.path.replace("/analysis/", ""),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = analysisPages.find((p) => p.path === `/analysis/${slug}`);
  if (!page) return {};
  return PageMetadata(page.label, page.description);
}

export default async function AnalysisPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = analysisPages.find((p) => p.path === `/analysis/${slug}`);

  if (!page) {
    notFound();
  }

  const Component = page.component;
  return <Component title={page.label} description={page.description} />;
}
