"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  UserCheck,
  TrendingUp,
  School,
  ArrowRight,
  Flame,
  Award,
  Sparkles
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { StartVisitModal } from "@/components/dashboard/start-visit-modal";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [selectedSchoolForVisit, setSelectedSchoolForVisit] = useState<any | null>(null);
  const [stats, setStats] = useState<any>({
    totalSchools: 201,
    totalVisits: 211,
    hotLeads: 28,
    warmLeads: 85,
    coldLeads: 80,
    conducted: 8,
  });
  const [tomorrowItinerary, setTomorrowItinerary] = useState<any[]>([]);
  const [followups, setFollowups] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        // 1. Fetch counts
        const [schoolsRes, visitsRes, plansRes] = await Promise.all([
          supabase.from("schools").select("*"),
          supabase.from("visits").select("id", { count: "exact" }),
          supabase
            .from("planned_visits")
            .select("*, schools(school_code, name, area, phone, contact_person)")
            .order("visit_date", { ascending: true })
            .order("visit_order", { ascending: true, nullsFirst: false })
            .limit(10)
        ]);

        const schools = schoolsRes.data || [];
        const plans = plansRes.data || [];

        setStats({
          totalSchools: schools.length || 201,
          totalVisits: visitsRes.count || 211,
          hotLeads: schools.filter(s => s.lead_status === "Hot").length,
          warmLeads: schools.filter(s => s.lead_status === "Warm").length,
          coldLeads: schools.filter(s => s.lead_status === "Cold").length,
          conducted: schools.filter(s => s.lead_status === "CONDUCTED").length,
        });

        setTomorrowItinerary(plans.slice(0, 6));

        // Follow-ups due
        const dueSchools = schools.filter(s => s.next_action_date).slice(0, 6);
        setFollowups(dueSchools);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Executive Welcome & Date Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#23232f] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#ff6666] tracking-wider uppercase mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            Field Activity Dashboard
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            ASET School Outreach Engine
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time operations center linked with Supabase & Master Documentation
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-[#23232f] bg-[#121217] px-4 py-2 text-xs font-medium text-zinc-200">
            <Calendar className="h-4 w-4 text-[#990000]" />
            <span>TODAY: <strong>04 September 2026</strong></span>
          </div>
          <div className="rounded-xl border border-[#990000]/40 bg-[#990000]/15 px-3 py-2 text-xs font-bold text-[#ff8080]">
            Executive: Manikandan
          </div>
        </div>
      </div>

      {/* TODAY'S METRIC TILES */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
          Today's Field Execution
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <div className="rounded-2xl border border-[#23232f] bg-[#121217]/90 p-4 transition-all hover:border-[#990000]/40">
            <span className="text-[11px] font-medium text-zinc-400">Planned Visits</span>
            <div className="text-2xl font-bold text-white mt-1">14</div>
            <div className="text-[10px] text-zinc-500 mt-1">Assigned Route</div>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-4 transition-all hover:border-emerald-500/40">
            <span className="text-[11px] font-medium text-emerald-300">Completed</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">9</div>
            <div className="text-[10px] text-emerald-500/70 mt-1">64% of Target</div>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-950/20 p-4 transition-all hover:border-amber-500/40">
            <span className="text-[11px] font-medium text-amber-300">Pending</span>
            <div className="text-2xl font-bold text-amber-400 mt-1">5</div>
            <div className="text-[10px] text-amber-500/70 mt-1">Remaining Today</div>
          </div>

          <div className="rounded-2xl border border-rose-500/20 bg-rose-950/20 p-4 transition-all hover:border-rose-500/40">
            <span className="text-[11px] font-medium text-rose-300">Appointments</span>
            <div className="text-2xl font-bold text-rose-400 mt-1">4</div>
            <div className="text-[10px] text-rose-500/70 mt-1">Principal / Admin</div>
          </div>

          <div className="rounded-2xl border border-sky-500/20 bg-sky-950/20 p-4 transition-all hover:border-sky-500/40">
            <span className="text-[11px] font-medium text-sky-300">Follow-ups</span>
            <div className="text-2xl font-bold text-sky-400 mt-1">3</div>
            <div className="text-[10px] text-sky-500/70 mt-1">Re-engagement</div>
          </div>
        </div>
      </div>

      {/* TWO COLUMN WORKSPACE: TOMORROW'S PLAN + NEXT ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TOMORROW'S PLAN (2 Columns) */}
        <div className="lg:col-span-2 rounded-2xl border border-[#2e2e3d] bg-[#121217] p-5">
          <div className="flex items-center justify-between border-b border-[#23232f] pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-[#990000] px-2 py-0.5 text-[10px] font-bold text-white">
                  CRITICAL
                </span>
                <h3 className="text-base font-bold text-white">Tomorrow's Itinerary</h3>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                05 September 2026 • Area: <strong>Mogappair / Anna Nagar</strong>
              </p>
            </div>
            <Link
              href="/dashboard/management"
              className="flex items-center gap-1.5 text-xs font-semibold text-[#ff8080] hover:text-white transition-colors"
            >
              <span>Management View</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Quick stats ribbon */}
          <div className="grid grid-cols-3 gap-3 mb-4 p-3 rounded-xl bg-[#181822] border border-[#23232f] text-center">
            <div>
              <div className="text-lg font-bold text-white">14</div>
              <div className="text-[10px] text-zinc-400">Total Visits</div>
            </div>
            <div className="border-x border-[#2b2b3b]">
              <div className="text-lg font-bold text-[#ff6666]">6</div>
              <div className="text-[10px] text-zinc-400">Appointments</div>
            </div>
            <div>
              <div className="text-lg font-bold text-zinc-300">8</div>
              <div className="text-[10px] text-zinc-400">Follow-ups</div>
            </div>
          </div>

          {/* Route sequence list */}
          <div className="space-y-2.5">
            {tomorrowItinerary.map((item, idx) => {
              const mapQuery = encodeURIComponent(`${item.schools?.name || ""} ${item.schools?.area || "Chennai"}`);
              const mapUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

              return (
                <div
                  key={item.id || idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-[#23232f] bg-[#15151d] p-3 hover:border-[#990000]/30 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#990000]/20 text-[#ff8080] font-bold text-xs border border-[#990000]/40">
                      {item.visit_order || idx + 1}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">
                        {item.schools?.name || "Target Partner School"}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-zinc-500" />
                          {item.schools?.area || "Chennai"}
                        </span>
                        <span>•</span>
                        <span className="text-zinc-300">{item.purpose || "Principal Meeting"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span className="rounded-full bg-[#20202d] px-2 py-0.5 text-[10px] font-medium text-zinc-300">
                      {item.planned_time || `${String(9 + idx)}:30 AM`}
                    </span>

                    {/* MAP Button */}
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-[#272736] bg-[#181824] px-2.5 py-1 text-[11px] font-semibold text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors"
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
                      <span>START VISIT</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* NEXT ACTIONS & FOLLOW-UPS (1 Column) */}
        <div className="rounded-2xl border border-[#2e2e3d] bg-[#121217] p-5 flex flex-col">
          <div className="flex items-center justify-between border-b border-[#23232f] pb-4 mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Next Actions</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Scheduled calls & follow-ups</p>
            </div>
            <Link
              href="/dashboard/schools"
              className="text-xs font-medium text-[#ff8080] hover:text-white"
            >
              View all
            </Link>
          </div>

          {/* Action Pills */}
          <div className="grid grid-cols-3 gap-2 mb-4 text-center">
            <div className="rounded-lg bg-rose-950/30 border border-rose-500/20 py-2">
              <div className="text-sm font-bold text-rose-400">3</div>
              <div className="text-[10px] text-zinc-400">Overdue</div>
            </div>
            <div className="rounded-lg bg-amber-950/30 border border-amber-500/20 py-2">
              <div className="text-sm font-bold text-amber-400">4</div>
              <div className="text-[10px] text-zinc-400">Today</div>
            </div>
            <div className="rounded-lg bg-sky-950/30 border border-sky-500/20 py-2">
              <div className="text-sm font-bold text-sky-400">8</div>
              <div className="text-[10px] text-zinc-400">Upcoming</div>
            </div>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto">
            {followups.map((school, i) => (
              <div
                key={school.id || i}
                className="rounded-xl border border-[#23232f] bg-[#15151d] p-3 text-xs hover:border-[#990000]/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white truncate max-w-[170px]">
                    {school.name}
                  </span>
                  <span className="rounded bg-[#990000]/20 px-1.5 py-0.5 text-[10px] font-medium text-[#ff8080]">
                    {school.next_action_date || "05 Sep"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] mt-1">
                  <PhoneCall className="h-3 w-3 text-emerald-400" />
                  <span>{school.next_action || "Follow-up Call"}</span>
                </div>
                {school.contact_person && (
                  <div className="text-[10px] text-zinc-500 mt-1 truncate">
                    Attn: {school.contact_person} ({school.phone || "No phone"})
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CUMULATIVE CONVERSION PIPELINE (4 CARDS) */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
          Overall Outreach Pipeline (201 Master Schools)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-rose-500/20 bg-[#14141a] p-4.5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                <Flame className="h-4 w-4" />
                Hot Leads
              </span>
              <span className="text-xs text-zinc-400">Immediate</span>
            </div>
            <div className="text-3xl font-extrabold text-white mt-2">{stats.hotLeads}</div>
            <div className="text-xs text-zinc-400 mt-1">Principal meetings scheduled</div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-600 to-[#990000]" />
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-[#14141a] p-4.5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4" />
                Warm Leads
              </span>
              <span className="text-xs text-zinc-400">Nurturing</span>
            </div>
            <div className="text-3xl font-extrabold text-white mt-2">{stats.warmLeads}</div>
            <div className="text-xs text-zinc-400 mt-1">Career guidance pitched</div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-600" />
          </div>

          <div className="rounded-2xl border border-zinc-700/40 bg-[#14141a] p-4.5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
                <School className="h-4 w-4" />
                Cold / Untapped
              </span>
              <span className="text-xs text-zinc-400">Pipeline</span>
            </div>
            <div className="text-3xl font-extrabold text-white mt-2">{stats.coldLeads}</div>
            <div className="text-xs text-zinc-400 mt-1">Follow-up due Oct / Nov</div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-600" />
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-[#14141a] p-4.5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <Award className="h-4 w-4" />
                Orientations Won
              </span>
              <span className="text-xs text-zinc-400">Milestone</span>
            </div>
            <div className="text-3xl font-extrabold text-white mt-2">{stats.conducted}</div>
            <div className="text-xs text-zinc-400 mt-1">Programs conducted / confirmed</div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600" />
          </div>
        </div>
      </div>

      {/* Fast Start Visit Field Modal */}
      <StartVisitModal
        isOpen={!!selectedSchoolForVisit}
        onClose={() => setSelectedSchoolForVisit(null)}
        preselectedSchool={selectedSchoolForVisit}
      />
    </div>
  );
}
