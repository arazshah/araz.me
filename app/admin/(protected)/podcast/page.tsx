import { prisma } from "@/lib/prisma";
export default async function PodcastAdmin() {
  const rows = await prisma.podcastEpisode
    .findMany({ take: 50, orderBy: { updatedAt: "desc" } })
    .catch(() => []);
  return (
    <section className="admin-card">
      <h2>Podcast episodes</h2>
      {rows.length ? (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Episode</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((x) => (
              <tr key={x.id}>
                <td>{x.title}</td>
                <td>{x.episode || "—"}</td>
                <td>{x.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>
          No episodes yet. Podcast records can be imported by a future RSS sync
          after the RSS URL is configured.
        </p>
      )}
    </section>
  );
}
