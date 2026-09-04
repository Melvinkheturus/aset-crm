"use client";

import { useState, useEffect } from "react";
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
  CalendarPlus
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AddSchoolModal } from "@/components/schools/add-school-modal";
import { EditSchoolModal } from "@/components/schools/edit-school-modal";
import { StartVisitModal } from "@/components/dashboard/start-visit-modal";
import { AddPlanModal } from "@/components/plans/add-plan-modal";

export default function SchoolsMasterPage() {
  const [schools, setSchools] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedArea, setSelectedArea] = useState("ALL");
  const [activeSchool, setActiveSchool] = useState<any | null>(null);
  const [schoolVisits, setSchoolVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddSchoolOpen, setIsAddSchoolOpen] = useState(false);
  const [isEditSchoolOpen, setIsEditSchoolOpen] = useState(false);
  const [isStartVisitOpen, setIsStartVisitOpen] = useState(false);
  const [isPlanVisitOpen, setIsPlanVisitOpen] = useState(false);

  useEffect(() => {
    async function loadSchools() {
      const { data, error } = await supabase
        .from("schools")
        .select("*")
        .order("school_code", { ascending: true });

      if (data) {
        setSchools(data);
        setFiltered(data);
      }
      setLoading(false);
    }
    loadSchools();
  }, []);

  useEffect(() => {
    let list = [...schools];
    if (selectedStatus !== "ALL") {
      list = list.filter((s) => s.lead_status === selectedStatus);
    }
    if (selectedArea !== "ALL") {
      list = list.filter((s) => s.area?.toLowerCase().includes(selectedArea.toLowerCase()));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name?.toLowerCase().includes(q) ||
          s.school_code?.toLowerCase().includes(q) ||
          s.area?.toLowerCase().includes(q) ||
          s.contact_person?.toLowerCase().includes(q) ||
          s.phone?.toLowerCase().includes(q)
      );
    }
    setFiltered(list);
  }, [search, selectedStatus, selectedArea, schools]);

  const openSchoolDetail = async (school: any) => {
    setActiveSchool(school);
    const { data } = await supabase
      .from("visits")
      .select("*")
      .eq("school_id", school.id)
      .order("visit_date", { ascending: false });
    setSchoolVisits(data || []);
  };

  // Distinct areas for filter dropdown
  const areas = Array.from(new Set(schools.map((s) => s.area).filter(Boolean))).slice(0, 15);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#23232f] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#ff6666] tracking-wider uppercase mb-1">
            <School className="h-4 w-4" />
            02_SCHOOL_MASTER
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Master School Database
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Permanent record of {schools.length} verified educational institutions in Greater Chennai
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-[#23232f] bg-[#121217] px-3.5 py-2 text-xs font-semibold text-zinc-300">
            Total Active Records: <strong className="text-white">{filtered.length}</strong>
          </div>
          <button
            onClick={() => setIsAddSchoolOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-[#990000] hover:bg-[#b91c1c] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-[#990000]/30 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>+ Add School</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#23232f] bg-[#121217] p-3.5">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by school name, ID, contact, or area..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[#272736] bg-[#181822] py-2 pl-9 pr-4 text-xs text-zinc-100 placeholder-zinc-500 focus:border-[#990000] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-[#272736] bg-[#181822] px-3 py-2 text-xs text-zinc-200 focus:border-[#990000] focus:outline-none"
          >
            <option value="ALL">All Lead Statuses</option>
            <option value="Hot">🔥 Hot ({schools.filter((s) => s.lead_status === "Hot").length})</option>
            <option value="Warm">⚡ Warm ({schools.filter((s) => s.lead_status === "Warm").length})</option>
            <option value="Cold">❄️ Cold ({schools.filter((s) => s.lead_status === "Cold").length})</option>
            <option value="CONDUCTED">🏆 Conducted ({schools.filter((s) => s.lead_status === "CONDUCTED").length})</option>
          </select>

          {/* Area Filter */}
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="rounded-xl border border-[#272736] bg-[#181822] px-3 py-2 text-xs text-zinc-200 focus:border-[#990000] focus:outline-none max-w-[170px]"
          >
            <option value="ALL">All Areas</option>
            {areas.map((a: any) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Schools Table Grid */}
      <div className="rounded-2xl border border-[#23232f] bg-[#121217] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#23232f] bg-[#171720] text-zinc-400 font-semibold">
              <tr>
                <th className="py-3.5 px-4">School ID</th>
                <th className="py-3.5 px-4 min-w-[220px]">Institution Name</th>
                <th className="py-3.5 px-4">Area</th>
                <th className="py-3.5 px-4">Strength</th>
                <th className="py-3.5 px-4 min-w-[170px]">Contact Person</th>
                <th className="py-3.5 px-4">Program</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 min-w-[170px]">Next Action & Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#20202c] text-zinc-300">
              {filtered.slice(0, 50).map((school) => (
                <tr
                  key={school.id}
                  onClick={() => openSchoolDetail(school)}
                  className="hover:bg-[#181824] transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-[#ff8080]">
                    {school.school_code}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-white group-hover:text-[#ff9999] transition-colors">
                    {school.name}
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400">
                    {school.area || "Chennai"}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-zinc-300">
                    {school.student_strength ? `${school.student_strength}` : "—"}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-zinc-200">{school.contact_person || "Staff"}</div>
                    <div className="text-[10px] text-zinc-500">{school.phone || "No phone"}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="rounded bg-[#20202d] px-2 py-0.5 text-[10px] text-zinc-300">
                      {school.program || "Career Guidance"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        school.lead_status === "Hot"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : school.lead_status === "Warm"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : school.lead_status === "CONDUCTED"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {school.lead_status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-zinc-200">{school.next_action || "Follow-up Call"}</div>
                    <div className="text-[10px] text-[#ff8080]">
                      {school.next_action_date || "Pending schedule"}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <ChevronRight className="h-4 w-4 text-zinc-500 group-hover:text-white transition-colors inline" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-[#23232f] p-3 text-center text-xs text-zinc-500">
          Showing {Math.min(50, filtered.length)} of {filtered.length} institutions • Click any row for complete visit history
        </div>
      </div>

      {/* School Detail Slideover Modal */}
      {activeSchool && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm">
          <div className="h-full w-full max-w-xl bg-[#121217] border-l border-[#272736] p-6 text-white overflow-y-auto shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b border-[#23232f] pb-4 mb-5">
              <div>
                <span className="font-mono text-xs font-bold text-[#ff8080]">
                  {activeSchool.school_code}
                </span>
                <h2 className="text-lg font-bold text-white mt-1">{activeSchool.name}</h2>
                <p className="text-xs text-zinc-400">{activeSchool.address || activeSchool.area}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditSchoolOpen(true)}
                  className="rounded-lg border border-[#272736] bg-[#181822] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
                >
                  Edit School
                </button>
                <button
                  onClick={() => setActiveSchool(null)}
                  className="rounded-lg p-2 text-zinc-400 hover:bg-[#20202c] hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* School Attributes Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="rounded-xl bg-[#181822] p-3 border border-[#23232f]">
                <span className="text-[10px] uppercase text-zinc-500 font-semibold">Contact Person</span>
                <div className="text-xs font-semibold text-white mt-1">
                  {activeSchool.contact_person || "Not Recorded"}
                </div>
                <div className="text-[11px] text-zinc-400">{activeSchool.designation || "Staff"}</div>
              </div>

              <div className="rounded-xl bg-[#181822] p-3 border border-[#23232f]">
                <span className="text-[10px] uppercase text-zinc-500 font-semibold">Phone Contact</span>
                <div className="text-xs font-semibold text-white mt-1">
                  {activeSchool.phone || "No phone on file"}
                </div>
                <div className="text-[11px] text-emerald-400">Direct Outreach Line</div>
              </div>

              <div className="rounded-xl bg-[#181822] p-3 border border-[#23232f]">
                <span className="text-[10px] uppercase text-zinc-500 font-semibold">Lead Status & Priority</span>
                <div className="text-xs font-semibold text-white mt-1 flex items-center gap-2">
                  <span>{activeSchool.lead_status}</span>
                  <span className="text-[10px] text-[#ff8080] font-normal">({activeSchool.priority} Priority)</span>
                </div>
              </div>

              <div className="rounded-xl bg-[#181822] p-3 border border-[#23232f]">
                <span className="text-[10px] uppercase text-zinc-500 font-semibold">Next Action</span>
                <div className="text-xs font-semibold text-[#ff8080] mt-1">
                  {activeSchool.next_action || "Follow-up Call"}
                </div>
                <div className="text-[11px] text-zinc-400">{activeSchool.next_action_date || "Date Pending"}</div>
              </div>
            </div>

            {/* Quick Action Buttons (Call, WhatsApp, Map, Plan Visit, Record Visit) */}
            {(() => {
              const cleanPhone = (activeSchool.phone || "").replace(/[^0-9]/g, "");
              const mapQuery = encodeURIComponent(`${activeSchool.name} ${activeSchool.address || activeSchool.area || "Chennai"}`);
              const mapUrl = activeSchool.maps_url || `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

              return (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
                  {cleanPhone ? (
                    <a
                      href={`tel:${cleanPhone}`}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 py-2.5 text-xs font-bold text-emerald-400 hover:bg-emerald-900/30 transition-colors"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>CALL</span>
                    </a>
                  ) : (
                    <button disabled className="rounded-xl border border-zinc-800 bg-zinc-900 py-2.5 text-xs text-zinc-600 cursor-not-allowed">
                      NO PHONE
                    </button>
                  )}

                  {cleanPhone ? (
                    <a
                      href={`https://wa.me/91${cleanPhone.slice(-10)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 py-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-900/30 transition-colors"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>WHATSAPP</span>
                    </a>
                  ) : (
                    <button disabled className="rounded-xl border border-zinc-800 bg-zinc-900 py-2.5 text-xs text-zinc-600 cursor-not-allowed">
                      NO WA
                    </button>
                  )}

                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-[#272736] bg-[#181824] py-2.5 text-xs font-bold text-zinc-200 hover:text-white transition-colors"
                  >
                    <Navigation className="h-3.5 w-3.5 text-rose-400" />
                    <span>MAP</span>
                  </a>

                  <button
                    onClick={() => setIsPlanVisitOpen(true)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-[#990000]/40 bg-[#990000]/15 py-2.5 text-xs font-bold text-[#ff8080] hover:bg-[#990000]/30 transition-colors"
                  >
                    <CalendarPlus className="h-3.5 w-3.5" />
                    <span>PLAN</span>
                  </button>

                  <button
                    onClick={() => setIsStartVisitOpen(true)}
                    className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#990000] hover:bg-[#b91c1c] py-2.5 text-xs font-extrabold text-white shadow-md shadow-[#990000]/30 transition-colors"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>VISIT</span>
                  </button>
                </div>
              );
            })()}

            {/* Discussion Remarks */}
            {activeSchool.latest_remarks && (
              <div className="rounded-xl bg-[#181822] p-3.5 border border-[#23232f] mb-6">
                <span className="text-[10px] uppercase text-zinc-500 font-semibold">Latest Key Discussion</span>
                <p className="text-xs text-zinc-300 mt-1.5 leading-relaxed">
                  {activeSchool.latest_remarks}
                </p>
              </div>
            )}

            {/* Historical Visit Log */}
            <div className="flex-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-[#990000]" />
                Field Visit History ({schoolVisits.length} visits logged)
              </h3>

              {schoolVisits.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#2b2b3b] p-6 text-center text-xs text-zinc-500">
                  No previous visits recorded for this school yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {schoolVisits.map((v) => (
                    <div
                      key={v.id}
                      className="rounded-xl border border-[#23232f] bg-[#161620] p-3.5 text-xs"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono font-bold text-[#ff8080]">{v.visit_code}</span>
                        <span className="text-zinc-400 text-[11px]">{v.visit_date}</span>
                      </div>
                      <div className="font-semibold text-white">{v.visit_type} • Met {v.person_met}</div>
                      <div className="text-emerald-400 font-medium text-[11px] mt-0.5">Outcome: {v.outcome}</div>
                      <div className="text-zinc-400 text-[11px] mt-1 italic">"{v.remarks}"</div>
                      <div className="text-[10px] text-zinc-500 mt-2">Executive: {v.created_by}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add School Modal */}
      <AddSchoolModal
        isOpen={isAddSchoolOpen}
        onClose={() => setIsAddSchoolOpen(false)}
        onSuccess={async () => {
          const { data } = await supabase.from("schools").select("*").order("school_code", { ascending: true });
          if (data) {
            setSchools(data);
            setFiltered(data);
          }
        }}
      />

      {/* Edit School Modal */}
      <EditSchoolModal
        isOpen={isEditSchoolOpen}
        onClose={() => setIsEditSchoolOpen(false)}
        school={activeSchool}
        onSuccess={async () => {
          const { data } = await supabase.from("schools").select("*").order("school_code", { ascending: true });
          if (data) {
            setSchools(data);
            setFiltered(data);
            if (activeSchool) {
              const updated = data.find((s) => s.id === activeSchool.id);
              if (updated) setActiveSchool(updated);
            }
          }
        }}
      />

      {/* Fast Start Visit Modal */}
      <StartVisitModal
        isOpen={isStartVisitOpen}
        onClose={() => setIsStartVisitOpen(false)}
        preselectedSchool={activeSchool}
        allSchools={schools}
        onSuccess={async () => {
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
