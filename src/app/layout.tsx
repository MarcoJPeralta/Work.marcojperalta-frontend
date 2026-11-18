import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { themeInitScript } from "@/lib/theme";
import { site } from "@/content/site";
import "./globals.css";

// Fonte serif do Draft E. O next/font descarrega-a no build e serve-a do próprio site.
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-newsreader",
});

// Endereço público do site, para as imagens de partilha terem URL absoluto.
// Na Vercel, VERCEL_PROJECT_PRODUCTION_URL é o domínio de produção (sem https://) e é definido automaticamente.
// NEXT_PUBLIC_SITE_URL permite forçar outro valor.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${site.name} — ${site.section}`, template: `%s · ${site.name}` },
  description: site.description,
  // A imagem vem de app/opengraph-image.tsx (ou da do case study); aqui só o resto do cartão.
  openGraph: {
    type: "website",
    siteName: `${site.name} — ${site.section}`,
    title: `${site.name} — ${site.section}`,
    description: site.description,
    locale: "en_GB",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: o script abaixo muda data-theme antes do React arrancar, e isso é intencional.
    <html lang="en" className={newsreader.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <SiteHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}
