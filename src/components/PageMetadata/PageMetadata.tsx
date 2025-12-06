import { GetTitle } from "@util/stringManipulation";

const isBetaEnv = () => process.env.NEXT_PUBLIC_IS_BETA === 'true';

const getSiteName = () => 
    isBetaEnv() ? "[BETA] Wait, I'm Ramping!" : "Wait, I'm Ramping!";

const SITE_DESCRIPTION =
    "Tools that help healers plan, visualize, and theorycraft their healing.";
const SITE_URL = "https://www.waitimramping.com/";
const SITE_IMAGE = SITE_URL + "description.png";

const getTitleTemplate = () => 
    isBetaEnv() ? "[BETA] %s | Wait, I'm Ramping!" : "%s | Wait, I'm Ramping!";

export function PageMetadata(
    title: string = "",
    description: string = SITE_DESCRIPTION,
    image: string = SITE_IMAGE,
    url: string = SITE_URL
) {
    const SITE_NAME = getSiteName();
    const TITLE_TEMPLATE = getTitleTemplate();
    const displayTitle = title || SITE_NAME;
    
    const formattedTitle = GetTitle(displayTitle);
    const formattedDescription = GetTitle(description);

    return {
        title: {
            default: formattedTitle,
            template: GetTitle(TITLE_TEMPLATE),
        },
        description: formattedDescription,
        openGraph: {
            type: "website",
            url,
            title: title ? GetTitle(`${title} | ${SITE_NAME}`) : formattedTitle,
            description: formattedDescription,
            // images: [
            //     {
            //         url: image,
            //         width: 1200,
            //         height: 630,
            //         alt: GetTitle(SITE_NAME),
            //     },
            // ],
        },
        twitter: {
            card: "summary_large_image",
            title: GetTitle(`${title || SITE_NAME} | ${SITE_NAME}`),
            description: formattedDescription,
            // images: [image],
        },
    };
}
