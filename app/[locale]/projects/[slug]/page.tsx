import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getProjects } from "@/lib/seed-content";
import { isLocale } from "@/lib/i18n";

export async function generateStaticParams() {
  return ["fa", "en"].flatMap((locale) =>
    getProjects(locale as "fa" | "en").map((p) => ({ locale, slug: p.slug })),
  );
}
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const p = getProject(locale, slug);
  if (!p) notFound();
  const fa = locale === "fa";
  return (
    <>
      <section className="page-hero">
        <div className="shell">
          <span className="section-kicker">PROJECT / {p.category}</span>
          <h1>{p.title}</h1>
          <p>{p.summary}</p>
          <div className="tags">
            {p.technologies.map((t) => (
              <span className="tag" key={t}>
                {t}
              </span>
            ))}
          </div>
          <div className="actions">
            {p.url && (
              <a className="button primary" href={p.url} rel="noreferrer">
                {fa ? "مشاهده وب‌سایت" : "Visit website"}
              </a>
            )}
            {p.repository && (
              <a className="button" href={p.repository} rel="noreferrer">
                GitHub
              </a>
            )}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="shell two-col">
          <article className="prose">
            <h2>{fa ? "مسئله" : "Problem"}</h2>
            <p>
              {fa
                ? "این پروژه برای تبدیل درخواست‌ها و داده‌های پیچیده مکانی به یک جریان قابل فهم و قابل استفاده طراحی شده است."
                : "This project is designed to turn complex spatial requests and data into an understandable, usable workflow."}
            </p>
            <h2>{fa ? "راهکار" : "Solution"}</h2>
            <p>{p.summary}</p>
            <h2>{fa ? "معماری" : "Architecture"}</h2>
            <p>
              {fa
                ? "مرزهای سرویس روشن، APIهای قابل توسعه و اجزای مستقل برای پردازش مکانی و هماهنگی مدل‌های هوشمند."
                : "Clear service boundaries, extensible APIs, and independent components for spatial processing and AI orchestration."}
            </p>
          </article>
          <aside>
            <div className="info-card">
              <b>{fa ? "وضعیت" : "Status"}</b>
              <p>{p.status}</p>
              <b>{fa ? "نقش" : "Role"}</b>
              <p>
                {fa
                  ? "طراحی و توسعه بک‌اند مکانی"
                  : "Geospatial backend architecture and development"}
              </p>
              <b>{fa ? "پیوندها" : "Links"}</b>
              <p>
                {p.url ? (
                  <a className="text-link" href={p.url}>
                    {p.url}
                  </a>
                ) : fa ? (
                  "پیوند عمومی در دسترس نیست."
                ) : (
                  "No public link is available."
                )}
              </p>
            </div>
          </aside>
        </div>
        <div className="shell" style={{ marginTop: 60 }}>
          <Link className="text-link" href={`/${locale}/projects`}>
            ← {fa ? "بازگشت به پروژه‌ها" : "Back to projects"}
          </Link>
        </div>
      </section>
    </>
  );
}
