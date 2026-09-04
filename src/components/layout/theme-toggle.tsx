"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/theme-context";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={cn(
        "relative flex items-center p-1 rounded-full border transition-all select-none",
        theme === "dark"
          ? "bg-[#14141c] border-[#262634] text-zinc-400"
          : "bg-white border-zinc-200 text-zinc-500 shadow-sm",
        className
      )}
      role="group"
      aria-label="Theme selection"
    >
      {/* Light Mode Button */}
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={cn(
          "relative z-10 flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200",
          theme === "light"
            ? "bg-[#990000] text-white shadow-md shadow-[#990000]/30 scale-105"
            : "hover:text-zinc-900 dark:hover:text-white"
        )}
        title="Switch to Light Theme"
      >
        <Sun className="h-3.5 w-3.5" />
      </button>

      {/* Dark Mode Button */}
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={cn(
          "relative z-10 flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200",
          theme === "dark"
            ? "bg-[#990000] text-white shadow-md shadow-[#990000]/30 scale-105"
            : "hover:text-zinc-900 dark:hover:text-white"
        )}
        title="Switch to Dark Theme"
      >
        <Moon className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
