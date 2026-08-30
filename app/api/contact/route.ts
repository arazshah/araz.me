import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { contactSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limited = rateLimit(`contact:${ip}`, 4, 60_000);
  if (!limited.allowed)
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } },
    );
  const parsed = contactSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  const input = parsed.data;
  try {
    await prisma.contactSubmission.create({
      data: {
        name: input.name,
        email: input.email,
        company: input.company,
        collaborationType: input.collaborationType,
        subject: input.subject,
        message: input.message,
        ipHash: createHash("sha256")
          .update(`${ip}:${process.env.AUTH_SECRET || "local"}`)
          .digest("hex"),
      },
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }
}
