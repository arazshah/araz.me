import { notFound } from "next/navigation";
import { episodes } from "@/lib/seed-content";
import { isLocale } from "@/lib/i18n";
export default async function EpisodePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const e = episodes[locale].find((x) => x.slug === slug);
  if (!e) notFound();
  const fa = locale === "fa";
  return (
    <>
      <section className="page-hero">
        <div className="shell">
          <span className="section-kicker">ARAZ CAST / EP.{e.number}</span>
          <h1>{e.title}</h1>
          <p>{e.summary}</p>
        </div>
      </section>
      <section className="section">
        <article className="shell prose">
          <div className="notice">
            {fa
              ? "فایل صوتی پس از تنظیم در پنل مدیریت اینجا نمایش داده می‌شود."
              : "The audio player appears here after an audio URL is configured in admin."}
          </div>
          <h2>{fa ? "یادداشت برنامه" : "Show notes"}</h2>
          <p>
            {fa
              ? "این قسمت برای یادداشت‌ها، منابع و متن کامل قسمت در نظر گرفته شده و از پنل مدیریت قابل ویرایش است."
              : "This area supports show notes, resources, and transcripts managed from the admin panel."}
          </p>
        </article>
      </section>
    </>
  );
}
