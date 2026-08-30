import Image from "next/image";
import Link from "next/link";
import { ArrowUpLeft, ArrowUpRight } from "lucide-react";
import { isLocale, t } from "@/lib/i18n";
import { articles, episodes, expertise, getProjects } from "@/lib/seed-content";
import { notFound } from "next/navigation";
import { siteConfig } from "@/lib/site";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const m = t(locale);
  const Arrow = locale === "fa" ? ArrowUpLeft : ArrowUpRight;
  const projects = getProjects(locale).slice(0, 4);
  const personJson = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Araz Shahkarami",
    alternateName: "آراز شاه‌کرمی",
    url: siteConfig.url,
    jobTitle: "Geospatial Backend Developer",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Urmia",
      addressCountry: "IR",
    },
    knowsAbout: expertise,
    sameAs: [siteConfig.github, siteConfig.linkedin],
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJson) }}
      />
      <section className="hero">
        <div className="shell hero-grid">
          <div>
            <div className="eyebrow">{m.home.eyebrow}</div>
            <h1>{m.home.title}</h1>
            <p className="hero-copy">{m.home.intro}</p>
            <div className="actions">
              <Link className="button accent" href={`/${locale}/projects`}>
                {m.actions.projects}
                <Arrow size={16} />
              </Link>
              <Link className="button" href={`/${locale}/resume`}>
                {m.actions.resume}
              </Link>
              <Link className="button" href={`/${locale}/contact`}>
                {m.actions.contact}
              </Link>
            </div>
          </div>
          <div className="portrait-frame">
            <div className="portrait-map">
              <Image
                src="/docs/assets/img/araz.png"
                width={440}
                height={446}
                priority
                alt={
                  locale === "fa"
                    ? "پرتره آراز شاه‌کرمی"
                    : "Portrait of Araz Shahkarami"
                }
              />
              <div className="coordinate">
                URMIA · 37.5527° N / 45.0761° E<br />
                SYSTEM STATUS · AVAILABLE
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="stats">
        <div className="shell stats-grid">
          <div className="stat">
            <b>{m.home.experience}</b>
            <span>Python · APIs · Spatial systems</span>
          </div>
          <div className="stat">
            <b>{m.home.leadership}</b>
            <span>
              {locale === "fa"
                ? "هدایت تیم چهار نفره و منتورینگ"
                : "Four-person team leadership & mentoring"}
            </span>
          </div>
          <div className="stat">
            <b>{m.home.location}</b>
            <span>37.5527° N · 45.0761° E</span>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="shell">
          <div className="section-head">
            <div>
              <span className="section-kicker">01 / SELECTED WORK</span>
              <h2>{m.home.projects}</h2>
            </div>
            <Link className="text-link" href={`/${locale}/projects`}>
              {m.actions.all} ←
            </Link>
          </div>
          <div className="project-grid">
            {projects.map((project) => (
              <Link
                className="project-card"
                key={project.slug}
                href={`/${locale}/projects/${project.slug}`}
              >
                <div className="project-meta">
                  <span className="status-dot" />
                  <span>{project.status}</span>
                  <span>·</span>
                  <span>{project.category}</span>
                </div>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <div className="tags">
                  {project.technologies.map((tech) => (
                    <span className="tag" key={tech}>
                      {tech}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="shell">
          <div className="section-head">
            <div>
              <span className="section-kicker">02 / CAPABILITIES</span>
              <h2>{m.home.expertise}</h2>
            </div>
          </div>
          <div className="expertise-grid">
            {expertise.map((item, index) => (
              <div className="expertise-item" key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <b dir="ltr">{item}</b>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="shell focus-grid">
          <div className="focus-card">
            <span
              className="section-kicker"
              style={{ color: "var(--accent-bright)" }}
            >
              NOW / 2026
            </span>
            <h2>{m.home.focus}</h2>
            <p>{m.home.focusText}</p>
          </div>
          <div>
            <span className="section-kicker">03 / PATH</span>
            <h2>{m.home.timeline}</h2>
            <div className="timeline">
              <div className="timeline-item">
                <small>2025 — NOW</small>
                <h3>
                  {locale === "fa"
                    ? "Spatial Science Innovators"
                    : "Spatial Science Innovators"}
                </h3>
                <p>GeoSpatial Backend Developer · Tehran</p>
              </div>
              <div className="timeline-item">
                <small>
                  {locale === "fa"
                    ? "مسیر حرفه‌ای پیشین"
                    : "Earlier professional path"}
                </small>
                <h3>{locale === "fa" ? "بیمه البرز" : "Alborz Insurance"}</h3>
                <p>
                  {locale === "fa"
                    ? "پیشرفت از کارشناس تا کارشناس ارشد و برنامه‌نویس ارشد"
                    : "Progressed from expert to senior expert and senior programmer"}
                </p>
              </div>
              <div className="timeline-item">
                <small>OPEN SOURCE</small>
                <h3>OSGeo Advocate · GeoLibre</h3>
                <p>
                  {locale === "fa"
                    ? "فعالیت در جامعه نرم‌افزارهای آزاد و مکانی"
                    : "Geospatial and free-software community work"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="shell">
          <div className="section-head">
            <div>
              <span className="section-kicker">04 / FIELD NOTES</span>
              <h2>{m.home.latest}</h2>
            </div>
          </div>
          <div className="content-list">
            {articles[locale].map((item) => (
              <Link
                className="content-card"
                href={`/${locale}/blog/${item.slug}`}
                key={item.slug}
              >
                <small>
                  {item.category} · {item.readingTime} MIN
                </small>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
              </Link>
            ))}
            {episodes[locale].map((item) => (
              <Link
                className="content-card"
                href={`/${locale}/podcast/${item.slug}`}
                key={item.slug}
              >
                <small>PODCAST · EP.{item.number}</small>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
