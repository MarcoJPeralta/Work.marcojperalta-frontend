// Favicon gerado no build a partir do design (ver Mark em src/lib/og.tsx).
import { ImageResponse } from "next/og";
import { loadSerifFonts, Mark } from "@/lib/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
  return new ImageResponse(<Mark scale={1} />, { ...size, fonts: await loadSerifFonts() });
}
