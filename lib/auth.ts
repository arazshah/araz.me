import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { UserRole } from "@prisma/client";
const COOKIE = "araz_admin_session";
function key() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    if (process.env.NODE_ENV === "production")
      throw new Error("AUTH_SECRET must contain at least 32 characters");
    return new TextEncoder().encode("development-only-secret-change-me-32");
  }
  return new TextEncoder().encode(secret);
}
export type Session = {
  sub: string;
  email: string;
  name: string;
  role: UserRole;
};
export async function createSession(session: Session) {
  return new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .setJti(crypto.randomUUID())
    .sign(key());
}
export async function setSessionCookie(token: string) {
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}
export async function clearSessionCookie() {
  (await cookies()).delete(COOKIE);
}
export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key(), {
      algorithms: ["HS256"],
    });
    if (
      !payload.sub ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string" ||
      (payload.role !== "ADMIN" && payload.role !== "EDITOR")
    )
      return null;
    return {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  } catch {
    return null;
  }
}
export async function requireSession(role?: UserRole) {
  const session = await getSession();
  if (!session) redirect("/admin/login?reason=expired");
  if (role && session.role !== role)
    redirect("/admin/dashboard?error=forbidden");
  return session;
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}
