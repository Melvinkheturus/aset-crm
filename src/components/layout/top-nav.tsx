"use client";

import { useState } from "react";
import { Search, Plus, Download, CheckCircle2, RefreshCw, User, Shield } from "lucide-react";
import { useRole } from "@/context/role-context";

import { ThemeToggle } from "@/components/layout/theme-toggle";

interface TopNavProps {
  onLogVisitClick?: () => void;
}

export function TopNav({ onLogVisitClick }: TopNavProps) {
  const { role, toggleRole, executiveName } = useRole();
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
    }, 1200);
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-[#22222d] dark:border-[#22222d] border-zinc-200 bg-[#09090c]/80 dark:bg-[#09090c]/80 bg-white/90 px-6 backdrop-blur-xl transition-colors">
      {/* Search Input */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          placeholder="Search 201 schools, visit notes, contacts, or areas..."
          className="w-full rounded-xl border border-[#23232f] dark:border-[#23232f] border-zinc-200 bg-[#121217] dark:bg-[#121217] bg-zinc-50 py-2 pl-10 pr-4 text-xs text-zinc-100 dark:text-zinc-100 text-zinc-900 placeholder-zinc-500 focus:border-[#990000] focus:outline-none focus:ring-1 focus:ring-[#990000] transition-all"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Theme Toggle Button (Image 1 Capsule style) */}
        <ThemeToggle />

        {/* Role Toggle Pill */}
        <button
          onClick={toggleRole}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#262638] dark:border-[#262638] border-zinc-200 bg-[#14141c] dark:bg-[#14141c] bg-zinc-100 hover:bg-[#1a1a24] text-xs font-semibold transition-all text-zinc-200 dark:text-zinc-200 text-zinc-800"
          title="Click to switch role between Executive and Manager"
        >
          {role === "manager" ? (
            <>
              <Shield className="h-3.5 w-3.5 text-[#ff6666]" />
              <span>Manager Console</span>
            </>
          ) : (
            <>
              <User className="h-3.5 w-3.5 text-[#ff6666]" />
              <span>Executive: {executiveName}</span>
            </>
          )}
          <span className="text-[10px] text-zinc-500 ml-1 underline decoration-dotted">Switch</span>
        </button>

        {/* Sheet Sync Pill */}
        <div className="hidden md:flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sheet Synced</span>
        </div>

        {/* Refresh Sync button */}
        <button
          onClick={handleSync}
          className="flex items-center gap-1.5 rounded-xl border border-[#23232f] bg-[#14141a] px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-[#1f1f28] hover:text-white transition-colors"
          title="Synchronize Live Views"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin text-[#ff6666]" : ""}`} />
          <span className="hidden md:inline">Sync</span>
        </button>

        {/* Direct Action Button: Log Visit */}
        {onLogVisitClick && (
          <button
            onClick={onLogVisitClick}
            className="flex items-center gap-1.5 rounded-xl bg-[#990000] hover:bg-[#b91c1c] px-3.5 py-2 text-xs font-semibold text-white shadow-lg shadow-[#990000]/30 transition-all hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" />
            <span>Log Visit</span>
          </button>
        )}
      </div>
    </header>
  );
}
