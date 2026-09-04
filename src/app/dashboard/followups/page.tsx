"use client";

import { useState, useEffect } from "react";
import {
  CheckSquare,
  Phone,
  MessageSquare,
  MapPin,
  Calendar,
  AlertTriangle,
  Clock,
  Sparkles,
  ExternalLink,
  Plus
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { StartVisitModal } from "@/components/dashboard/start-visit-modal";

export default function FollowupsPage() {
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState<any | null>(null);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "overdue" | "today" | "upcoming">("all");

  const todayStr = "2026-09-04";

  const fetchFollowups = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("schools")
      .select("*")
      .not("next_action_date", "is", null)
      .order("next_action_date", { ascending: true });

    if (data) setSchools(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFollowups();
  }, []);

  const overdue = schools.filter((s) => s.next_action_date < todayStr);
  const dueToday = schools.filter((s) => s.next_action_date === todayStr);
  const upcoming = schools.filter((s) => s.next_action_date > todayStr);

  const displayedSchools =
    activeFilter === "overdue"
      ? overdue
      : activeFilter === "today"
      ? dueToday
      : activeFilter === "upcoming"
      ? upcoming
      : schools;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#14141c] via-[#101017] to-[#0c0c10] border border-[#22222f]">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <CheckSquare className="h-6 w-6 text-[#ff6666]" />
            Follow-ups Command Center
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Calls, WhatsApp check-ins, second visits, and proposal follow-ups due across all partner schools.
          </p>
        </div>

        {/* Counter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeFilter === "all"
                ? "bg-[#990000] text-white shadow-md shadow-[#990000]/30"
                : "bg-[#161622] text-zinc-300 hover:bg-[#1e1e2c]"
            }`}
          >
            All ({schools.length})
          </button>
          <button
            onClick={() => setActiveFilter("overdue")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeFilter === "overdue"
                ? "bg-rose-900 text-rose-100 border border-rose-600"
                : "bg-rose-950/40 text-rose-300 border border-rose-900/60 hover:bg-rose-950/70"
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
            <span>Overdue ({overdue.length})</span>
          </button>
          <button
            onClick={() => setActiveFilter("today")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeFilter === "today"
                ? "bg-amber-900 text-amber-100 border border-amber-600"
                : "bg-amber-950/40 text-amber-300 border border-amber-900/60 hover:bg-amber-950/70"
            }`}
          >
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            <span>Due Today ({dueToday.length})</span>
          </button>
          <button
            onClick={() => setActiveFilter("upcoming")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeFilter === "upcoming"
                ? "bg-blue-900 text-blue-100 border border-blue-600"
                : "bg-blue-950/40 text-blue-300 border border-blue-900/60 hover:bg-blue-950/70"
            }`}
          >
            <Calendar className="h-3.5 w-3.5 text-blue-400" />
            <span>Upcoming ({upcoming.length})</span>
          </button>
        </div>
      </div>

      {/* Follow-up Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-zinc-500">
          Loading actionable follow-ups from Supabase...
        </div>
      ) : displayedSchools.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-[#0f0f15] border border-[#20202e] text-xs text-zinc-500">
          No follow-ups found under this filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedSchools.map((school) => {
            const isOverdue = school.next_action_date < todayStr;
            const isDueToday = school.next_action_date === todayStr;

            return (
              <div
                key={school.id}
                className="p-5 rounded-2xl bg-[#0e0e14] border border-[#20202c] hover:border-[#990000]/50 transition-all flex flex-col justify-between space-y-4 shadow-lg shadow-black/40"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-bold text-zinc-400">
                      {school.school_code}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isOverdue
                          ? "bg-rose-950 border border-rose-700 text-rose-300"
                          : isDueToday
                          ? "bg-amber-950 border border-amber-700 text-amber-300"
                          : "bg-blue-950 border border-blue-700 text-blue-300"
                      }`}
                    >
                      {isOverdue ? "OVERDUE" : isDueToday ? "DUE TODAY" : "UPCOMING"}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-sm line-clamp-1">{school.name}</h3>

                  <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
                    <MapPin className="h-3.5 w-3.5 text-[#ff6666] shrink-0" />
                    <span className="truncate">{school.area || "Chennai Region"}</span>
                  </div>

                  {/* Next Action Box */}
                  <div className="p-3 rounded-xl bg-[#14141c] border border-[#22222f] space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-500">Required Action:</span>
                      <span className="font-bold text-[#ff8080]">{school.next_action || "Follow up"}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-500">Scheduled Date:</span>
                      <span className="font-mono text-zinc-200">{school.next_action_date}</span>
                    </div>
                    {school.latest_remarks && (
                      <p className="text-[11px] text-zinc-400 italic pt-1 border-t border-[#22222f] line-clamp-2">
                        "{school.latest_remarks}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Contact & Field Actions */}
                <div className="pt-2 border-t border-[#1e1e2a] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {school.phone && (
                      <>
                        <a
                          href={`tel:${school.phone}`}
                          className="p-2 rounded-xl bg-[#181824] hover:bg-[#222232] text-zinc-300 hover:text-white transition-colors border border-[#28283c]"
                          title="Direct Call"
                        >
                          <Phone className="h-3.5 w-3.5 text-emerald-400" />
                        </a>
                        <a
                          href={`https://wa.me/91${school.phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-[#181824] hover:bg-[#222232] text-zinc-300 hover:text-white transition-colors border border-[#28283c]"
                          title="Open WhatsApp"
                        >
                          <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
                        </a>
                      </>
                    )}
                    {school.maps_url && (
                      <a
                        href={school.maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-[#181824] hover:bg-[#222232] text-zinc-300 hover:text-white transition-colors border border-[#28283c]"
                        title="Google Maps"
                      >
                        <MapPin className="h-3.5 w-3.5 text-rose-400" />
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedSchool(school);
                      setIsVisitModalOpen(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#990000] hover:bg-[#b91c1c] text-white text-xs font-semibold shadow-md shadow-[#990000]/30 transition-colors"
                  >
                    <span>Log Action</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedSchool && (
        <StartVisitModal
          isOpen={isVisitModalOpen}
          onClose={() => setIsVisitModalOpen(false)}
          onSuccess={fetchFollowups}
          preselectedSchool={selectedSchool}
        />
      )}
    </div>
  );
}
