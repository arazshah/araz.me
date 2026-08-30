import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { isLocale } from "@/lib/i18n";
export default async function MediaPage({
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
        kicker="TEACHING / TALKS"
        title={fa ? "آموزش، گفت‌وگو و جامعه" : "Teaching, talks, and community"}
        intro={
          fa
            ? "ارائه‌ها، کارگاه‌ها، آموزش‌های ویدیویی و فعالیت‌های جامعه متن‌باز؛ هر مورد پس از تأیید از پنل منتشر می‌شود."
            : "Talks, workshops, video education, and open-source community activity—published after verification."
        }
      />
      <section className="section">
        <div className="shell card-grid">
          <div className="info-card">
            <h3>{fa ? "آموزش یوتیوب" : "YouTube teaching"}</h3>
            <p>
              {fa
                ? "آموزش Python، GIS و تحلیل داده‌های مکانی."
                : "Python, GIS, and spatial analysis education."}
            </p>
          </div>
          <div className="info-card">
            <h3>{fa ? "سخنرانی و کارگاه" : "Talks & workshops"}</h3>
            <p>
              {fa
                ? "موضوعات متن‌باز، داده مکانی و توسعه نرم‌افزار."
                : "Open source, geospatial data, and software engineering."}
            </p>
          </div>
          <div className="info-card">
            <h3>Araz Cast</h3>
            <p>
              {fa
                ? "روایت‌های صوتی از جایی که کد به مکان می‌رسد."
                : "Audio stories from where code meets place."}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
