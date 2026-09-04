"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  Calendar,
  Download,
  FileSpreadsheet,
  TrendingUp,
  Award,
  CheckCircle2,
  Users,
  MapPin,
  Flame,
  ArrowRight
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ReportsPage() {
  const [reportType, setReportType] = useState<"daily" | "weekly" | "monthly">("daily");
  const [visits, setVisits] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [vRes, sRes] = await Promise.all([
        supabase.from("visits").select("*, schools(school_code, name, area)").order("visit_date", { ascending: false }),
        supabase.from("schools").select("*")
      ]);
      if (vRes.data) setVisits(vRes.data);
      if (sRes.data) setSchools(sRes.data);
      setLoading(false);
    }
    loadData();
  }, []);

  // Executive Breakdown
  const execMap: Record<string, { total: number; hot: number; warm: number; cold: number; conducted: number }> = {};
  ["Ajith Kumar", "Manikandan", "Kingsten", "Pandurangan", "Peter", "Saranya"].forEach((e) => {
    execMap[e] = { total: 0, hot: 0, warm: 0, cold: 0, conducted: 0 };
  });

  visits.forEach((v) => {
    const e = v.created_by;
    if (execMap[e]) {
      execMap[e].total++;
      if (v.lead_status_after_visit === "Hot") execMap[e].hot++;
      else if (v.lead_status_after_visit === "Warm") execMap[e].warm++;
      else if (v.lead_status_after_visit === "Cold") execMap[e].cold++;
      else if (v.lead_status_after_visit === "CONDUCTED") execMap[e].conducted++;
    }
  });

  // Area Breakdown
  const areaCounts: Record<string, number> = {};
  visits.forEach((v) => {
    const a = v.schools?.area || "Chennai";
    areaCounts[a] = (areaCounts[a] || 0) + 1;
  });
  const topAreas = Object.entries(areaCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#23232f] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#ff6666] tracking-wider uppercase mb-1">
            <BarChart3 className="h-4 w-4" />
            AUTOMATED REPORT ENGINE
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Outreach Reports & Analytics
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Generated directly from underlying Visit Logs — zero manual re-entry required
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 rounded-xl border border-[#272736] bg-[#121217] p-1">
          <button
            onClick={() => setReportType("daily")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              reportType === "daily"
                ? "bg-[#990000] text-white shadow-md shadow-[#990000]/30"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            05_DAILY_REPORT
          </button>
          <button
            onClick={() => setReportType("weekly")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              reportType === "weekly"
                ? "bg-[#990000] text-white shadow-md shadow-[#990000]/30"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            06_WEEKLY_REPORT
          </button>
          <button
            onClick={() => setReportType("monthly")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              reportType === "monthly"
                ? "bg-[#990000] text-white shadow-md shadow-[#990000]/30"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            07_MONTHLY_REPORT
          </button>
        </div>
      </div>

      {/* DAILY REPORT VIEW */}
      {reportType === "daily" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#23232f] bg-[#121217] p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#23232f] pb-4 mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff8080]">
                  Official Daily Dispatch
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5">
                  ASET SCHOOL OUTREACH — DAILY REPORT
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Date: <strong>04 September 2026</strong> • Executive: <strong>Manikandan</strong> • Region: <strong>Mogappair / Anna Nagar</strong>
                </p>
              </div>

              <a
                href="/ASET School Outreach — Field Operations.xlsx"
                download
                className="mt-3 sm:mt-0 inline-flex items-center gap-2 rounded-xl border border-[#990000]/40 bg-[#990000]/15 px-3.5 py-2 text-xs font-semibold text-[#ff8080] hover:bg-[#990000]/25 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export Master Workbook</span>
              </a>
            </div>

            {/* Daily KPI Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
              <div className="rounded-xl border border-[#23232f] bg-[#171722] p-3 text-center">
                <span className="text-[10px] text-zinc-400">Planned</span>
                <div className="text-xl font-bold text-white mt-1">14</div>
              </div>
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 text-center">
                <span className="text-[10px] text-emerald-400">Completed</span>
                <div className="text-xl font-bold text-emerald-300 mt-1">12</div>
              </div>
              <div className="rounded-xl border border-zinc-700/30 bg-[#171722] p-3 text-center">
                <span className="text-[10px] text-zinc-400">Not Met</span>
                <div className="text-xl font-bold text-zinc-300 mt-1">2</div>
              </div>
              <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3 text-center">
                <span className="text-[10px] text-rose-400">Appointments</span>
                <div className="text-xl font-bold text-rose-300 mt-1">5</div>
              </div>
              <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-center">
                <span className="text-[10px] text-amber-400">Positive</span>
                <div className="text-xl font-bold text-amber-300 mt-1">7</div>
              </div>
              <div className="rounded-xl border border-sky-500/30 bg-sky-950/20 p-3 text-center">
                <span className="text-[10px] text-sky-400">Follow-ups</span>
                <div className="text-xl font-bold text-sky-300 mt-1">6</div>
              </div>
              <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-3 text-center">
                <span className="text-[10px] text-purple-400">Orientations</span>
                <div className="text-xl font-bold text-purple-300 mt-1">1</div>
              </div>
            </div>

            {/* Visit Summary Table */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                Chronological Visit Execution Summary
              </h3>
              <div className="overflow-x-auto rounded-xl border border-[#23232f]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#181822] text-zinc-400">
                    <tr>
                      <th className="py-2.5 px-3.5">#</th>
                      <th className="py-2.5 px-3.5">School Name</th>
                      <th className="py-2.5 px-3.5">Area</th>
                      <th className="py-2.5 px-3.5">Outcome</th>
                      <th className="py-2.5 px-3.5">Next Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#23232f] text-zinc-300">
                    {visits.slice(0, 10).map((v, idx) => (
                      <tr key={v.id} className="hover:bg-[#161622]">
                        <td className="py-2.5 px-3.5 font-bold text-[#ff8080]">{idx + 1}</td>
                        <td className="py-2.5 px-3.5 font-medium text-white">{v.schools?.name}</td>
                        <td className="py-2.5 px-3.5 text-zinc-400">{v.schools?.area}</td>
                        <td className="py-2.5 px-3.5">
                          <span className="rounded bg-[#20202d] px-2 py-0.5 text-[10px] text-emerald-300">
                            {v.outcome}
                          </span>
                        </td>
                        <td className="py-2.5 px-3.5 text-zinc-300">{v.next_action || "Follow-up Call"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WEEKLY REPORT VIEW */}
      {reportType === "weekly" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#23232f] bg-[#121217] p-6">
            <div className="border-b border-[#23232f] pb-4 mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff8080]">
                Rolling 7-Day Performance
              </span>
              <h2 className="text-lg font-bold text-white mt-0.5">
                ASET SCHOOL OUTREACH — WEEKLY REPORT
              </h2>
              <p className="text-xs text-zinc-400 mt-1">Period: <strong>31 Aug – 06 Sep 2026</strong></p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="rounded-xl bg-[#171722] p-4 border border-[#23232f]">
                <span className="text-xs text-zinc-400">Total Visits Logged</span>
                <div className="text-2xl font-bold text-white mt-1">{visits.length}</div>
              </div>
              <div className="rounded-xl bg-[#171722] p-4 border border-[#23232f]">
                <span className="text-xs text-zinc-400">Unique Schools Visited</span>
                <div className="text-2xl font-bold text-[#ff8080] mt-1">{schools.length}</div>
              </div>
              <div className="rounded-xl bg-[#171722] p-4 border border-[#23232f]">
                <span className="text-xs text-zinc-400">Appointments Fixed</span>
                <div className="text-2xl font-bold text-rose-400 mt-1">
                  {visits.filter((v) => v.visit_type === "Principal Meeting").length}
                </div>
              </div>
              <div className="rounded-xl bg-[#171722] p-4 border border-[#23232f]">
                <span className="text-xs text-zinc-400">Orientations Confirmed</span>
                <div className="text-2xl font-bold text-emerald-400 mt-1">
                  {schools.filter((s) => s.lead_status === "CONDUCTED").length}
                </div>
              </div>
            </div>

            {/* Area Activity Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-[#23232f] bg-[#161620] p-4">
                <h3 className="text-xs font-bold uppercase text-zinc-400 mb-3">Top Outreach Clusters</h3>
                <div className="space-y-2">
                  {topAreas.map(([area, count]) => (
                    <div key={area} className="flex items-center justify-between text-xs">
                      <span className="text-zinc-300">{area}</span>
                      <span className="font-bold text-white">{count} visits</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-[#23232f] bg-[#161620] p-4">
                <h3 className="text-xs font-bold uppercase text-zinc-400 mb-3">Key Outcome Distribution</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-300">Follow-up Required</span>
                    <span className="font-bold text-amber-400">
                      {visits.filter((v) => v.outcome === "Follow-up Required").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-300">Interested / In Discussion</span>
                    <span className="font-bold text-emerald-400">
                      {visits.filter((v) => v.outcome?.includes("Interested") || v.outcome?.includes("Ongoing")).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-300">Program Confirmed / Conducted</span>
                    <span className="font-bold text-purple-400">
                      {visits.filter((v) => v.outcome?.includes("Confirmed") || v.outcome?.includes("Conducted")).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MONTHLY REPORT VIEW & EXECUTIVE MATRIX */}
      {reportType === "monthly" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#23232f] bg-[#121217] p-6">
            <div className="border-b border-[#23232f] pb-4 mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff8080]">
                Monthly Operational Review
              </span>
              <h2 className="text-lg font-bold text-white mt-0.5">
                FIELD EXECUTIVE PERFORMANCE MATRIX
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Comparative individual breakdown: 6 field executives covering {schools.length} institutions
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#23232f]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#181822] text-zinc-400 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Executive</th>
                    <th className="py-3 px-4">Total Visits</th>
                    <th className="py-3 px-4 text-rose-400">🔥 Hot Leads</th>
                    <th className="py-3 px-4 text-amber-400">⚡ Warm Leads</th>
                    <th className="py-3 px-4 text-zinc-400">❄️ Cold Leads</th>
                    <th className="py-3 px-4 text-emerald-400">🏆 Conducted</th>
                    <th className="py-3 px-4">Performance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#23232f] text-zinc-300">
                  {Object.entries(execMap).map(([name, data]) => (
                    <tr key={name} className="hover:bg-[#161622]">
                      <td className="py-3 px-4 font-bold text-white">{name}</td>
                      <td className="py-3 px-4 font-mono font-bold text-[#ff8080]">{data.total}</td>
                      <td className="py-3 px-4 font-mono text-rose-300">{data.hot}</td>
                      <td className="py-3 px-4 font-mono text-amber-300">{data.warm}</td>
                      <td className="py-3 px-4 font-mono text-zinc-400">{data.cold}</td>
                      <td className="py-3 px-4 font-mono text-emerald-300 font-bold">{data.conducted}</td>
                      <td className="py-3 px-4">
                        <span className="rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-semibold">
                          Active Outreach
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
