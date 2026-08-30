import { articles } from "@/lib/seed-content";
import { siteConfig } from "@/lib/site";
function escape(x: string) {
  return x.replace(
    /[<>&'\"]/g,
    (c) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&apos;",
        '"': "&quot;",
      })[c]!,
  );
}
export function GET() {
  const items = articles.fa
    .map(
      (a) =>
        `<item><title>${escape(a.title)}</title><link>${siteConfig.url}/fa/blog/${a.slug}</link><guid>${siteConfig.url}/fa/blog/${a.slug}</guid><description>${escape(a.summary)}</description></item>`,
    )
    .join("");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Araz Shahkarami</title><link>${siteConfig.url}/fa/blog</link><description>Geospatial backend, GeoAI and open-source notes</description>${items}</channel></rss>`,
    {
      headers: {
        "content-type": "application/rss+xml; charset=utf-8",
        "cache-control": "public, max-age=3600",
      },
    },
  );
}
