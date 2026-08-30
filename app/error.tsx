"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="login-page">
      <div className="login-card">
        <span className="section-kicker">SYSTEM ERROR</span>
        <h1>ارتباط موقتاً قطع شد.</h1>
        <p>Something went wrong. No private details were exposed.</p>
        <button className="button primary" onClick={reset}>
          Try again
        </button>
      </div>
    </main>
  );
}
