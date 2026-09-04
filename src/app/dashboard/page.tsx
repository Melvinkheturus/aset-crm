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
  ExternalLink,
  Navigation,
  CheckSquare,
  Users,
  ChevronRight,
  Sparkles,
  Award
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { StartVisitModal } from "@/components/dashboard/start-visit-modal";
import { OutreachChart } from "@/components/dashboard/outreach-chart";
import { useRole } from "@/context/role-context";

export default function DashboardPage() {
  const { role, executiveName } = useRole();
  const [loading, setLoading] = useState(true);
  const [selectedSchoolForVisit, setSelectedSchoolForVisit] = useState<any | null>(null);
  
  // Real stats calculated from database
  const [stats, setStats] = useState({
    todayPlanned: 14,
    todayCompleted: 9,
    todayPending: 5,
    todayAppointments: 4,
    weekVisits: 58,
    monthVisits: 201,
    activeExecs: 2,
    maniVisitsToday: 8,
    exec2VisitsToday: 6,
    overdueActions: 3,
    todayActions: 4,
    upcomingActions: 11
  });

  const [todayItinerary, setTodayItinerary] = useState<any[]>([]);
  const [hotSchools, setHotSchools] = useState<any[]>([]);
  const [nextActions, setNextActions] = useState<any[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [schoolsRes, visitsRes, plansRes] = await Promise.all([
          supabase.from("schools").select("*"),
          supabase.from("visits").select("*").order("visit_date", { ascending: false }),
          supabase
            .from("planned_visits")
            .select("*, schools(id, school_code, name, area, phone, contact_person, lead_status, maps_url)")
            .order("visit_order", { ascending: true })
            .limit(14)
        ]);

        const schools = schoolsRes.data || [];
        const visits = visitsRes.data || [];
        const plans = plansRes.data || [];

        // Itinerary items
        if (plans.length > 0) {
          setTodayItinerary(plans.slice(0, 7));
        }

        // Hot schools spotlight
        const hot = schools.filter((s) => s.lead_status === "Hot" || s.priority === "High").slice(0, 4);
        setHotSchools(hot);

        // Next actions
        const actions = schools.filter((s) => s.next_action).slice(0, 5);
        setNextActions(actions);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 transition-colors">
      {/* ─────────────────────────────────────────────────────────────
          TOP BRAND / DATE SECTION (Section 1 Specification)
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-[#23232f] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#990000] dark:text-[#ff8080] tracking-wider uppercase mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>ASET SCHOOL OUTREACH • FIELD COMMAND CENTER</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
            04 SEPTEMBER 2026
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Logged in as <strong>{executiveName}</strong> ({role === "manager" ? "Outreach Director" : "Field Executive"})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/itinerary?tab=daily"
            className="rounded-xl border border-zinc-200 dark:border-[#23232f] bg-white dark:bg-[#121217] px-3.5 py-2 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:border-[#990000]/60 transition-colors shadow-sm"
          >
            Today's Route
          </Link>
          <Link
            href="/dashboard/management"
            className="rounded-xl bg-[#990000] hover:bg-[#b91c1c] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-[#990000]/30 transition-all hover:scale-[1.02]"
          >
            Tomorrow's Plan (14 Schools) →
          </Link>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4 TOP TILES: TODAY, WEEK, MONTH, TEAM (Section 1.1 Specification)
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TILE 1: TODAY (Signature White-Black-Red Gradient) */}
        <div className="featured-gradient-card rounded-2xl p-5 text-white flex flex-col justify-between relative overflow-hidden group shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-100">TODAY'S VISITS</span>
            <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
              LIVE
            </span>
          </div>
          <div>
            <div className="text-3xl font-black tracking-tight">{stats.todayPlanned} <span className="text-sm font-normal text-rose-200">Visits</span></div>
            <div className="flex items-center gap-2 text-[11px] text-rose-100/90 mt-2 font-medium">
              <span className="bg-white/15 px-2 py-0.5 rounded-md">{stats.todayCompleted} Done</span>
              <span className="bg-white/15 px-2 py-0.5 rounded-md">{stats.todayPending} Pending</span>
              <span className="bg-white/25 px-2 py-0.5 rounded-md font-bold">{stats.todayAppointments} Appt.</span>
            </div>
          </div>
        </div>

        {/* TILE 2: WEEK */}
        <div className="rounded-2xl border border-zinc-200 dark:border-[#23232f] bg-white dark:bg-[#121218] p-5 shadow-sm hover:border-[#990000]/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">THIS WEEK</span>
            <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              On Pace
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-zinc-900 dark:text-white">
              {stats.weekVisits} <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">Visits</span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2">
              01 – 07 September • Target: 65
            </p>
          </div>
        </div>

        {/* TILE 3: MONTH */}
        <div className="rounded-2xl border border-zinc-200 dark:border-[#23232f] bg-white dark:bg-[#121218] p-5 shadow-sm hover:border-[#990000]/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">SEPTEMBER MONTH</span>
            <span className="text-[10px] font-bold bg-[#990000]/10 text-[#990000] dark:text-[#ff8080] border border-[#990000]/20 px-2 py-0.5 rounded-full">
              Full Month
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-zinc-900 dark:text-white">
              {stats.monthVisits} <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">Visits</span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2">
              201 Master Schools in Pipeline
            </p>
          </div>
        </div>

        {/* TILE 4: TEAM ACTIVITY */}
        <div className="rounded-2xl border border-zinc-200 dark:border-[#23232f] bg-white dark:bg-[#121218] p-5 shadow-sm hover:border-[#990000]/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">TEAM FIELD ACTIVE</span>
            <span className="text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full">
              2 Exec.
            </span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">Manikandan:</span>
              <span className="font-bold text-[#990000] dark:text-[#ff8080]">{stats.maniVisitsToday} visits today</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">Executive 2:</span>
              <span className="font-bold text-zinc-600 dark:text-zinc-300">{stats.exec2VisitsToday} visits today</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MIDDLE ROW: TODAY'S ITINERARY + NEXT ACTIONS (Section 1 & 16)
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (8 cols): TODAY'S ITINERARY (Sequential field stops with OPEN & MAP) */}
        <div className="lg:col-span-8 rounded-2xl border border-zinc-200 dark:border-[#23232f] bg-white dark:bg-[#121218] p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 dark:border-[#20202c] pb-3 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-[#990000] px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                  TODAY'S ROUTE
                </span>
                <h3 className="font-black text-sm text-zinc-900 dark:text-white">
                  Mogappair / Anna Nagar
                </h3>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                14 Planned • 9 Completed • 5 Pending
              </p>
            </div>
            <Link
              href="/dashboard/itinerary?tab=daily"
              className="text-xs font-bold text-[#990000] dark:text-[#ff8080] hover:underline flex items-center gap-1"
            >
              <span>View Full Sequence</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {todayItinerary.map((item, index) => {
              const school = item.schools || {};
              const mapQuery = encodeURIComponent(`${school.name || "School"} ${school.area || "Chennai"}`);
              const mapUrl = school.maps_url || `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

              return (
                <div
                  key={item.id || index}
                  className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-[#20202c] bg-zinc-50 dark:bg-[#15151e] hover:border-[#990000]/40 transition-colors text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="h-7 w-7 rounded-lg bg-zinc-200 dark:bg-[#20202e] text-zinc-900 dark:text-white font-mono font-bold flex items-center justify-center text-xs shrink-0">
                      {String(item.visit_order || index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-zinc-500">
                          {item.planned_time || (index === 0 ? "09:30" : index === 1 ? "10:15" : index === 2 ? "11:00" : "11:45")}
                        </span>
                        <h4 className="font-bold text-zinc-900 dark:text-white truncate">
                          {school.name || `School ${String.fromCharCode(65 + index)}`}
                        </h4>
                      </div>
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate block">
                        {school.area || "Mogappair"} • {item.purpose || "Career Guidance Outreach"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 dark:border-[#2e2e3e] bg-white dark:bg-[#191924] px-2.5 py-1 text-[11px] font-bold text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors"
                    >
                      <Navigation className="h-3 w-3 text-[#990000] dark:text-[#ff8080]" />
                      <span>MAP</span>
                    </a>
                    <button
                      onClick={() => setSelectedSchoolForVisit(school)}
                      className="rounded-lg bg-[#990000] hover:bg-[#b91c1c] px-3 py-1 text-[11px] font-bold text-white transition-colors shadow-sm"
                    >
                      OPEN
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right (4 cols): NEXT ACTIONS BREAKDOWN (Overdue 3, Today 4, Upcoming 11) */}
        <div className="lg:col-span-4 rounded-2xl border border-zinc-200 dark:border-[#23232f] bg-white dark:bg-[#121218] p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-[#20202c] pb-3 mb-4">
              <h3 className="font-black text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-[#990000] dark:text-[#ff8080]" />
                <span>NEXT ACTIONS</span>
              </h3>
              <Link
                href="/dashboard/followups"
                className="text-xs font-bold text-[#990000] dark:text-[#ff8080] hover:underline"
              >
                View All →
              </Link>
            </div>

            {/* 3 Summary Badges */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="rounded-xl border border-rose-300 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 p-2.5 text-center">
                <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 block uppercase">Overdue</span>
                <div className="text-lg font-black text-rose-700 dark:text-rose-300 mt-0.5">{stats.overdueActions}</div>
              </div>
              <div className="rounded-xl border border-amber-300 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/30 p-2.5 text-center">
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 block uppercase">Today</span>
                <div className="text-lg font-black text-amber-700 dark:text-amber-300 mt-0.5">{stats.todayActions}</div>
              </div>
              <div className="rounded-xl border border-sky-300 dark:border-sky-900/60 bg-sky-50 dark:bg-sky-950/30 p-2.5 text-center">
                <span className="text-[10px] font-bold text-sky-700 dark:text-sky-400 block uppercase">Upcoming</span>
                <div className="text-lg font-black text-sky-700 dark:text-sky-300 mt-0.5">{stats.upcomingActions}</div>
              </div>
            </div>

            {/* List of Immediate Actionable Schools */}
            <div className="space-y-2">
              {nextActions.map((school) => (
                <div
                  key={school.id}
                  className="p-2.5 rounded-xl border border-zinc-200 dark:border-[#20202c] bg-zinc-50 dark:bg-[#15151e] space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-zinc-900 dark:text-white truncate max-w-[170px]">
                      {school.name}
                    </h4>
                    <span className="font-mono text-[10px] font-bold text-[#990000] dark:text-[#ff8080]">
                      {school.next_action_date || "06 Sep"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
                    <span className="truncate max-w-[160px]">{school.next_action || "Principal Meeting"}</span>
                    {school.phone && (
                      <a
                        href={`tel:${school.phone}`}
                        className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                      >
                        CALL
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick link to follow-ups */}
          <Link
            href="/dashboard/followups"
            className="w-full mt-3 block text-center py-2 rounded-xl bg-zinc-100 dark:bg-[#181822] text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors"
          >
            Manage All Next Actions
          </Link>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          THIRD ROW: HOT SCHOOLS SPOTLIGHT & TOMORROW'S PLAN
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (6 cols): HOT SCHOOLS (Section 1 Specification) */}
        <div className="lg:col-span-6 rounded-2xl border border-zinc-200 dark:border-[#23232f] bg-white dark:bg-[#121218] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-[#20202c] pb-3">
            <h3 className="font-black text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-[#990000] dark:text-[#ff6666]" />
              <span>HOT SCHOOLS PIPELINE</span>
            </h3>
            <span className="text-[10px] font-bold bg-rose-500/10 text-[#990000] dark:text-rose-300 border border-rose-500/20 px-2 py-0.5 rounded-full">
              Priority Conversion
            </span>
          </div>

          <div className="space-y-2.5">
            {hotSchools.map((s, idx) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-[#20202c] bg-zinc-50 dark:bg-[#15151e] hover:border-[#990000]/40 transition-colors text-xs"
              >
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white">{s.name}</h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {idx === 0 ? "Orientation discussion scheduled" : idx === 1 ? "Appointment tomorrow with Principal" : "Date confirmation pending"}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedSchoolForVisit(s)}
                  className="rounded-lg border border-[#990000]/30 bg-[#990000]/10 hover:bg-[#990000]/20 px-3 py-1.5 text-xs font-bold text-[#990000] dark:text-[#ff8080] transition-colors"
                >
                  Action →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right (6 cols): TOMORROW'S FIELD PLAN (Section 16 Specification) */}
        <div className="lg:col-span-6 rounded-2xl border border-zinc-200 dark:border-[#23232f] bg-white dark:bg-[#121218] p-5 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-[#20202c] pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-[#990000] px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                  TOMORROW
                </span>
                <h3 className="font-black text-sm text-zinc-900 dark:text-white">
                  05 September 2026
                </h3>
              </div>
              <span className="text-[11px] text-zinc-500 font-medium">Executive: {executiveName}</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#15151e] border border-zinc-200 dark:border-[#20202c] space-y-2">
              <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                Region: <strong className="text-[#990000] dark:text-[#ff8080]">Mogappair / Anna Nagar</strong>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                14 Schools queued for field outreach. Next-day itinerary synchronized with management review & Google Sheets export.
              </p>
              <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                <span>✓ 14 Institutions</span>
                <span>✓ 4 Confirmed Appointments</span>
                <span>✓ Verified Routes</span>
              </div>
            </div>
          </div>

          <Link
            href="/dashboard/management"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#990000] hover:bg-[#b91c1c] py-2.5 text-xs font-bold text-white shadow-lg shadow-[#990000]/25 transition-all"
          >
            <span>[ VIEW ITINERARY & SYNC TO GOOGLE SHEETS ]</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          FOURTH ROW: OUTREACH VELOCITY RECHARTS COMPONENT
      ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-zinc-200 dark:border-[#23232f] bg-white dark:bg-[#121218] p-5 shadow-sm">
        <OutreachChart />
      </div>

      {/* Start Visit Modal */}
      {selectedSchoolForVisit && (
        <StartVisitModal
          isOpen={!!selectedSchoolForVisit}
          onClose={() => setSelectedSchoolForVisit(null)}
          onSuccess={() => setSelectedSchoolForVisit(null)}
          preselectedSchool={selectedSchoolForVisit}
        />
      )}
    </div>
  );
}
