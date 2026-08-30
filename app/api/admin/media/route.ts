import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { requireSession, sameOrigin } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
const allowed = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "application/pdf",
]);
const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "application/pdf": "pdf",
};
export async function POST(request: Request) {
  const session = await requireSession();
  if (!sameOrigin(request))
    return NextResponse.json({ error: "Invalid request" }, { status: 403 });
  if (!rateLimit(`upload:${session.sub}`, 10, 60_000).allowed)
    return NextResponse.json(
      { error: "Upload limit reached" },
      { status: 429 },
    );
  const form = await request.formData();
  const file = form.get("file");
  const altText = String(form.get("altText") || "").trim();
  if (
    !(file instanceof File) ||
    !allowed.has(file.type) ||
    file.size < 1 ||
    file.size > 5 * 1024 * 1024 ||
    altText.length < 3
  )
    return NextResponse.json(
      { error: "Unsupported file, size, or alternative text" },
      { status: 400 },
    );
  const filename = `${randomUUID()}.${extensions[file.type]}`;
  const folder = path.join(process.cwd(), "public", "uploads");
  await mkdir(folder, { recursive: true });
  await writeFile(
    path.join(folder, filename),
    Buffer.from(await file.arrayBuffer()),
    { flag: "wx" },
  );
  const asset = await prisma.mediaAsset.create({
    data: {
      filename: file.name.replace(/[^a-zA-Z0-9._-]/g, "-"),
      storageKey: `uploads/${filename}`,
      mimeType: file.type,
      size: file.size,
      altText,
    },
  });
  await prisma.auditLog.create({
    data: {
      actorId: session.sub,
      action: "UPLOAD_MEDIA",
      entityType: "MediaAsset",
      entityId: asset.id,
    },
  });
  return NextResponse.json(
    { id: asset.id, filename, storageKey: asset.storageKey },
    { status: 201 },
  );
}
