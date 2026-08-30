import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { ContactForm } from "@/components/contact-form";
import { isLocale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";
export default async function ContactPage({
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
        kicker="CONTACT / 08"
        title={
          fa
            ? "بیایید درباره یک مسئله واقعی صحبت کنیم."
            : "Let’s talk about a real problem."
        }
        intro={
          fa
            ? "برای همکاری فنی، مشاوره معماری، آموزش یا گفت‌وگو درباره سامانه‌های مکانی پیام بفرستید."
            : "Get in touch about technical collaboration, architecture consulting, training, or geospatial systems."
        }
      />
      <section className="section">
        <div className="shell contact-layout">
          <aside>
            <h2>{fa ? "مسیرهای ارتباط" : "Contact paths"}</h2>
            <p>
              {fa
                ? "پاسخ‌گویی از طریق ایمیل انجام می‌شود. شماره تلفن و ایمیل دوم به‌صورت عمومی نمایش داده نمی‌شوند."
                : "Replies are handled by email. The phone number and secondary email remain private by default."}
            </p>
            <p>
              <a className="text-link" href={`mailto:${siteConfig.email}`}>
                {siteConfig.email}
              </a>
            </p>
            <p>
              {fa
                ? "ارومیه، ایران · آماده جابه‌جایی"
                : "Urmia, Iran · Open to relocation"}
            </p>
          </aside>
          <ContactForm locale={locale} />
        </div>
      </section>
    </>
  );
}
