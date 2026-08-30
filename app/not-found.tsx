import Link from "next/link";
export default function NotFound() {
  return (
    <main className="login-page">
      <div className="login-card">
        <span className="section-kicker">404 / COORDINATE NOT FOUND</span>
        <h1>این نقطه روی نقشه نیست.</h1>
        <p>The requested coordinate could not be found.</p>
        <Link className="button primary" href="/fa">
          بازگشت به خانه
        </Link>
      </div>
    </main>
  );
}
