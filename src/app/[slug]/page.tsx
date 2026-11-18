import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuthorCard } from "@/components/AuthorCard";
import { getPages, getPageBySlug, decodeEntities } from "@/lib/wordpress";

type Props = { params: Promise<{ slug: string }> };

// Páginas do WordPress (About…). Uma página estática por cada página publicada.
export async function generateStaticParams() {
  const pages = await getPages();
  return pages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  return page ? { title: decodeEntities(page.title.rendered) } : {};
}

export default async function WordPressPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) notFound();

  return (
    <article>
      <header className="single-head">
        <h1 className="single-title">{decodeEntities(page.title.rendered)}</h1>
      </header>
      <div className="prose page-prose" dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
      <AuthorCard />
    </article>
  );
}
