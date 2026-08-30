import { NextResponse } from "next/server";
import { clearSessionCookie, sameOrigin } from "@/lib/auth";
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return NextResponse.json({ error: "Invalid request" }, { status: 403 });
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
