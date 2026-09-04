"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  School,
  CalendarDays,
  ClipboardList,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

const BOTTOM_ITEMS = [
  { title: "Home", href: "/dashboard", icon: LayoutDashboard },
  { title: "Schools", href: "/dashboard/schools", icon: School },
  { title: "Plan", href: "/dashboard/itinerary", icon: CalendarDays },
  { title: "Visits", href: "/dashboard/visits", icon: ClipboardList },
  { title: "Reports", href: "/dashboard/reports", icon: BarChart3 },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-[#23232f] bg-[#0c0c10]/95 px-2 backdrop-blur-lg md:hidden">
      {BOTTOM_ITEMS.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href));
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 py-1 text-[10px] font-medium transition-colors",
              isActive ? "text-[#ff6666] font-bold" : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <div
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-xl transition-all",
                isActive ? "bg-[#990000] text-white shadow-md shadow-[#990000]/40" : ""
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
