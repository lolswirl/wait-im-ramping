import { GetTitle } from "@util/stringManipulation";

const isBetaEnv = () => process.env.NEXT_PUBLIC_IS_BETA === 'true';

const SITE_NAME = "Wait, I'm Ramping!";
const BETA_PREFIX = "[Beta] ";
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
    const betaPrefix = isBetaEnv() ? BETA_PREFIX : "";
    const formattedDescription = GetTitle(description);
    
    // Build the full title with beta prefix BEFORE GetTitle
    const fullTitle = title !== SITE_NAME 
        ? `${betaPrefix}${title} | ${SITE_NAME}` 
        : `${betaPrefix}${title}`;
    
    const formattedFullTitle = GetTitle(fullTitle);

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
