import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AuthorCard } from "@/components/AuthorCard";
import { CaseImage } from "@/components/CaseCard";
import { Eyebrow } from "@/components/ui";
import { site } from "@/content/site";
import { getCaseStudies, getCaseStudy } from "@/lib/wordpress";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const studies = await getCaseStudies();
  return studies.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  return study ? { title: `${study.client}: ${study.title}`, description: study.excerpt } : {};
}

// Página individual. O Draft E só tem o arquivo, por isso segue o "Draft B — Journal · Single",
// que é a mesma família visual ("Journal + stats").
export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = await getCaseStudy(slug);

  if (!study) notFound();

  const glance = [
    { label: "Role", value: study.role },
    { label: "Deliverables", value: study.deliverables },
    { label: "Stack", value: study.tags.join(", ") },
  ].filter((item) => item.value);

  return (
    <article>
      <header className="single-head">
        <Eyebrow tone="accent">{[study.client, study.year, study.role].filter(Boolean).join(" · ")}</Eyebrow>
        <h1 className="single-title">{study.title}</h1>
        <p className="single-dek">{study.excerpt}</p>
        <div className="byline">
          <Image src={site.portrait} alt="" width={40} height={40} />
          <span>
            <b>{site.name}</b>
            {study.context && <> &nbsp;·&nbsp; {study.context}</>} &nbsp;·&nbsp; {study.readingMinutes} min read
          </span>
        </div>
      </header>

      {study.image && (
        <figure className="wrap single-figure">
          <CaseImage study={study} sizes="100vw" priority />
        </figure>
      )}

      <section className="single-body">
        <aside className="glance">
          <Eyebrow>At a glance</Eyebrow>
          <dl>
            {glance.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
        {/* HTML do editor de blocos do WordPress, estilizado em .prose */}
        <div className="prose" dangerouslySetInnerHTML={{ __html: study.contentHtml }} />
      </section>

      <AuthorCard />
    </article>
  );
}
