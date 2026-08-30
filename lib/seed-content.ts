import type { SiteLocale } from "@/lib/i18n";

export type PublicProject = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  status: string;
  technologies: string[];
  url?: string;
  repository?: string;
};

const projects: Record<SiteLocale, PublicProject[]> = {
  fa: [
    {
      slug: "mapathon",
      title: "Mapathon",
      summary:
        "دستیار هوشمند مکانی فارسی برای تبدیل درخواست‌های طبیعی به جست‌وجو، مسیریابی، تحلیل فضایی و نمایش روی نقشه.",
      category: "GeoAI",
      status: "فعال",
      technologies: ["Python", "FastAPI", "PostGIS", "LLM"],
      url: "https://mapathon.ir",
    },
    {
      slug: "geospatial-intelligence-platform",
      title: "پلتفرم هوشمندی مکانی",
      summary:
        "معماری افزونه‌پذیر برای پرس‌وجوی زبانی، نقشه تعاملی، مسیریابی آبشاری، هماهنگی مدل‌های زبانی و SDK پایتون.",
      category: "زیرساخت مکانی",
      status: "در حال توسعه",
      technologies: ["Microservices", "MCP", "Python", "GIS"],
    },
    {
      slug: "bookane",
      title: "Bookane",
      summary:
        "پلتفرمی برای آموزش جامع فارسی در حوزه برنامه‌نویسی، هوش مصنوعی و فناوری.",
      category: "آموزش",
      status: "فعال",
      technologies: ["Python", "Web"],
      url: "https://bookane.ir",
    },
    {
      slug: "araz-cast",
      title: "Araz Cast",
      summary:
        "پادکست تخصصی فارسی درباره علوم مکانی، زمین، GIS، سنجش از دور، ماهواره و GeoAI.",
      category: "رسانه",
      status: "فعال",
      technologies: ["Podcast", "Education"],
      url: "https://cast.araz.me",
    },
    {
      slug: "geolibre",
      title: "GeoLibre",
      summary:
        "مشارکت در جامعه و ابزارهای متن‌باز برای گسترش دسترسی به فناوری‌های مکانی.",
      category: "متن‌باز",
      status: "فعال",
      technologies: ["Open Source", "GIS"],
    },
  ],
  en: [
    {
      slug: "mapathon",
      title: "Mapathon",
      summary:
        "A Persian spatial assistant that turns natural-language requests into geographic search, routing, analysis, and map visualization.",
      category: "GeoAI",
      status: "Active",
      technologies: ["Python", "FastAPI", "PostGIS", "LLM"],
      url: "https://mapathon.ir",
    },
    {
      slug: "geospatial-intelligence-platform",
      title: "Geospatial intelligence platform",
      summary:
        "A plugin-based architecture for natural-language queries, interactive maps, cascading routing, LLM orchestration, and a Python SDK.",
      category: "Spatial infrastructure",
      status: "In development",
      technologies: ["Microservices", "MCP", "Python", "GIS"],
    },
    {
      slug: "bookane",
      title: "Bookane",
      summary:
        "A platform for comprehensive Persian tutorials in programming, artificial intelligence, and technology.",
      category: "Education",
      status: "Active",
      technologies: ["Python", "Web"],
      url: "https://bookane.ir",
    },
    {
      slug: "araz-cast",
      title: "Araz Cast",
      summary:
        "A Persian podcast about spatial science, Earth, GIS, remote sensing, satellites, and GeoAI.",
      category: "Media",
      status: "Active",
      technologies: ["Podcast", "Education"],
      url: "https://cast.araz.me",
    },
    {
      slug: "geolibre",
      title: "GeoLibre",
      summary:
        "Open-source community work that broadens access to geospatial technology.",
      category: "Open source",
      status: "Active",
      technologies: ["Open Source", "GIS"],
    },
  ],
};

export const expertise = [
  "Python & FastAPI",
  "PostgreSQL & PostGIS",
  "Spatial APIs",
  "GeoAI pipelines",
  "LLM & MCP",
  "Microservices",
  "GeoPandas & GDAL",
  "Docker & infrastructure",
];

export function getProjects(locale: SiteLocale) {
  return projects[locale];
}
export function getProject(locale: SiteLocale, slug: string) {
  return projects[locale].find((item) => item.slug === slug);
}

export const articles = {
  fa: [
    {
      slug: "spatial-backends",
      title: "بک‌اند مکانی؛ جایی که نقشه به زیرساخت تبدیل می‌شود",
      summary:
        "نگاهی عملی به معماری سرویس‌هایی که داده‌های مکانی را پردازش و ارائه می‌کنند.",
      category: "بک‌اند مکانی",
      readingTime: 7,
    },
    {
      slug: "mcp-for-gis",
      title: "چرا MCP برای ابزارهای GIS مهم است؟",
      summary:
        "چگونه عامل‌های هوشمند می‌توانند امن و ساخت‌یافته با ابزارها و منابع مکانی کار کنند.",
      category: "هوش مصنوعی",
      readingTime: 6,
    },
  ],
  en: [
    {
      slug: "spatial-backends",
      title: "Spatial backends: where maps become infrastructure",
      summary:
        "A practical look at services that process and deliver geographic data.",
      category: "Geospatial backend",
      readingTime: 7,
    },
    {
      slug: "mcp-for-gis",
      title: "Why MCP matters for GIS tools",
      summary:
        "How AI agents can work with spatial tools and resources through a structured boundary.",
      category: "Artificial intelligence",
      readingTime: 6,
    },
  ],
};

export const episodes = {
  fa: [
    {
      slug: "open-source-gis",
      title: "اگر ابزارهای متن‌باز نبودند، GIS امروز چه شکلی بود؟",
      summary: "روایتی از نقش نرم‌افزارهای آزاد در شکل‌گیری علوم مکانی مدرن.",
      number: 1,
      duration: "۱۵ دقیقه",
    },
  ],
  en: [
    {
      slug: "open-source-gis",
      title: "What would GIS look like without open source?",
      summary: "A story about free software and the modern geospatial world.",
      number: 1,
      duration: "15 min",
    },
  ],
};
