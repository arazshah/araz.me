import { redirect } from "next/navigation";
import { AdminLogin } from "@/components/admin-login";
import { getSession } from "@/lib/auth";
export const metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};
export default async function LoginPage() {
  if (await getSession()) redirect("/admin/dashboard");
  return (
    <main className="login-page">
      <div className="login-card">
        <span className="brand-mark">A</span>
        <h1>Content administration</h1>
        <p>
          Authorized administrators and editors only. Public registration is
          disabled.
        </p>
        <AdminLogin />
      </div>
    </main>
  );
}
