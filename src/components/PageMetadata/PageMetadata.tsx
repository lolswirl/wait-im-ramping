import { GetTitle } from "@util/stringManipulation";

export function PageMetadata({
  title,
  description,
  image = "https://waitimramping.vercel.app/description.png",
}: {
  title: string;
  description: string;
  image?: string;
}) {
  return {
    title: GetTitle(title),
    description: GetTitle(description),
    openGraph: {
      title: GetTitle(title),
      description: GetTitle(description),
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: "wait, i'm ramping!",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: GetTitle(title),
      description: GetTitle(description),
      images: [image],
    },
  };
}