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
  Plus,
  CheckCircle2,
  Navigation,
  ArrowRight
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { StartVisitModal } from "@/components/dashboard/start-visit-modal";

export default function NextActionQueuePage() {
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState<any | null>(null);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"overdue" | "today" | "tomorrow" | "this_week" | "all">("today");

  const todayStr = "2026-09-04";
  const tomorrowStr = "2026-09-05";
  const endOfWeekStr = "2026-09-07";

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
  const dueTomorrow = schools.filter((s) => s.next_action_date === tomorrowStr);
  const dueThisWeek = schools.filter((s) => s.next_action_date >= todayStr && s.next_action_date <= endOfWeekStr);

  const displayedSchools =
    activeTab === "overdue"
      ? overdue
      : activeTab === "today"
      ? dueToday
      : activeTab === "tomorrow"
      ? dueTomorrow
      : activeTab === "this_week"
      ? dueThisWeek
      : schools;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-[#23232f] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#990000] dark:text-[#ff8080] tracking-wider uppercase mb-1">
            <CheckSquare className="h-4 w-4" />
            <span>ACTIONABLE OPERATIONAL QUEUE</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
            My Next Action Queue
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Never search the database to figure out what to do. One centralized queue of immediate outreach tasks.
          </p>
        </div>

        {/* 4 Big Counter Cards (Overdue, Today, Tomorrow, This Week) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => setActiveTab("overdue")}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              activeTab === "overdue"
                ? "bg-rose-500/20 border-rose-500 text-rose-300 shadow-md"
                : "bg-zinc-100 dark:bg-[#14141c] border-zinc-200 dark:border-[#22222f] text-zinc-600 dark:text-zinc-400"
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider block">OVERDUE</span>
            <span className="text-lg font-black text-rose-600 dark:text-rose-400">{overdue.length}</span>
          </button>

          <button
            onClick={() => setActiveTab("today")}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              activeTab === "today"
                ? "bg-amber-500/20 border-amber-500 text-amber-300 shadow-md"
                : "bg-zinc-100 dark:bg-[#14141c] border-zinc-200 dark:border-[#22222f] text-zinc-600 dark:text-zinc-400"
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider block">TODAY</span>
            <span className="text-lg font-black text-amber-600 dark:text-amber-400">{dueToday.length}</span>
          </button>

          <button
            onClick={() => setActiveTab("tomorrow")}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              activeTab === "tomorrow"
                ? "bg-blue-500/20 border-blue-500 text-blue-300 shadow-md"
                : "bg-zinc-100 dark:bg-[#14141c] border-zinc-200 dark:border-[#22222f] text-zinc-600 dark:text-zinc-400"
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider block">TOMORROW</span>
            <span className="text-lg font-black text-blue-600 dark:text-blue-400">{dueTomorrow.length}</span>
          </button>

          <button
            onClick={() => setActiveTab("this_week")}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              activeTab === "this_week"
                ? "bg-purple-500/20 border-purple-500 text-purple-300 shadow-md"
                : "bg-zinc-100 dark:bg-[#14141c] border-zinc-200 dark:border-[#22222f] text-zinc-600 dark:text-zinc-400"
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider block">THIS WEEK</span>
            <span className="text-lg font-black text-purple-600 dark:text-purple-400">{dueThisWeek.length}</span>
          </button>
        </div>
      </div>

      {/* Tab Switcher & All Filter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs font-bold text-zinc-500">
          <span>Active Queue Filter:</span>
          <span className="uppercase text-[#990000] dark:text-[#ff8080] font-black">{activeTab.replace("_", " ")}</span>
          <span>({displayedSchools.length} items)</span>
        </div>

        <button
          onClick={() => setActiveTab(activeTab === "all" ? "today" : "all")}
          className="text-xs font-bold text-[#990000] dark:text-[#ff8080] hover:underline"
        >
          {activeTab === "all" ? "← Focus Queue" : "View Entire Pipeline →"}
        </button>
      </div>

      {/* Structured Next Action Queue Table */}
      <div className="rounded-2xl border border-zinc-200 dark:border-[#23232f] bg-white dark:bg-[#121217] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-200 dark:border-[#23232f] bg-zinc-50 dark:bg-[#181822] text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">School</th>
                <th className="py-3.5 px-4">Area</th>
                <th className="py-3.5 px-4">Action Required</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4">Action Note</th>
                <th className="py-3.5 px-4 text-right">Quick Execution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-[#1f1f2b]">
              {displayedSchools.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    No actions pending in this queue! Everything is up to date.
                  </td>
                </tr>
              ) : (
                displayedSchools.map((school) => {
                  const cleanPhone = (school.phone || "").replace(/[^0-9]/g, "");
                  const isOverdue = school.next_action_date < todayStr;
                  const isToday = school.next_action_date === todayStr;

                  return (
                    <tr key={school.id} className="hover:bg-zinc-50 dark:hover:bg-[#161620] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-zinc-900 dark:text-white">{school.name}</div>
                        <div className="text-[10px] text-zinc-500">{school.contact_person || "Staff"} • {school.phone || "No phone"}</div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-zinc-700 dark:text-zinc-300">
                        {school.area || "Chennai"}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-zinc-900 dark:text-white block">
                          {school.next_action || "Follow-up Call"}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          Status: <strong>{school.lead_status || "Warm"}</strong>
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`font-mono font-bold text-xs ${
                            isOverdue
                              ? "text-rose-600 dark:text-rose-400"
                              : isToday
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-zinc-600 dark:text-zinc-300"
                          }`}
                        >
                          {school.next_action_date}
                        </span>
                        {isOverdue && (
                          <span className="block text-[9px] font-bold text-rose-500 uppercase">Overdue</span>
                        )}
                        {isToday && (
                          <span className="block text-[9px] font-bold text-amber-500 uppercase">Today</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-400 max-w-xs truncate italic">
                        {school.next_action_note ? `"${school.next_action_note}"` : "—"}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {cleanPhone && (
                            <a
                              href={`tel:${cleanPhone}`}
                              className="p-1.5 rounded-lg border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100"
                              title="Direct Phone Call"
                            >
                              <Phone className="h-3.5 w-3.5" />
                            </a>
                          )}

                          {cleanPhone && (
                            <a
                              href={`https://wa.me/91${cleanPhone.slice(-10)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100"
                              title="Open WhatsApp"
                            >
                              <MessageSquare className="h-3.5 w-3.5" />
                            </a>
                          )}

                          <button
                            onClick={() => {
                              setSelectedSchool(school);
                              setIsVisitModalOpen(true);
                            }}
                            className="rounded-lg bg-[#990000] hover:bg-[#b91c1c] px-3 py-1.5 text-[11px] font-bold text-white shadow-sm transition-all"
                          >
                            Log Visit
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Start Visit Modal */}
      {selectedSchool && (
        <StartVisitModal
          isOpen={isVisitModalOpen}
          onClose={() => {
            setIsVisitModalOpen(false);
            setSelectedSchool(null);
          }}
          onSuccess={() => {
            setIsVisitModalOpen(false);
            setSelectedSchool(null);
            fetchFollowups();
          }}
          preselectedSchool={selectedSchool}
        />
      )}
    </div>
  );
}
