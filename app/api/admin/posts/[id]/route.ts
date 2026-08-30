import { NextResponse } from "next/server";
import sanitizeHtml from "sanitize-html";
import { requireSession, sameOrigin } from "@/lib/auth";
import { contentSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireSession();
  if (!sameOrigin(request))
    return NextResponse.json({ error: "Invalid request" }, { status: 403 });
  const { id } = await params;
  const parsed = contentSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid content" }, { status: 400 });
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  const post = await prisma.$transaction(async (tx) => {
    await tx.revision.create({
      data: {
        entityType: "Post",
        entityId: id,
        snapshot: existing,
        editorId: session.sub,
      },
    });
    const updated = await tx.post.update({
      where: { id },
      data: {
        ...parsed.data,
        body: sanitizeHtml(parsed.data.body),
        publishedAt:
          parsed.data.status === "PUBLISHED"
            ? existing.publishedAt || new Date()
            : existing.publishedAt,
      },
    });
    await tx.auditLog.create({
      data: {
        actorId: session.sub,
        action: "UPDATE_POST",
        entityType: "Post",
        entityId: id,
      },
    });
    return updated;
  });
  return NextResponse.json(post);
}
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireSession();
  if (!sameOrigin(request))
    return NextResponse.json({ error: "Invalid request" }, { status: 403 });
  const { id } = await params;
  await prisma.$transaction([
    prisma.post.update({
      where: { id },
      data: { status: "ARCHIVED", deletedAt: new Date() },
    }),
    prisma.auditLog.create({
      data: {
        actorId: session.sub,
        action: "ARCHIVE_POST",
        entityType: "Post",
        entityId: id,
      },
    }),
  ]);
  return NextResponse.json({ ok: true });
}
