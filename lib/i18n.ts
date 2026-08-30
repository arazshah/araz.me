export const locales = ["fa", "en"] as const;
export type SiteLocale = (typeof locales)[number];

export function isLocale(value: string): value is SiteLocale {
  return locales.includes(value as SiteLocale);
}

export function direction(locale: SiteLocale) {
  return locale === "fa" ? "rtl" : "ltr";
}

export const messages = {
  fa: {
    nav: {
      home: "خانه",
      about: "درباره من",
      projects: "پروژه‌ها",
      blog: "نوشته‌ها",
      podcast: "پادکست",
      resume: "رزومه",
      contact: "تماس",
    },
    actions: {
      projects: "مشاهده پروژه‌ها",
      resume: "مطالعه رزومه",
      contact: "شروع گفتگو",
      all: "مشاهده همه",
      search: "جست‌وجو",
      menu: "منو",
    },
    home: {
      eyebrow: "Geospatial Backend · GeoAI · Open Source",
      title: "داده‌های مکانی را به زیرساخت‌های هوشمند تبدیل می‌کنم.",
      intro:
        "توسعه‌دهنده بک‌اند مکانی و GeoAI؛ طراح سامانه‌هایی که داده‌های جغرافیایی، هوش مصنوعی و زیرساخت نرم‌افزار را به هم متصل می‌کنند.",
      focus: "تمرکز حرفه‌ای اکنون",
      focusText:
        "طراحی سرویس‌های مقیاس‌پذیر مکانی، APIهای پردازش داده، معماری میکروسرویس و اتصال عامل‌های هوشمند به ابزارهای GIS.",
      experience: "+۷ سال تجربه حرفه‌ای",
      leadership: "+۳ سال رهبری فنی",
      location: "ارومیه، ایران · آماده جابه‌جایی",
      projects: "پروژه‌های منتخب",
      expertise: "حوزه‌های تخصص",
      timeline: "مسیر حرفه‌ای",
      latest: "تازه‌ترین محتوا",
    },
  },
  en: {
    nav: {
      home: "Home",
      about: "About",
      projects: "Projects",
      blog: "Writing",
      podcast: "Podcast",
      resume: "Résumé",
      contact: "Contact",
    },
    actions: {
      projects: "View projects",
      resume: "Read résumé",
      contact: "Start a conversation",
      all: "View all",
      search: "Search",
      menu: "Menu",
    },
    home: {
      eyebrow: "Geospatial Backend · GeoAI · Open Source",
      title: "I turn spatial data into intelligent infrastructure.",
      intro:
        "Geospatial backend and GeoAI developer connecting geographic data, artificial intelligence, and dependable software infrastructure.",
      focus: "Current professional focus",
      focusText:
        "Scalable spatial services, processing APIs, microservice architecture, and connecting AI agents to GIS tools.",
      experience: "7+ years professional experience",
      leadership: "3+ years technical leadership",
      location: "Urmia, Iran · Open to relocation",
      projects: "Selected projects",
      expertise: "Areas of expertise",
      timeline: "Professional path",
      latest: "Latest work",
    },
  },
} as const;

export function t(locale: SiteLocale) {
  return messages[locale];
}
