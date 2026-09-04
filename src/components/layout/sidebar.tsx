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
  UserCheck,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  ChevronRight,
  ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    badge: null
  },
  {
    title: "School Master",
    href: "/dashboard/schools",
    icon: School,
    badge: "201"
  },
  {
    title: "Visit Log",
    href: "/dashboard/visits",
    icon: ClipboardList,
    badge: "211"
  },
  {
    title: "Itinerary & Plans",
    href: "/dashboard/itinerary",
    icon: CalendarDays,
    badge: "69"
  },
  {
    title: "Reports Engine",
    href: "/dashboard/reports",
    icon: BarChart3,
    badge: "Auto"
  },
  {
    title: "Management View",
    href: "/dashboard/management",
    icon: UserCheck,
    badge: "Next Day",
    highlight: true
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

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
                <span className="rounded bg-[#990000]/20 px-1.5 py-0.5 text-[10px] font-semibold text-[#ff6666] border border-[#990000]/40">
                  v2.0
                </span>
              </span>
              <span className="text-[11px] text-zinc-400 truncate">School Outreach Engine</span>
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

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {!collapsed && (
          <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">
            Operations & Field
          </div>
        )}
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-[#990000] text-white font-semibold shadow-lg shadow-[#990000]/25"
                  : "text-zinc-400 hover:bg-[#181822] hover:text-zinc-100",
                item.highlight && !isActive && "border border-[#990000]/30 bg-[#990000]/10 text-rose-200"
              )}
              title={collapsed ? item.title : undefined}
            >
              <Icon className={cn("h-5 w-5 shrink-0 transition-transform group-hover:scale-105", isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-200")} />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate">{item.title}</span>
                  {item.badge && (
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums",
                        isActive
                          ? "bg-white/20 text-white"
                          : item.highlight
                          ? "bg-[#990000]/30 text-rose-300 border border-[#990000]/50"
                          : "bg-[#20202c] text-zinc-300"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer Executive Profile */}
      <div className="p-3 border-t border-[#22222d] bg-[#0a0a0d]">
        <div className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-[#16161f] transition-colors">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#990000] to-rose-700 text-white font-semibold text-xs border border-rose-400/40">
            M
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0c0c10]" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-white truncate">Manikandan</span>
              <span className="text-[10px] text-zinc-400 truncate">Senior Field Executive</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
