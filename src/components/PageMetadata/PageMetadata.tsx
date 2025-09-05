import { GetTitle } from "@util/stringManipulation";

const SITE_NAME = "Wait, I'm Ramping!";
const SITE_DESCRIPTION =
    "A website full of tools used to help World of Warcraft healers plan, visualize, and optimize their healing. :3";
const SITE_URL = "https://www.waitimramping.com/";
const SITE_IMAGE = SITE_URL + "description.png";
const TITLE_TEMPLATE = "%s | Wait, I'm Ramping!";

export function PageMetadata(
    title: string = SITE_NAME,
    description: string = SITE_DESCRIPTION,
    image: string = SITE_IMAGE,
    url: string = SITE_URL
) {
    const formattedTitle = GetTitle(title);
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
            title: title !== SITE_NAME ? GetTitle(`${title} | ${SITE_NAME}`) : formattedTitle,
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
            title: GetTitle(`${title} | ${SITE_NAME}`),
            description: formattedDescription,
            // images: [image],
        },
    };
}
