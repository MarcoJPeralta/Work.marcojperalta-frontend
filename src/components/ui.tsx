// Componentes pequenos do Draft E — um por cada componente da página "Components" no Doop.
import Link from "next/link";

export function Eyebrow({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted" | "accent" }) {
  return (
    <p className="eb" data-tone={tone}>
      {children}
    </p>
  );
}

export function Chip({
  children,
  href,
  active = false,
  scroll = true,
}: {
  children: React.ReactNode;
  href?: string;
  active?: boolean;
  /** false = navegar sem voltar ao topo da página */
  scroll?: boolean;
}) {
  if (href) {
    return (
      <Link className="chip" href={href} scroll={scroll} data-active={active} aria-current={active ? "page" : undefined}>
        {children}
      </Link>
    );
  }
  return <span className="chip">{children}</span>;
}

export function Button({ children, href, tone = "primary" }: { children: React.ReactNode; href: string; tone?: "primary" | "ghost" }) {
  return (
    <a className="btn" href={href} data-tone={tone}>
      {children}
    </a>
  );
}

export function ArrowLink({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <Link className="al" href={href}>
      <span>{children}</span>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M3 9 9 3M4 3h5v5" />
      </svg>
    </Link>
  );
}

export function StatItem({ value, label, accent = false }: { value: string; label: string; accent?: boolean }) {
  return (
    <div className="si" data-tone={accent ? "accent" : "default"}>
      <p className="si-v">{value}</p>
      <p className="si-l">{label}</p>
    </div>
  );
}
