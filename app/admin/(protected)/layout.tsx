import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  Podcast,
  Image,
  Inbox,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { requireSession } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";
export const dynamic = "force-dynamic";
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();
  const links = [
    ["dashboard", "Dashboard", LayoutDashboard],
    ["content", "Content", FileText],
    ["projects", "Projects", FolderKanban],
    ["podcast", "Podcast", Podcast],
    ["media", "Media", Image],
    ["inbox", "Contact inbox", Inbox],
    ["settings", "Settings", Settings],
    ["security", "Security", ShieldCheck],
  ] as const;
  return (
    <div className="admin-body" dir="ltr">
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <Link className="brand" href="/admin/dashboard">
            <span className="brand-mark">A</span>
            <span>
              <b>Araz.me</b>
              <small>ADMIN SYSTEM</small>
            </span>
          </Link>
          <nav className="admin-nav">
            {links.map(([path, label, Icon]) => (
              <Link href={`/admin/${path}`} key={path}>
                <Icon size={16} style={{ display: "inline", marginRight: 9 }} />
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="admin-main">
          <header className="admin-top">
            <div>
              <small>{session.role}</small>
              <h1>Welcome, {session.name}</h1>
            </div>
            <LogoutButton />
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
