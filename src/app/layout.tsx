import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Rock Mill Magnesium",
    template: "%s | Mg",
  },
  description: "Climbing community site for Rock Mill. Track your progress and share your climbs.",
  manifest: "/manifest.json",
  openGraph: {
    title: "Rock Mill Magnesium",
    description: "Climbing community site for Rock Mill. Track your progress and share your climbs.",
    url: "https://rockmill-magnesium.vercel.app",
    siteName: "Rock Mill Magnesium",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rock Mill Magnesium",
    description: "Climbing community site for Rock Mill. Track your progress and share your climbs.",
  },
};

import { Toaster } from "@/components/ui/Toaster";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="Magnesium" />
      </head>
      <body className={`${outfit.className} bg-slate-50 text-slate-900 antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
