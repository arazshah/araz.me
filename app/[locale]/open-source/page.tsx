import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { getProjects } from "@/lib/seed-content";
import { isLocale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";
export default async function OpenSourcePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const fa = locale === "fa";
  return (
    <>
      <PageHero
        kicker="OPEN SOURCE / 07"
        title={
          fa
            ? "دانش وقتی رشد می‌کند که قابل اشتراک باشد."
            : "Knowledge grows when it can be shared."
        }
        intro={
          fa
            ? "فعالیت در OSGeo، GeoLibre و جامعه نرم‌افزار آزاد بخشی از هویت حرفه‌ای من است."
            : "Work with OSGeo, GeoLibre, and free-software communities is part of my professional identity."
        }
      />
      <section className="section">
        <div className="shell project-grid">
          {getProjects(locale)
            .filter(
              (p) =>
                p.category.includes(fa ? "متن" : "Open") ||
                p.slug === "mapathon",
            )
            .map((p) => (
              <div className="project-card" key={p.slug}>
                <h3>{p.title}</h3>
                <p>{p.summary}</p>
                <div className="tags">
                  {p.technologies.map((t) => (
                    <span className="tag" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
        </div>
        <div className="shell actions">
          <a className="button primary" href={siteConfig.github}>
            GitHub
          </a>
        </div>
      </section>
    </>
  );
}
