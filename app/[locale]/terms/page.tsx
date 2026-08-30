import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { isLocale } from "@/lib/i18n";
export default async function Terms({
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
        kicker="TERMS"
        title={fa ? "شرایط استفاده" : "Terms of use"}
        intro={
          fa
            ? "محتوای این وب‌سایت برای معرفی حرفه‌ای و آموزش منتشر می‌شود."
            : "This website publishes professional and educational material."
        }
      />
      <section className="section">
        <article className="shell prose">
          <p>
            {fa
              ? "حقوق محتوای اختصاصی محفوظ است. پروژه‌های متن‌باز تابع مجوز درج‌شده در مخزن خود هستند. پیوندهای خارجی ممکن است بدون اطلاع تغییر کنند."
              : "Original content rights are reserved. Open-source projects follow the license in their repository. External links may change without notice."}
          </p>
        </article>
      </section>
    </>
  );
}
