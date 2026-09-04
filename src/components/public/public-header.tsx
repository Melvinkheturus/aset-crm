"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

export function PublicHeader() {
  const pathname = usePathname();

  const navLinks = [
    { label: "Product", href: "/" },
    { label: "Documentation", href: "/docs" },
    { label: "Changelog", href: "/changelog" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#22222f]/80 bg-[#09090c]/85 backdrop-blur-xl transition-all">
      <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#990000] to-[#550000] text-white font-black text-base tracking-wider border border-[#ff4d4d]/40 shadow-md shadow-[#990000]/30 group-hover:scale-105 transition-transform">
            A
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-wider text-white">ASET</span>
            <span className="rounded-md bg-[#990000]/20 px-1.5 py-0.5 text-[10px] font-semibold text-[#ff6666] border border-[#990000]/40">
              CRM
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors",
                  isActive
                    ? "text-white bg-[#1a1a24] font-semibold"
                    : "text-zinc-400 hover:text-white hover:bg-[#14141c]"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="flex items-center gap-2 rounded-xl bg-[#990000] hover:bg-[#b91c1c] px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-[#990000]/30 transition-all hover:scale-[1.02] border border-rose-500/30">
                <span>Access CRM</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </SignInButton>
          </Show>

          <Show when="signed-in">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-1.5 rounded-xl border border-zinc-200 dark:border-[#28283a] bg-zinc-100 dark:bg-[#14141c] px-3 py-1.5 text-xs font-semibold text-zinc-900 dark:text-zinc-200 hover:bg-[#990000] hover:text-white transition-colors"
              >
                <span>Dashboard</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
              <UserButton />
            </div>
          </Show>
        </div>
      </div>
    </header>
  );
}
