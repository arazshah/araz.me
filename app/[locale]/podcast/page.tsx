import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { episodes } from "@/lib/seed-content";
import { isLocale } from "@/lib/i18n";
export default async function PodcastPage({
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
        kicker="ARAZ CAST / 04"
        title={fa ? "جایی که کد به مکان می‌رسد" : "Where code meets place"}
        intro={
          fa
            ? "پادکست تخصصی فارسی درباره علوم مکانی، زمین، GIS، سنجش از دور، ماهواره، GeoAI و فناوری‌های متن‌باز."
            : "A Persian podcast about spatial science, Earth, GIS, remote sensing, satellites, GeoAI, and open technology."
        }
      />
      <section className="section">
        <div className="shell content-list">
          {episodes[locale].map((e) => (
            <Link
              className="content-card"
              href={`/${locale}/podcast/${e.slug}`}
              key={e.slug}
            >
              <small>
                EP.{e.number} · {e.duration}
              </small>
              <h3>{e.title}</h3>
              <p>{e.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
