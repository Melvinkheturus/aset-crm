"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  School,
  ClipboardList,
  CalendarDays,
  BarChart3,
  Users,
  CheckSquare,
  TrendingUp,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  User,
  Shield,
  Palette,
  Bell,
  Download,
  Upload,
  HelpCircle,
  LogOut,
  RefreshCw,
  Activity,
  FileSpreadsheet
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRole } from "@/context/role-context";

export function Sidebar() {
  const pathname = usePathname();
  const { role, setRole, executiveName } = useRole();
  const [collapsed, setCollapsed] = useState(false);
  const [planningOpen, setPlanningOpen] = useState(true);
  const [schoolsOpen, setSchoolsOpen] = useState(true);
  const [activityOpen, setActivityOpen] = useState(true);

  const isSettings = pathname.startsWith("/dashboard/settings");

  // ──────────────────────────────────────────
  // 1. SETTINGS DEDICATED SIDEBAR
  // ──────────────────────────────────────────
  if (isSettings) {
    return (
      <aside
        className={cn(
          "relative flex flex-col border-r border-[#22222d] bg-[#0c0c10] text-[#f4f4f6] transition-all duration-300 z-30 shrink-0 select-none",
          collapsed ? "w-[72px]" : "w-[260px]"
        )}
      >
        {/* Settings Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-[#22222d]">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 text-zinc-300 hover:text-white transition-colors"
            title="Return to operational dashboard"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#181824] border border-[#2e2e3e] text-zinc-300 hover:border-[#990000]/60">
              <ArrowLeft className="h-4 w-4" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-xs tracking-wider text-white uppercase">
                  Settings
                </span>
                <span className="text-[10px] text-zinc-500">Back to operations</span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-[#1f1f2a] hover:text-white transition-colors"
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>

        {/* Settings Menu */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-4 text-xs">
          {/* General Section */}
          <div>
            {!collapsed && (
              <div className="px-2 pb-1.5 text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                General
              </div>
            )}
            <Link
              href="/dashboard/settings?tab=profile"
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 font-medium transition-colors",
                pathname === "/dashboard/settings" || pathname.includes("tab=profile")
                  ? "bg-[#990000] text-white font-semibold shadow-md shadow-[#990000]/25"
                  : "text-zinc-400 hover:bg-[#161622] hover:text-zinc-100"
              )}
            >
              <User className="h-4 w-4 shrink-0" />
              {!collapsed && <span>Profile</span>}
            </Link>
          </div>

          {/* Manager-only: Team */}
          {role === "manager" && (
            <div>
              {!collapsed && (
                <div className="px-2 pb-1.5 text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                  Team
                </div>
              )}
              <div className="space-y-0.5">
                <Link
                  href="/dashboard/settings?tab=team"
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-zinc-400 hover:bg-[#161622] hover:text-zinc-100 transition-colors"
                >
                  <Users className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>Team Members</span>}
                </Link>
                <Link
                  href="/dashboard/settings?tab=roles"
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-zinc-400 hover:bg-[#161622] hover:text-zinc-100 transition-colors"
                >
                  <Shield className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>Roles & Permissions</span>}
                </Link>
              </div>
            </div>
          )}

          {/* Data Section */}
          <div>
            {!collapsed && (
              <div className="px-2 pb-1.5 text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                Data & Storage
              </div>
            )}
            <div className="space-y-0.5">
              {role === "manager" && (
                <Link
                  href="/dashboard/settings?tab=import"
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-zinc-400 hover:bg-[#161622] hover:text-zinc-100 transition-colors"
                >
                  <Upload className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>Import Data</span>}
                </Link>
              )}
              <Link
                href="/dashboard/settings?tab=export"
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-zinc-400 hover:bg-[#161622] hover:text-zinc-100 transition-colors"
              >
                <Download className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{role === "manager" ? "Export Data" : "Export My Data"}</span>}
              </Link>
              {role === "manager" && (
                <Link
                  href="/dashboard/settings?tab=sync"
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-zinc-400 hover:bg-[#161622] hover:text-zinc-100 transition-colors"
                >
                  <RefreshCw className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>Sync Settings</span>}
                </Link>
              )}
            </div>
          </div>

          {/* System Section (Manager) */}
          {role === "manager" && (
            <div>
              {!collapsed && (
                <div className="px-2 pb-1.5 text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                  System
                </div>
              )}
              <Link
                href="/dashboard/settings?tab=activity"
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-zinc-400 hover:bg-[#161622] hover:text-zinc-100 transition-colors"
              >
                <Activity className="h-4 w-4 shrink-0" />
                {!collapsed && <span>Activity Log</span>}
              </Link>
            </div>
          )}

          {/* Preferences */}
          <div>
            {!collapsed && (
              <div className="px-2 pb-1.5 text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                Preferences
              </div>
            )}
            <div className="space-y-0.5">
              <Link
                href="/dashboard/settings?tab=appearance"
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-zinc-400 hover:bg-[#161622] hover:text-zinc-100 transition-colors"
              >
                <Palette className="h-4 w-4 shrink-0" />
                {!collapsed && <span>Appearance</span>}
              </Link>
              <Link
                href="/dashboard/settings?tab=notifications"
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-zinc-400 hover:bg-[#161622] hover:text-zinc-100 transition-colors"
              >
                <Bell className="h-4 w-4 shrink-0" />
                {!collapsed && <span>Notifications</span>}
              </Link>
            </div>
          </div>

          {/* Help & Support */}
          <div className="pt-2 border-t border-[#22222d]">
            <Link
              href="/dashboard/settings?tab=help"
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-zinc-400 hover:bg-[#161622] hover:text-zinc-100 transition-colors"
            >
              <HelpCircle className="h-4 w-4 shrink-0" />
              {!collapsed && <span>Help & Support</span>}
            </Link>
          </div>
        </div>

        {/* Footer with Exit / Logout */}
        <div className="p-3 border-t border-[#22222d] bg-[#0a0a0d]">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-xl px-3 py-2 text-zinc-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors text-xs font-medium"
          >
            <LogOut className="h-4 w-4 shrink-0 text-zinc-500" />
            {!collapsed && <span>Back to Dashboard</span>}
          </Link>
        </div>
      </aside>
    );
  }

  // ──────────────────────────────────────────
  // 2. OPERATIONAL SIDEBAR (EXECUTIVE / MANAGER)
  // ──────────────────────────────────────────
  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-[#22222d] bg-[#0c0c10] text-[#f4f4f6] transition-all duration-300 z-30 shrink-0 select-none",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-[#22222d]">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#990000] to-[#550000] text-white shadow-md shadow-[#990000]/30 font-bold text-lg tracking-wider border border-[#ff4d4d]/30">
            A
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm tracking-wide text-white flex items-center gap-1.5">
                ASET CRM
              </span>
              <span className="text-[11px] text-[#ff8080] font-medium truncate">
                {role === "manager" ? "Management Console" : "School Outreach Engine"}
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-1.5 text-zinc-400 hover:bg-[#1f1f2a] hover:text-white transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      {/* Role Toggle Switcher */}
      {!collapsed && (
        <div className="px-3 pt-3">
          <div className="flex items-center rounded-xl bg-[#14141c] p-1 border border-[#22222f]">
            <button
              onClick={() => setRole("executive")}
              className={cn(
                "flex-1 rounded-lg py-1 text-[11px] font-semibold transition-all text-center",
                role === "executive"
                  ? "bg-[#990000] text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              Executive
            </button>
            <button
              onClick={() => setRole("manager")}
              className={cn(
                "flex-1 rounded-lg py-1 text-[11px] font-semibold transition-all text-center",
                role === "manager"
                  ? "bg-[#990000] text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              Manager
            </button>
          </div>
        </div>
      )}

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {/* 1. DASHBOARD (Primary dominant starting point) */}
        <Link
          href="/dashboard"
          className={cn(
            "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
            pathname === "/dashboard"
              ? "bg-[#990000] text-white font-semibold shadow-lg shadow-[#990000]/25"
              : "text-zinc-400 hover:bg-[#181822] hover:text-zinc-100"
          )}
          title={collapsed ? "Dashboard" : undefined}
        >
          <LayoutDashboard className="h-5 w-5 shrink-0" />
          {!collapsed && <span className="flex-1 truncate">Dashboard</span>}
        </Link>

        {/* 2. ROLE-SPECIFIC ITEMS */}
        {role === "executive" ? (
          /* ─── EXECUTIVE MENU ─── */
          <>
            {/* My Schools */}
            <Link
              href="/dashboard/schools"
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                pathname.startsWith("/dashboard/schools")
                  ? "bg-[#990000] text-white font-semibold shadow-lg shadow-[#990000]/25"
                  : "text-zinc-400 hover:bg-[#181822] hover:text-zinc-100"
              )}
              title={collapsed ? "My Schools" : undefined}
            >
              <School className="h-5 w-5 shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate">My Schools</span>
                  <span className="rounded-full bg-[#20202c] px-2 py-0.5 text-[10px] font-semibold text-zinc-300">
                    201
                  </span>
                </>
              )}
            </Link>

            {/* Planning (Collapsible with Today, This Week, This Month) */}
            <div className="space-y-0.5">
              <button
                onClick={() => setPlanningOpen(!planningOpen)}
                className="w-full group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 hover:bg-[#181822] hover:text-zinc-100 transition-colors"
                title={collapsed ? "Planning" : undefined}
              >
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>Planning</span>}
                </div>
                {!collapsed && (
                  planningOpen ? <ChevronDown className="h-4 w-4 text-zinc-500" /> : <ChevronRight className="h-4 w-4 text-zinc-500" />
                )}
              </button>

              {!collapsed && planningOpen && (
                <div className="ml-6 space-y-1 pl-2 border-l border-[#242434]">
                  <Link
                    href="/dashboard/itinerary?tab=today"
                    className={cn(
                      "block rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                      pathname === "/dashboard/itinerary"
                        ? "text-[#ff6666] font-semibold bg-[#990000]/10"
                        : "text-zinc-400 hover:text-zinc-200"
                    )}
                  >
                    Today
                  </Link>
                  <Link
                    href="/dashboard/itinerary?tab=weekly"
                    className="block rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    This Week
                  </Link>
                  <Link
                    href="/dashboard/itinerary?tab=monthly"
                    className="block rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    This Month
                  </Link>
                </div>
              )}
            </div>

            {/* Visit Log */}
            <Link
              href="/dashboard/visits"
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                pathname.startsWith("/dashboard/visits")
                  ? "bg-[#990000] text-white font-semibold shadow-lg shadow-[#990000]/25"
                  : "text-zinc-400 hover:bg-[#181822] hover:text-zinc-100"
              )}
              title={collapsed ? "Visit Log" : undefined}
            >
              <ClipboardList className="h-5 w-5 shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate">Visit Log</span>
                  <span className="rounded-full bg-[#20202c] px-2 py-0.5 text-[10px] font-semibold text-zinc-300">
                    211
                  </span>
                </>
              )}
            </Link>

            {/* Follow-ups */}
            <Link
              href="/dashboard/followups"
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                pathname.startsWith("/dashboard/followups")
                  ? "bg-[#990000] text-white font-semibold shadow-lg shadow-[#990000]/25"
                  : "text-zinc-400 hover:bg-[#181822] hover:text-zinc-100"
              )}
              title={collapsed ? "Follow-ups" : undefined}
            >
              <CheckSquare className="h-5 w-5 shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate">Follow-ups</span>
                  <span className="rounded-full bg-rose-950/60 border border-rose-700/50 px-2 py-0.5 text-[10px] font-semibold text-rose-300">
                    15
                  </span>
                </>
              )}
            </Link>

            {/* Divider */}
            <div className="my-2 border-t border-[#20202c]" />

            {/* Reports */}
            <Link
              href="/dashboard/reports"
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                pathname.startsWith("/dashboard/reports")
                  ? "bg-[#990000] text-white font-semibold shadow-lg shadow-[#990000]/25"
                  : "text-zinc-400 hover:bg-[#181822] hover:text-zinc-100"
              )}
              title={collapsed ? "Reports" : undefined}
            >
              <BarChart3 className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="flex-1 truncate">Reports</span>}
            </Link>

            {/* My Analytics */}
            <Link
              href="/dashboard/analytics"
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                pathname.startsWith("/dashboard/analytics")
                  ? "bg-[#990000] text-white font-semibold shadow-lg shadow-[#990000]/25"
                  : "text-zinc-400 hover:bg-[#181822] hover:text-zinc-100"
              )}
              title={collapsed ? "My Analytics" : undefined}
            >
              <TrendingUp className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="flex-1 truncate">My Analytics</span>}
            </Link>
          </>
        ) : (
          /* ─── MANAGER MENU ─── */
          <>
            {/* Team */}
            <Link
              href="/dashboard/team"
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                pathname.startsWith("/dashboard/team")
                  ? "bg-[#990000] text-white font-semibold shadow-lg shadow-[#990000]/25"
                  : "text-zinc-400 hover:bg-[#181822] hover:text-zinc-100"
              )}
              title={collapsed ? "Team" : undefined}
            >
              <Users className="h-5 w-5 shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate">Team</span>
                  <span className="rounded-full bg-[#20202c] px-2 py-0.5 text-[10px] font-semibold text-zinc-300">
                    6
                  </span>
                </>
              )}
            </Link>

            {/* Schools (Master Database, Ownership, Access Requests) */}
            <div className="space-y-0.5">
              <button
                onClick={() => setSchoolsOpen(!schoolsOpen)}
                className="w-full group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 hover:bg-[#181822] hover:text-zinc-100 transition-colors"
                title={collapsed ? "Schools" : undefined}
              >
                <div className="flex items-center gap-3">
                  <School className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>Schools</span>}
                </div>
                {!collapsed && (
                  schoolsOpen ? <ChevronDown className="h-4 w-4 text-zinc-500" /> : <ChevronRight className="h-4 w-4 text-zinc-500" />
                )}
              </button>

              {!collapsed && schoolsOpen && (
                <div className="ml-6 space-y-1 pl-2 border-l border-[#242434]">
                  <Link
                    href="/dashboard/schools"
                    className={cn(
                      "block rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                      pathname === "/dashboard/schools"
                        ? "text-[#ff6666] font-semibold bg-[#990000]/10"
                        : "text-zinc-400 hover:text-zinc-200"
                    )}
                  >
                    Master Database
                  </Link>
                  <Link
                    href="/dashboard/schools?view=ownership"
                    className="block rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    Ownership
                  </Link>
                  <Link
                    href="/dashboard/schools?view=requests"
                    className="block rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    Access Requests
                  </Link>
                </div>
              )}
            </div>

            {/* Planning (Today, This Week, This Month) */}
            <div className="space-y-0.5">
              <button
                onClick={() => setPlanningOpen(!planningOpen)}
                className="w-full group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 hover:bg-[#181822] hover:text-zinc-100 transition-colors"
                title={collapsed ? "Planning" : undefined}
              >
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>Planning</span>}
                </div>
                {!collapsed && (
                  planningOpen ? <ChevronDown className="h-4 w-4 text-zinc-500" /> : <ChevronRight className="h-4 w-4 text-zinc-500" />
                )}
              </button>

              {!collapsed && planningOpen && (
                <div className="ml-6 space-y-1 pl-2 border-l border-[#242434]">
                  <Link
                    href="/dashboard/management"
                    className={cn(
                      "block rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                      pathname === "/dashboard/management"
                        ? "text-[#ff6666] font-semibold bg-[#990000]/10"
                        : "text-zinc-400 hover:text-zinc-200"
                    )}
                  >
                    Today & Next Field
                  </Link>
                  <Link
                    href="/dashboard/itinerary?tab=weekly"
                    className="block rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    This Week
                  </Link>
                  <Link
                    href="/dashboard/itinerary?tab=monthly"
                    className="block rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    This Month
                  </Link>
                </div>
              )}
            </div>

            {/* Activity (Visit Log, Follow-ups) */}
            <div className="space-y-0.5">
              <button
                onClick={() => setActivityOpen(!activityOpen)}
                className="w-full group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 hover:bg-[#181822] hover:text-zinc-100 transition-colors"
                title={collapsed ? "Activity" : undefined}
              >
                <div className="flex items-center gap-3">
                  <ClipboardList className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>Activity</span>}
                </div>
                {!collapsed && (
                  activityOpen ? <ChevronDown className="h-4 w-4 text-zinc-500" /> : <ChevronRight className="h-4 w-4 text-zinc-500" />
                )}
              </button>

              {!collapsed && activityOpen && (
                <div className="ml-6 space-y-1 pl-2 border-l border-[#242434]">
                  <Link
                    href="/dashboard/visits"
                    className="block rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    Visit Log
                  </Link>
                  <Link
                    href="/dashboard/followups"
                    className="block rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    Follow-ups
                  </Link>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="my-2 border-t border-[#20202c]" />

            {/* Reports */}
            <Link
              href="/dashboard/reports"
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                pathname.startsWith("/dashboard/reports")
                  ? "bg-[#990000] text-white font-semibold shadow-lg shadow-[#990000]/25"
                  : "text-zinc-400 hover:bg-[#181822] hover:text-zinc-100"
              )}
              title={collapsed ? "Reports" : undefined}
            >
              <BarChart3 className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="flex-1 truncate">Reports</span>}
            </Link>

            {/* Analytics */}
            <Link
              href="/dashboard/analytics"
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                pathname.startsWith("/dashboard/analytics")
                  ? "bg-[#990000] text-white font-semibold shadow-lg shadow-[#990000]/25"
                  : "text-zinc-400 hover:bg-[#181822] hover:text-zinc-100"
              )}
              title={collapsed ? "Analytics" : undefined}
            >
              <TrendingUp className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="flex-1 truncate">Analytics</span>}
            </Link>
          </>
        )}

        {/* Divider */}
        <div className="my-2 border-t border-[#20202c]" />

        {/* 3. SETTINGS */}
        <Link
          href="/dashboard/settings"
          className={cn(
            "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
            pathname.startsWith("/dashboard/settings")
              ? "bg-[#990000] text-white font-semibold shadow-lg shadow-[#990000]/25"
              : "text-zinc-400 hover:bg-[#181822] hover:text-zinc-100"
          )}
          title={collapsed ? "Settings" : undefined}
        >
          <Settings className="h-5 w-5 shrink-0" />
          {!collapsed && <span className="flex-1 truncate">Settings</span>}
        </Link>
      </div>

      {/* Footer Profile & Role State */}
      <div className="p-3 border-t border-[#22222d] bg-[#0a0a0d]">
        <div className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-[#16161f] transition-colors">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#990000] to-rose-700 text-white font-semibold text-xs border border-rose-400/40">
            {executiveName.charAt(0)}
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0c0c10]" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-white truncate">{executiveName}</span>
              <span className="text-[10px] text-zinc-400 truncate">
                {role === "manager" ? "Outreach Director / Manager" : "Senior Field Executive"}
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
