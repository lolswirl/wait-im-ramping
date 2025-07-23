import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@context/ThemeContext";
import { SpecProvider } from "@context/SpecContext";
import Theme from "@components/Theme/Theme";
import AppBar from "@components/AppBar/AppBar";
import FooterBar from "@components/AppBar/FooterBar";
import ClientTilingBackground from "@components/Tiling/ClientTilingBackground";

export const metadata: Metadata = {
    title: {
        default: "wait, i'm ramping!",
        template: "%s | wait, i'm ramping!",
    },
    description:
        "a website full of tools used to help world of warcraft healers plan, visualize, and optimize their healing. :3",
    openGraph: {
        type: "website",
        url: "https://waitimramping.vercel.app/",
        title: "wait, i'm ramping!",
        description:
            "a website full of tools used to help world of warcraft healers plan, visualize, and optimize their healing. :3",
        images: [
            {
                url: "https://waitimramping.vercel.app/description.png",
                width: 1200,
                height: 630,
                alt: "wait, i'm ramping!",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "wait, i'm ramping!",
        description:
            "a website full of tools used to help world of warcraft healers plan, visualize, and optimize their healing. :3",
        images: ["https://waitimramping.vercel.app/description.png"],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <ThemeProvider>
                    <Theme>
                        <SpecProvider>
                            <ClientTilingBackground />
                            <AppBar />
                            <main>{children}</main>
                            <FooterBar />
                        </SpecProvider>
                    </Theme>
                </ThemeProvider>
            </body>
        </html>
    );
}
