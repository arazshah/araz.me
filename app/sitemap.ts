import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { articles, episodes, getProjects } from "@/lib/seed-content";
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "about",
    "projects",
    "blog",
    "podcast",
    "resume",
    "services",
    "open-source",
    "media",
    "contact",
    "search",
    "privacy",
    "terms",
  ];
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of ["fa", "en"] as const) {
    for (const route of routes)
      entries.push({
        url: `${siteConfig.url}/${locale}${route ? `/${route}` : ""}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1 : 0.7,
        alternates: {
          languages: {
            fa: `${siteConfig.url}/fa${route ? `/${route}` : ""}`,
            en: `${siteConfig.url}/en${route ? `/${route}` : ""}`,
          },
        },
      });
    for (const p of getProjects(locale))
      entries.push({
        url: `${siteConfig.url}/${locale}/projects/${p.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    for (const a of articles[locale])
      entries.push({
        url: `${siteConfig.url}/${locale}/blog/${a.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    for (const e of episodes[locale])
      entries.push({
        url: `${siteConfig.url}/${locale}/podcast/${e.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
  }
  return entries;
}
