"use client";
import { useRouter } from "next/navigation";
export function InboxAction({
  id,
  status,
}: {
  id: string;
  status: "READ" | "ARCHIVED" | "SPAM";
}) {
  const r = useRouter();
  return (
    <button
      className="button"
      onClick={async () => {
        await fetch(`/api/admin/contact/${id}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ status }),
        });
        r.refresh();
      }}
    >
      {status}
    </button>
  );
}
