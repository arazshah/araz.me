import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { isLocale } from "@/lib/i18n";
const data = {
  fa: [
    [
      "معماری بک‌اند مکانی",
      "طراحی سرویس‌های مقیاس‌پذیر، مرزهای API و جریان پردازش داده.",
    ],
    [
      "GeoAI و یکپارچه‌سازی LLM",
      "طراحی خطوط پردازش و اتصال امن مدل‌ها به داده‌ها و ابزارهای مکانی.",
    ],
    [
      "PostGIS و APIهای مکانی",
      "مدل‌سازی داده، بهینه‌سازی پرس‌وجو و طراحی REST API.",
    ],
    [
      "توسعه سرور MCP",
      "قابل استفاده کردن ابزارها و منابع مکانی برای عامل‌های هوشمند.",
    ],
    [
      "بازبینی فنی و معماری",
      "ارزیابی عملی کد، داده و زیرساخت با پیشنهادهای اولویت‌بندی‌شده.",
    ],
    [
      "آموزش و منتورینگ",
      "دوره‌ها و همراهی فنی در Python، GIS و علم داده مکانی.",
    ],
  ],
  en: [
    [
      "Geospatial backend architecture",
      "Scalable services, API boundaries, and spatial processing flows.",
    ],
    [
      "GeoAI & LLM integration",
      "Pipelines that connect models safely to geospatial data and tools.",
    ],
    [
      "PostGIS & spatial APIs",
      "Data modelling, query optimization, and REST API design.",
    ],
    [
      "MCP server development",
      "Making spatial tools and resources available to AI agents.",
    ],
    [
      "Code & architecture review",
      "Practical assessment with prioritized improvements.",
    ],
    [
      "Training & mentoring",
      "Python, GIS, and spatial data science education.",
    ],
  ],
};
export default async function ServicesPage({
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
        kicker="WORK WITH ME / 06"
        title={
          fa
            ? "همکاری برای ساخت سامانه‌های مکانی قابل اتکا"
            : "Collaboration for dependable spatial systems"
        }
        intro={
          fa
            ? "این حوزه‌ها قابلیت همکاری دارند؛ فعال بودن و دامنه هر خدمت پیش از شروع پروژه تأیید می‌شود."
            : "These are possible collaboration areas. Availability and scope are confirmed before any engagement."
        }
      />
      <section className="section">
        <div className="shell card-grid">
          {data[locale].map(([title, summary]) => (
            <div className="info-card" key={title}>
              <h3>{title}</h3>
              <p>{summary}</p>
            </div>
          ))}
        </div>
        <div className="shell actions">
          <Link className="button primary" href={`/${locale}/contact`}>
            {fa ? "بررسی امکان همکاری" : "Discuss collaboration"}
          </Link>
        </div>
      </section>
    </>
  );
}
