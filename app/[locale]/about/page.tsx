import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { expertise } from "@/lib/seed-content";
import { isLocale } from "@/lib/i18n";

export default async function AboutPage({
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
        kicker="ABOUT / 01"
        title={
          fa
            ? "فناوری وقتی معنا پیدا می‌کند که مسئله‌ای واقعی را حل کند."
            : "Technology matters when it solves a real problem."
        }
        intro={
          fa
            ? "من آراز شاه‌کرمی، توسعه‌دهنده بک‌اند مکانی و GeoAI هستم؛ با تمرکز بر پیوند مهندسی نرم‌افزار، داده‌های جغرافیایی و هوش مصنوعی."
            : "I’m Araz Shahkarami, a geospatial backend and GeoAI developer working where software engineering, geographic data, and AI meet."
        }
      />
      <section className="section">
        <div className="shell two-col">
          <div className="portrait-frame">
            <div className="portrait-map">
              <Image
                src="/docs/assets/img/araz.png"
                width={440}
                height={446}
                alt={fa ? "آراز شاه‌کرمی" : "Araz Shahkarami"}
              />
            </div>
          </div>
          <article className="prose">
            <h2>{fa ? "ماموریت حرفه‌ای" : "Professional mission"}</h2>
            <p>
              {fa
                ? "هدف من ساخت سامانه‌های قابل اتکایی است که داده‌های پیچیده مکانی را به تصمیم، خدمت و تجربه‌ای قابل استفاده تبدیل می‌کنند. در این مسیر، سادگی معماری، استانداردهای باز و انتقال دانش برایم اهمیت دارند."
                : "I build dependable systems that turn complex spatial data into decisions, services, and usable experiences. Clear architecture, open standards, and knowledge sharing guide that work."}
            </p>
            <h2>{fa ? "پس‌زمینه فنی" : "Technical background"}</h2>
            <p>
              {fa
                ? "بیش از هفت سال تجربه حرفه‌ای در توسعه بک‌اند، API، پایگاه‌داده و سامانه‌های GIS دارم. تجربه رهبری تیم چهار نفره، منتورینگ و آموزش در یوتیوب بخشی از مسیر حرفه‌ای من است."
                : "I have more than seven years of professional experience across backend development, APIs, databases, and GIS systems, alongside leading a four-person team, mentoring, and teaching on YouTube."}
            </p>
            <h2>{fa ? "تحقیق و جامعه" : "Research and community"}</h2>
            <p>
              {fa
                ? "در زمینه استانداردهای Sensor Web Enablement از OGC تحقیق و توسعه داشته‌ام، OSGeo Advocate هستم و در فعالیت‌های متن‌باز GeoLibre و جوامع مکانی مشارکت می‌کنم."
                : "My R&D includes OGC Sensor Web Enablement standards. I am an OSGeo Advocate and contribute to GeoLibre and geospatial open-source communities."}
            </p>
            <h2>{fa ? "دانشگاه" : "Education"}</h2>
            <p>
              {fa
                ? "دانشگاه آزاد اسلامی، واحد علوم و تحقیقات تهران. جزئیات مدرک‌هایی که تأیید نشده‌اند در نسخه عمومی نمایش داده نمی‌شود."
                : "Islamic Azad University, Science and Research Branch, Tehran. Unverified degree details are intentionally not published."}
            </p>
          </article>
        </div>
      </section>
      <section className="section alt">
        <div className="shell">
          <h2>{fa ? "ابزارها و حوزه‌ها" : "Tools and domains"}</h2>
          <div className="tags">
            {expertise.map((item) => (
              <span className="tag" key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
