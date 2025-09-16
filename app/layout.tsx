import "./globals.css";
import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
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
                <AppRouterCacheProvider >
                    <ThemeProvider>
                        <Theme>
                            <SpecProvider>
                                <ClientTilingBackground />
                                <AppBar />
                                <main>{children}</main>
                                <SpeedInsights />
                                <Analytics />
                                <FooterBar />
                            </SpecProvider>
                        </Theme>
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
