"use client";

import { Menu, Moon, Search, Sun, X } from "lucide-react";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { SiteLocale } from "@/lib/i18n";

export function ThemeButton() {
  const [dark, setDark] = useState(false);
  function toggle() {
    const next = document.documentElement.dataset.theme !== "dark";
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    localStorage.setItem("theme", next ? "dark" : "light");
  }
  return (
    <button
      className="icon-button"
      onClick={toggle}
      aria-label={dark ? "Light theme" : "Dark theme"}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

export function LocaleButton({ locale }: { locale: SiteLocale }) {
  const pathname = usePathname();
  const router = useRouter();
  const nextLocale = locale === "fa" ? "en" : "fa";
  return (
    <button
      className="locale-button"
      onClick={() =>
        router.push(pathname.replace(`/${locale}`, `/${nextLocale}`))
      }
      aria-label={`Switch to ${nextLocale}`}
    >
      {nextLocale.toUpperCase()}
    </button>
  );
}

export function MobileMenu({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mobile-menu">
      <button
        className="icon-button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-label={label}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      <div
        id="mobile-navigation"
        className={open ? "mobile-panel open" : "mobile-panel"}
        onClick={() => setOpen(false)}
      >
        {children}
      </div>
    </div>
  );
}

export function SearchButton({
  locale,
  label,
}: {
  locale: SiteLocale;
  label: string;
}) {
  const router = useRouter();
  return (
    <button
      className="icon-button"
      aria-label={label}
      onClick={() => router.push(`/${locale}/search`)}
    >
      <Search size={18} />
    </button>
  );
}
