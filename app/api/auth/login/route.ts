import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { createSession, sameOrigin, setSessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export async function POST(request: NextRequest) {
  if (!sameOrigin(request))
    return NextResponse.json({ error: "Invalid request" }, { status: 403 });
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limited = rateLimit(`login:${ip}`, 5, 15 * 60_000);
  if (!limited.allowed)
    return NextResponse.json({ error: "Try again later" }, { status: 429 });
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  const user = await prisma.user
    .findUnique({ where: { email: parsed.data.email.toLowerCase() } })
    .catch(() => null);
  if (
    !user ||
    !user.active ||
    !(await bcrypt.compare(parsed.data.password, user.passwordHash))
  )
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  const token = await createSession({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
  await setSessionCookie(token);
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });
  await prisma.auditLog.create({ data: { actorId: user.id, action: "LOGIN" } });
  return NextResponse.json({ ok: true });
}
