"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, Mail, Shield, User, ArrowRight, CheckCircle2 } from "lucide-react";
import { useRole, UserRole } from "@/context/role-context";

export default function LoginPage() {
  const router = useRouter();
  const { setRole } = useRole();

  const [selectedRole, setSelectedRole] = useState<UserRole>("executive");
  const [email, setEmail] = useState("manikandan@aset.edu.in");
  const [password, setPassword] = useState("••••••••••••");
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (role: UserRole, userEmail: string) => {
    setSelectedRole(role);
    setEmail(userEmail);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setRole(selectedRole);

    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#07070a] px-4 py-12 text-zinc-100 selection:bg-[#990000] selection:text-white relative overflow-hidden">
      {/* Background Crimson Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#990000]/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Back to Home Link */}
      <div className="w-full max-w-md mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Landing</span>
        </Link>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md p-8 rounded-3xl bg-[#0e0e14] border border-[#20202c] shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#990000] to-[#550000] text-white font-black text-xl border border-rose-500/40 shadow-lg shadow-[#990000]/30 mb-2">
            A
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Access Outreach CRM</h1>
          <p className="text-xs text-zinc-400">
            Sign in with your authorized institutional credentials.
          </p>
        </div>

        {/* Role Quick Selector */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
            Select Role Preset
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleRoleSelect("executive", "manikandan@aset.edu.in")}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedRole === "executive"
                  ? "bg-[#990000]/20 border-[#990000] text-white"
                  : "bg-[#14141c] border-[#22222f] text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs">
                <User className="h-3.5 w-3.5 text-[#ff6666]" />
                <span>Executive</span>
              </div>
              <p className="text-[10px] text-zinc-500 mt-0.5">Field Outreach</p>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect("manager", "director@aset.edu.in")}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedRole === "manager"
                  ? "bg-[#990000]/20 border-[#990000] text-white"
                  : "bg-[#14141c] border-[#22222f] text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs">
                <Shield className="h-3.5 w-3.5 text-[#ff6666]" />
                <span>Manager</span>
              </div>
              <p className="text-[10px] text-zinc-500 mt-0.5">Outreach Director</p>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-400 mb-1.5 font-medium">Institutional Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[#22222f] bg-[#14141c] py-2.5 pl-10 pr-4 text-white focus:border-[#990000] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5 font-medium">
              <label className="text-zinc-400">Password</label>
              <a href="#" className="text-[11px] text-[#ff6666] hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[#22222f] bg-[#14141c] py-2.5 pl-10 pr-4 text-white focus:border-[#990000] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#990000] hover:bg-[#b91c1c] py-3 text-xs font-bold text-white shadow-xl shadow-[#990000]/30 transition-all hover:scale-[1.01] border border-rose-500/30 disabled:opacity-60"
          >
            <span>{loading ? "Authenticating..." : "Access CRM Dashboard"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="pt-2 text-center text-[11px] text-zinc-500 border-t border-[#1a1a26]">
          Authorized ASET personnel only · Session secured
        </div>
      </div>
    </div>
  );
}
