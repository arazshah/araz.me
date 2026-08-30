import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { isLocale } from "@/lib/i18n";
export default async function Privacy({
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
        kicker="PRIVACY"
        title={fa ? "حریم خصوصی" : "Privacy"}
        intro={
          fa
            ? "اطلاعات لازم برای پاسخ‌گویی به پیام‌ها، به حداقل و به‌صورت امن نگهداری می‌شود."
            : "Only the information needed to answer messages is retained, with data minimization in mind."
        }
      />
      <section className="section">
        <article className="shell prose">
          <h2>{fa ? "فرم تماس" : "Contact form"}</h2>
          <p>
            {fa
              ? "نام، ایمیل و متن پیام برای پاسخ‌گویی ذخیره می‌شود و به‌صورت عمومی منتشر نخواهد شد. تحلیل‌گر بازدید تا زمان تنظیم توسط مدیر غیرفعال است."
              : "Name, email, and message content are stored to respond and are never made public. Analytics remain disabled until configured by the owner."}
          </p>
        </article>
      </section>
    </>
  );
}
