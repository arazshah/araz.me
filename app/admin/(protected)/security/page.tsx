import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
export default async function Security() {
  const session = await requireSession();
  const users =
    session.role === "ADMIN"
      ? await prisma.user
          .findMany({
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              active: true,
              lastLoginAt: true,
            },
            orderBy: { createdAt: "asc" },
          })
          .catch(() => [])
      : [];
  return (
    <>
      <section className="admin-card">
        <h2>Security controls</h2>
        <ul>
          <li>Server-side ADMIN / EDITOR authorization</li>
          <li>
            HTTP-only, Secure (production), SameSite=Strict session cookie
          </li>
          <li>Origin checks on every mutating admin endpoint</li>
          <li>Login and upload rate limits</li>
          <li>Audit logging and no public registration</li>
        </ul>
        <p>
          TOTP fields and session revocation boundaries are included in the data
          model; provider enrollment remains optional.
        </p>
      </section>
      {session.role === "ADMIN" && (
        <section className="admin-card">
          <h2>Users</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Active</th>
                <th>Last login</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{String(u.active)}</td>
                  <td>{u.lastLoginAt?.toLocaleString() || "Never"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </>
  );
}
