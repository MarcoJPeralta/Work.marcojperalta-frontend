"use client";
// Client Component porque precisa de saber o URL atual (usePathname) para marcar o link ativo.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, site } from "@/content/site";
import { Button } from "./ui";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" || pathname.startsWith("/case-studies") : pathname.startsWith(href);

  return (
    <header className="sh">
      <Link className="sh-brand" href="/">
        <b>{site.name}</b>
        <span className="sh-sep">/</span>
        <span className="sh-sub">{site.section}</span>
      </Link>
      <nav className="sh-nav" aria-label="Principal">
        {nav.map((item) => (
          <Link
            key={item.href}
            className="nl"
            href={item.href}
            data-active={isActive(item.href)}
            aria-current={isActive(item.href) ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
        <Button href={site.externalUrl} tone="ghost">
          {site.externalLabel}
        </Button>
        <ThemeToggle />
      </nav>
    </header>
  );
}
