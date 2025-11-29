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
  themeColor: "#F8FAFC",
  icons: {
    icon: "/web-app-manifest-192x192.png",
    apple: "/web-app-manifest-192x192.png",
  },
  openGraph: {
    title: "Rock Mill Magnesium",
    description:
      "Climbing community site for Rock Mill. Track your progress and share your climbs.",
    url: "https://mg.rockmillclimbing.com",
    siteName: "Rock Mill Magnesium",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Rock Mill Magnesium",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rock Mill Magnesium",
    description:
      "Climbing community site for Rock Mill. Track your progress and share your climbs.",
    images: ["/api/og"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Magnesium",
  },
  formatDetection: {
    telephone: false,
  },
};

import { Toaster } from "@/components/ui/Toaster";
import { TooltipProvider } from "@/components/ui/Tooltip";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className={`${outfit.className} bg-[#F8FAFC] text-slate-900 antialiased`}>
        <TooltipProvider delayDuration={300} skipDelayDuration={0}>
          {children}
        </TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}
