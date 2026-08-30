import Link from "next/link";
import { prisma } from "@/lib/prisma";
export default async function ProjectsAdmin() {
  const rows = await prisma.project
    .findMany({ take: 50, orderBy: { updatedAt: "desc" } })
    .catch(() => []);
  return (
    <section className="admin-card">
      <div className="admin-top">
        <h2>Projects</h2>
        <Link className="button primary" href="/admin/content">
          Create with content editor
        </Link>
      </div>
      {rows.length ? (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Locale</th>
              <th>Status</th>
              <th>Year</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((x) => (
              <tr key={x.id}>
                <td>{x.title}</td>
                <td>{x.locale}</td>
                <td>{x.status}</td>
                <td>{x.year || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>
          No database projects yet. Run the seed command to install verified
          starter content.
        </p>
      )}
    </section>
  );
}
