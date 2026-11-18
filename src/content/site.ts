// Texto fixo do layout (Draft E). O que muda com frequência (os case studies) vem do WordPress;
// isto é a "moldura" do site, que só muda quando mudas o design.

export const site = {
  name: "Marco Peralta",
  section: "Case studies",
  description:
    "Long-form write-ups of client work and personal projects by Marco Peralta, a frontend developer in Lisbon.",
  externalUrl: "https://marcojperalta.com",
  externalLabel: "marcojperalta.com",
  contactUrl: "mailto:hello@marcojperalta.com",
  portrait: "https://marcojperalta.com/images/marco-240.webp",
};

export const nav = [
  { href: "/", label: "All cases" },
  { href: "/category/client-work", label: "Client work" },
  { href: "/category/personal", label: "Personal projects" },
  { href: "/about", label: "About" },
];

export const hero = {
  eyebrow: "Case notes · Vol. 1",
  // A palavra entre [colchetes] fica em itálico e na cor de destaque.
  title: "Notes from [between] the Figma file and the live page",
  intro:
    "Long-form write-ups of client work and personal projects by Marco Peralta, a frontend developer in Lisbon who started in design. Each one covers the brief, the calls I made and what happened after launch.",
};

// "published" é preenchido automaticamente com o número de case studies no WordPress.
export const stats = [
  { value: "20+", label: "Production sites shipped" },
  { value: "10+", label: "Years shipping frontend" },
  { value: "published", label: "Case studies published", accent: true },
  { value: "100", label: "Lighthouse a11y, this site" },
] as const;

export const beingWritten = [
  "ECO, a National news website",
  "Cololinasdeferias.pt, an expanded business to help families",
  "Scopecraft, a personal project to help freelancers and small companies all over the world",
];

export const author = {
  tagline: "Designer's eye, engineer's hands.",
  bio: "I'm Marco, a senior frontend developer in Lisbon. Open to contract projects and full-time roles.",
  cta: "Get in touch",
};
