import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { PrintButton } from "@/components/print-button";
import { expertise, getProjects } from "@/lib/seed-content";
import { isLocale } from "@/lib/i18n";
export default async function ResumePage({
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
        kicker="RÉSUMÉ / 05"
        title={fa ? "آراز شاه‌کرمی" : "Araz Shahkarami"}
        intro={
          fa
            ? "توسعه‌دهنده بک‌اند مکانی، GeoAI، مشارکت‌کننده متن‌باز و رهبر فنی با بیش از هفت سال تجربه حرفه‌ای."
            : "Geospatial backend developer, GeoAI practitioner, open-source contributor, and technical leader with 7+ years of professional experience."
        }
      />
      <section className="section">
        <div className="shell two-col">
          <article className="prose">
            <h2>{fa ? "تجربه حرفه‌ای" : "Experience"}</h2>
            <h3>Spatial Science Innovators</h3>
            <p>
              GeoSpatial Backend Developer · Tehran · 2025 —{" "}
              {fa ? "اکنون" : "Present"}
            </p>
            <ul>
              <li>
                {fa
                  ? "طراحی سرویس‌های مقیاس‌پذیر مکانی و REST API"
                  : "Scalable spatial services and REST APIs"}
              </li>
              <li>
                {fa
                  ? "معماری پلتفرم‌های مکانی مبتنی بر میکروسرویس"
                  : "Microservice-based geospatial platform architecture"}
              </li>
              <li>
                {fa
                  ? "توسعه خطوط پردازش GeoAI و سرورهای MCP"
                  : "GeoAI pipelines and MCP server development"}
              </li>
            </ul>
            <h3>{fa ? "بیمه البرز" : "Alborz Insurance"}</h3>
            <p>
              {fa
                ? "پیشرفت از کارشناس تا کارشناس ارشد و برنامه‌نویس ارشد. تاریخ‌های دقیق تأییدنشده در نسخه عمومی درج نشده‌اند."
                : "Progressed from expert to senior expert and senior programmer. Unverified dates are intentionally omitted."}
            </p>
            <h2>{fa ? "آموزش و پژوهش" : "Education & research"}</h2>
            <p>
              {fa
                ? "دانشگاه آزاد اسلامی، واحد علوم و تحقیقات تهران؛ تحقیق و توسعه درباره استانداردهای Sensor Web Enablement از OGC."
                : "Islamic Azad University, Science and Research Branch, Tehran; R&D on OGC Sensor Web Enablement standards."}
            </p>
            <h2>{fa ? "جامعه و رهبری" : "Community & leadership"}</h2>
            <p>
              OSGeo Advocate · GeoLibre ·{" "}
              {fa
                ? "رهبری تیم چهار نفره · منتورینگ و آموزش یوتیوب"
                : "Four-person team leadership · Mentoring and YouTube teaching"}
            </p>
          </article>
          <aside>
            <div className="info-card">
              <h3>{fa ? "مهارت‌ها" : "Skills"}</h3>
              <div className="tags">
                {expertise.map((s) => (
                  <span className="tag" key={s}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="info-card" style={{ marginTop: 18 }}>
              <h3>{fa ? "پروژه‌های منتخب" : "Selected projects"}</h3>
              {getProjects(locale)
                .slice(0, 4)
                .map((p) => (
                  <p key={p.slug}>
                    <b>{p.title}</b>
                    <br />
                    <small>{p.category}</small>
                  </p>
                ))}
            </div>
            <PrintButton
              label={fa ? "چاپ یا ذخیره به‌صورت PDF" : "Print or save as PDF"}
            />
          </aside>
        </div>
      </section>
    </>
  );
}
