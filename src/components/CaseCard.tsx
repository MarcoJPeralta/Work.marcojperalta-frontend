import Image from "next/image";
import Link from "next/link";
import type { CaseStudy } from "@/lib/wordpress";

// Imagem do case study, ou um bloco neutro enquanto não houver imagem destacada no WordPress.
export function CaseImage({ study, sizes, priority = false }: { study: CaseStudy; sizes: string; priority?: boolean }) {
  if (!study.image) {
    return <div className="case-img-empty" aria-hidden="true">{study.client}</div>;
  }
  return (
    <Image
      src={study.image.src}
      alt={study.image.alt}
      width={study.image.width}
      height={study.image.height}
      sizes={sizes}
      priority={priority}
    />
  );
}

export function CaseCard({ study }: { study: CaseStudy }) {
  return (
    <Link className="cc" href={`/case-studies/${study.slug}`}>
      <div className="cc-img">
        <CaseImage study={study} sizes="(max-width: 900px) 100vw, 33vw" />
      </div>
      <p className="cc-e">
        {study.client} · {study.year}
      </p>
      <h3 className="cc-t">{study.title}</h3>
      <p className="cc-d">{study.excerpt}</p>
    </Link>
  );
}
