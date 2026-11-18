// Imagem de partilha (LinkedIn, Slack, WhatsApp, X…) do site. As páginas sem imagem própria herdam esta.
import { ImageResponse } from "next/og";
import { hero } from "@/content/site";
import { loadSerifFonts, ShareCard } from "@/lib/og";

export const alt = "Marco Peralta — Case studies: notes from between the Figma file and the live page";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    <ShareCard eyebrow={hero.eyebrow} title={hero.title} size={92} />,
    { ...size, fonts: await loadSerifFonts() },
  );
}
