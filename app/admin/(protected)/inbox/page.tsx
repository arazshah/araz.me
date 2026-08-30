import { prisma } from "@/lib/prisma";
import { InboxAction } from "@/components/inbox-actions";
export default async function Inbox() {
  const messages = await prisma.contactSubmission
    .findMany({ take: 50, orderBy: { createdAt: "desc" } })
    .catch(() => []);
  return (
    <section className="admin-card">
      <h2>Contact inbox</h2>
      {messages.length ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Sender</th>
                <th>Subject / message</th>
                <th>Status</th>
                <th>Received</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <tr key={m.id}>
                  <td>
                    {m.name}
                    <br />
                    <a href={`mailto:${m.email}`}>{m.email}</a>
                  </td>
                  <td>
                    <b>{m.subject}</b>
                    <br />
                    <small>{m.message.slice(0, 180)}</small>
                  </td>
                  <td>{m.status}</td>
                  <td>{m.createdAt.toLocaleString()}</td>
                  <td>
                    <InboxAction id={m.id} status="READ" />{" "}
                    <InboxAction id={m.id} status="ARCHIVED" />{" "}
                    <InboxAction id={m.id} status="SPAM" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No contact submissions.</p>
      )}
    </section>
  );
}
