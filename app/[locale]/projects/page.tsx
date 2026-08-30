import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { getProjects } from "@/lib/seed-content";
import { isLocale } from "@/lib/i18n";

export default async function ProjectsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const fa = locale === "fa";
  const query = await searchParams;
  let projects = getProjects(locale);
  if (query.q)
    projects = projects.filter((p) =>
      `${p.title} ${p.summary} ${p.technologies.join(" ")}`
        .toLowerCase()
        .includes(query.q!.toLowerCase()),
    );
  if (query.category)
    projects = projects.filter((p) => p.category === query.category);
  const categories = [...new Set(getProjects(locale).map((p) => p.category))];
  return (
    <>
      <PageHero
        kicker="WORK / 02"
        title={
          fa
            ? "سامانه‌هایی برای دنیای مکانی"
            : "Systems built for a spatial world"
        }
        intro={
          fa
            ? "محصولات شخصی، پروژه‌های متن‌باز و سامانه‌هایی در تقاطع بک‌اند، GIS و هوش مصنوعی."
            : "Personal products, open-source work, and systems at the intersection of backend engineering, GIS, and AI."
        }
      />
      <section className="section">
        <div className="shell">
          <form className="filters">
            <input
              className="input"
              style={{ maxWidth: 360 }}
              name="q"
              defaultValue={query.q}
              placeholder={
                fa
                  ? "جست‌وجوی پروژه یا فناوری…"
                  : "Search project or technology…"
              }
            />
            <select
              className="select"
              style={{ maxWidth: 220 }}
              name="category"
              defaultValue={query.category}
            >
              <option value="">{fa ? "همه دسته‌ها" : "All categories"}</option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <button className="button primary" type="submit">
              {fa ? "اعمال فیلتر" : "Apply filters"}
            </button>
          </form>
          {projects.length ? (
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
                    {project.technologies.map((t) => (
                      <span className="tag" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty">
              {fa
                ? "پروژه‌ای با این مشخصات پیدا نشد."
                : "No projects match these filters."}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
