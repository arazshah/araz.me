import { NextResponse } from "next/server";
import sanitizeHtml from "sanitize-html";
import { requireSession, sameOrigin } from "@/lib/auth";
import { contentSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
export async function GET() {
  await requireSession();
  const posts = await prisma.post.findMany({
    where: { deletedAt: null },
    select: {
      id: true,
      title: true,
      slug: true,
      locale: true,
      status: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(posts);
}
export async function POST(request: Request) {
  const session = await requireSession();
  if (!sameOrigin(request))
    return NextResponse.json({ error: "Invalid request" }, { status: 403 });
  const parsed = contentSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid content" }, { status: 400 });
  const data = {
    ...parsed.data,
    body: sanitizeHtml(parsed.data.body, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        "img",
        "h1",
        "h2",
      ]),
      allowedAttributes: {
        a: ["href", "rel"],
        img: ["src", "alt", "width", "height"],
      },
    }),
    authorId: session.sub,
    publishedAt: parsed.data.status === "PUBLISHED" ? new Date() : null,
  };
  const post = await prisma.$transaction(async (tx) => {
    const created = await tx.post.create({ data });
    await tx.revision.create({
      data: {
        entityType: "Post",
        entityId: created.id,
        snapshot: created,
        editorId: session.sub,
      },
    });
    await tx.auditLog.create({
      data: {
        actorId: session.sub,
        action: "CREATE_POST",
        entityType: "Post",
        entityId: created.id,
      },
    });
    return created;
  });
  return NextResponse.json(post, { status: 201 });
}
