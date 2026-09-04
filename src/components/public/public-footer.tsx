import Link from "next/link";
import { Shield } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="w-full border-t border-[#1e1e2c] bg-[#07070a] py-8 text-xs text-zinc-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#990000] text-white font-bold text-[10px]">
            A
          </div>
          <span className="font-semibold text-zinc-300">ASET School Outreach CRM</span>
          <span className="text-zinc-600">·</span>
          <span className="flex items-center gap-1 text-[11px] text-zinc-400">
            <Shield className="h-3 w-3 text-rose-500" />
            Authorized Access Only
          </span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/docs" className="hover:text-zinc-300 transition-colors">
            Documentation
          </Link>
          <Link href="/changelog" className="hover:text-zinc-300 transition-colors">
            Changelog
          </Link>
          <span>© 2026 ASET</span>
        </div>
      </div>
    </footer>
  );
}
