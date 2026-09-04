"use client";

import { useState } from "react";
import {
  BookOpen,
  Key,
  LayoutDashboard,
  School,
  CalendarDays,
  ClipboardList,
  CheckSquare,
  BarChart3,
  TrendingUp,
  Users,
  ShieldCheck,
  Lock,
  ChevronRight
} from "lucide-react";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";

interface DocSection {
  id: string;
  num: string;
  title: string;
  category: "Getting Started" | "Manager";
  icon: any;
  content: React.ReactNode;
}

export default function DocsPage() {
  const [activeSectionId, setActiveSectionId] = useState("login");

  const sections: DocSection[] = [
    {
      id: "login",
      num: "01",
      title: "Login & Access",
      category: "Getting Started",
      icon: Key,
      content: (
        <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
          <h3 className="text-base font-bold text-white">Accessing the CRM</h3>
          <div className="p-3 rounded-xl bg-[#990000]/10 border border-[#990000]/30 text-[#ff9999] font-medium">
            ASET CRM is strictly restricted to authorized users.
          </div>
          <p>
            Your account is created by the Super Admin. You will receive an invitation email to activate your account.
          </p>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-[#14141c] border border-[#22222f] font-mono text-[11px] text-zinc-300">
            <span>Invitation</span>
            <span className="text-zinc-600">→</span>
            <span>Account Setup</span>
            <span className="text-zinc-600">→</span>
            <span>Login</span>
            <span className="text-zinc-600">→</span>
            <span className="text-emerald-400 font-bold">Dashboard</span>
          </div>
          <h4 className="text-sm font-bold text-white pt-2">Account Recovery</h4>
          <p>Use your registered institutional email to reset your credentials if you lose access to your account.</p>
        </div>
      )
    },
    {
      id: "dashboard",
      num: "02",
      title: "Dashboard",
      category: "Getting Started",
      icon: LayoutDashboard,
      content: (
        <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
          <h3 className="text-base font-bold text-white">Operational Dashboards</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#14141c] border border-[#22222f] space-y-2">
              <h4 className="font-bold text-[#ff8080] text-sm">Executive Dashboard</h4>
              <ul className="space-y-1 text-zinc-400 list-disc list-inside">
                <li>Today's sequential route itinerary</li>
                <li>Pending vs completed school visits</li>
                <li>Immediate follow-ups and due calls</li>
                <li>Upcoming actions and direct Maps links</li>
                <li>Personal outreach activity counters</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-[#14141c] border border-[#22222f] space-y-2">
              <h4 className="font-bold text-[#ff8080] text-sm">Manager Dashboard</h4>
              <ul className="space-y-1 text-zinc-400 list-disc list-inside">
                <li>Consolidated team activity across 6 executives</li>
                <li>Tomorrow's field visit route spotlight</li>
                <li>School ownership distribution</li>
                <li>Pending institutional actions & overdue items</li>
                <li>Real-time outreach performance metrics</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "schools",
      num: "03",
      title: "Schools Master",
      category: "Getting Started",
      icon: School,
      content: (
        <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
          <h3 className="text-base font-bold text-white">02_SCHOOL_MASTER</h3>
          <p>
            The centralized institutional registry storing 201 accredited schools across Chennai and neighboring zones.
          </p>
          <div className="p-4 rounded-xl bg-[#14141c] border border-[#22222f] space-y-2">
            <h4 className="font-bold text-white">Each school record contains:</h4>
            <div className="grid grid-cols-2 gap-2 text-zinc-400">
              <div>• Human-readable ID (<code>SCH-0042</code>)</div>
              <div>• Primary School Owner</div>
              <div>• Contact Person & Designation</div>
              <div>• Lead Status (Hot / Warm / Cold / Conducted)</div>
              <div>• Direct Phone & WhatsApp triggers</div>
              <div>• Complete historical visit timeline</div>
              <div>• Next Action & Action Date</div>
              <div>• Verified Google Maps location link</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "planning",
      num: "04",
      title: "Planning & Itineraries",
      category: "Getting Started",
      icon: CalendarDays,
      content: (
        <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
          <h3 className="text-base font-bold text-white">Create Your Route Itinerary</h3>
          <p>
            Select <strong>Date → School → Order → Planned Time → Purpose</strong>. The system generates your field route.
          </p>
          <div className="p-3 rounded-xl bg-[#14141c] border border-[#22222f] font-mono text-[11px] text-[#ff9999]">
            Date (05 Sep) → Schools (14) → Order (1 to 14) → Time (09:30) → Purpose (Principal Meeting)
          </div>
          <h4 className="text-sm font-bold text-white pt-2">Available Planning Scopes:</h4>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 rounded-lg bg-[#14141c] border border-[#22222f]">
              <span className="font-bold text-white block">Daily</span>
              <span className="text-[11px] text-zinc-500">Ordered stops with Maps</span>
            </div>
            <div className="p-3 rounded-lg bg-[#14141c] border border-[#22222f]">
              <span className="font-bold text-white block">Weekly</span>
              <span className="text-[11px] text-zinc-500">Monday–Saturday routes</span>
            </div>
            <div className="p-3 rounded-lg bg-[#14141c] border border-[#22222f]">
              <span className="font-bold text-white block">Monthly</span>
              <span className="text-[11px] text-zinc-500">Volume milestones</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "visits",
      num: "05",
      title: "Visit Log",
      category: "Getting Started",
      icon: ClipboardList,
      content: (
        <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
          <h3 className="text-base font-bold text-white">03_VISIT_LOG</h3>
          <p>
            When standing outside a partner school, open the <strong>START VISIT</strong> modal and record your interaction:
          </p>
          <div className="p-3 rounded-xl bg-[#14141c] border border-[#22222f] font-mono text-[11px] text-zinc-300">
            School → Person Met → Outcome → Lead Status → Next Action → Next Action Date → Remarks
          </div>
          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-300">
            <strong>Automated Trigger:</strong> Once saved, the school record and dashboard automatically synchronize the last visit date, new status, and upcoming action date.
          </div>
        </div>
      )
    },
    {
      id: "followups",
      num: "06",
      title: "Follow-ups Engine",
      category: "Getting Started",
      icon: CheckSquare,
      content: (
        <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
          <h3 className="text-base font-bold text-white">Zero Missed Follow-ups</h3>
          <p>The follow-ups engine organizes scheduled actions into three clear buckets:</p>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/50">
              <span className="font-bold text-rose-300 block">Overdue</span>
              <span className="text-[10px] text-zinc-400">Date passed without log</span>
            </div>
            <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800/50">
              <span className="font-bold text-amber-300 block">Due Today</span>
              <span className="text-[10px] text-zinc-400">Immediate calls & check-ins</span>
            </div>
            <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-800/50">
              <span className="font-bold text-blue-300 block">Upcoming</span>
              <span className="text-[10px] text-zinc-400">Scheduled future actions</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "reports",
      num: "07",
      title: "Reports Engine",
      category: "Getting Started",
      icon: BarChart3,
      content: (
        <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
          <h3 className="text-base font-bold text-white">Dynamic Reports Generator</h3>
          <p>
            No manual report writing. Reports are generated dynamically directly from the underlying visit logs:
          </p>
          <ul className="space-y-1.5 text-zinc-400 list-disc list-inside">
            <li><strong>05_DAILY_REPORT:</strong> Planned visits, completed, not met, positive outcomes, follow-ups.</li>
            <li><strong>06_WEEKLY_REPORT:</strong> Unique reached institutions, weekly day breakdown, area cluster counts.</li>
            <li><strong>07_MONTHLY_REPORT:</strong> Executive performance matrix ranking visits, hot leads, and orientations.</li>
          </ul>
          <p className="pt-2 text-zinc-400">
            Export formats supported: <strong>CSV, JSON, and Master XLSX Spreadsheet</strong>.
          </p>
        </div>
      )
    },
    {
      id: "analytics",
      num: "08",
      title: "Outreach Analytics",
      category: "Getting Started",
      icon: TrendingUp,
      content: (
        <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
          <h3 className="text-base font-bold text-white">Conversion Funnel & Yield</h3>
          <p>Track your pipeline velocity across 5 defined stages:</p>
          <div className="p-3 rounded-xl bg-[#14141c] border border-[#22222f] space-y-1 font-mono text-[11px]">
            <div>1. Master Schools Identified (201)</div>
            <div>2. Field Visits Conducted (160)</div>
            <div>3. Warm Discussion Ongoing (85)</div>
            <div>4. Hot Principal Meetings (28)</div>
            <div className="text-emerald-400 font-bold">5. Program Conducted & Won (8)</div>
          </div>
        </div>
      )
    },
    {
      id: "team",
      num: "09",
      title: "Team Management",
      category: "Manager",
      icon: Users,
      content: (
        <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
          <div className="inline-block px-2 py-0.5 rounded bg-rose-950 border border-rose-700 text-rose-300 font-bold text-[10px] uppercase">
            Manager Only
          </div>
          <h3 className="text-base font-bold text-white">Executive Workload & Territory</h3>
          <p>
            Monitor real-time status (<em>On Route</em>, <em>In Office</em>, <em>On Call</em>) and balance outreach loads across all 6 field officers.
          </p>
        </div>
      )
    },
    {
      id: "ownership",
      num: "10",
      title: "School Ownership",
      category: "Manager",
      icon: ShieldCheck,
      content: (
        <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
          <div className="inline-block px-2 py-0.5 rounded bg-rose-950 border border-rose-700 text-rose-300 font-bold text-[10px] uppercase">
            Manager Only
          </div>
          <h3 className="text-base font-bold text-white">Prevent Duplicate Outreach</h3>
          <p>
            Each school is assigned a primary executive owner. This eliminates confusion and guarantees that two officers never cross paths at the same school without prior alignment.
          </p>
        </div>
      )
    },
    {
      id: "requests",
      num: "11",
      title: "Access Requests",
      category: "Manager",
      icon: Lock,
      content: (
        <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
          <div className="inline-block px-2 py-0.5 rounded bg-rose-950 border border-rose-700 text-rose-300 font-bold text-[10px] uppercase">
            Manager Only
          </div>
          <h3 className="text-base font-bold text-white">Delegation Workflow</h3>
          <div className="p-3 rounded-xl bg-[#14141c] border border-[#22222f] font-mono text-[11px] text-zinc-300">
            Request Access → Justification Reason → Manager Review → Approve / Reject
          </div>
          <p>
            Approved temporary access allows an executive to record visits without changing the primary school ownership.
          </p>
        </div>
      )
    }
  ];

  const activeDoc = sections.find((s) => s.id === activeSectionId) || sections[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#07070a] text-zinc-100 selection:bg-[#990000] selection:text-white">
      <PublicHeader />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-12 w-full">
        {/* Header */}
        <div className="mb-10 pb-8 border-b border-[#1f1f2e]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161622] border border-[#262638] text-[11px] font-bold tracking-widest text-[#ff6666] uppercase mb-3">
            <BookOpen className="h-3 w-3 text-[#ff4d4d]" />
            <span>DOCUMENTATION</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
            ASET Outreach CRM
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Everything you need to use the outreach system effectively.
          </p>
        </div>

        {/* Documentation Layout: Sidebar + Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Navigation Sidebar */}
          <aside className="md:col-span-4 lg:col-span-3 space-y-6 md:sticky md:top-24">
            {/* Getting Started Category */}
            <div>
              <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                Getting Started
              </div>
              <div className="space-y-1">
                {sections
                  .filter((s) => s.category === "Getting Started")
                  .map((item) => {
                    const isActive = activeSectionId === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSectionId(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${
                          isActive
                            ? "bg-[#990000] text-white font-semibold shadow-md shadow-[#990000]/30"
                            : "text-zinc-400 hover:bg-[#14141c] hover:text-zinc-200"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-[10px] opacity-70">{item.num}</span>
                          <span className="truncate">{item.title}</span>
                        </div>
                        {isActive && <ChevronRight className="h-3.5 w-3.5" />}
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Manager Category */}
            <div>
              <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-[#ff6666] uppercase">
                Manager
              </div>
              <div className="space-y-1">
                {sections
                  .filter((s) => s.category === "Manager")
                  .map((item) => {
                    const isActive = activeSectionId === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSectionId(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${
                          isActive
                            ? "bg-[#990000] text-white font-semibold shadow-md shadow-[#990000]/30"
                            : "text-zinc-400 hover:bg-[#14141c] hover:text-zinc-200"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-[10px] opacity-70">{item.num}</span>
                          <span className="truncate">{item.title}</span>
                        </div>
                        {isActive && <ChevronRight className="h-3.5 w-3.5" />}
                      </button>
                    );
                  })}
              </div>
            </div>
          </aside>

          {/* Right Main Content Card */}
          <section className="md:col-span-8 lg:col-span-9 p-6 sm:p-8 rounded-2xl bg-[#0e0e14] border border-[#20202c] shadow-xl">
            <div className="border-b border-[#20202c] pb-4 mb-6 flex items-center gap-3">
              <span className="font-mono text-sm font-bold text-[#ff6666] px-2.5 py-1 rounded-lg bg-[#990000]/20 border border-[#990000]/40">
                {activeDoc.num}
              </span>
              <h2 className="text-xl font-bold text-white">{activeDoc.title}</h2>
            </div>

            {activeDoc.content}
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
