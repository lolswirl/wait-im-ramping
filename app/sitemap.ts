import type { MetadataRoute } from "next";
import { SITE_URL } from "@components/PageMetadata/PageMetadata";
import { analysisPages } from "./AnalysisPages";

export const dynamic = "force-static";

const staticPaths = ["", "about", "analysis", "bugs", "changelog"];

export default function sitemap(): MetadataRoute.Sitemap {
    const paths = [
        ...staticPaths,
        ...analysisPages.map((page) => page.path.slice(1)),
    ];

    return paths.map((path) => ({
        url: SITE_URL + path,
    }));
}
