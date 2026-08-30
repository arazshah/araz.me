import { MediaUploader } from "@/components/media-uploader";
import { prisma } from "@/lib/prisma";
export default async function MediaPage() {
  const assets = await prisma.mediaAsset
    .findMany({ take: 30, orderBy: { createdAt: "desc" } })
    .catch(() => []);
  return (
    <>
      <section className="admin-card">
        <h2>Media library</h2>
        <MediaUploader />
      </section>
      <section className="admin-card">
        <h2>Recent files</h2>
        {assets.length ? (
          <table>
            <thead>
              <tr>
                <th>File</th>
                <th>Type</th>
                <th>Size</th>
                <th>Alt text</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((x) => (
                <tr key={x.id}>
                  <td>{x.filename}</td>
                  <td>{x.mimeType}</td>
                  <td>{Math.ceil(x.size / 1024)} KB</td>
                  <td>{x.altText}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No uploaded media.</p>
        )}
      </section>
    </>
  );
}
