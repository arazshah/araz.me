import Link from "next/link";
import type { SiteLocale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import {
  LocaleButton,
  MobileMenu,
  SearchButton,
  ThemeButton,
} from "@/components/site-controls";

export function SiteHeader({ locale }: { locale: SiteLocale }) {
  const m = t(locale);
  const links = [
    ["about", m.nav.about],
    ["projects", m.nav.projects],
    ["blog", m.nav.blog],
    ["podcast", m.nav.podcast],
    ["resume", m.nav.resume],
    ["contact", m.nav.contact],
  ];
  const nav = (
    <nav className="nav-links" aria-label="Primary">
      {links.map(([href, label]) => (
        <Link key={href} href={`/${locale}/${href}`}>
          {label}
        </Link>
      ))}
    </nav>
  );
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link
          href={`/${locale}`}
          className="brand"
          aria-label="Araz Shahkarami home"
        >
          <span className="brand-mark" aria-hidden="true">
            A
          </span>
          <span>
            <b>{locale === "fa" ? "آراز شاه‌کرمی" : "Araz Shahkarami"}</b>
            <small>GEOSPATIAL SYSTEMS</small>
          </span>
        </Link>
        {nav}
        <div className="header-actions">
          <SearchButton locale={locale} label={m.actions.search} />
          <ThemeButton />
          <LocaleButton locale={locale} />
          <MobileMenu label={m.actions.menu}>{nav}</MobileMenu>
        </div>
      </div>
    </header>
  );
}
