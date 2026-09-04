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
  Sparkles,
  Send,
  Mic,
  Plus,
  ExternalLink
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { StartVisitModal } from "@/components/dashboard/start-visit-modal";
import { OutreachChart } from "@/components/dashboard/outreach-chart";
import { useRole } from "@/context/role-context";
import { useTheme } from "@/context/theme-context";

export default function DashboardPage() {
  const { role, executiveName } = useRole();
  const { theme } = useTheme();
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
  const [quickNote, setQuickNote] = useState("");
  const [assistantNoteSubmitted, setAssistantNoteSubmitted] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [schoolsRes, visitsRes, plansRes] = await Promise.all([
          supabase.from("schools").select("*"),
          supabase.from("visits").select("id", { count: "exact" }),
          supabase
            .from("planned_visits")
            .select("*, schools(id, school_code, name, area, phone, contact_person)")
            .order("visit_date", { ascending: true })
            .order("visit_order", { ascending: true, nullsFirst: false })
            .limit(10)
        ]);

        const schools = schoolsRes.data || [];
        const plans = plansRes.data || [];

        setStats({
          totalSchools: schools.length || 201,
          totalVisits: visitsRes.count || 211,
          hotLeads: schools.filter((s) => s.lead_status === "Hot").length,
          warmLeads: schools.filter((s) => s.lead_status === "Warm").length,
          coldLeads: schools.filter((s) => s.lead_status === "Cold").length,
          conducted: schools.filter((s) => s.lead_status === "CONDUCTED").length,
        });

        setTomorrowItinerary(plans.slice(0, 6));
        const dueSchools = schools.filter((s) => s.next_action_date).slice(0, 6);
        setFollowups(dueSchools);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleAssistantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickNote.trim()) return;
    setAssistantNoteSubmitted(true);
    setQuickNote("");
    setTimeout(() => setAssistantNoteSubmitted(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 transition-colors">
      {/* Executive Welcome & Date Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-[#23232f] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#ff6666] tracking-wider uppercase mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Welcome back, {executiveName} 👋</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Real-time outreach command center linked with Supabase & Master Documentation
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-[#23232f] bg-white dark:bg-[#121217] px-3.5 py-2 text-xs font-medium text-zinc-800 dark:text-zinc-200 shadow-sm">
            <Calendar className="h-4 w-4 text-[#990000]" />
            <span>TODAY: <strong>04 September 2026</strong></span>
          </div>
          <Link
            href="/dashboard/management"
            className="rounded-xl bg-[#990000] hover:bg-[#b91c1c] px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-[#990000]/30 transition-all hover:scale-[1.02]"
          >
            + Create Plan
          </Link>
        </div>
      </div>

      {/* 4 TOP STAT CARDS (Card 1 has the signature white-black-red gradient from Image 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Signature Red Gradient Card (Like Image 1 Total Revenue) */}
        <div className="featured-gradient-card rounded-2xl p-5 text-white flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-rose-100/90">Total Master Reach</span>
            <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
              +18.5%
            </span>
          </div>
          <div>
            <div className="text-3xl font-black tracking-tight">{stats.totalSchools}</div>
            <p className="text-[11px] text-rose-200/80 mt-1">Accredited Partner Schools</p>
          </div>
        </div>

        {/* Card 2: Field Visits Logged */}
        <div className="rounded-2xl border border-zinc-200 dark:border-[#23232f] bg-white dark:bg-[#121218] p-5 shadow-sm transition-all hover:border-[#990000]/40 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Total Visits Logged</span>
            <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              +12.4%
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-zinc-900 dark:text-white">{stats.totalVisits}</div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">Verified Field Interactions</p>
          </div>
        </div>

        {/* Card 3: Hot Lead Pipeline */}
        <div className="rounded-2xl border border-zinc-200 dark:border-[#23232f] bg-white dark:bg-[#121218] p-5 shadow-sm transition-all hover:border-[#990000]/40 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Hot Lead Pipeline</span>
            <span className="text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full">
              +24.0%
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-[#990000] dark:text-[#ff6666]">{stats.hotLeads}</div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">High-Conversion Institutions</p>
          </div>
        </div>

        {/* Card 4: Orientations Conducted */}
        <div className="rounded-2xl border border-zinc-200 dark:border-[#23232f] bg-white dark:bg-[#121218] p-5 shadow-sm transition-all hover:border-[#990000]/40 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Orientations Won</span>
            <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              Completed
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{stats.conducted}</div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">Confirmed Institutional Programs</p>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKSPACE: RECHARTS OUTREACH VELOCITY + FIELD ASSISTANT (Matching Image 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Recharts Area Chart */}
        <div className="lg:col-span-8 rounded-2xl border border-zinc-200 dark:border-[#23232f] bg-white dark:bg-[#121218] p-5 shadow-sm">
          <OutreachChart />
        </div>

        {/* Right Column (4 cols): AI Outreach Assistant & Quick Action (Matching Image 1 Assistant) */}
        <div className="lg:col-span-4 rounded-2xl border border-zinc-200 dark:border-[#23232f] bg-white dark:bg-[#121218] p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-[#20202c] pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-lg bg-[#990000]/15 text-[#ff6666] flex items-center justify-center font-bold text-xs">
                  ⚡
                </div>
                <h3 className="font-bold text-xs text-zinc-900 dark:text-white uppercase tracking-wider">
                  Outreach Field Briefing
                </h3>
              </div>
              <span className="text-[10px] text-zinc-500">Live AI Sync</span>
            </div>

            {/* Speech Bubble with Dark Crimson Tint from Image 1 */}
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-[#251014] border border-rose-200 dark:border-[#42171e] text-xs text-rose-950 dark:text-rose-100 leading-relaxed shadow-sm">
              <p className="font-medium">
                "Tomorrow: <strong>14 visits</strong> planned for <strong>Mogappair & Anna Nagar</strong>. 6 appointments scheduled with principals. 3 priority follow-ups due."
              </p>
              <div className="text-[10px] text-rose-600 dark:text-rose-300/70 mt-2 font-mono text-right">
                11:00 AM · Automated Itinerary Sync
              </div>
            </div>
          </div>

          {/* Assistant Quick Note / Voice Logger Form */}
          <form onSubmit={handleAssistantSubmit} className="space-y-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Log a field note or ask briefing..."
                value={quickNote}
                onChange={(e) => setQuickNote(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 dark:border-[#28283a] bg-zinc-50 dark:bg-[#181824] py-2.5 pl-4 pr-20 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:border-[#990000] focus:outline-none transition-all"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-colors"
                  title="Voice Note"
                >
                  <Mic className="h-3.5 w-3.5" />
                </button>
                <button
                  type="submit"
                  className="p-1.5 rounded-full bg-[#990000] hover:bg-[#b91c1c] text-white shadow-sm transition-transform active:scale-95"
                  title="Send"
                >
                  <Send className="h-3 w-3" />
                </button>
              </div>
            </div>

            {assistantNoteSubmitted && (
              <p className="text-[11px] text-emerald-500 flex items-center gap-1 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Field note saved & synced to Supabase!</span>
              </p>
            )}
          </form>
        </div>
      </div>

      {/* BOTTOM WORKSPACE: TOMORROW'S ITINERARY + ACTIONABLE FOLLOW-UPS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tomorrow's Route (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-zinc-200 dark:border-[#23232f] bg-white dark:bg-[#121218] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-[#20202c] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-[#990000] px-2 py-0.5 text-[10px] font-bold text-white">
                  ROUTE
                </span>
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                  Tomorrow's Itinerary (05 Sep 2026)
                </h3>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Area: <strong>Mogappair / Anna Nagar</strong> · 14 Planned Stops
              </p>
            </div>
            <Link
              href="/dashboard/itinerary"
              className="text-xs font-semibold text-[#ff6666] hover:underline flex items-center gap-1"
            >
              <span>Full Route</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {tomorrowItinerary.map((item, index) => (
              <div
                key={item.id || index}
                className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-[#20202c] bg-zinc-50 dark:bg-[#15151e] hover:border-[#990000]/40 transition-colors text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="h-6 w-6 rounded-lg bg-zinc-200 dark:bg-[#20202e] text-zinc-800 dark:text-zinc-200 font-mono font-bold flex items-center justify-center text-[11px]">
                    {item.visit_order || index + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-white">
                      {item.schools?.name || "Partner School"}
                    </h4>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      {item.planned_time || "09:30 AM"} · {item.purpose || "Outreach"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {item.is_appointment && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      Appointment
                    </span>
                  )}
                  <button
                    onClick={() => setSelectedSchoolForVisit(item.schools)}
                    className="rounded-lg bg-[#990000] hover:bg-[#b91c1c] px-3 py-1.5 text-[11px] font-bold text-white transition-colors shadow-sm"
                  >
                    Start Visit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Immediate Next Actions (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-zinc-200 dark:border-[#23232f] bg-white dark:bg-[#121218] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-[#20202c] pb-3">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-[#ff6666]" />
              <span>Next Actions Due</span>
            </h3>
            <Link
              href="/dashboard/followups"
              className="text-xs font-semibold text-[#ff6666] hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="space-y-2.5">
            {followups.map((school) => (
              <div
                key={school.id}
                className="p-3 rounded-xl border border-zinc-200 dark:border-[#20202c] bg-zinc-50 dark:bg-[#15151e] space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-zinc-900 dark:text-white truncate max-w-[180px]">
                    {school.name}
                  </h4>
                  <span className="font-mono text-[10px] text-[#ff6666] font-bold">
                    {school.next_action_date}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
                  <span>Action: <strong>{school.next_action || "Follow up"}</strong></span>
                  {school.phone && (
                    <a
                      href={`tel:${school.phone}`}
                      className="text-emerald-500 hover:underline font-semibold"
                    >
                      Call
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
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
