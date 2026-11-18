import type { NextConfig } from "next";

// O domínio das imagens vem do WORDPRESS_URL, por isso funciona igual no Local
// (http://workmarcojperalta.local) e em produção (https://cms.marcojperalta.com).
const wp = new URL(process.env.WORDPRESS_URL ?? "http://workmarcojperalta.local");

const nextConfig: NextConfig = {
  // As imagens de partilha leem a fonte de assets/fonts com fs: garante que vai junto nas funções da Vercel.
  outputFileTracingIncludes: { "/**": ["./assets/fonts/*.woff"] },
  images: {
    // Permite que <Image> do Next.js mostre imagens da biblioteca de media do WordPress.
    remotePatterns: [
      {
        protocol: wp.protocol.replace(":", "") as "http" | "https",
        hostname: wp.hostname,
        pathname: "/wp-content/uploads/**",
      },
      // Retrato do autor, servido pelo site atual
      { protocol: "https", hostname: "marcojperalta.com", pathname: "/images/**" },
    ],
  },
};

export default nextConfig;
