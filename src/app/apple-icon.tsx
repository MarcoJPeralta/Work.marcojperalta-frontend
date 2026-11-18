// Ícone para "Adicionar ao ecrã principal" no iPhone/iPad (180×180).
import { ImageResponse } from "next/og";
import { loadSerifFonts, Mark } from "@/lib/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  // O iOS arredonda os cantos sozinho, por isso o quadrado vai sem raio.
  return new ImageResponse(<Mark scale={180 / 64} rounded={false} />, { ...size, fonts: await loadSerifFonts() });
}
