"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  School,
  Search,
  Filter,
  Phone,
  User,
  MapPin,
  Calendar,
  ChevronRight,
  X,
  ExternalLink,
  Flame,
  Plus,
  MessageSquare,
  Navigation,
  CheckCircle2,
  CalendarPlus,
  Shield,
  Lock,
  Unlock,
  AlertTriangle,
  Clock,
  Sparkles,
  Send
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AddSchoolModal } from "@/components/schools/add-school-modal";
import { EditSchoolModal } from "@/components/schools/edit-school-modal";
import { StartVisitModal } from "@/components/dashboard/start-visit-modal";
import { AddPlanModal } from "@/components/plans/add-plan-modal";
import { useRole } from "@/context/role-context";

export default function SchoolsMasterPage() {
  const searchParams = useSearchParams();
  const viewParam = searchParams.get("view");
  const { role, executiveName } = useRole();

  const [activeTab, setActiveTab] = useState<"master" | "ownership" | "requests">("master");
  const [schools, setSchools] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedArea, setSelectedArea] = useState("ALL");
  const [selectedOwner, setSelectedOwner] = useState("ALL");
  const [activeSchool, setActiveSchool] = useState<any | null>(null);
  const [schoolVisits, setSchoolVisits] = useState<any[]>([]);
  const [accessRequests, setAccessRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAddSchoolOpen, setIsAddSchoolOpen] = useState(false);
  const [isEditSchoolOpen, setIsEditSchoolOpen] = useState(false);
  const [isStartVisitOpen, setIsStartVisitOpen] = useState(false);
  const [isPlanVisitOpen, setIsPlanVisitOpen] = useState(false);

  // Request Access Modal State
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestTargetSchool, setRequestTargetSchool] = useState<any | null>(null);
  const [requestReason, setRequestReason] = useState("");
  const [requestSubmitting, setRequestSubmitting] = useState(false);

  useEffect(() => {
    if (viewParam === "ownership") setActiveTab("ownership");
    else if (viewParam === "requests") setActiveTab("requests");
    else setActiveTab("master");
  }, [viewParam]);

  const loadSchoolsAndRequests = async () => {
    setLoading(true);
    const [sRes, reqRes] = await Promise.all([
      supabase.from("schools").select("*").order("school_code", { ascending: true }),
      supabase.from("access_requests").select("*, schools(name, school_code, area)").order("created_at", { ascending: false })
    ]);

    if (sRes.data) {
      setSchools(sRes.data);
      setFiltered(sRes.data);
    }
    if (reqRes.data) {
      setAccessRequests(reqRes.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSchoolsAndRequests();
  }, []);

  useEffect(() => {
    let list = [...schools];
    if (selectedStatus !== "ALL") {
      list = list.filter((s) => s.lead_status?.toUpperCase() === selectedStatus.toUpperCase());
    }
    if (selectedArea !== "ALL") {
      list = list.filter((s) => s.area?.toLowerCase().includes(selectedArea.toLowerCase()));
    }
    if (selectedOwner !== "ALL") {
      list = list.filter((s) => s.owner?.toUpperCase() === selectedOwner.toUpperCase());
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name?.toLowerCase().includes(q) ||
          s.school_code?.toLowerCase().includes(q) ||
          s.area?.toLowerCase().includes(q) ||
          s.contact_person?.toLowerCase().includes(q) ||
          s.owner?.toLowerCase().includes(q)
      );
    }
    setFiltered(list);
  }, [search, selectedStatus, selectedArea, selectedOwner, schools]);

  const openSchoolDetail = async (school: any) => {
    setActiveSchool(school);
    const { data } = await supabase
      .from("visits")
      .select("*")
      .eq("school_id", school.id)
      .order("visit_date", { ascending: false });
    setSchoolVisits(data || []);
  };

  // Ownership Check Rule (Section 2.3: One school = one primary executive at a time)
  const isLockedForCurrentExecutive = (school: any) => {
    if (!school || !school.owner) return false;
    const owner = school.owner.toUpperCase();
    if (owner === "UNASSIGNED" || owner === "JOINT") return false;
    // Check if the current user executive name differs from owner
    const current = executiveName.toUpperCase();
    if (current.includes("MANIKANDAN") && owner.includes("EXECUTIVE 2")) return true;
    if (current.includes("EXECUTIVE 2") && owner.includes("MANIKANDAN")) return true;
    return false;
  };

  // Handle Request Access Submission
  const handleRequestAccessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestTargetSchool || !requestReason.trim()) return;

    setRequestSubmitting(true);
    try {
      const { error } = await supabase.from("access_requests").insert({
        school_id: requestTargetSchool.id,
        requester_name: executiveName,
        owner_name: requestTargetSchool.owner || "MANIKANDAN",
        reason: requestReason.trim(),
        status: "pending"
      });

      if (error) throw error;

      alert(`Access request submitted to ${requestTargetSchool.owner}. Once approved, you can plan visits.`);
      setIsRequestModalOpen(false);
      setRequestReason("");
      loadSchoolsAndRequests();
    } catch (err: any) {
      alert(`Error submitting request: ${err.message}`);
    } finally {
      setRequestSubmitting(false);
    }
  };

  // Approve / Reject Request (Manager or Owner)
  const handleRequestDecision = async (requestId: string, newStatus: "approved" | "rejected") => {
    try {
      const { error } = await supabase
        .from("access_requests")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", requestId);

      if (error) throw error;

      // If approved, update school owner to JOINT or Requester
      if (newStatus === "approved") {
        const req = accessRequests.find((r) => r.id === requestId);
        if (req && req.school_id) {
          await supabase.from("schools").update({ owner: "JOINT" }).eq("id", req.school_id);
        }
      }

      loadSchoolsAndRequests();
    } catch (err: any) {
      alert(`Failed to update request: ${err.message}`);
    }
  };

  const areas = Array.from(new Set(schools.map((s) => s.area).filter(Boolean))).slice(0, 15);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 transition-colors">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-[#23232f] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#990000] dark:text-[#ff8080] tracking-wider uppercase mb-1">
            <School className="h-4 w-4" />
            <span>MODULE 2: SCHOOL MASTER & EXECUTIVE TRACKER</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
            Educational Institutions & Ownership
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            201 Accredited Schools • Two-Executive Ownership Rules • Collision Prevention Active
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab Switcher */}
          <div className="flex items-center rounded-xl bg-zinc-100 dark:bg-[#15151e] p-1 border border-zinc-200 dark:border-[#242432]">
            <button
              onClick={() => setActiveTab("master")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === "master"
                  ? "bg-[#990000] text-white shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
              }`}
            >
              Master Tracker
            </button>
            <button
              onClick={() => setActiveTab("ownership")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === "ownership"
                  ? "bg-[#990000] text-white shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
              }`}
            >
              Ownership Split
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === "requests"
                  ? "bg-[#990000] text-white shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
              }`}
            >
              <span>Access Requests</span>
              {accessRequests.filter((r) => r.status === "pending").length > 0 && (
                <span className="rounded-full bg-rose-500 text-white px-1.5 py-0.2 text-[10px]">
                  {accessRequests.filter((r) => r.status === "pending").length}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={() => setIsAddSchoolOpen(true)}
            className="flex items-center gap-1 rounded-xl bg-[#990000] hover:bg-[#b91c1c] px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-[#990000]/30 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>+ Add School</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: MASTER TRACKER TABLE
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "master" && (
        <>
          {/* Search & Multi-Filters */}
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-zinc-200 dark:border-[#23232f] bg-white dark:bg-[#121217] p-3.5 shadow-sm">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search school name, area, contact, or owner..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 dark:border-[#272736] bg-zinc-50 dark:bg-[#181822] py-2 pl-9 pr-4 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-[#990000] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Lead Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="rounded-xl border border-zinc-200 dark:border-[#272736] bg-zinc-50 dark:bg-[#181822] px-3 py-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200 focus:outline-none"
              >
                <option value="ALL">Status: All</option>
                <option value="HOT">HOT</option>
                <option value="WARM">WARM</option>
                <option value="COLD">COLD</option>
              </select>

              {/* Owner Filter */}
              <select
                value={selectedOwner}
                onChange={(e) => setSelectedOwner(e.target.value)}
                className="rounded-xl border border-zinc-200 dark:border-[#272736] bg-zinc-50 dark:bg-[#181822] px-3 py-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200 focus:outline-none"
              >
                <option value="ALL">Owner: All</option>
                <option value="MANIKANDAN">MANIKANDAN</option>
                <option value="EXECUTIVE 2">EXECUTIVE 2</option>
                <option value="JOINT">JOINT</option>
                <option value="UNASSIGNED">UNASSIGNED</option>
              </select>

              {/* Area Filter */}
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="rounded-xl border border-zinc-200 dark:border-[#272736] bg-zinc-50 dark:bg-[#181822] px-3 py-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200 focus:outline-none max-w-[150px]"
              >
                <option value="ALL">Area: All</option>
                {areas.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Master Institutions Table */}
          <div className="rounded-2xl border border-zinc-200 dark:border-[#23232f] bg-white dark:bg-[#121217] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-800 dark:text-zinc-200">
                <thead className="border-b border-zinc-200 dark:border-[#23232f] bg-zinc-50 dark:bg-[#181822] text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">School</th>
                    <th className="py-3.5 px-4">Area</th>
                    <th className="py-3.5 px-4">Owner</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Lead Status</th>
                    <th className="py-3.5 px-4">Next Action</th>
                    <th className="py-3.5 px-4">Next Action Date</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-[#1f1f2b]">
                  {filtered.slice(0, 60).map((school) => {
                    const isLocked = isLockedForCurrentExecutive(school);

                    return (
                      <tr
                        key={school.id}
                        onClick={() => openSchoolDetail(school)}
                        className="hover:bg-zinc-50 dark:hover:bg-[#191922] transition-colors cursor-pointer group"
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] text-zinc-400 group-hover:text-[#990000] dark:group-hover:text-[#ff8080]">
                              {school.school_code}
                            </span>
                            <span className="font-bold text-zinc-900 dark:text-white">
                              {school.name}
                            </span>
                          </div>
                          <div className="text-[10px] text-zinc-500">
                            {school.board || "State Board / CBSE"} • Class 12
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-medium text-zinc-700 dark:text-zinc-300">
                            {school.area || "Chennai"}
                          </span>
                        </td>

                        {/* Owner Badge */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                              school.owner === "MANIKANDAN"
                                ? "bg-rose-500/15 text-[#990000] dark:text-[#ff8080] border border-rose-500/20"
                                : school.owner === "EXECUTIVE 2"
                                ? "bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/20"
                                : school.owner === "JOINT"
                                ? "bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/20"
                                : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                            }`}
                          >
                            {isLocked ? <Lock className="h-3 w-3" /> : <User className="h-3 w-3" />}
                            <span>{school.owner || "UNASSIGNED"}</span>
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                            {school.contact_person || "Staff"}
                          </div>
                          <div className="text-[10px] text-zinc-500">{school.phone || "No phone"}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                              school.lead_status === "Hot"
                                ? "bg-rose-500/15 text-[#990000] dark:text-rose-300 border border-rose-500/30"
                                : school.lead_status === "Warm"
                                ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                            }`}
                          >
                            {school.lead_status || "WARM"}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-zinc-900 dark:text-zinc-200">
                            {school.next_action || "Follow-up"}
                          </div>
                          {school.next_action_note && (
                            <div className="text-[10px] text-zinc-500 truncate max-w-[160px]">
                              "{school.next_action_note}"
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4 font-mono text-zinc-600 dark:text-zinc-300">
                          {school.next_action_date || "—"}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors inline" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="border-t border-zinc-200 dark:border-[#23232f] p-3 text-center text-xs text-zinc-500">
              Displaying {Math.min(60, filtered.length)} of {filtered.length} institutions • Click any row for profile drawer
            </div>
          </div>
        </>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: OWNERSHIP SPLIT (Section 2.2 Specification)
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "ownership" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Column 1: Manikandan */}
            <div className="rounded-2xl border border-zinc-200 dark:border-[#23232f] bg-white dark:bg-[#121217] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-[#23232f] pb-3">
                <div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <User className="h-4 w-4 text-[#990000]" />
                    <span>MANIKANDAN</span>
                  </h3>
                  <span className="text-[10px] text-zinc-500">Primary Senior Executive</span>
                </div>
                <span className="rounded-full bg-rose-500/15 text-[#990000] dark:text-[#ff8080] font-black text-xs px-2.5 py-0.5">
                  {schools.filter((s) => s.owner === "MANIKANDAN").length} Schools
                </span>
              </div>
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {schools.filter((s) => s.owner === "MANIKANDAN").slice(0, 30).map((s) => (
                  <div
                    key={s.id}
                    onClick={() => openSchoolDetail(s)}
                    className="p-2.5 rounded-xl border border-zinc-200 dark:border-[#20202c] bg-zinc-50 dark:bg-[#15151e] hover:border-[#990000]/40 transition-colors cursor-pointer text-xs"
                  >
                    <div className="font-bold text-zinc-900 dark:text-white truncate">{s.name}</div>
                    <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-1">
                      <span>{s.area}</span>
                      <span className="font-semibold text-[#990000] dark:text-[#ff8080]">{s.lead_status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Executive 2 */}
            <div className="rounded-2xl border border-zinc-200 dark:border-[#23232f] bg-white dark:bg-[#121217] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-[#23232f] pb-3">
                <div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <User className="h-4 w-4 text-blue-500" />
                    <span>EXECUTIVE 2</span>
                  </h3>
                  <span className="text-[10px] text-zinc-500">Field Outreach Executive</span>
                </div>
                <span className="rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-300 font-black text-xs px-2.5 py-0.5">
                  {schools.filter((s) => s.owner === "EXECUTIVE 2").length} Schools
                </span>
              </div>
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {schools.filter((s) => s.owner === "EXECUTIVE 2").slice(0, 30).map((s) => (
                  <div
                    key={s.id}
                    onClick={() => openSchoolDetail(s)}
                    className="p-2.5 rounded-xl border border-zinc-200 dark:border-[#20202c] bg-zinc-50 dark:bg-[#15151e] hover:border-blue-500/40 transition-colors cursor-pointer text-xs"
                  >
                    <div className="font-bold text-zinc-900 dark:text-white truncate">{s.name}</div>
                    <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-1">
                      <span>{s.area}</span>
                      <span className="font-semibold text-blue-500">{s.lead_status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Joint & Unassigned */}
            <div className="rounded-2xl border border-zinc-200 dark:border-[#23232f] bg-white dark:bg-[#121217] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-[#23232f] pb-3">
                <div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <Shield className="h-4 w-4 text-purple-500" />
                    <span>JOINT & UNASSIGNED</span>
                  </h3>
                  <span className="text-[10px] text-zinc-500">Collaborative or Open</span>
                </div>
                <span className="rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-300 font-black text-xs px-2.5 py-0.5">
                  {schools.filter((s) => s.owner === "JOINT" || s.owner === "UNASSIGNED" || !s.owner).length} Schools
                </span>
              </div>
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {schools.filter((s) => s.owner === "JOINT" || s.owner === "UNASSIGNED" || !s.owner).slice(0, 30).map((s) => (
                  <div
                    key={s.id}
                    onClick={() => openSchoolDetail(s)}
                    className="p-2.5 rounded-xl border border-zinc-200 dark:border-[#20202c] bg-zinc-50 dark:bg-[#15151e] hover:border-purple-500/40 transition-colors cursor-pointer text-xs"
                  >
                    <div className="font-bold text-zinc-900 dark:text-white truncate">{s.name}</div>
                    <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-1">
                      <span>{s.area}</span>
                      <span className="font-semibold text-purple-500">{s.owner || "UNASSIGNED"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 3: ACCESS REQUESTS & COLLISION RESOLUTION (Section 2.3 & 13)
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "requests" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 dark:border-[#23232f] bg-white dark:bg-[#121217] p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-[#23232f] pb-3 mb-4">
              <div>
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[#990000]" />
                  <span>Executive Collision Prevention Queue</span>
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  If an executive wants to plan a visit to a school owned by another executive, permission must be requested and approved here.
                </p>
              </div>
              <span className="text-xs font-bold text-zinc-500">
                Total Requests: {accessRequests.length}
              </span>
            </div>

            {accessRequests.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-500 border border-dashed border-zinc-300 dark:border-[#2c2c3e] rounded-xl">
                No active access requests in queue. No executive collisions detected.
              </div>
            ) : (
              <div className="space-y-3">
                {accessRequests.map((req) => (
                  <div
                    key={req.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-zinc-200 dark:border-[#242432] bg-zinc-50 dark:bg-[#161620] text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-900 dark:text-white">
                          {req.schools?.name || "Target School"}
                        </span>
                        <span
                          className={`rounded px-2 py-0.2 text-[10px] font-bold ${
                            req.status === "approved"
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                              : req.status === "rejected"
                              ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                              : "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {req.status?.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-zinc-600 dark:text-zinc-400">
                        <strong>{req.requester_name}</strong> requested access to school owned by <strong>{req.owner_name}</strong>.
                      </p>
                      <div className="text-[11px] text-zinc-500 italic bg-white dark:bg-[#101015] p-2 rounded-lg border border-zinc-200 dark:border-[#22222d]">
                        Reason: "{req.reason}"
                      </div>
                    </div>

                    {req.status === "pending" && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleRequestDecision(req.id, "approved")}
                          className="rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1.5 text-xs font-bold text-white transition-colors shadow-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRequestDecision(req.id, "rejected")}
                          className="rounded-lg bg-zinc-200 dark:bg-[#20202c] hover:bg-rose-600 hover:text-white px-3 py-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SECTION 5: COMPLETE SCHOOL PROFILE DRAWER
      ───────────────────────────────────────────────────────────── */}
      {activeSchool && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm p-0">
          <div className="h-full w-full max-w-xl bg-white dark:bg-[#111116] border-l border-zinc-200 dark:border-[#272736] p-6 text-zinc-900 dark:text-white overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-[#23232f] pb-4 mb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#990000] dark:text-[#ff8080]">
                      {activeSchool.school_code}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        activeSchool.owner === "MANIKANDAN"
                          ? "bg-rose-500/15 text-[#990000] dark:text-[#ff8080]"
                          : "bg-blue-500/15 text-blue-600 dark:text-blue-300"
                      }`}
                    >
                      Owner: {activeSchool.owner || "MANIKANDAN"}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-zinc-900 dark:text-white mt-1">
                    {activeSchool.name}
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {activeSchool.area || "Chennai"} • {activeSchool.board || "State Board"} • Class 12 Strength: {activeSchool.student_strength || "—"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditSchoolOpen(true)}
                    className="rounded-lg border border-zinc-300 dark:border-[#272736] bg-zinc-50 dark:bg-[#181822] px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setActiveSchool(null)}
                    className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#20202c] hover:text-black dark:hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Collision / Locking Warning (Section 2.3) */}
              {isLockedForCurrentExecutive(activeSchool) && (
                <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-[#271015] border border-rose-300 dark:border-rose-900/60 text-xs text-rose-900 dark:text-rose-200 flex items-start gap-2.5 shadow-sm">
                  <Lock className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold block">Assigned to {activeSchool.owner}</strong>
                    <span>You cannot plan visits to this school without requesting access first to avoid double-visiting.</span>
                    <button
                      onClick={() => {
                        setRequestTargetSchool(activeSchool);
                        setIsRequestModalOpen(true);
                      }}
                      className="mt-2 block rounded-lg bg-[#990000] hover:bg-[#b91c1c] text-white px-3 py-1 text-[11px] font-bold transition-all shadow-sm"
                    >
                      Request Visit Access →
                    </button>
                  </div>
                </div>
              )}

              {/* School Structured Sections (Section 5) */}
              {/* 1. CURRENT ACTION */}
              <div className="mb-4 rounded-xl bg-rose-50/50 dark:bg-[#1c1215] p-3.5 border border-rose-200 dark:border-[#381e24]">
                <span className="text-[10px] uppercase font-bold text-[#990000] dark:text-[#ff8080] block mb-1">
                  CURRENT ACTION
                </span>
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-zinc-900 dark:text-white">
                    {activeSchool.next_action || "Follow-up Visit"}
                  </div>
                  <div className="font-mono text-xs font-bold text-[#990000] dark:text-[#ff8080]">
                    {activeSchool.next_action_date || "Pending schedule"}
                  </div>
                </div>
                {activeSchool.next_action_note && (
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 italic">
                    "{activeSchool.next_action_note}"
                  </p>
                )}
              </div>

              {/* 2. CONTACT */}
              <div className="mb-4 rounded-xl bg-zinc-50 dark:bg-[#181822] p-3.5 border border-zinc-200 dark:border-[#23232f]">
                <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">CONTACT</span>
                <div className="text-xs font-bold text-zinc-900 dark:text-white">
                  {activeSchool.contact_person || "Principal / Staff"}
                </div>
                <div className="text-[11px] text-zinc-500">{activeSchool.designation || "Principal"}</div>
                <div className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                  {activeSchool.phone || "No phone on record"}
                </div>
              </div>

              {/* 3. ORIENTATION & APPOINTMENT STATUS */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="rounded-xl bg-zinc-50 dark:bg-[#181822] p-3 border border-zinc-200 dark:border-[#23232f]">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">ORIENTATION</span>
                  <div className="text-xs font-bold text-zinc-900 dark:text-white">
                    {activeSchool.orientation_status || "Not Discussed"}
                  </div>
                  <div className="text-[11px] text-purple-600 dark:text-purple-400 mt-0.5">
                    {activeSchool.orientation_date ? `Date: ${activeSchool.orientation_date}` : "Date Pending"}
                  </div>
                </div>

                <div className="rounded-xl bg-zinc-50 dark:bg-[#181822] p-3 border border-zinc-200 dark:border-[#23232f]">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">LEAD STATUS</span>
                  <div className="text-xs font-bold text-zinc-900 dark:text-white">
                    {activeSchool.lead_status || "WARM"}
                  </div>
                  <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-0.5">
                    Priority: {activeSchool.priority || "Normal"}
                  </div>
                </div>
              </div>

              {/* Action Buttons (Section 5 Specification: CALL, WHATSAPP, MAP, PLAN VISIT, LOG VISIT) */}
              {(() => {
                const cleanPhone = (activeSchool.phone || "").replace(/[^0-9]/g, "");
                const mapQuery = encodeURIComponent(`${activeSchool.name} ${activeSchool.address || activeSchool.area || "Chennai"}`);
                const mapUrl = activeSchool.maps_url || `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
                const isLocked = isLockedForCurrentExecutive(activeSchool);

                return (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
                    {cleanPhone ? (
                      <a
                        href={`tel:${cleanPhone}`}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/20 py-2.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition-colors"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        <span>CALL</span>
                      </a>
                    ) : (
                      <button disabled className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 py-2.5 text-xs text-zinc-400 cursor-not-allowed">
                        NO CALL
                      </button>
                    )}

                    {cleanPhone ? (
                      <a
                        href={`https://wa.me/91${cleanPhone.slice(-10)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/20 py-2.5 text-xs font-bold text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 transition-colors"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>WHATSAPP</span>
                      </a>
                    ) : (
                      <button disabled className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 py-2.5 text-xs text-zinc-400 cursor-not-allowed">
                        NO WA
                      </button>
                    )}

                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-300 dark:border-[#272736] bg-zinc-50 dark:bg-[#181824] py-2.5 text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:text-black dark:hover:text-white transition-colors"
                    >
                      <Navigation className="h-3.5 w-3.5 text-[#990000] dark:text-[#ff8080]" />
                      <span>MAP</span>
                    </a>

                    {isLocked ? (
                      <button
                        onClick={() => {
                          setRequestTargetSchool(activeSchool);
                          setIsRequestModalOpen(true);
                        }}
                        className="flex items-center justify-center gap-1 rounded-xl border border-amber-500/40 bg-amber-500/15 py-2.5 text-xs font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-500/25 transition-colors"
                        title="Locked by other executive"
                      >
                        <Lock className="h-3.5 w-3.5" />
                        <span>REQUEST</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsPlanVisitOpen(true)}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-[#990000]/40 bg-[#990000]/15 py-2.5 text-xs font-bold text-[#990000] dark:text-[#ff8080] hover:bg-[#990000]/30 transition-colors"
                      >
                        <CalendarPlus className="h-3.5 w-3.5" />
                        <span>PLAN</span>
                      </button>
                    )}

                    <button
                      onClick={() => setIsStartVisitOpen(true)}
                      className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#990000] hover:bg-[#b91c1c] py-2.5 text-xs font-black text-white shadow-md shadow-[#990000]/30 transition-colors"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>LOG VISIT</span>
                    </button>
                  </div>
                );
              })()}

              {/* Historical Visit Log */}
              <div className="flex-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3 flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-[#990000]" />
                  <span>Visit History ({schoolVisits.length} visits recorded)</span>
                </h3>

                {schoolVisits.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-zinc-300 dark:border-[#2b2b3b] p-6 text-center text-xs text-zinc-500">
                    No field visits logged for this school yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {schoolVisits.map((v) => (
                      <div
                        key={v.id}
                        className="rounded-xl border border-zinc-200 dark:border-[#23232f] bg-zinc-50 dark:bg-[#161620] p-3.5 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-[#990000] dark:text-[#ff8080]">{v.visit_date}</span>
                          <span className="font-bold text-zinc-700 dark:text-zinc-300">{v.created_by || "Manikandan"}</span>
                        </div>
                        <div className="font-semibold text-zinc-900 dark:text-white">
                          Met: {v.person_met} ({v.designation || "Principal"})
                        </div>
                        <div className="text-emerald-600 dark:text-emerald-400 font-bold">Outcome: {v.outcome}</div>
                        {v.next_action && (
                          <div className="text-zinc-600 dark:text-zinc-400">
                            Next Action: <strong>{v.next_action}</strong> {v.next_action_date && `(${v.next_action_date})`}
                          </div>
                        )}
                        {v.remarks && (
                          <div className="text-zinc-500 italic text-[11px] pt-1 border-t border-zinc-200 dark:border-[#242434]">
                            "{v.remarks}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Request Access Modal (Collision Prevention Modal) */}
      {isRequestModalOpen && requestTargetSchool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 dark:border-[#2e2e3d] bg-white dark:bg-[#121217] p-6 text-zinc-900 dark:text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-[#242432] pb-3 mb-4">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                <Lock className="h-4 w-4 text-[#990000]" />
                <span>Request Visit Access</span>
              </h3>
              <button onClick={() => setIsRequestModalOpen(false)} className="text-zinc-400 hover:text-black dark:hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3">
              <strong>{requestTargetSchool.name}</strong> is currently assigned to <strong>{requestTargetSchool.owner}</strong>. Explain why you need to visit this school to obtain approval.
            </p>

            <form onSubmit={handleRequestAccessSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Reason for visit access *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Principal requested morning orientation slot while Manikandan is visiting Anna Nagar."
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-[#2e2e3e] bg-zinc-50 dark:bg-[#181822] p-2.5 text-zinc-900 dark:text-white focus:border-[#990000] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-zinc-500 hover:text-black dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={requestSubmitting}
                  className="rounded-xl bg-[#990000] hover:bg-[#b91c1c] px-4 py-2 text-xs font-bold text-white shadow-md shadow-[#990000]/30 transition-all disabled:opacity-50"
                >
                  {requestSubmitting ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add School Modal */}
      <AddSchoolModal
        isOpen={isAddSchoolOpen}
        onClose={() => setIsAddSchoolOpen(false)}
        onSuccess={loadSchoolsAndRequests}
      />

      {/* Edit School Modal */}
      <EditSchoolModal
        isOpen={isEditSchoolOpen}
        onClose={() => setIsEditSchoolOpen(false)}
        school={activeSchool}
        onSuccess={() => {
          loadSchoolsAndRequests();
          if (activeSchool) {
            openSchoolDetail(activeSchool);
          }
        }}
      />

      {/* Start Visit Modal */}
      <StartVisitModal
        isOpen={isStartVisitOpen}
        onClose={() => setIsStartVisitOpen(false)}
        preselectedSchool={activeSchool}
        allSchools={schools}
        onSuccess={() => {
          loadSchoolsAndRequests();
          if (activeSchool) {
            openSchoolDetail(activeSchool);
          }
        }}
      />

      {/* Add Plan Modal */}
      <AddPlanModal
        isOpen={isPlanVisitOpen}
        onClose={() => setIsPlanVisitOpen(false)}
        schools={schools}
      />
    </div>
  );
}
