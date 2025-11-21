import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rockmill Magnesium",
  description: "Premium Climbing Route Management",
  manifest: "/manifest.json",
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
