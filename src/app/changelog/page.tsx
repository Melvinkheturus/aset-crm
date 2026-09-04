"use client";

import { CheckCircle2, Sparkles, Tag, Calendar } from "lucide-react";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";

interface ChangelogEntry {
  date: string;
  version: string;
  title: string;
  isLatest?: boolean;
  items: string[];
}

const CHANGELOG_DATA: ChangelogEntry[] = [
  {
    date: "20 SEP 2026",
    version: "v1.0.2",
    title: "Reporting & Export Improvements",
    items: [
      "Improved weekly reports with executive performance breakdown",
      "PDF and XLSX download improvements for management documentation",
      "Additional territory yield and conversion analytics",
      "One-click WhatsApp itinerary sharing optimizations"
    ]
  },
  {
    date: "12 SEP 2026",
    version: "v1.0.1",
    title: "Improved Route Planning & Maps",
    items: [
      "Faster sequential itinerary resequencing with instant drag/arrow reordering",
      "Direct turn-by-turn Google Maps links embedded per school stop",
      "Better next-action date validation and overdue action flags",
      "Mobile bottom navigation bar for field phone usability",
      "Minor UI enhancements in Crimson Red and Deep Dark theme"
    ]
  },
  {
    date: "04 SEP 2026",
    version: "v1.0.0",
    title: "Initial CRM Release",
    isLatest: true,
    items: [
      "Master school database of 201 educational institutions",
      "Role-based Executive and Manager views with 1-click switcher",
      "Daily, weekly, and monthly route planning engine",
      "Immutable field visit log tracking (211 historical records seeded)",
      "Automated state update trigger synchronizing school lead status",
      "Follow-up management engine (Overdue, Today, Upcoming)",
      "Institutional ownership and access request controls",
      "Executive workload and territory visibility across 6 officers",
      "Automated daily, weekly, and monthly report generation",
      "Google Sheets management documentation synchronization mirror"
    ]
  }
];

export default function ChangelogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#07070a] text-zinc-100 selection:bg-[#990000] selection:text-white">
      <PublicHeader />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-16 w-full">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161622] border border-[#262638] text-[11px] font-bold tracking-widest text-[#ff6666] uppercase mb-4">
            <Sparkles className="h-3 w-3 text-[#ff4d4d]" />
            <span>CHANGELOG</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
            What's new
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Updates, improvements, and fixes to the ASET Outreach CRM.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative pl-6 sm:pl-8 border-l border-[#20202e] space-y-12">
          {CHANGELOG_DATA.map((entry) => (
            <div key={entry.version} className="relative group">
              {/* Timeline Bullet Node */}
              <div
                className={`absolute -left-[31px] sm:-left-[39px] top-1.5 h-4 w-4 rounded-full border-2 transition-transform group-hover:scale-125 ${
                  entry.isLatest
                    ? "bg-[#990000] border-rose-400 ring-4 ring-[#990000]/20"
                    : "bg-[#14141c] border-zinc-600"
                }`}
              />

              {/* Version & Date Metadata */}
              <div className="flex flex-wrap items-center gap-2.5 mb-2">
                <span className="font-mono text-xs font-bold text-zinc-400 flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-zinc-500" />
                  {entry.date}
                </span>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                    entry.isLatest
                      ? "bg-[#990000] text-white shadow-md shadow-[#990000]/30"
                      : "bg-[#181824] text-zinc-300 border border-[#252536]"
                  }`}
                >
                  {entry.version}
                </span>

                {entry.isLatest && (
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                    Current Stable
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="text-lg font-bold text-white mb-4">{entry.title}</h2>

              {/* Items Card */}
              <div className="p-5 rounded-2xl bg-[#0e0e14] border border-[#20202c] group-hover:border-[#990000]/40 transition-colors space-y-2.5 shadow-lg shadow-black/40">
                {entry.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#ff6666] mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
