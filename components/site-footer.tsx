import Link from "next/link";
import type { SiteLocale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

export function SiteFooter({ locale }: { locale: SiteLocale }) {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <div className="brand footer-brand">
            <span className="brand-mark">A</span>
            <span>
              <b>{locale === "fa" ? "آراز شاه‌کرمی" : "Araz Shahkarami"}</b>
              <small>WHERE CODE MEETS PLACE</small>
            </span>
          </div>
          <p>
            {locale === "fa"
              ? "ساخت زیرساخت‌های نرم‌افزاری برای جهانی که مکان اهمیت دارد."
              : "Building software infrastructure for a world where location matters."}
          </p>
        </div>
        <div>
          <b>{locale === "fa" ? "ارتباط" : "Connect"}</b>
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          <a href={siteConfig.github}>GitHub</a>
          <a href={siteConfig.linkedin}>LinkedIn</a>
        </div>
        <div>
          <b>{locale === "fa" ? "حقوقی" : "Legal"}</b>
          <Link href={`/${locale}/privacy`}>
            {locale === "fa" ? "حریم خصوصی" : "Privacy"}
          </Link>
          <Link href={`/${locale}/terms`}>
            {locale === "fa" ? "شرایط استفاده" : "Terms"}
          </Link>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} Araz Shahkarami</span>
        <span>43.02° N · 47.01° E</span>
      </div>
    </footer>
  );
}
