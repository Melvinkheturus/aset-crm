"use client";

import Link from "next/link";
import {
  CalendarDays,
  ClipboardList,
  Users,
  BarChart3,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  ChevronRight,
  School,
  MapPin,
  Sparkles
} from "lucide-react";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";

export default function LandingPage() {
  const workflowSteps = [
    { step: "01", label: "School", desc: "Master institution record" },
    { step: "02", label: "Plan", desc: "Sequential route stop" },
    { step: "03", label: "Visit", desc: "Field interaction logged" },
    { step: "04", label: "Follow-up", desc: "Call / second visit due" },
    { step: "05", label: "Appointment", desc: "Principal meeting fixed" },
    { step: "06", label: "Orientation", desc: "Program conducted & won" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#07070a] text-zinc-100 selection:bg-[#990000] selection:text-white">
      <PublicHeader />

      <main className="flex-1">
        {/* SECTION 1 — HERO */}
        <section className="relative px-4 sm:px-6 pt-20 pb-24 text-center max-w-5xl mx-auto overflow-hidden">
          {/* Subtle Ambient Crimson Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-[#990000]/15 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161622] border border-[#262638] text-xs font-bold tracking-widest text-[#ff6666] uppercase mb-6 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#ff4d4d] animate-pulse" />
            <span>ASET SCHOOL OUTREACH</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white mb-6">
            Plan. Visit. Track. Grow.
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            A centralized system for managing school outreach, field visits, follow-ups, and team activity.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/login"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#990000] hover:bg-[#b91c1c] px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-[#990000]/30 transition-all hover:scale-[1.02] border border-rose-500/30"
            >
              <span>Access CRM</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/docs"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#121218] hover:bg-[#1b1b24] px-6 py-3.5 text-sm font-semibold text-zinc-300 hover:text-white border border-[#252533] transition-colors"
            >
              <span>Documentation</span>
            </Link>
          </div>

          {/* Small Trust Line */}
          <p className="text-xs text-zinc-500 mt-6 flex items-center justify-center gap-1.5">
            <ShieldAlert className="h-3.5 w-3.5 text-zinc-500" />
            <span>Authorized ASET members only.</span>
          </p>
        </section>

        {/* SECTION 2 — WHAT IT DOES */}
        <section className="py-20 px-4 sm:px-6 border-t border-[#1b1b26] bg-[#0a0a0e]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-3">
                Everything your outreach team needs.
              </h2>
              <p className="text-xs text-zinc-400">
                Built specifically for school visits, institutional relations, and field performance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: PLAN */}
              <div className="p-6 rounded-2xl bg-[#0f0f15] border border-[#20202e] hover:border-[#990000]/50 transition-all flex flex-col justify-between space-y-4">
                <div>
                  <div className="h-10 w-10 rounded-xl bg-[#181824] border border-[#2a2a3c] flex items-center justify-center text-[#ff6666] mb-4">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-sm tracking-wider text-white uppercase mb-2">
                    PLAN
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Build daily, weekly, and monthly field itineraries.
                  </p>
                </div>
                <span className="text-[11px] text-[#ff8080] font-semibold flex items-center gap-1">
                  Sequential routes <ChevronRight className="h-3 w-3" />
                </span>
              </div>

              {/* Card 2: TRACK */}
              <div className="p-6 rounded-2xl bg-[#0f0f15] border border-[#20202e] hover:border-[#990000]/50 transition-all flex flex-col justify-between space-y-4">
                <div>
                  <div className="h-10 w-10 rounded-xl bg-[#181824] border border-[#2a2a3c] flex items-center justify-center text-[#ff6666] mb-4">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-sm tracking-wider text-white uppercase mb-2">
                    TRACK
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Record school visits, contacts, outcomes, and follow-ups.
                  </p>
                </div>
                <span className="text-[11px] text-[#ff8080] font-semibold flex items-center gap-1">
                  1-Tap mood logger <ChevronRight className="h-3 w-3" />
                </span>
              </div>

              {/* Card 3: MONITOR */}
              <div className="p-6 rounded-2xl bg-[#0f0f15] border border-[#20202e] hover:border-[#990000]/50 transition-all flex flex-col justify-between space-y-4">
                <div>
                  <div className="h-10 w-10 rounded-xl bg-[#181824] border border-[#2a2a3c] flex items-center justify-center text-[#ff6666] mb-4">
                    <Users className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-sm tracking-wider text-white uppercase mb-2">
                    MONITOR
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Track team activity, school ownership, and upcoming actions.
                  </p>
                </div>
                <span className="text-[11px] text-[#ff8080] font-semibold flex items-center gap-1">
                  Executive console <ChevronRight className="h-3 w-3" />
                </span>
              </div>

              {/* Card 4: REPORT */}
              <div className="p-6 rounded-2xl bg-[#0f0f15] border border-[#20202e] hover:border-[#990000]/50 transition-all flex flex-col justify-between space-y-4">
                <div>
                  <div className="h-10 w-10 rounded-xl bg-[#181824] border border-[#2a2a3c] flex items-center justify-center text-[#ff6666] mb-4">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-sm tracking-wider text-white uppercase mb-2">
                    REPORT
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Generate daily, weekly, and monthly reports.
                  </p>
                </div>
                <span className="text-[11px] text-[#ff8080] font-semibold flex items-center gap-1">
                  Zero manual entry <ChevronRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3 — BUILT FOR FIELD OUTREACH */}
        <section className="py-20 px-4 sm:px-6 border-t border-[#1b1b26] bg-[#07070a]">
          <div className="max-w-6xl mx-auto text-center">
            <div className="max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-3">
                From the first visit to the final outcome.
              </h2>
              <p className="text-sm text-zinc-400 font-medium">
                Every interaction stays connected to the school record.
              </p>
            </div>

            {/* Horizontal Workflow */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
              {workflowSteps.map((item, index) => (
                <div
                  key={item.step}
                  className="relative p-4 rounded-xl bg-[#0e0e14] border border-[#222230] text-left hover:border-[#990000]/60 transition-colors"
                >
                  <span className="text-[10px] font-mono font-bold text-[#ff6666] block mb-1">
                    {item.step}
                  </span>
                  <h4 className="font-bold text-sm text-white">{item.label}</h4>
                  <p className="text-[11px] text-zinc-400 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>

            <p className="text-xs text-zinc-400 max-w-xl mx-auto leading-relaxed">
              Prevent duplicate outreach. Keep ownership clear. Never lose the next action.
            </p>
          </div>
        </section>

        {/* SECTION 4 — ACCESS CTA */}
        <section className="py-24 px-4 sm:px-6 border-t border-[#1b1b26] bg-gradient-to-b from-[#0a0a0f] to-[#07070a] text-center">
          <div className="max-w-2xl mx-auto p-10 rounded-3xl bg-[#0f0f16] border border-[#252536] shadow-2xl relative overflow-hidden">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#990000]/20 rounded-full blur-3xl pointer-events-none -z-10" />

            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
              Ready to manage your outreach?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mb-8 max-w-md mx-auto">
              Access the ASET School Outreach CRM with your authorized account.
            </p>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-[#990000] hover:bg-[#b91c1c] px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-[#990000]/30 transition-all hover:scale-[1.02] border border-rose-500/30"
            >
              <span>Access CRM</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <p className="text-[11px] text-zinc-500 mt-5">
              Access is restricted to authorized ASET team members.
            </p>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
