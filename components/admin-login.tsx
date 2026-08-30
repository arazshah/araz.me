"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
    setBusy(false);
    if (response.ok) {
      router.replace("/admin/dashboard");
      router.refresh();
    } else
      setError(
        "Email or password is incorrect, or login is temporarily limited.",
      );
  }
  return (
    <form onSubmit={submit}>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          className="input"
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input
          className="input"
          id="password"
          name="password"
          type="password"
          minLength={10}
          autoComplete="current-password"
          required
        />
      </div>
      {error && (
        <p className="error-text" role="alert">
          {error}
        </p>
      )}
      <button
        className="button primary"
        style={{ width: "100%" }}
        disabled={busy}
      >
        {busy ? "Signing in…" : "Sign in securely"}
      </button>
    </form>
  );
}
