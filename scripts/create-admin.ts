import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
const db = new PrismaClient();
async function main() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Araz Shahkarami";
  if (!email || !password || password.length < 12)
    throw new Error(
      "Set ADMIN_EMAIL and ADMIN_PASSWORD (minimum 12 characters).",
    );
  await db.user.upsert({
    where: { email },
    update: {
      name,
      passwordHash: await bcrypt.hash(password, 12),
      role: UserRole.ADMIN,
      active: true,
    },
    create: {
      email,
      name,
      passwordHash: await bcrypt.hash(password, 12),
      role: UserRole.ADMIN,
    },
  });
  console.log(`Admin account ready: ${email}`);
}
main().finally(() => db.$disconnect());
