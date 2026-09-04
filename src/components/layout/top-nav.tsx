"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Download, CheckCircle2, RefreshCw, User, Shield, Command } from "lucide-react";
import { useRole } from "@/context/role-context";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserButton } from "@clerk/nextjs";
import { GlobalSearchModal } from "@/components/layout/global-search-modal";
import { StartVisitModal } from "@/components/dashboard/start-visit-modal";

interface TopNavProps {
  onLogVisitClick?: () => void;
}

export function TopNav({ onLogVisitClick }: TopNavProps) {
  const { role, toggleRole, executiveName } = useRole();
  const [syncing, setSyncing] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedSchoolForVisit, setSelectedSchoolForVisit] = useState<any | null>(null);

  const handleSync = async () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
    }, 1200);
  };

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-[#22222d] dark:border-[#22222d] border-zinc-200 bg-[#09090c]/80 dark:bg-[#09090c]/80 bg-white/90 px-6 backdrop-blur-xl transition-colors">
      {/* Global Fast Search Trigger (Cmd+K) */}
      <div
        onClick={() => setIsSearchOpen(true)}
        className="relative w-full max-w-md cursor-pointer group"
      >
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 group-hover:text-[#990000] dark:group-hover:text-[#ff8080] transition-colors" />
        <div className="w-full flex items-center justify-between rounded-xl border border-[#23232f] dark:border-[#23232f] border-zinc-200 bg-[#121217] dark:bg-[#121217] bg-zinc-50 py-2 pl-10 pr-3 text-xs text-zinc-400 dark:text-zinc-400 text-zinc-500 hover:border-[#990000]/60 transition-all">
          <span className="truncate">Search 201 schools, contact, phone, or area...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded bg-zinc-200 dark:bg-[#1f1f2c] px-1.5 py-0.5 font-mono text-[10px] text-zinc-600 dark:text-zinc-400">
            <span>⌘</span>K
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Theme Toggle Button (Image 1 Capsule style) */}
        <ThemeToggle />

        {/* Role Toggle Pill (SUPER_ADMIN, MANAGER, EXECUTIVE) */}
        <button
          onClick={toggleRole}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#262638] dark:border-[#262638] border-zinc-200 bg-[#14141c] dark:bg-[#14141c] bg-zinc-100 hover:bg-[#1a1a24] text-xs font-semibold transition-all text-zinc-200 dark:text-zinc-200 text-zinc-800"
          title="Click to cycle role between Executive, Manager, and Super Admin"
        >
          {role === "SUPER_ADMIN" ? (
            <>
              <Shield className="h-3.5 w-3.5 text-purple-400" />
              <span className="text-purple-400 font-bold">Super Admin</span>
            </>
          ) : role === "MANAGER" ? (
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

        {/* Clerk User Profile Button */}
        <div className="pl-1">
          <UserButton />
        </div>
      </div>

      {/* Global Fast Search Command Palette */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectSchool={(school) => {
          setSelectedSchoolForVisit(school);
        }}
      />

      {/* Start Visit Modal Triggered from Search Selection */}
      {selectedSchoolForVisit && (
        <StartVisitModal
          isOpen={!!selectedSchoolForVisit}
          onClose={() => setSelectedSchoolForVisit(null)}
          onSuccess={() => setSelectedSchoolForVisit(null)}
          preselectedSchool={selectedSchoolForVisit}
        />
      )}
    </header>
  );
}
