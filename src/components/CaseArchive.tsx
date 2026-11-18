// A página de arquivo do Draft E. Usada em "/" (todos) e em "/category/[slug]" (filtrado).
import type { CaseStudy, WPCategory } from "@/lib/wordpress";
import { beingWritten, hero, stats } from "@/content/site";
import { ArrowLink, Chip, Eyebrow, StatItem } from "./ui";
import { CaseCard, CaseImage } from "./CaseCard";

type Props = {
  /** Todos os case studies publicados (o filtro só afeta a grelha "More case studies"). */
  studies: CaseStudy[];
  categories: WPCategory[];
  activeCategory?: string;
};

// "Notes from [between] the…" → a palavra entre colchetes fica em <em>.
function withEmphasis(text: string) {
  return text.split(/\[(.+?)\]/).map((part, i) => (i % 2 ? <em key={i}>{part}</em> : part));
}

export function CaseArchive({ studies, categories, activeCategory }: Props) {
  // O destaque é o artigo "fixo" (sticky) no WordPress; se não houver, o mais recente.
  // É sempre o mesmo, com ou sem filtro, para a página não mudar acima da grelha.
  const featured = studies.find((s) => s.featured) ?? studies[0];
  const rest = studies.filter(
    (s) => s !== featured && (!activeCategory || s.categories.some((c) => c.slug === activeCategory)),
  );
  const totalPublished = studies.length;

  return (
    <>
      <section className="archive-hero">
        <div>
          <Eyebrow tone="accent">{hero.eyebrow}</Eyebrow>
          <h1 className="display">{withEmphasis(hero.title)}</h1>
        </div>
        <p className="archive-intro">{hero.intro}</p>
      </section>

      <section className="wrap">
        <div className="stats">
          {stats.map((stat) => (
            <StatItem
              key={stat.label}
              value={stat.value === "published" ? String(totalPublished) : stat.value}
              label={stat.label}
              accent={"accent" in stat && stat.accent}
            />
          ))}
        </div>
      </section>

      {featured && (
        <section className="wrap featured">
          <div className="featured-img">
            <CaseImage study={featured} sizes="(max-width: 900px) 100vw, 60vw" priority />
          </div>
          <div>
            <Eyebrow>
              {featured.featured ? "Featured · " : ""}
              {featured.client} · {featured.year}
            </Eyebrow>
            <h2 className="featured-title">{featured.title}</h2>
            <p className="muted featured-dek">{featured.excerpt}</p>
            <div className="chips">
              {featured.tags.slice(0, 3).map((tag) => (
                <Chip key={tag}>{tag}</Chip>
              ))}
            </div>
            <ArrowLink href={`/case-studies/${featured.slug}`}>
              Read the case study · {featured.readingMinutes} min
            </ArrowLink>
          </div>
        </section>
      )}

      <section className="wrap more">
        <div className="more-head">
          <h2>More case studies</h2>
          {/* scroll={false}: trocar de filtro não volta ao topo da página */}
          <div className="chips" role="navigation" aria-label="Filtrar">
            <Chip href="/" active={!activeCategory} scroll={false}>
              All
            </Chip>
            {categories.map((c) => (
              <Chip key={c.slug} href={`/category/${c.slug}`} active={activeCategory === c.slug} scroll={false}>
                {c.name === "Personal projects" ? "Personal" : c.name}
              </Chip>
            ))}
          </div>
        </div>

        {rest.length > 0 ? (
          <div className="case-grid">
            {rest.map((study) => (
              <CaseCard key={study.slug} study={study} />
            ))}
          </div>
        ) : (
          <p className="muted">No other case studies in this category yet.</p>
        )}

        <div className="being-written">
          <Eyebrow>Being written</Eyebrow>
          <p>{beingWritten.join(" · ")}</p>
        </div>
      </section>
    </>
  );
}
