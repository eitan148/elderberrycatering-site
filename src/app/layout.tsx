import type { Metadata, Viewport } from "next";
import { Assistant } from "next/font/google";
import "./globals.css";
import { listSourceStylesheets, getChrome } from "@/lib/content-store";

const SITE = {
  name: "קייטרינג אלדברי",
  alternateName: "Elderberry Catering",
  // NEXT_PUBLIC_SITE_URL controls metadataBase. Set to the live deployment URL pre-DNS-cutover
  // (so canonical/og:image resolve to a real host). Default falls back to the production domain.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.elderberrycatering.com",
  description:
    "קייטרינג בד\"ץ העדה החרדית כשר למהדרין. שירות מקצועי לאירועים גדולים: חתונות, בריתות, ברי ובנות מצווה, ועוד.",
  locale: "he_IL",
  lang: "he-IL",
};

const assistant = Assistant({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-assistant",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.name, template: `%s • ${SITE.name}` },
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const cssFiles = listSourceStylesheets();
  const chrome = getChrome();
  return (
    <html
      lang="he"
      dir="rtl"
      className={assistant.variable}
    >
      <head>
        {cssFiles.map((href) => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
      </head>
      <body
        className={chrome.body_classes || "rtl"}
        style={{ fontFamily: "var(--font-assistant), Assistant, system-ui, sans-serif" }}
      >
        {chrome.a11y_toolbar ? (
          <div className="wp-html-section" data-section="a11y-toolbar" dangerouslySetInnerHTML={{ __html: chrome.a11y_toolbar }} />
        ) : null}
        {chrome.header_html ? (
          <div className="wp-html-section" data-section="header" dangerouslySetInnerHTML={{ __html: chrome.header_html }} />
        ) : null}
        {children}
        {chrome.footer_html ? (
          <div className="wp-html-section" data-section="footer" dangerouslySetInnerHTML={{ __html: chrome.footer_html }} />
        ) : null}
        {(chrome.sticky_bars || []).map((html, i) => (
          <div key={i} className="wp-html-section" data-section={`sticky-${i}`} dangerouslySetInnerHTML={{ __html: html }} />
        ))}
      </body>
    </html>
  );
}
