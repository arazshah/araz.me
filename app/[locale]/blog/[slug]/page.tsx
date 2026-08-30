import { notFound } from "next/navigation";
import { getPublicArticle } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const a = await getPublicArticle(locale, slug);
  if (!a) notFound();
  const fa = locale === "fa";
  return (
    <>
      <section className="page-hero">
        <div className="shell">
          <span className="section-kicker">
            {a.category} · {a.readingTime} MIN
          </span>
          <h1>{a.title}</h1>
          <p>{a.summary}</p>
        </div>
      </section>
      <section className="section">
        <article className="shell prose">
          {a.body ? (
            <div dangerouslySetInnerHTML={{ __html: a.body }} />
          ) : (
            <>
              <p>
                {fa
                  ? "این نوشته یک ورودی اولیه برای سامانه مدیریت محتوا است و از پنل مدیریت قابل ویرایش، بازبینی و انتشار خواهد بود."
                  : "This is initial seed content for the editorial system and can be edited, reviewed, and published from the admin panel."}
              </p>
              <h2>{fa ? "از نقشه تا سرویس" : "From map to service"}</h2>
              <p>
                {fa
                  ? "یک سامانه مکانی قابل اتکا فقط یک نقشه زیبا نیست. مدل داده، پرس‌وجوهای فضایی، کنترل هزینه پردازش، کش و مشاهده‌پذیری همان‌قدر اهمیت دارند که تجربه کاربر."
                  : "A dependable geospatial system is more than a beautiful map. Data models, spatial queries, processing budgets, caching, and observability matter just as much as the user experience."}
              </p>
              <h2>{fa ? "اصل مهم" : "A useful principle"}</h2>
              <blockquote>
                {fa
                  ? "مرزهای روشن بین پردازش مکانی، منطق محصول و رابط کاربر، توسعه و نگهداری را ساده‌تر می‌کند."
                  : "Clear boundaries between spatial processing, product logic, and interface work make systems easier to evolve."}
              </blockquote>
            </>
          )}
        </article>
      </section>
    </>
  );
}
