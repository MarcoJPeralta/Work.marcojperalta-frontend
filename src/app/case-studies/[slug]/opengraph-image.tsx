// Imagem de partilha de cada case study: cliente · ano e o título, gerada a partir do WordPress.
import { ImageResponse } from "next/og";
import { getCaseStudies, getCaseStudy } from "@/lib/wordpress";
import { loadSerifFonts, ShareCard } from "@/lib/og";

export const alt = "Case study by Marco Peralta";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  const studies = await getCaseStudies();
  return studies.map((s) => ({ slug: s.slug }));
}

export default async function CaseStudyImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  const title = study?.title ?? "Case study";
  // Títulos longos ficam mais pequenos para caberem em 3–4 linhas.
  const fontSize = title.length > 70 ? 68 : title.length > 45 ? 80 : 92;

  return new ImageResponse(
    <ShareCard eyebrow={study ? `${study.client} · ${study.year}` : "Case study"} title={title} size={fontSize} />,
    { ...size, fonts: await loadSerifFonts() },
  );
}
