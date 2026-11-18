// Camada de dados: o único sítio que sabe falar com o WordPress.
// As páginas do Next.js importam estas funções e nunca chamam fetch() diretamente.

const WP_URL = process.env.WORDPRESS_URL;

if (!WP_URL) {
  throw new Error("Falta WORDPRESS_URL no .env.local");
}

const API = `${WP_URL}/wp-json`;

// Quantos segundos o Next.js guarda uma resposta em cache antes de voltar a pedir ao WordPress.
const REVALIDATE_SECONDS = 60;

// ---------- Tipos crus do WordPress (só os campos que usamos) ----------

type Rendered = { rendered: string };

type WPTerm = { id: number; name: string; slug: string; taxonomy: "category" | "post_tag" };

export type WPPage = {
  id: number;
  slug: string;
  title: Rendered;
  content: Rendered;
  parent: number;
};

type WPPost = {
  id: number;
  slug: string;
  date: string;
  sticky: boolean;
  title: Rendered;
  content: Rendered;
  excerpt: Rendered;
  // Campos registados pelo mu-plugin headless-case-studies.php
  meta: { client?: string; role?: string; deliverables?: string; context?: string };
  _embedded?: {
    "wp:featuredmedia"?: { source_url: string; alt_text: string; media_details?: { width: number; height: number } }[];
    "wp:term"?: WPTerm[][];
  };
};

export type WPCategory = { id: number; slug: string; name: string; count: number };

// ---------- O nosso modelo: um case study já "limpo" para o React ----------

export type CaseStudy = {
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  year: number;
  client: string;
  role: string;
  deliverables: string;
  context: string;
  featured: boolean;
  categories: { slug: string; name: string }[];
  tags: string[];
  readingMinutes: number;
  image: { src: string; alt: string; width: number; height: number } | null;
};

// ---------- Função base ----------

// Erros temporários: o servidor está ocupado (o build faz muitos pedidos em paralelo e um
// alojamento partilhado, ou o Local, só tem poucos processos PHP). Vale a pena tentar outra vez.
const RETRY_STATUSES = new Set([429, 502, 503, 504]);
const MAX_ATTEMPTS = 4;

async function wpFetch<T>(path: string): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(`${API}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (res.ok) return res.json() as Promise<T>;

    if (RETRY_STATUSES.has(res.status) && attempt < MAX_ATTEMPTS) {
      await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** (attempt - 1))); // 0,5 s → 1 s → 2 s
      continue;
    }

    throw new Error(`WordPress respondeu ${res.status} em ${path}`);
  }
}

// ---------- Conversão WordPress → CaseStudy ----------

function toCaseStudy(post: WPPost): CaseStudy {
  const terms = post._embedded?.["wp:term"]?.flat() ?? [];
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  const words = stripTags(post.content.rendered).split(/\s+/).filter(Boolean).length;

  return {
    slug: post.slug,
    title: decodeEntities(post.title.rendered),
    excerpt: decodeEntities(post.excerpt.rendered).trim(),
    contentHtml: post.content.rendered,
    year: new Date(post.date).getFullYear(),
    client: post.meta.client || decodeEntities(post.title.rendered),
    role: post.meta.role ?? "",
    deliverables: post.meta.deliverables ?? "",
    context: post.meta.context ?? "",
    featured: post.sticky,
    categories: terms
      .filter((t) => t.taxonomy === "category" && t.slug !== "uncategorized")
      .map(({ slug, name }) => ({ slug, name: decodeEntities(name) })),
    tags: terms.filter((t) => t.taxonomy === "post_tag").map((t) => decodeEntities(t.name)),
    readingMinutes: Math.max(1, Math.ceil(words / 220)),
    image: media
      ? {
          src: media.source_url,
          alt: media.alt_text,
          width: media.media_details?.width ?? 1600,
          height: media.media_details?.height ?? 1000,
        }
      : null,
  };
}

// _embed traz a imagem destacada e os termos (categorias + tags) na mesma resposta.
const EMBED = "_embed=wp:featuredmedia,wp:term";

// ---------- Funções públicas ----------

export async function getCaseStudies(categorySlug?: string): Promise<CaseStudy[]> {
  let filter = "";
  if (categorySlug) {
    const category = await getCategory(categorySlug);
    if (!category) return [];
    filter = `&categories=${category.id}`;
  }
  const posts = await wpFetch<WPPost[]>(`/wp/v2/posts?per_page=100&${EMBED}${filter}`);
  return posts.map(toCaseStudy);
}

export async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  const posts = await wpFetch<WPPost[]>(`/wp/v2/posts?slug=${encodeURIComponent(slug)}&${EMBED}`);
  return posts[0] ? toCaseStudy(posts[0]) : null;
}

export async function getCategories(): Promise<WPCategory[]> {
  const categories = await wpFetch<WPCategory[]>("/wp/v2/categories?per_page=100&hide_empty=true");
  return categories
    .filter((c) => c.slug !== "uncategorized")
    .map((c) => ({ ...c, name: decodeEntities(c.name) }));
}

export async function getCategory(slug: string): Promise<WPCategory | null> {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}

export async function getPages(): Promise<WPPage[]> {
  return wpFetch<WPPage[]>("/wp/v2/pages?per_page=100");
}

export async function getPageBySlug(slug: string): Promise<WPPage | null> {
  const pages = await wpFetch<WPPage[]>(`/wp/v2/pages?slug=${encodeURIComponent(slug)}`);
  return pages[0] ?? null;
}

// ---------- Utilitários ----------

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ");
}

// O WordPress devolve texto com entidades HTML (&#8217; etc.). Isto limpa as mais comuns.
export function decodeEntities(text: string): string {
  return stripTags(text)
    .replace(/&#8217;|&#8216;|&#039;/g, "'")
    .replace(/&#8220;|&#8221;|&quot;/g, '"')
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#8230;|&hellip;/g, "…")
    .replace(/&#038;|&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
