"use client";

import { useState, useEffect } from "react";
import {
  ClipboardList,
  Search,
  Filter,
  Calendar,
  User,
  School,
  ArrowUpDown,
  Download,
  Plus
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function VisitLogPage() {
  const [visits, setVisits] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedExec, setSelectedExec] = useState("ALL");
  const [selectedOutcome, setSelectedOutcome] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const fetchVisits = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("visits")
      .select("*, schools(school_code, name, area, phone)")
      .order("visit_date", { ascending: false });

    if (data) {
      setVisits(data);
      setFiltered(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  useEffect(() => {
    let list = [...visits];
    if (selectedExec !== "ALL") {
      list = list.filter((v) => v.created_by === selectedExec);
    }
    if (selectedOutcome !== "ALL") {
      list = list.filter((v) => v.outcome === selectedOutcome);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (v) =>
          v.visit_code?.toLowerCase().includes(q) ||
          v.schools?.name?.toLowerCase().includes(q) ||
          v.person_met?.toLowerCase().includes(q) ||
          v.remarks?.toLowerCase().includes(q) ||
          v.created_by?.toLowerCase().includes(q)
      );
    }
    setFiltered(list);
  }, [search, selectedExec, selectedOutcome, visits]);

  const executives = ["Ajith Kumar", "Manikandan", "Kingsten", "Pandurangan", "Peter", "Saranya"];
  const outcomes = [
    "Follow-up Required",
    "Interested",
    "Program Confirmed",
    "Program Conducted",
    "Program Discussion Ongoing",
    "Proposal Sent",
    "Not Interested"
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#23232f] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#ff6666] tracking-wider uppercase mb-1">
            <ClipboardList className="h-4 w-4" />
            03_VISIT_LOG
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Daily Visit Log
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Historical field activity records: {visits.length} logged visits across all executives
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-[#23232f] bg-[#121217] px-3.5 py-2 text-xs font-semibold text-zinc-300">
            Records Shown: <strong className="text-white">{filtered.length}</strong>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#23232f] bg-[#121217] p-3.5">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search visit code, school name, discussion notes, executive..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[#272736] bg-[#181822] py-2 pl-9 pr-4 text-xs text-zinc-100 placeholder-zinc-500 focus:border-[#990000] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Executive Filter */}
          <select
            value={selectedExec}
            onChange={(e) => setSelectedExec(e.target.value)}
            className="rounded-xl border border-[#272736] bg-[#181822] px-3 py-2 text-xs text-zinc-200 focus:border-[#990000] focus:outline-none"
          >
            <option value="ALL">All Executives</option>
            {executives.map((e) => (
              <option key={e} value={e}>
                {e} ({visits.filter((v) => v.created_by === e).length})
              </option>
            ))}
          </select>

          {/* Outcome Filter */}
          <select
            value={selectedOutcome}
            onChange={(e) => setSelectedOutcome(e.target.value)}
            className="rounded-xl border border-[#272736] bg-[#181822] px-3 py-2 text-xs text-zinc-200 focus:border-[#990000] focus:outline-none max-w-[180px]"
          >
            <option value="ALL">All Outcomes</option>
            {outcomes.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Visits Table */}
      <div className="rounded-2xl border border-[#23232f] bg-[#121217] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#23232f] bg-[#171720] text-zinc-400 font-semibold">
              <tr>
                <th className="py-3.5 px-4">Visit ID</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 min-w-[200px]">School</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Person Met</th>
                <th className="py-3.5 px-4">Outcome</th>
                <th className="py-3.5 px-4">Status After</th>
                <th className="py-3.5 px-4 min-w-[160px]">Next Action</th>
                <th className="py-3.5 px-4">Executive</th>
                <th className="py-3.5 px-4 min-w-[240px]">Field Notes & Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#20202c] text-zinc-300">
              {filtered.slice(0, 50).map((v) => (
                <tr key={v.id} className="hover:bg-[#181824] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#ff8080]">
                    {v.visit_code}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-zinc-400 whitespace-nowrap">
                    {v.visit_date}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-white">
                    <div className="truncate max-w-[220px]">
                      {v.schools?.name || "Partner School"}
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono">
                      {v.schools?.school_code} • {v.schools?.area}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="rounded bg-[#20202d] px-2 py-0.5 text-[10px] text-zinc-300 whitespace-nowrap">
                      {v.visit_type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-zinc-200">{v.person_met}</div>
                    <div className="text-[10px] text-zinc-500">{v.designation}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap ${
                        v.outcome === "Interested" || v.outcome === "Program Confirmed" || v.outcome === "Program Conducted"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : v.outcome === "Follow-up Required"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {v.outcome}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                        v.lead_status_after_visit === "Hot"
                          ? "text-rose-400 bg-rose-950/40"
                          : v.lead_status_after_visit === "Warm"
                          ? "text-amber-400 bg-amber-950/40"
                          : "text-zinc-400 bg-zinc-800"
                      }`}
                    >
                      {v.lead_status_after_visit}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-zinc-200 truncate max-w-[150px]">{v.next_action}</div>
                    <div className="text-[10px] text-[#ff8080] font-mono">
                      {v.next_action_date || "—"}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-zinc-300 whitespace-nowrap">
                    {v.created_by}
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400 text-[11px] leading-relaxed">
                    {v.remarks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-[#23232f] p-3 text-center text-xs text-zinc-500">
          Showing {Math.min(50, filtered.length)} of {filtered.length} logged visits
        </div>
      </div>
    </div>
  );
}
