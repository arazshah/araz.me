import type { SiteLocale } from "@/lib/i18n";
import { articles as seedArticles } from "@/lib/seed-content";
import { prisma } from "@/lib/prisma";

export type PublicArticle = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  readingTime: number;
  body?: string;
};

function readingTime(body: string) {
  return Math.max(
    1,
    Math.ceil(body.replace(/<[^>]+>/g, " ").split(/\s+/).length / 180),
  );
}

export async function getPublicArticles(
  locale: SiteLocale,
): Promise<PublicArticle[]> {
  const records = await prisma.post
    .findMany({
      where: {
        locale,
        status: "PUBLISHED",
        deletedAt: null,
        publishedAt: { lte: new Date() },
      },
      orderBy: { publishedAt: "desc" },
      include: { categories: { include: { category: true } } },
    })
    .catch(() => []);
  if (!records.length) return seedArticles[locale];
  return records.map((post) => ({
    slug: post.slug,
    title: post.title,
    summary: post.summary,
    category:
      post.categories[0]?.category.name ??
      (locale === "fa" ? "یادداشت" : "Article"),
    readingTime: readingTime(post.body),
    body: post.body,
  }));
}

export async function getPublicArticle(
  locale: SiteLocale,
  slug: string,
): Promise<PublicArticle | undefined> {
  const post = await prisma.post
    .findFirst({
      where: {
        locale,
        slug,
        status: "PUBLISHED",
        deletedAt: null,
        publishedAt: { lte: new Date() },
      },
    })
    .catch(() => null);
  if (post)
    return {
      slug: post.slug,
      title: post.title,
      summary: post.summary,
      category: locale === "fa" ? "یادداشت" : "Article",
      readingTime: readingTime(post.body),
      body: post.body,
    };
  return seedArticles[locale].find((item) => item.slug === slug);
}
