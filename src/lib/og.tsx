// Peças partilhadas pelas imagens geradas (favicon e imagens de partilha).
// O ImageResponse (next/og) desenha JSX numa imagem PNG; só aceita fontes .woff/.ttf/.otf,
// por isso a Newsreader vem de assets/fonts (licença OFL) em vez do next/font.
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Cores fixas do tema escuro (as imagens não mudam com o tema do visitante).
export const og = {
  bg: "#111113",
  surface: "#18181b",
  line: "#2c2d33",
  text: "#f4f4f5",
  muted: "#a3a8b4",
  accent: "#ee4f84",
};

export async function loadSerifFonts() {
  const dir = join(process.cwd(), "assets/fonts");
  const [regular, italic, medium] = await Promise.all([
    readFile(join(dir, "newsreader-latin-400-normal.woff")),
    readFile(join(dir, "newsreader-latin-400-italic.woff")),
    readFile(join(dir, "newsreader-latin-500-normal.woff")),
  ]);
  return [
    { name: "Newsreader", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Newsreader", data: italic, weight: 400 as const, style: "italic" as const },
    { name: "Newsreader", data: medium, weight: 500 as const, style: "normal" as const },
  ];
}

// "Notes from [between] the…" → uma <span> por palavra; as que estão entre colchetes em itálico rosa.
// Uma palavra por <span> porque o ImageResponse apaga os espaços nas pontas de cada bloco de texto;
// o espaço entre palavras vem do columnGap do ShareCard.
export function words(text: string) {
  return text.split(/\[(.+?)\]/).flatMap((part, i) =>
    part
      .split(/\s+/)
      .filter(Boolean)
      .map((word, j) => (
        <span key={`${i}-${j}`} style={i % 2 ? { fontStyle: "italic", color: og.accent } : undefined}>
          {word}
        </span>
      )),
  );
}

// Favicon: "M" serif num quadrado escuro, com o traço rosa da marca. Desenhado a 64px e escalado.
export function Mark({ scale, rounded = true }: { scale: number; rounded?: boolean }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        background: og.bg,
        borderRadius: rounded ? 14 * scale : 0,
        fontFamily: "Newsreader",
        fontWeight: 500,
        fontSize: 42 * scale,
        color: og.text,
        lineHeight: 1,
      }}
    >
      <span style={{ marginTop: -7 * scale }}>M</span>
      <div
        style={{
          position: "absolute",
          left: 17 * scale,
          right: 17 * scale,
          bottom: 11 * scale,
          height: 4 * scale,
          borderRadius: 3 * scale,
          background: og.accent,
        }}
      />
    </div>
  );
}

// Moldura da imagem de partilha (1200×630): eyebrow em cima, título grande, rodapé com a marca.
// Tudo em Newsreader (a única fonte carregada), como os títulos do site.
export function ShareCard({ eyebrow, title, size }: { eyebrow: string; title: string; size: number }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: og.bg,
        color: og.text,
        fontFamily: "Newsreader",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 24,
          fontWeight: 500,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: og.accent,
        }}
      >
        {eyebrow}
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          columnGap: Math.round(size * 0.24),
          fontSize: size,
          lineHeight: 1.02,
          letterSpacing: "-0.03em",
        }}
      >
        {words(title)}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 28,
          borderTop: `2px solid ${og.line}`,
          fontSize: 26,
          color: og.muted,
        }}
      >
        <div style={{ display: "flex", gap: 14 }}>
          <span style={{ color: og.text, fontWeight: 500 }}>Marco Peralta</span>
          <span style={{ color: og.accent, fontWeight: 500 }}>/</span>
          <span>Case studies</span>
        </div>
        <span>Senior Frontend Developer · Lisbon</span>
      </div>
    </div>
  );
}
