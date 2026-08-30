"use client";
import { useEffect, useState } from "react";
type Post = {
  id: string;
  title: string;
  slug: string;
  locale: string;
  status: string;
  updatedAt: string;
};
export function ContentManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState<Post | null>(null);
  async function load() {
    const r = await fetch("/api/admin/posts");
    if (r.ok) setPosts(await r.json());
  }
  useEffect(() => {
    let active = true;
    fetch("/api/admin/posts")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (active) setPosts(data);
      });
    return () => {
      active = false;
    };
  }, []);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("Saving…");
    const form = e.currentTarget;
    const body = Object.fromEntries(new FormData(form));
    const url = editing ? `/api/admin/posts/${editing.id}` : "/api/admin/posts";
    const response = await fetch(url, {
      method: editing ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (response.ok) {
      form.reset();
      setEditing(null);
      setMessage("Saved. Revision and audit entry created.");
      await load();
    } else setMessage("Could not save. Check all fields and permissions.");
  }
  async function archive(id: string) {
    if (!confirm("Archive this content? It will no longer be public.")) return;
    await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    await load();
  }
  return (
    <>
      <section className="admin-card">
        <h2>{editing ? "Edit article" : "New article"}</h2>
        <form
          onSubmit={submit}
          className="form-grid"
          key={editing?.id || "new"}
        >
          <div className="field">
            <label>Title</label>
            <input
              className="input"
              name="title"
              defaultValue={editing?.title}
              required
            />
          </div>
          <div className="field">
            <label>Slug</label>
            <input
              className="input"
              name="slug"
              dir="ltr"
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              defaultValue={editing?.slug}
              required
            />
          </div>
          <div className="field">
            <label>Locale</label>
            <select
              className="select"
              name="locale"
              defaultValue={editing?.locale || "fa"}
            >
              <option value="fa">Persian</option>
              <option value="en">English</option>
            </select>
          </div>
          <div className="field">
            <label>Status</label>
            <select
              className="select"
              name="status"
              defaultValue={editing?.status || "DRAFT"}
            >
              <option>DRAFT</option>
              <option>REVIEW</option>
              <option>SCHEDULED</option>
              <option>PUBLISHED</option>
              <option>ARCHIVED</option>
            </select>
          </div>
          <div className="field full">
            <label>Summary</label>
            <textarea
              className="textarea"
              style={{ minHeight: 80 }}
              name="summary"
              required
              defaultValue={editing ? `Update for ${editing.title}` : ""}
            />
          </div>
          <div className="field full">
            <label>Content (sanitized HTML or plain text)</label>
            <textarea
              className="textarea"
              name="body"
              required
              defaultValue={editing ? `<p>${editing.title}</p>` : ""}
            />
          </div>
          <div className="full actions">
            <button className="button primary">Save content</button>
            {editing && (
              <button
                type="button"
                className="button"
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
            )}
          </div>
          <p className="full" role="status">
            {message}
          </p>
        </form>
      </section>
      <section className="admin-card">
        <h2>Articles</h2>
        {posts.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Locale</th>
                  <th>Status</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td>
                      {post.title}
                      <br />
                      <small>/{post.slug}</small>
                    </td>
                    <td>{post.locale}</td>
                    <td>
                      <span className="badge">{post.status}</span>
                    </td>
                    <td>{new Date(post.updatedAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="button"
                        onClick={() => setEditing(post)}
                      >
                        Edit
                      </button>{" "}
                      <button
                        className="button"
                        onClick={() => archive(post.id)}
                      >
                        Archive
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No articles yet. Create the first draft above.</p>
        )}
      </section>
    </>
  );
}
