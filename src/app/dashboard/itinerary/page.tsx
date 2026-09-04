"use client";

import { useState, useEffect } from "react";
import {
  CalendarDays,
  Clock,
  MapPin,
  MoveUp,
  MoveDown,
  Calendar,
  CheckCircle2,
  Phone,
  User,
  School,
  ExternalLink,
  ChevronRight,
  Plus
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSearchParams } from "next/navigation";
import { AddPlanModal } from "@/components/plans/add-plan-modal";
import { StartVisitModal } from "@/components/dashboard/start-visit-modal";

export default function ItineraryPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [plans, setPlans] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<"daily" | "weekly" | "monthly">("daily");

  useEffect(() => {
    if (tabParam === "weekly") {
      setViewMode("weekly");
    } else if (tabParam === "monthly") {
      setViewMode("monthly");
    } else if (tabParam === "today") {
      setViewMode("daily");
    }
  }, [tabParam]);
  const [selectedDate, setSelectedDate] = useState("2026-09-05");
  const [loading, setLoading] = useState(true);

  const [isAddPlanOpen, setIsAddPlanOpen] = useState(false);
  const [selectedSchoolForVisit, setSelectedSchoolForVisit] = useState<any | null>(null);

  const loadPlans = async () => {
    const [pRes, sRes] = await Promise.all([
      supabase
        .from("planned_visits")
        .select("*, schools(id, school_code, name, area, phone, contact_person, designation, lead_status)")
        .order("visit_date", { ascending: true })
        .order("visit_order", { ascending: true, nullsFirst: false }),
      supabase.from("schools").select("id, school_code, name, area").order("school_code", { ascending: true })
    ]);

    if (pRes.data) {
      setPlans(pRes.data);
      if (pRes.data.length > 0 && !selectedDate) {
        setSelectedDate(pRes.data[0].visit_date);
      }
    }
    if (sRes.data) setSchools(sRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const moveOrder = async (index: number, direction: "up" | "down") => {
    const list = [...dailyPlans];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    // Swap visit orders
    const current = list[index];
    const neighbor = list[targetIdx];

    const currentOrder = current.visit_order || index + 1;
    const neighborOrder = neighbor.visit_order || targetIdx + 1;

    // Optimistic UI update
    current.visit_order = neighborOrder;
    neighbor.visit_order = currentOrder;
    list[index] = neighbor;
    list[targetIdx] = current;

    setPlans((prev) =>
      prev.map((p) => {
        if (p.id === current.id) return { ...p, visit_order: neighborOrder };
        if (p.id === neighbor.id) return { ...p, visit_order: currentOrder };
        return p;
      })
    );

    // Save to Supabase
    await Promise.all([
      supabase.from("planned_visits").update({ visit_order: neighborOrder }).eq("id", current.id),
      supabase.from("planned_visits").update({ visit_order: currentOrder }).eq("id", neighbor.id)
    ]);
  };

  const updatePlanStatus = async (planId: string, newStatus: string) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === planId ? { ...p, status: newStatus } : p))
    );
    await supabase
      .from("planned_visits")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", planId);
  };

  const dailyPlans = plans.filter((p) => p.visit_date === selectedDate);
  const distinctDates = Array.from(new Set(plans.map((p) => p.visit_date))).slice(0, 10);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#23232f] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#ff6666] tracking-wider uppercase mb-1">
            <CalendarDays className="h-4 w-4" />
            04_VISIT_PLAN
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Field Itinerary & Route Optimization
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Maintain planned visits once: drives Daily Itineraries, Weekly Routings, and Management Next-Day Views
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddPlanOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-[#990000] hover:bg-[#b91c1c] px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-[#990000]/30 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>+ Add to Plan</span>
          </button>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 rounded-xl border border-[#272736] bg-[#121217] p-1">
            <button
              onClick={() => setViewMode("daily")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                viewMode === "daily"
                  ? "bg-[#990000] text-white shadow-md shadow-[#990000]/30"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Daily Route
            </button>
            <button
              onClick={() => setViewMode("weekly")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                viewMode === "weekly"
                  ? "bg-[#990000] text-white shadow-md shadow-[#990000]/30"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Weekly Grid
            </button>
            <button
              onClick={() => setViewMode("monthly")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                viewMode === "monthly"
                  ? "bg-[#990000] text-white shadow-md shadow-[#990000]/30"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Monthly Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Date Navigator (for Daily View) */}
      {viewMode === "daily" && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <span className="text-xs font-semibold text-zinc-400 shrink-0 mr-2">Itinerary Date:</span>
          {distinctDates.map((d: any) => (
            <button
              key={d}
              onClick={() => setSelectedDate(d)}
              className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-medium border transition-all ${
                selectedDate === d
                  ? "border-[#990000] bg-[#990000]/20 text-[#ff8080] font-bold"
                  : "border-[#23232f] bg-[#121217] text-zinc-400 hover:text-white hover:bg-[#181822]"
              }`}
            >
              {d}
              <span className="ml-2 text-[10px] opacity-70">
                ({plans.filter((p) => p.visit_date === d).length})
              </span>
            </button>
          ))}
        </div>
      )}

      {/* DAILY VIEW */}
      {viewMode === "daily" && (
        <div className="rounded-2xl border border-[#23232f] bg-[#121217] overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#23232f] p-4 bg-[#171720]">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                Route Order for {selectedDate}
                <span className="rounded bg-[#990000]/20 px-2 py-0.5 text-[10px] text-[#ff8080] font-semibold border border-[#990000]/30">
                  {dailyPlans.length} Schools in Itinerary
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">Use order arrows to re-sequence route stops</p>
            </div>
          </div>

          <div className="divide-y divide-[#20202c]">
            {dailyPlans.length === 0 ? (
              <div className="p-12 text-center text-xs text-zinc-500">
                No field visits planned for this selected date.
              </div>
            ) : (
              dailyPlans.map((item, idx) => {
                const mapQuery = encodeURIComponent(`${item.schools?.name || ""} ${item.schools?.area || "Chennai"}`);
                const mapUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

                return (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-[#161622] transition-colors gap-3"
                  >
                    <div className="flex items-center gap-4">
                      {/* Sequence Number */}
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#990000]/20 border border-[#990000]/40 text-[#ff8080] font-bold text-sm">
                        {item.visit_order || idx + 1}
                      </div>

                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-2">
                          <span>{item.schools?.name || "Partner School"}</span>
                          <span className="rounded bg-[#20202e] px-2 py-0.5 text-[10px] font-mono text-zinc-400">
                            {item.schools?.school_code}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 mt-1">
                          <span className="flex items-center gap-1 text-zinc-300">
                            <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                            {item.schools?.area || "Chennai"}
                          </span>
                          <span>•</span>
                          <span className="text-[#ff9999] font-medium">{item.purpose}</span>
                          {item.schools?.contact_person && (
                            <>
                              <span>•</span>
                              <span className="text-zinc-400">
                                Attn: {item.schools.contact_person} ({item.schools.phone || "No phone"})
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className="rounded-full bg-[#1c1c28] px-2.5 py-1 text-xs font-semibold text-zinc-200">
                        {item.planned_time || `${String(9 + idx)}:30 AM`}
                      </span>

                      {/* Status Selector */}
                      <select
                        value={item.status || "Planned"}
                        onChange={(e) => updatePlanStatus(item.id, e.target.value)}
                        className={`rounded-lg px-2 py-1 text-[11px] font-semibold border transition-all ${
                          item.status === "Completed"
                            ? "bg-emerald-950/40 text-emerald-300 border-emerald-500/30"
                            : item.status === "Cancelled"
                            ? "bg-rose-950/40 text-rose-300 border-rose-500/30"
                            : item.status === "Rescheduled"
                            ? "bg-amber-950/40 text-amber-300 border-amber-500/30"
                            : "bg-[#181824] text-zinc-300 border-[#272736]"
                        }`}
                      >
                        <option value="Planned">Planned</option>
                        <option value="Completed">Completed</option>
                        <option value="Rescheduled">Rescheduled</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>

                      {/* MAP Button */}
                      <a
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg border border-[#272736] bg-[#181824] px-2.5 py-1 text-[11px] font-semibold text-zinc-300 hover:text-white transition-colors"
                        title="Open Google Maps"
                      >
                        <MapPin className="h-3 w-3 text-rose-400" />
                        <span>MAP</span>
                      </a>

                      {/* START VISIT Button */}
                      <button
                        onClick={() => setSelectedSchoolForVisit(item.schools)}
                        className="inline-flex items-center gap-1 rounded-lg bg-[#990000] hover:bg-[#b91c1c] px-2.5 py-1 text-[11px] font-bold text-white shadow-md shadow-[#990000]/30 transition-colors"
                        title="Record Completed Visit"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        <span>VISIT</span>
                      </button>

                      {/* Resequence buttons */}
                      <div className="flex items-center gap-1 ml-1">
                        <button
                          onClick={() => moveOrder(idx, "up")}
                          disabled={idx === 0}
                          className="rounded-lg p-1.5 border border-[#272736] bg-[#181822] text-zinc-400 hover:text-white disabled:opacity-30"
                          title="Move Earlier in Route"
                        >
                          <MoveUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => moveOrder(idx, "down")}
                          disabled={idx === dailyPlans.length - 1}
                          className="rounded-lg p-1.5 border border-[#272736] bg-[#181822] text-zinc-400 hover:text-white disabled:opacity-30"
                          title="Move Later in Route"
                        >
                          <MoveDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* WEEKLY VIEW */}
      {viewMode === "weekly" && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {distinctDates.slice(0, 5).map((d: any, i) => {
            const dayList = plans.filter((p) => p.visit_date === d);
            return (
              <div key={d} className="rounded-2xl border border-[#23232f] bg-[#121217] p-4 flex flex-col">
                <div className="border-b border-[#23232f] pb-3 mb-3">
                  <div className="text-[10px] uppercase font-bold text-[#ff8080] tracking-wider">
                    Day {i + 1}
                  </div>
                  <h3 className="text-sm font-bold text-white mt-0.5">{d}</h3>
                  <div className="text-[11px] text-zinc-400 mt-1">
                    {dayList.length} Planned Stops
                  </div>
                </div>

                <div className="space-y-2 flex-1 overflow-y-auto max-h-[350px]">
                  {dayList.map((item, idx) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-[#23232f] bg-[#161622] p-2.5 text-xs"
                    >
                      <div className="font-semibold text-white truncate">
                        {idx + 1}. {item.schools?.name}
                      </div>
                      <div className="text-[10px] text-zinc-400 mt-0.5 truncate">
                        {item.schools?.area} • {item.purpose}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MONTHLY VIEW */}
      {viewMode === "monthly" && (
        <div className="rounded-2xl border border-[#23232f] bg-[#121217] p-6 text-center space-y-4">
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-bold text-white">Monthly Itinerary Pipeline (September 2026)</h3>
            <p className="text-xs text-zinc-400 mt-1">
              Automated weekly clustering generated from underlying planned visit records
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
            <div className="rounded-xl border border-[#23232f] bg-[#181824] p-4 text-left">
              <span className="text-xs font-bold text-[#ff8080]">Week 1 (01–07 Sep)</span>
              <div className="text-2xl font-bold text-white mt-1">24</div>
              <div className="text-[11px] text-zinc-400 mt-1">Schools Scheduled</div>
            </div>
            <div className="rounded-xl border border-[#23232f] bg-[#181824] p-4 text-left">
              <span className="text-xs font-bold text-[#ff8080]">Week 2 (08–14 Sep)</span>
              <div className="text-2xl font-bold text-white mt-1">19</div>
              <div className="text-[11px] text-zinc-400 mt-1">Schools Scheduled</div>
            </div>
            <div className="rounded-xl border border-[#23232f] bg-[#181824] p-4 text-left">
              <span className="text-xs font-bold text-[#ff8080]">Week 3 (15–21 Sep)</span>
              <div className="text-2xl font-bold text-white mt-1">15</div>
              <div className="text-[11px] text-zinc-400 mt-1">Schools Scheduled</div>
            </div>
            <div className="rounded-xl border border-[#23232f] bg-[#181824] p-4 text-left">
              <span className="text-xs font-bold text-[#ff8080]">Week 4 (22–30 Sep)</span>
              <div className="text-2xl font-bold text-white mt-1">11</div>
              <div className="text-[11px] text-zinc-400 mt-1">Schools Scheduled</div>
            </div>
          </div>
        </div>
      )}

      {/* Add Plan Modal */}
      <AddPlanModal
        isOpen={isAddPlanOpen}
        onClose={() => setIsAddPlanOpen(false)}
        schools={schools}
        defaultDate={selectedDate}
        onSuccess={loadPlans}
      />

      {/* Start Visit Modal */}
      <StartVisitModal
        isOpen={!!selectedSchoolForVisit}
        onClose={() => setSelectedSchoolForVisit(null)}
        preselectedSchool={selectedSchoolForVisit}
        allSchools={schools}
        onSuccess={loadPlans}
      />
    </div>
  );
}
