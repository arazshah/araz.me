"use client";

export function PrintButton({ label }: { label: string }) {
  return (
    <button
      className="button no-print"
      style={{ marginTop: 18 }}
      onClick={() => window.print()}
    >
      {label}
    </button>
  );
}
