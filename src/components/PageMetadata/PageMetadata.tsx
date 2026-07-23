import { T } from "@util/T";

const getBranchName = () => {
    const branch = process.env.NEXT_PUBLIC_CF_PAGES_BRANCH;

    if (!branch || branch === 'main' || branch === 'master') {
        return null;
    }

    return branch;
};

const SITE_NAME = "Wait, I'm Ramping!";
const SITE_DESCRIPTION =
    "Tools that help healers plan, visualize, and theorycraft their healing.";
const SITE_URL = "https://www.waitimramping.com/";
const SITE_IMAGE = SITE_URL + "description.png";

export function PageMetadata(
    title: string = SITE_NAME,
    description: string = SITE_DESCRIPTION,
    image: string = SITE_IMAGE,
    url: string = SITE_URL
) { 
    const branchName = getBranchName();
    const branchPrefix = branchName ? `[${branchName}] ` : "";
    const formattedDescription = T(description);
    
    const fullTitle = title !== SITE_NAME 
        ? `${branchPrefix}${title} | ${SITE_NAME}` 
        : `${branchPrefix}${title}`;
    
    const formattedFullTitle = T(fullTitle);

    return {
        title: {
            default: formattedFullTitle,
            template: `%s`,
        },
        description: formattedDescription,
        openGraph: {
            type: "website",
            url,
            title: formattedFullTitle,
            description: formattedDescription,
        },
        twitter: {
            card: "summary_large_image",
            title: formattedFullTitle,
            description: formattedDescription,
        },
    };
}
