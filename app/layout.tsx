import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import type { Metadata } from "next";
import Image from "next/image";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Globe } from "lucide-react";
import { SiGithub, SiDiscord } from "react-icons/si";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://docs.tracearr.com"),
  title: {
    default: "Tracearr Documentation",
    template: "%s | Tracearr Docs",
  },
  description:
    "Documentation for Tracearr - the modern monitoring platform for Plex, Jellyfin, and Emby. Installation guides, configuration, and troubleshooting.",
  keywords: [
    "Tracearr",
    "Tracearr documentation",
    "Plex monitoring",
    "Jellyfin monitoring",
    "Emby monitoring",
    "media server monitoring",
    "Tautulli alternative",
    "session tracking",
    "Docker installation",
    "self-hosted",
  ],
  authors: [{ name: "Tracearr" }],
  creator: "Tracearr",
  publisher: "Tracearr",
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "16x16" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: [{ url: "/favicon.ico" }],
  },
  openGraph: {
    title: "Tracearr Documentation",
    description:
      "Documentation for Tracearr - the modern monitoring platform for Plex, Jellyfin, and Emby. Installation guides, configuration, and troubleshooting.",
    siteName: "Tracearr Docs",
    url: "https://docs.tracearr.com",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tracearr - Free Media Server Monitoring for Plex, Jellyfin, and Emby",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tracearr Documentation",
    description:
      "Documentation for Tracearr - the modern monitoring platform for Plex, Jellyfin, and Emby.",
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: "https://docs.tracearr.com",
  },
};

const navbar = (
  <Navbar
    logo={
      <div className="flex items-center gap-2">
        <Image
          src="/images/logo-transparent.png"
          alt="Tracearr"
          width={32}
          height={32}
        />
        <span className="font-bold text-lg">Tracearr</span>
      </div>
    }
    projectLink="https://github.com/connorgallopo/tracearr"
  />
);

const footer = (
  <Footer className="flex flex-col items-center gap-4 py-6">
    <span className="text-sm text-gray-600 dark:text-gray-400">
      Open source under{" "}
      <a
        href="https://github.com/connorgallopo/Tracearr/blob/main/LICENSE"
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:text-gray-900 dark:hover:text-gray-100"
      >
        AGPL-3.0
      </a>
    </span>
    <div className="flex items-center gap-6">
      <a
        href="https://tracearr.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
      >
        <Globe className="size-4" />
        Website
      </a>
      <a
        href="https://github.com/connorgallopo/tracearr"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
      >
        <SiGithub className="size-4" />
        GitHub
      </a>
      <a
        href="https://discord.gg/a7n3sFd2Yw"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
      >
        <SiDiscord className="size-4" />
        Discord
      </a>
    </div>
  </Footer>
);

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Tracearr Documentation",
  url: "https://docs.tracearr.com",
  description:
    "Documentation for Tracearr - the modern monitoring platform for Plex, Jellyfin, and Emby media servers.",
  publisher: {
    "@type": "Organization",
    name: "Tracearr",
    url: "https://tracearr.com",
    logo: "https://tracearr.com/images/logo-transparent.png",
  },
  potentialAction: {
    "@type": "SearchAction",
    target: "https://docs.tracearr.com?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <body>
        <Layout
          navbar={navbar}
          footer={footer}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/connorgallopo/tracearr-docs/tree/main"
          editLink="Edit this page on GitHub"
        >
          {children}
        </Layout>
      </body>
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      )}
    </html>
  );
}
