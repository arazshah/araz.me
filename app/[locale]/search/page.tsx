import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { articles, episodes, getProjects } from "@/lib/seed-content";
import { isLocale } from "@/lib/i18n";
export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { q = "" } = await searchParams;
  const fa = locale === "fa";
  const all = [
    ...getProjects(locale).map((x) => ({
      ...x,
      type: fa ? "پروژه" : "Project",
      href: `/${locale}/projects/${x.slug}`,
    })),
    ...articles[locale].map((x) => ({
      ...x,
      type: fa ? "نوشته" : "Article",
      href: `/${locale}/blog/${x.slug}`,
    })),
    ...episodes[locale].map((x) => ({
      ...x,
      type: fa ? "پادکست" : "Podcast",
      href: `/${locale}/podcast/${x.slug}`,
    })),
  ];
  const results = q
    ? all.filter((x) =>
        `${x.title} ${x.summary}`.toLowerCase().includes(q.toLowerCase()),
      )
    : [];
  return (
    <>
      <PageHero
        kicker="SEARCH"
        title={fa ? "جست‌وجوی یکپارچه" : "Unified search"}
        intro={
          fa
            ? "در پروژه‌ها، نوشته‌ها و قسمت‌های پادکست جست‌وجو کنید."
            : "Search projects, articles, and podcast episodes."
        }
      />
      <section className="section">
        <div className="shell">
          <form className="search-form">
            <input
              autoFocus
              className="input"
              style={{ maxWidth: 600 }}
              name="q"
              defaultValue={q}
              placeholder={fa ? "عبارت مورد نظر…" : "Search term…"}
            />
            <button className="button primary">
              {fa ? "جست‌وجو" : "Search"}
            </button>
          </form>
          {results.length ? (
            <div className="content-list">
              {results.map((x) => (
                <Link className="content-card" href={x.href} key={x.href}>
                  <small>{x.type}</small>
                  <h3>{x.title}</h3>
                  <p>{x.summary}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty">
              {q
                ? fa
                  ? "نتیجه‌ای پیدا نشد؛ واژه کوتاه‌تر یا نام فناوری را امتحان کنید."
                  : "No results. Try a shorter term or a technology name."
                : fa
                  ? "برای شروع یک عبارت بنویسید."
                  : "Enter a term to begin."}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
