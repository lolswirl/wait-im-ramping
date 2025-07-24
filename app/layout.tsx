import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@context/ThemeContext";
import { SpecProvider } from "@context/SpecContext";
import Theme from "@components/Theme/Theme";
import AppBar from "@components/AppBar/AppBar";
import FooterBar from "@components/AppBar/FooterBar";
import ClientTilingBackground from "@components/Tiling/ClientTilingBackground";
import { PageMetadata } from "@components/PageMetadata/PageMetadata";

export const metadata = PageMetadata();

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
