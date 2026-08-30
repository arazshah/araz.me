import { prisma } from "@/lib/prisma";
export default async function Dashboard() {
  const stats = await Promise.all([
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.post.count({ where: { status: "DRAFT" } }),
    prisma.project.count({ where: { status: "PUBLISHED" } }),
    prisma.contactSubmission.count({ where: { status: "NEW" } }),
  ]).catch(() => [0, 0, 0, 0]);
  const recent = await prisma.auditLog
    .findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { actor: true },
    })
    .catch(() => []);
  return (
    <>
      <div className="admin-grid">
        {[
          [stats[0], "Published posts"],
          [stats[1], "Draft posts"],
          [stats[2], "Published projects"],
          [stats[3], "New messages"],
        ].map(([value, label]) => (
          <div className="metric" key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <section className="admin-card">
        <h2>System overview</h2>
        <p>
          {process.env.DATABASE_URL
            ? "Database configuration is present."
            : "DATABASE_URL is missing. Configure it before editorial work."}
        </p>
        <p>
          {process.env.AUTH_SECRET && process.env.AUTH_SECRET.length >= 32
            ? "Session signing is configured."
            : "AUTH_SECRET is missing or too short."}
        </p>
      </section>
      <section className="admin-card">
        <h2>Recent activity</h2>
        {recent.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Actor</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((log) => (
                  <tr key={log.id}>
                    <td>{log.action}</td>
                    <td>{log.actor?.name || "System"}</td>
                    <td>{log.createdAt.toISOString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No audit events yet.</p>
        )}
      </section>
    </>
  );
}
