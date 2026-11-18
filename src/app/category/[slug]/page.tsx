import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseArchive } from "@/components/CaseArchive";
import { getCaseStudies, getCategories } from "@/lib/wordpress";

type Props = { params: Promise<{ slug: string }> };

// Uma página estática por categoria do WordPress (client-work, personal…).
export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = (await getCategories()).find((c) => c.slug === slug);
  return category ? { title: category.name } : {};
}

export default async function CategoryArchive({ params }: Props) {
  const { slug } = await params;
  const [all, filtered, categories] = await Promise.all([getCaseStudies(), getCaseStudies(slug), getCategories()]);

  if (!categories.some((c) => c.slug === slug)) notFound();

  return <CaseArchive studies={filtered} totalPublished={all.length} categories={categories} activeCategory={slug} />;
}
