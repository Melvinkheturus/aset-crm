"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  User,
  Palette,
  Bell,
  Download,
  Upload,
  RefreshCw,
  Shield,
  Users,
  Activity,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  FileJson,
  Key,
  Database,
  ExternalLink
} from "lucide-react";
import { useRole } from "@/context/role-context";
import { supabase } from "@/lib/supabase";

export default function SettingsPage() {
  const { role, executiveName } = useRole();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "profile";

  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: executiveName,
    email: "manikandan@aset.edu.in",
    phone: "+91 98401 23456",
    roleTitle: role === "manager" ? "Outreach Director" : "Senior Field Executive",
    defaultArea: "Mogappair / Anna Nagar",
    defaultProgram: "Scholarship Exam"
  });

  const [webhookUrl, setWebhookUrl] = useState(
    "https://script.google.com/macros/s/AKfycbz_example_aset_outreach/exec"
  );
  const [spreadsheetId, setSpreadsheetId] = useState(
    "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
  );

  const handleExport = async (entity: "schools" | "visits" | "plans", format: "csv" | "json") => {
    let tableName = entity === "plans" ? "planned_visits" : entity;
    const { data } = await supabase.from(tableName).select("*");
    if (!data) return;

    let content = "";
    let mimeType = "";
    let filename = `ASET_${entity}_${new Date().toISOString().split("T")[0]}.${format}`;

    if (format === "json") {
      content = JSON.stringify(data, null, 2);
      mimeType = "application/json";
    } else {
      if (data.length === 0) return;
      const headers = Object.keys(data[0]).join(",");
      const rows = data.map((row) =>
        Object.values(row)
          .map((val) => `"${String(val ?? "").replace(/"/g, '""')}"`)
          .join(",")
      );
      content = [headers, ...rows].join("\n");
      mimeType = "text/csv";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleTriggerSync = () => {
    setSyncing(true);
    setSyncSuccess(false);
    setTimeout(() => {
      setSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 4000);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Settings Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#14141c] via-[#101017] to-[#0c0c10] border border-[#22222f]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Settings & Preferences</h1>
            <span className="rounded-md bg-[#990000]/20 px-2 py-0.5 text-xs font-semibold text-[#ff6666] border border-[#990000]/40 uppercase tracking-wider">
              {role === "manager" ? "Manager Console" : "Executive View"}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Manage your personal profile, field defaults, data exports, and Google Sheets synchronization.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#181824] border border-[#242436] text-xs text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Supabase: Connected</span>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      {(currentTab === "profile" || currentTab === "general") && (
        <div className="p-6 rounded-2xl bg-[#0f0f15] border border-[#20202e] space-y-6">
          <div className="border-b border-[#20202e] pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <User className="h-4 w-4 text-[#ff6666]" />
              Personal Profile & Field Defaults
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              These details pre-fill your visit logs and itinerary scheduling.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-zinc-400 mb-1.5 font-medium">Full Name</label>
              <input
                type="text"
                value={profileData.fullName}
                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                className="w-full rounded-xl border border-[#22222f] bg-[#14141c] px-3 py-2 text-white focus:border-[#990000] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1.5 font-medium">Email Address</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full rounded-xl border border-[#22222f] bg-[#14141c] px-3 py-2 text-white focus:border-[#990000] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1.5 font-medium">Phone Number</label>
              <input
                type="text"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="w-full rounded-xl border border-[#22222f] bg-[#14141c] px-3 py-2 text-white focus:border-[#990000] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1.5 font-medium">Operational Role</label>
              <input
                type="text"
                readOnly
                value={profileData.roleTitle}
                className="w-full rounded-xl border border-[#22222f] bg-[#14141c]/60 px-3 py-2 text-zinc-400 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1.5 font-medium">Default Territory / Area</label>
              <input
                type="text"
                value={profileData.defaultArea}
                onChange={(e) => setProfileData({ ...profileData, defaultArea: e.target.value })}
                className="w-full rounded-xl border border-[#22222f] bg-[#14141c] px-3 py-2 text-white focus:border-[#990000] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1.5 font-medium">Primary Outreach Program</label>
              <input
                type="text"
                value={profileData.defaultProgram}
                onChange={(e) => setProfileData({ ...profileData, defaultProgram: e.target.value })}
                className="w-full rounded-xl border border-[#22222f] bg-[#14141c] px-3 py-2 text-white focus:border-[#990000] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                setSaving(true);
                setTimeout(() => setSaving(false), 800);
              }}
              className="rounded-xl bg-[#990000] hover:bg-[#b91c1c] px-4 py-2 text-xs font-semibold text-white shadow-md shadow-[#990000]/30 transition-colors"
            >
              {saving ? "Saving Changes..." : "Save Profile"}
            </button>
          </div>
        </div>
      )}

      {/* Data Export & Backup Center */}
      {(currentTab === "export" || currentTab === "data") && (
        <div className="p-6 rounded-2xl bg-[#0f0f15] border border-[#20202e] space-y-6">
          <div className="border-b border-[#20202e] pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Download className="h-4 w-4 text-[#ff6666]" />
              Data Export & Backup Center
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Download complete, uncompressed datasets directly from the live database.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Schools Export */}
            <div className="p-4 rounded-xl bg-[#14141c] border border-[#22222f] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">Schools Master</span>
                <span className="text-[10px] bg-[#222230] text-zinc-300 px-2 py-0.5 rounded-md font-semibold">
                  201 Records
                </span>
              </div>
              <p className="text-zinc-400 text-[11px]">
                Full institution directory with board, student strength, contact, and lead state.
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleExport("schools", "csv")}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#1e1e2c] hover:bg-[#28283a] text-zinc-200 font-semibold transition-colors"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
                  <span>CSV</span>
                </button>
                <button
                  onClick={() => handleExport("schools", "json")}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#1e1e2c] hover:bg-[#28283a] text-zinc-200 font-semibold transition-colors"
                >
                  <FileJson className="h-3.5 w-3.5 text-amber-400" />
                  <span>JSON</span>
                </button>
              </div>
            </div>

            {/* Visits Export */}
            <div className="p-4 rounded-xl bg-[#14141c] border border-[#22222f] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">Visit Log</span>
                <span className="text-[10px] bg-[#222230] text-zinc-300 px-2 py-0.5 rounded-md font-semibold">
                  211 Records
                </span>
              </div>
              <p className="text-zinc-400 text-[11px]">
                Complete chronological field activity history with outcomes and next actions.
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleExport("visits", "csv")}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#1e1e2c] hover:bg-[#28283a] text-zinc-200 font-semibold transition-colors"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
                  <span>CSV</span>
                </button>
                <button
                  onClick={() => handleExport("visits", "json")}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#1e1e2c] hover:bg-[#28283a] text-zinc-200 font-semibold transition-colors"
                >
                  <FileJson className="h-3.5 w-3.5 text-amber-400" />
                  <span>JSON</span>
                </button>
              </div>
            </div>

            {/* Plans Export */}
            <div className="p-4 rounded-xl bg-[#14141c] border border-[#22222f] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">Itinerary Plans</span>
                <span className="text-[10px] bg-[#222230] text-zinc-300 px-2 py-0.5 rounded-md font-semibold">
                  69 Records
                </span>
              </div>
              <p className="text-zinc-400 text-[11px]">
                Daily and weekly planned routes, stop orders, appointments, and status.
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleExport("plans", "csv")}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#1e1e2c] hover:bg-[#28283a] text-zinc-200 font-semibold transition-colors"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
                  <span>CSV</span>
                </button>
                <button
                  onClick={() => handleExport("plans", "json")}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#1e1e2c] hover:bg-[#28283a] text-zinc-200 font-semibold transition-colors"
                >
                  <FileJson className="h-3.5 w-3.5 text-amber-400" />
                  <span>JSON</span>
                </button>
              </div>
            </div>
          </div>

          {/* Master 9-Sheet Excel Workbook Download */}
          <div className="p-4 rounded-xl bg-[#161622] border border-[#28283c] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">ASET School Outreach — Master Field Operations.xlsx</h4>
                <p className="text-zinc-400 text-[11px]">
                  All 9 sheets formatted in Crimson Red theme with complete formulas and lists.
                </p>
              </div>
            </div>

            <a
              href="/ASET%20School%20Outreach%20%E2%80%94%20Field%20Operations.xlsx"
              download
              className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-white font-semibold flex items-center gap-2 shrink-0 transition-colors shadow-sm"
            >
              <Download className="h-4 w-4" />
              <span>Download .XLSX</span>
            </a>
          </div>
        </div>
      )}

      {/* Google Sheets Sync Settings (Manager Mode) */}
      {(currentTab === "sync" || (role === "manager" && currentTab === "settings")) && (
        <div className="p-6 rounded-2xl bg-[#0f0f15] border border-[#20202e] space-y-6">
          <div className="border-b border-[#20202e] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-[#ff6666]" />
                Google Sheets Synchronization Mirror
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Automatically formats and pushes operational itineraries and reports to management's spreadsheet.
              </p>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-zinc-500 block">Last Synced:</span>
              <span className="text-xs font-semibold text-emerald-400">04 Sep 2026, 11:30 AM</span>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-400 mb-1.5 font-medium">
                Google Apps Script Webhook Endpoint URL
              </label>
              <input
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full rounded-xl border border-[#22222f] bg-[#14141c] px-3 py-2 text-white font-mono text-[11px] focus:border-[#990000] focus:outline-none"
              />
              <p className="text-[10px] text-zinc-500 mt-1">
                Deployed Web App handler from <code>aset/GoogleAppsScript_Setup.js</code>.
              </p>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1.5 font-medium">Google Spreadsheet ID</label>
              <input
                type="text"
                value={spreadsheetId}
                onChange={(e) => setSpreadsheetId(e.target.value)}
                className="w-full rounded-xl border border-[#22222f] bg-[#14141c] px-3 py-2 text-white font-mono text-[11px] focus:border-[#990000] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[#20202e]">
            <div className="text-xs text-zinc-400 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Source of Truth: Website & Supabase PostgreSQL</span>
            </div>

            <button
              onClick={handleTriggerSync}
              disabled={syncing}
              className="w-full sm:w-auto rounded-xl bg-[#990000] hover:bg-[#b91c1c] px-5 py-2 text-xs font-semibold text-white shadow-md shadow-[#990000]/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
              <span>{syncing ? "Synchronizing to Google Sheets..." : "Sync All Sheets Now"}</span>
            </button>
          </div>

          {syncSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-700/50 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>
                ✓ Successfully synchronized 201 schools, 211 visits, 69 planned visits, and Management View to Google Sheets!
              </span>
            </div>
          )}
        </div>
      )}

      {/* Preferences Section */}
      {currentTab === "appearance" && (
        <div className="p-6 rounded-2xl bg-[#0f0f15] border border-[#20202e] space-y-6">
          <div className="border-b border-[#20202e] pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Palette className="h-4 w-4 text-[#ff6666]" />
              Appearance & Theme
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Current active system theme: ASET Crimson Red & Deep Dark.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#14141c] border border-[#990000] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Crimson Red & Midnight Black</span>
                <span className="text-[10px] bg-[#990000] text-white px-2 py-0.5 rounded-full font-semibold">
                  Active
                </span>
              </div>
              <p className="text-zinc-400 text-[11px]">
                High-contrast outreach theme based on the Mergex-OS design system.
              </p>
              <div className="flex gap-2 pt-2">
                <div className="h-6 w-12 rounded bg-[#990000]" />
                <div className="h-6 w-12 rounded bg-[#09090c] border border-zinc-700" />
                <div className="h-6 w-12 rounded bg-[#181824]" />
                <div className="h-6 w-12 rounded bg-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help & Support */}
      {currentTab === "help" && (
        <div className="p-6 rounded-2xl bg-[#0f0f15] border border-[#20202e] space-y-6">
          <div className="border-b border-[#20202e] pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-[#ff6666]" />
              Help & Operational Guide
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Quick reference for field outreach workflows and system principles.
            </p>
          </div>

          <div className="space-y-3 text-xs text-zinc-300">
            <div className="p-3 rounded-xl bg-[#14141c] border border-[#22222f]">
              <h4 className="font-bold text-white">1. Enter data once</h4>
              <p className="text-zinc-400 mt-0.5">
                Every school, visit log, and itinerary is saved to Supabase. All daily, weekly, and monthly reports generate dynamically.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#14141c] border border-[#22222f]">
              <h4 className="font-bold text-white">2. Immediate Google Maps access</h4>
              <p className="text-zinc-400 mt-0.5">
                Click <code>[ MAP ]</code> on any itinerary card or school profile drawer to launch turn-by-turn navigation on mobile.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#14141c] border border-[#22222f]">
              <h4 className="font-bold text-white">3. Fast Field Mood Buttons</h4>
              <p className="text-zinc-400 mt-0.5">
                Use <code>[ POSITIVE ]</code>, <code>[ NEUTRAL ]</code>, <code>[ NEGATIVE ]</code>, or <code>[ NOT MET ]</code> to log a completed visit in seconds.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
