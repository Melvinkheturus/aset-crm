"use client";

import { useState } from "react";
import { Search, Plus, Download, CheckCircle2, RefreshCw } from "lucide-react";

interface TopNavProps {
  onLogVisitClick?: () => void;
}

export function TopNav({ onLogVisitClick }: TopNavProps) {
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
    }, 1200);
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-[#22222d] bg-[#09090c]/80 px-6 backdrop-blur-xl">
      {/* Search Input */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          placeholder="Search 201 schools, visit notes, contacts, or areas..."
          className="w-full rounded-xl border border-[#23232f] bg-[#121217] py-2 pl-10 pr-4 text-xs text-zinc-100 placeholder-zinc-500 focus:border-[#990000] focus:outline-none focus:ring-1 focus:ring-[#990000] transition-all"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Supabase Realtime Status Pill */}
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Supabase Connected</span>
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
