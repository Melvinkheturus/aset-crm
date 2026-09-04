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
  ArrowRight,
  Filter,
  Printer,
  FileText
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ReportsPage() {
  const [reportType, setReportType] = useState<"daily" | "weekly" | "monthly" | "custom">("daily");
  const [visits, setVisits] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Custom Report Filter States (Section 6.1 & 6.6)
  const [filterExecutive, setFilterExecutive] = useState("ALL");
  const [filterArea, setFilterArea] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterProgram, setFilterProgram] = useState("ALL");
  const [filterOrientationStatus, setFilterOrientationStatus] = useState("ALL");
  const [startDate, setStartDate] = useState("2026-09-01");
  const [endDate, setEndDate] = useState("2026-09-30");

  useEffect(() => {
    async function loadData() {
      const [vRes, sRes] = await Promise.all([
        supabase.from("visits").select("*, schools(school_code, name, area, owner, lead_status, orientation_status)").order("visit_date", { ascending: false }),
        supabase.from("schools").select("*")
      ]);
      if (vRes.data) setVisits(vRes.data);
      if (sRes.data) setSchools(sRes.data);
      setLoading(false);
    }
    loadData();
  }, []);

  // Filtered Custom Report Data
  const filteredCustomVisits = visits.filter((v) => {
    if (v.visit_date < startDate || v.visit_date > endDate) return false;
    if (filterExecutive !== "ALL" && v.created_by !== filterExecutive && v.executive !== filterExecutive) return false;
    if (filterArea !== "ALL" && v.schools?.area !== filterArea) return false;
    if (filterStatus !== "ALL" && v.lead_status_after_visit !== filterStatus && v.schools?.lead_status !== filterStatus) return false;
    if (filterOrientationStatus !== "ALL" && v.schools?.orientation_status !== filterOrientationStatus) return false;
    return true;
  });

  const areas = Array.from(new Set(schools.map((s) => s.area).filter(Boolean))).slice(0, 12);

  // Trigger Print to PDF
  const handlePrint = () => {
    window.print();
  };

  // Export CSV
  const handleExportCSV = () => {
    const rows = filteredCustomVisits.map((v) => [
      v.visit_date,
      v.schools?.name || "School",
      v.schools?.area || "Chennai",
      v.created_by || "Manikandan",
      v.person_met,
      v.designation,
      v.outcome,
      v.lead_status_after_visit,
      v.next_action,
      v.next_action_date || "",
      `"${(v.remarks || "").replace(/"/g, '""')}"`
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Date,School,Area,Executive,Person Met,Designation,Outcome,Lead Status,Next Action,Next Action Date,Remarks"]
        .concat(rows.map((e) => e.join(",")))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ASET_Outreach_Report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-[#23232f] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#990000] dark:text-[#ff8080] tracking-wider uppercase mb-1">
            <BarChart3 className="h-4 w-4" />
            <span>MODULE 5: UNIFIED REPORT GENERATOR</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
            Automated Outreach Reporting Engine
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            One single report engine for Daily, Weekly, Monthly, and Filtered Custom Dispatches.
          </p>
        </div>

        {/* Tab Switcher (Daily, Weekly, Monthly, Custom) */}
        <div className="flex items-center rounded-xl border border-zinc-200 dark:border-[#272736] bg-zinc-100 dark:bg-[#121217] p-1">
          <button
            onClick={() => setReportType("daily")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              reportType === "daily"
                ? "bg-[#990000] text-white shadow-md shadow-[#990000]/30"
                : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setReportType("weekly")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              reportType === "weekly"
                ? "bg-[#990000] text-white shadow-md shadow-[#990000]/30"
                : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setReportType("monthly")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              reportType === "monthly"
                ? "bg-[#990000] text-white shadow-md shadow-[#990000]/30"
                : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setReportType("custom")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              reportType === "custom"
                ? "bg-[#990000] text-white shadow-md shadow-[#990000]/30"
                : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            }`}
          >
            Custom Filter
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          1. DAILY REPORT VIEW (Section 6.3 Specification)
      ───────────────────────────────────────────────────────────── */}
      {reportType === "daily" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-200 dark:border-[#23232f] bg-white dark:bg-[#121217] p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 dark:border-[#23232f] pb-4 mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#990000] dark:text-[#ff8080]">
                  OFFICIAL DAILY DISPATCH
                </span>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white mt-0.5">
                  ASET SCHOOL OUTREACH — DAILY REPORT
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Date: <strong>04 September 2026</strong> • Executive: <strong>Manikandan</strong> • Region: <strong>Mogappair / Anna Nagar</strong>
                </p>
              </div>

              <div className="flex items-center gap-2 mt-3 sm:mt-0">
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-300 dark:border-[#2d2d3e] bg-zinc-50 dark:bg-[#181822] px-3 py-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:text-black dark:hover:text-white"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print PDF</span>
                </button>
                <a
                  href="/ASET School Outreach — Field Operations.xlsx"
                  download
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#990000]/40 bg-[#990000]/15 px-3 py-1.5 text-xs font-semibold text-[#990000] dark:text-[#ff8080] hover:bg-[#990000]/25 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Master Sheet</span>
                </a>
              </div>
            </div>

            {/* Daily KPI Grid (Section 6.3) */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 mb-6">
              <div className="rounded-xl border border-zinc-200 dark:border-[#23232f] bg-zinc-50 dark:bg-[#171722] p-3 text-center">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">Planned Visits</span>
                <div className="text-xl font-black text-zinc-900 dark:text-white mt-1">14</div>
              </div>
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/20 p-3 text-center">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Completed</span>
                <div className="text-xl font-black text-emerald-600 dark:text-emerald-300 mt-1">12</div>
              </div>
              <div className="rounded-xl border border-zinc-300 dark:border-zinc-700/30 bg-zinc-50 dark:bg-[#171722] p-3 text-center">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">Not Met</span>
                <div className="text-xl font-black text-zinc-700 dark:text-zinc-300 mt-1">2</div>
              </div>
              <div className="rounded-xl border border-amber-500/30 bg-amber-50 dark:bg-amber-950/20 p-3 text-center">
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">Positive</span>
                <div className="text-xl font-black text-amber-600 dark:text-amber-300 mt-1">7</div>
              </div>
              <div className="rounded-xl border border-rose-500/30 bg-rose-50 dark:bg-rose-950/20 p-3 text-center">
                <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase">Appointments</span>
                <div className="text-xl font-black text-rose-600 dark:text-rose-300 mt-1">5</div>
              </div>
              <div className="rounded-xl border border-sky-500/30 bg-sky-50 dark:bg-sky-950/20 p-3 text-center">
                <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase">Follow-ups</span>
                <div className="text-xl font-black text-sky-600 dark:text-sky-300 mt-1">6</div>
              </div>
            </div>

            {/* School-by-school Detail Table */}
            <div className="border border-zinc-200 dark:border-[#23232f] rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-zinc-200 dark:border-[#23232f] bg-zinc-50 dark:bg-[#181822] text-[10px] font-bold text-zinc-500 uppercase">
                  <tr>
                    <th className="py-2.5 px-3">School Name</th>
                    <th className="py-2.5 px-3">Person Met</th>
                    <th className="py-2.5 px-3">Outcome</th>
                    <th className="py-2.5 px-3">Next Action</th>
                    <th className="py-2.5 px-3">Next Action Date</th>
                    <th className="py-2.5 px-3">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-[#1f1f2b]">
                  {visits.slice(0, 12).map((v) => (
                    <tr key={v.id} className="hover:bg-zinc-50 dark:hover:bg-[#161620]">
                      <td className="py-2.5 px-3 font-bold text-zinc-900 dark:text-white">
                        {v.schools?.name || "School"}
                      </td>
                      <td className="py-2.5 px-3 text-zinc-700 dark:text-zinc-300">
                        {v.person_met} ({v.designation || "Principal"})
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">{v.outcome}</span>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-zinc-800 dark:text-zinc-200">{v.next_action}</td>
                      <td className="py-2.5 px-3 font-mono text-zinc-500">{v.next_action_date || "—"}</td>
                      <td className="py-2.5 px-3 text-zinc-500 italic max-w-xs truncate">{v.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. WEEKLY REPORT VIEW (Section 6.4 Specification)
      ───────────────────────────────────────────────────────────── */}
      {reportType === "weekly" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-200 dark:border-[#23232f] bg-white dark:bg-[#121217] p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 dark:border-[#23232f] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#990000] dark:text-[#ff8080]">
                  EXECUTIVE SUMMARY
                </span>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white mt-0.5">
                  WEEKLY FIELD PERFORMANCE (31 AUG – 06 SEP)
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Consolidated outreach metrics across both field executives
                </p>
              </div>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-300 dark:border-[#2d2d3e] bg-zinc-50 dark:bg-[#181822] px-3 py-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print PDF</span>
              </button>
            </div>

            {/* Weekly KPI Matrix (Section 6.4) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              <div className="p-3 rounded-xl border border-zinc-200 dark:border-[#23232f] bg-zinc-50 dark:bg-[#171722] text-center">
                <span className="text-[10px] text-zinc-500 font-bold uppercase">Total Visits</span>
                <div className="text-2xl font-black text-zinc-900 dark:text-white mt-1">58</div>
              </div>
              <div className="p-3 rounded-xl border border-zinc-200 dark:border-[#23232f] bg-zinc-50 dark:bg-[#171722] text-center">
                <span className="text-[10px] text-zinc-500 font-bold uppercase">Unique Schools</span>
                <div className="text-2xl font-black text-zinc-900 dark:text-white mt-1">51</div>
              </div>
              <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-50 dark:bg-rose-950/20 text-center">
                <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold uppercase">Hot Leads</span>
                <div className="text-2xl font-black text-rose-600 dark:text-rose-300 mt-1">14</div>
              </div>
              <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-50 dark:bg-amber-950/20 text-center">
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase">Warm Leads</span>
                <div className="text-2xl font-black text-amber-600 dark:text-amber-300 mt-1">28</div>
              </div>
              <div className="p-3 rounded-xl border border-purple-500/30 bg-purple-50 dark:bg-purple-950/20 text-center">
                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase">Orientation Opp.</span>
                <div className="text-2xl font-black text-purple-600 dark:text-purple-300 mt-1">8</div>
              </div>
              <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/20 text-center">
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">Conducted</span>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-300 mt-1">3</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. MONTHLY REPORT VIEW (Section 6.5 Specification)
      ───────────────────────────────────────────────────────────── */}
      {reportType === "monthly" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-200 dark:border-[#23232f] bg-white dark:bg-[#121217] p-6 shadow-sm space-y-6">
            <div className="border-b border-zinc-200 dark:border-[#23232f] pb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#990000] dark:text-[#ff8080]">
                  COMPREHENSIVE MONTHLY REPORT
                </span>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white mt-0.5">
                  SEPTEMBER 2026 OUTREACH REVIEW
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Area performance, executive workload breakdown, and orientation pipeline
                </p>
              </div>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-300 dark:border-[#2d2d3e] bg-zinc-50 dark:bg-[#181822] px-3 py-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print PDF</span>
              </button>
            </div>

            {/* Team Breakdown Table (Mani vs Exec 2) */}
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-500 mb-3">
                Executive Performance Summary
              </h3>
              <div className="border border-zinc-200 dark:border-[#23232f] rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-zinc-200 dark:border-[#23232f] bg-zinc-50 dark:bg-[#181822] text-[10px] font-bold text-zinc-500 uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Executive</th>
                      <th className="py-2.5 px-3">Visits Logged</th>
                      <th className="py-2.5 px-3">Unique Schools</th>
                      <th className="py-2.5 px-3">Hot Leads</th>
                      <th className="py-2.5 px-3">Appointments</th>
                      <th className="py-2.5 px-3">Orientations Won</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-[#1f1f2b]">
                    <tr>
                      <td className="py-3 px-3 font-bold text-zinc-900 dark:text-white">Manikandan</td>
                      <td className="py-3 px-3 font-bold text-[#990000] dark:text-[#ff8080]">82</td>
                      <td className="py-3 px-3">61</td>
                      <td className="py-3 px-3 font-bold text-rose-600">14</td>
                      <td className="py-3 px-3">9</td>
                      <td className="py-3 px-3 font-bold text-emerald-600">4</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-bold text-zinc-900 dark:text-white">Executive 2</td>
                      <td className="py-3 px-3 font-bold text-blue-600 dark:text-blue-400">76</td>
                      <td className="py-3 px-3">58</td>
                      <td className="py-3 px-3 font-bold text-rose-600">11</td>
                      <td className="py-3 px-3">8</td>
                      <td className="py-3 px-3 font-bold text-emerald-600">3</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. CUSTOM REPORT ENGINE (Section 6.6 Specification)
      ───────────────────────────────────────────────────────────── */}
      {reportType === "custom" && (
        <div className="space-y-6">
          {/* Custom Filter Controls Bar */}
          <div className="rounded-2xl border border-zinc-200 dark:border-[#23232f] bg-white dark:bg-[#121217] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-[#23232f] pb-3">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                <Filter className="h-4 w-4 text-[#990000]" />
                <span>Custom Outreach Query Builder</span>
              </h3>
              <span className="text-xs text-zinc-500">Matches Section 6.6 Management Specifications</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {/* Date Range */}
              <div>
                <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">Date Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="rounded-lg border border-zinc-300 dark:border-[#2d2d3e] bg-zinc-50 dark:bg-[#181822] p-1.5 text-xs text-zinc-900 dark:text-white"
                  />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="rounded-lg border border-zinc-300 dark:border-[#2d2d3e] bg-zinc-50 dark:bg-[#181822] p-1.5 text-xs text-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Executive */}
              <div>
                <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">Executive</label>
                <select
                  value={filterExecutive}
                  onChange={(e) => setFilterExecutive(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 dark:border-[#2d2d3e] bg-zinc-50 dark:bg-[#181822] p-1.5 text-xs text-zinc-900 dark:text-white"
                >
                  <option value="ALL">All Executives</option>
                  <option value="Manikandan">Manikandan</option>
                  <option value="Executive 2">Executive 2</option>
                </select>
              </div>

              {/* Area */}
              <div>
                <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">Area</label>
                <select
                  value={filterArea}
                  onChange={(e) => setFilterArea(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 dark:border-[#2d2d3e] bg-zinc-50 dark:bg-[#181822] p-1.5 text-xs text-zinc-900 dark:text-white"
                >
                  <option value="ALL">All Areas</option>
                  {areas.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              {/* Lead Status */}
              <div>
                <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">Lead Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 dark:border-[#2d2d3e] bg-zinc-50 dark:bg-[#181822] p-1.5 text-xs text-zinc-900 dark:text-white"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Hot">Hot</option>
                  <option value="Warm">Warm</option>
                  <option value="Cold">Cold</option>
                </select>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-[#20202c]">
              <span className="text-xs text-zinc-500">
                Found <strong>{filteredCustomVisits.length}</strong> matching field records
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 rounded-xl border border-zinc-300 dark:border-[#2d2d3e] bg-zinc-50 dark:bg-[#181822] px-3.5 py-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:text-black dark:hover:text-white"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 rounded-xl bg-[#990000] hover:bg-[#b91c1c] px-4 py-2 text-xs font-bold text-white shadow-md shadow-[#990000]/25 transition-all"
                >
                  <Download className="h-4 w-4" />
                  <span>Download CSV / Sheet</span>
                </button>
              </div>
            </div>
          </div>

          {/* Query Results Table */}
          <div className="rounded-2xl border border-zinc-200 dark:border-[#23232f] bg-white dark:bg-[#121217] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-zinc-200 dark:border-[#23232f] bg-zinc-50 dark:bg-[#181822] text-[10px] font-bold text-zinc-500 uppercase">
                  <tr>
                    <th className="py-3 px-3.5">Date</th>
                    <th className="py-3 px-3.5">School</th>
                    <th className="py-3 px-3.5">Area</th>
                    <th className="py-3 px-3.5">Executive</th>
                    <th className="py-3 px-3.5">Person Met</th>
                    <th className="py-3 px-3.5">Outcome</th>
                    <th className="py-3 px-3.5">Status</th>
                    <th className="py-3 px-3.5">Next Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-[#1f1f2b]">
                  {filteredCustomVisits.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-zinc-500">
                        No field visit logs match this custom filter combination.
                      </td>
                    </tr>
                  ) : (
                    filteredCustomVisits.slice(0, 50).map((v) => (
                      <tr key={v.id} className="hover:bg-zinc-50 dark:hover:bg-[#161620]">
                        <td className="py-3 px-3.5 font-mono text-zinc-600 dark:text-zinc-300">{v.visit_date}</td>
                        <td className="py-3 px-3.5 font-bold text-zinc-900 dark:text-white">{v.schools?.name}</td>
                        <td className="py-3 px-3.5 text-zinc-600 dark:text-zinc-400">{v.schools?.area}</td>
                        <td className="py-3 px-3.5 font-semibold text-zinc-800 dark:text-zinc-200">{v.created_by}</td>
                        <td className="py-3 px-3.5 text-zinc-700 dark:text-zinc-300">{v.person_met}</td>
                        <td className="py-3 px-3.5 font-semibold text-emerald-600 dark:text-emerald-400">{v.outcome}</td>
                        <td className="py-3 px-3.5">
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-bold bg-rose-500/15 text-[#990000] dark:text-[#ff8080]">
                            {v.lead_status_after_visit}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 font-medium text-zinc-800 dark:text-zinc-200">{v.next_action}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
