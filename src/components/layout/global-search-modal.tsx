"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  School,
  Phone,
  User,
  MapPin,
  X,
  ArrowRight,
  Flame,
  CheckCircle2,
  Clock
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSchool: (school: any) => void;
}

export function GlobalSearchModal({
  isOpen,
  onClose,
  onSelectSchool,
}: GlobalSearchModalProps) {
  const [query, setQuery] = useState("");
  const [schools, setSchools] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadAllSchools() {
      const { data } = await supabase.from("schools").select("*").order("school_code", { ascending: true });
      if (data) setSchools(data);
    }
    loadAllSchools();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(schools.slice(0, 6));
      return;
    }

    const q = query.toLowerCase().trim();
    const cleanQPhone = query.replace(/[^0-9]/g, "");

    const matched = schools.filter((s) => {
      if (s.name?.toLowerCase().includes(q)) return true;
      if (s.school_code?.toLowerCase().includes(q)) return true;
      if (s.area?.toLowerCase().includes(q)) return true;
      if (s.contact_person?.toLowerCase().includes(q)) return true;
      if (s.owner?.toLowerCase().includes(q)) return true;
      if (cleanQPhone && s.phone && s.phone.replace(/[^0-9]/g, "").includes(cleanQPhone)) return true;
      return false;
    });

    setResults(matched.slice(0, 10));
  }, [query, schools]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm p-4 pt-20">
      <div className="w-full max-w-2xl rounded-2xl border border-zinc-200 dark:border-[#2e2e3d] bg-white dark:bg-[#121217] shadow-2xl overflow-hidden flex flex-col">
        {/* Search Header */}
        <div className="relative flex items-center border-b border-zinc-200 dark:border-[#23232f] px-4 py-3">
          <Search className="h-5 w-5 text-[#990000] dark:text-[#ff8080] shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search school name, code (e.g. SCH-0012), area, contact, or phone (2–3 sec jump)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#1f1f28] hover:text-black dark:hover:text-white shrink-0 ml-2"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {results.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-500">
              No schools found matching "<strong>{query}</strong>"
            </div>
          ) : (
            results.map((school) => (
              <div
                key={school.id}
                onClick={() => {
                  onSelectSchool(school);
                  onClose();
                }}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-[#181822] cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-[#1e1e2c] border border-zinc-200 dark:border-[#2a2a3c] flex items-center justify-center text-[#990000] dark:text-[#ff8080] shrink-0 font-mono text-xs font-bold">
                    {school.school_code?.slice(-3) || "SCH"}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-zinc-900 dark:text-white truncate">
                        {school.name}
                      </h4>
                      <span className="font-mono text-[10px] text-zinc-400">
                        [{school.school_code}]
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                      <span>Area: <strong>{school.area || "Chennai"}</strong></span>
                      {school.contact_person && <span>Contact: {school.contact_person}</span>}
                      {school.phone && <span className="font-mono text-emerald-600 dark:text-emerald-400">{school.phone}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                      school.owner === "MANIKANDAN"
                        ? "bg-rose-500/15 text-[#990000] dark:text-[#ff8080]"
                        : "bg-blue-500/15 text-blue-600 dark:text-blue-300"
                    }`}
                  >
                    {school.owner || "UNASSIGNED"}
                  </span>
                  <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="border-t border-zinc-200 dark:border-[#23232f] p-2.5 px-4 bg-zinc-50 dark:bg-[#0d0d12] flex items-center justify-between text-[11px] text-zinc-500">
          <span>Search 201 Master Schools in Greater Chennai</span>
          <span className="font-mono text-[10px] bg-zinc-200 dark:bg-[#1a1a24] px-2 py-0.5 rounded">
            ESC to close
          </span>
        </div>
      </div>
    </div>
  );
}
