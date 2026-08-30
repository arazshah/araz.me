import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSession, sameOrigin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
const schema = z.object({
  status: z.enum(["NEW", "READ", "REPLIED", "ARCHIVED", "SPAM"]),
  notes: z.string().max(5000).optional(),
});
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireSession();
  if (!sameOrigin(request))
    return NextResponse.json({ error: "Invalid request" }, { status: 403 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  const { id } = await params;
  const updated = await prisma.contactSubmission.update({
    where: { id },
    data: parsed.data,
  });
  await prisma.auditLog.create({
    data: {
      actorId: session.sub,
      action: "UPDATE_CONTACT",
      entityType: "ContactSubmission",
      entityId: id,
    },
  });
  return NextResponse.json(updated);
}
