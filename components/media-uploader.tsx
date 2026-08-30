"use client";
import { useState } from "react";
export function MediaUploader() {
  const [msg, setMsg] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg("Uploading…");
    const r = await fetch("/api/admin/media", {
      method: "POST",
      body: new FormData(e.currentTarget),
    });
    const body = await r.json();
    setMsg(r.ok ? `Uploaded: ${body.filename}` : body.error || "Upload failed");
  }
  return (
    <form onSubmit={submit}>
      <div className="field">
        <label htmlFor="file">
          Image or document (max 5 MB; SVG is disabled)
        </label>
        <input
          className="input"
          id="file"
          name="file"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,application/pdf"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="altText">Alternative text</label>
        <input
          className="input"
          id="altText"
          name="altText"
          required
          minLength={3}
        />
      </div>
      <button className="button primary" style={{ marginTop: 16 }}>
        Upload securely
      </button>
      <p role="status">{msg}</p>
    </form>
  );
}
