import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { getPublicArticles } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const fa = locale === "fa";
  const articles = await getPublicArticles(locale);
  return (
    <>
      <PageHero
        kicker="NOTES / 03"
        title={
          fa ? "یادداشت‌هایی از میدان فناوری" : "Field notes from technology"
        }
        intro={
          fa
            ? "درباره بک‌اند، داده‌های مکانی، GeoAI، متن‌باز و ساخت سامانه‌های قابل نگهداری."
            : "Writing about backend engineering, spatial data, GeoAI, open source, and maintainable systems."
        }
      />
      <section className="section">
        <div className="shell content-list">
          {articles.map((a) => (
            <Link
              className="content-card"
              href={`/${locale}/blog/${a.slug}`}
              key={a.slug}
            >
              <small>
                {a.category} · {a.readingTime} MIN
              </small>
              <h3>{a.title}</h3>
              <p>{a.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
