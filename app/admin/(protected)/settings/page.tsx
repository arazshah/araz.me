import { prisma } from "@/lib/prisma";
export default async function Settings() {
  const rows = await prisma.siteSetting
    .findMany({ orderBy: { key: "asc" } })
    .catch(() => []);
  return (
    <section className="admin-card">
      <h2>Site settings</h2>
      <p>
        Brand, locale, visibility, analytics, email, podcast, navigation, and
        homepage settings are stored as validated keyed records. Integrations
        stay disabled until their environment variables are configured.
      </p>
      {rows.length ? (
        <table>
          <thead>
            <tr>
              <th>Key</th>
              <th>Value</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((x) => (
              <tr key={x.id}>
                <td>{x.key}</td>
                <td>
                  <code>{JSON.stringify(x.value)}</code>
                </td>
                <td>{x.updatedAt.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Run the seed command to create safe default settings.</p>
      )}
    </section>
  );
}
