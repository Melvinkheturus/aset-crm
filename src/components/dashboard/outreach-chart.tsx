"use client";

import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import { useTheme } from "@/context/theme-context";

const OUTREACH_TREND_DATA = [
  { date: "Aug 20", planned: 10, conducted: 8, appointments: 3 },
  { date: "Aug 24", planned: 14, conducted: 12, appointments: 4 },
  { date: "Aug 28", planned: 16, conducted: 15, appointments: 6 },
  { date: "Aug 31", planned: 18, conducted: 17, appointments: 7 },
  { date: "Sep 02", planned: 12, conducted: 11, appointments: 4 },
  { date: "Sep 04", planned: 14, conducted: 9, appointments: 4 },
  { date: "Sep 05", planned: 14, conducted: 12, appointments: 6 },
  { date: "Sep 08", planned: 15, conducted: 13, appointments: 5 },
  { date: "Sep 12", planned: 16, conducted: 14, appointments: 6 },
  { date: "Sep 15", planned: 18, conducted: 16, appointments: 8 },
];

export function OutreachChart() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [timeframe, setTimeframe] = useState<"monthly" | "weekly">("monthly");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-[280px] w-full flex items-center justify-center text-xs text-zinc-500">
        Loading outreach analytics chart...
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <div className="w-full">
      {/* Chart Header Bar */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
            Outreach Velocity & Field Execution
          </h3>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Conducted school visits vs planned route capacity
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg bg-zinc-100 dark:bg-[#181822] p-0.5 border border-zinc-200 dark:border-[#262638] text-[11px]">
            <button
              onClick={() => setTimeframe("weekly")}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                timeframe === "weekly"
                  ? "bg-[#990000] text-white shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setTimeframe("monthly")}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                timeframe === "monthly"
                  ? "bg-[#990000] text-white shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
              }`}
            >
              Monthly
            </button>
          </div>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={OUTREACH_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {/* Crimson Gradient Fill */}
              <linearGradient id="crimsonAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#DC2626" stopOpacity={isDark ? 0.45 : 0.25} />
                <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="neutralLineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#71717A" stopOpacity={isDark ? 0.15 : 0.08} />
                <stop offset="95%" stopColor="#71717A" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? "#232330" : "#E5E7EB"}
              vertical={false}
            />

            <XAxis
              dataKey="date"
              stroke={isDark ? "#71717A" : "#9CA3AF"}
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              stroke={isDark ? "#71717A" : "#9CA3AF"}
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-xl border border-zinc-200 dark:border-[#2a2a3c] bg-white/95 dark:bg-[#161622]/95 p-3 text-xs shadow-xl backdrop-blur-md">
                      <div className="font-bold text-zinc-900 dark:text-white mb-1.5 pb-1 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
                        <span>{data.date}, 2026</span>
                        <span className="text-[10px] text-[#ff6666] font-mono">Verified</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-zinc-500 dark:text-zinc-400">Conducted Visits:</span>
                          <span className="font-black text-[#ff4d4d]">{data.conducted}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-zinc-500 dark:text-zinc-400">Planned Capacity:</span>
                          <span className="font-bold text-zinc-700 dark:text-zinc-300">{data.planned}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-zinc-500 dark:text-zinc-400">Appointments:</span>
                          <span className="font-bold text-amber-500">{data.appointments}</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Target Capacity Line */}
            <Area
              type="monotone"
              dataKey="planned"
              stroke={isDark ? "#52525B" : "#D1D5DB"}
              strokeWidth={1.5}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#neutralLineGradient)"
            />

            {/* Conducted Actual Visits Crimson Gradient Curve */}
            <Area
              type="monotone"
              dataKey="conducted"
              stroke="#DC2626"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#crimsonAreaGradient)"
              activeDot={{ r: 5, fill: "#DC2626", stroke: "#FFFFFF", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-2 text-[11px] text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#DC2626]" />
          <span>Conducted Field Visits</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-600" />
          <span>Planned Target Capacity</span>
        </div>
      </div>
    </div>
  );
}
