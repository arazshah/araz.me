import { PrismaClient, ContentStatus, Locale, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { getProjects, expertise } from "../lib/seed-content";
const db = new PrismaClient();
async function main() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (email && password && password.length >= 12) {
    await db.user.upsert({
      where: { email },
      update: { active: true },
      create: {
        email,
        name: "Araz Shahkarami",
        passwordHash: await bcrypt.hash(password, 12),
        role: UserRole.ADMIN,
      },
    });
  } else
    console.warn(
      "Admin not seeded: set ADMIN_EMAIL and ADMIN_PASSWORD (12+ chars), or run npm run admin:create.",
    );
  for (const locale of ["fa", "en"] as const) {
    const dbLocale = locale === "fa" ? Locale.fa : Locale.en;
    for (const project of getProjects(locale)) {
      await db.project.upsert({
        where: { locale_slug: { locale: dbLocale, slug: project.slug } },
        update: { title: project.title, summary: project.summary },
        create: {
          locale: dbLocale,
          slug: project.slug,
          title: project.title,
          summary: project.summary,
          projectStatus: project.status,
          liveUrl: project.url,
          githubUrl: project.repository,
          status: ContentStatus.PUBLISHED,
          featured: [
            "mapathon",
            "geospatial-intelligence-platform",
            "bookane",
            "araz-cast",
          ].includes(project.slug),
          publishedAt: new Date(),
        },
      });
    }
    for (const [index, name] of expertise.entries()) {
      await db.skill.upsert({
        where: { locale_name: { locale: dbLocale, name } },
        update: { sortOrder: index },
        create: {
          locale: dbLocale,
          name,
          group: "Technical",
          sortOrder: index,
        },
      });
    }
    await db.navigationMenu.upsert({
      where: { locale_key: { locale: dbLocale, key: "main" } },
      update: {},
      create: {
        locale: dbLocale,
        key: "main",
        items: {
          create: (locale === "fa"
            ? [
                ["درباره من", "about"],
                ["پروژه‌ها", "projects"],
                ["نوشته‌ها", "blog"],
                ["پادکست", "podcast"],
                ["رزومه", "resume"],
                ["تماس", "contact"],
              ]
            : [
                ["About", "about"],
                ["Projects", "projects"],
                ["Writing", "blog"],
                ["Podcast", "podcast"],
                ["Résumé", "resume"],
                ["Contact", "contact"],
              ]
          ).map(([label, href], sortOrder) => ({
            label,
            href: `/${locale}/${href}`,
            sortOrder,
          })),
        },
      },
    });
  }
  await db.siteSetting.upsert({
    where: { key: "brand" },
    update: {},
    create: {
      key: "brand",
      value: {
        publicName: "Araz Shahkarami",
        publicNameFa: "آراز شاه‌کرمی",
        legalNameVisible: false,
        primaryEmail: "mail@araz.me",
        secondaryEmailVisible: false,
        phoneVisible: false,
      },
    },
  });
  await db.siteSetting.upsert({
    where: { key: "locales" },
    update: {},
    create: {
      key: "locales",
      value: { primary: "fa", active: ["fa", "en"], future: ["az"] },
    },
  });
  await db.siteSetting.upsert({
    where: { key: "integrations" },
    update: {},
    create: {
      key: "integrations",
      value: {
        analytics: false,
        github: false,
        podcastRss: false,
        smtp: false,
        s3: false,
        turnstile: false,
      },
    },
  });
  console.log("Verified seed content installed.");
}
main().finally(() => db.$disconnect());
