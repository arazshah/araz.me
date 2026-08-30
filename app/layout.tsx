import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Araz Shahkarami — Geospatial Backend & GeoAI",
    template: "%s · Araz Shahkarami",
  },
  description:
    "Geospatial backend developer building spatial APIs, GeoAI systems, and open-source infrastructure.",
  applicationName: "Araz Shahkarami",
  authors: [{ name: "Araz Shahkarami", url: siteConfig.url }],
  alternates: { canonical: "/", languages: { "fa-IR": "/fa", "en-US": "/en" } },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "Araz Shahkarami",
    title: "Araz Shahkarami — Geospatial Backend & GeoAI",
    description: "Where geospatial data, AI, and backend infrastructure meet.",
  },
  twitter: {
    card: "summary",
    title: "Araz Shahkarami",
    description: "Geospatial backend · GeoAI · Open source",
  },
};

const themeScript = `(function(){try{var t=localStorage.getItem('theme');document.documentElement.dataset.theme=t||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
