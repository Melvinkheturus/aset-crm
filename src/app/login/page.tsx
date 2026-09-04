"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, Mail, Shield, User, ArrowRight, CheckCircle2, Sparkles, Key } from "lucide-react";
import { useRole, UserRole } from "@/context/role-context";
import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  const router = useRouter();
  const { setRole } = useRole();

  const [activeMode, setActiveMode] = useState<"clerk" | "preset">("clerk");
  const [selectedRole, setSelectedRole] = useState<UserRole>("EXECUTIVE");
  const [email, setEmail] = useState("manikandan@aset.edu.in");
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (role: UserRole, userEmail: string) => {
    setSelectedRole(role);
    setEmail(userEmail);
  };

  const handleQuickDemoLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setRole(selectedRole);

    setTimeout(() => {
      setLoading(false);
      if (selectedRole === "SUPER_ADMIN") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard");
      }
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#07070a] px-4 py-12 text-zinc-100 selection:bg-[#990000] selection:text-white relative overflow-hidden">
      {/* Background Crimson Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#990000]/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Back to Home Link */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Landing</span>
        </Link>

        {/* Auth Mode Toggle */}
        <div className="flex items-center rounded-xl bg-[#14141c] p-1 border border-[#22222f] text-[11px]">
          <button
            onClick={() => setActiveMode("clerk")}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              activeMode === "clerk"
                ? "bg-[#990000] text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Clerk Auth
          </button>
          <button
            onClick={() => setActiveMode("preset")}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              activeMode === "preset"
                ? "bg-[#990000] text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Role Presets
          </button>
        </div>
      </div>

      {activeMode === "clerk" ? (
        /* CLERK OFFICIAL SIGN IN COMPONENT (NO PUBLIC SIGNUP) */
        <div className="flex flex-col items-center w-full max-w-md">
          <SignIn
            routing="hash"
            fallbackRedirectUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-[#0e0e14] border border-[#20202c] shadow-2xl rounded-3xl p-6 w-full",
                headerTitle: "text-white font-bold",
                headerSubtitle: "text-zinc-400 text-xs",
                formButtonPrimary: "bg-[#990000] hover:bg-[#b91c1c] text-white",
                formFieldLabel: "text-zinc-300 text-xs",
                formFieldInput: "bg-[#14141c] border-[#22222f] text-white rounded-xl",
                footerAction: "hidden", // STRICTLY HIDE PUBLIC SIGNUP LINK
              }
            }}
          />
          <div className="flex items-center justify-between w-full px-2 mt-4 text-xs">
            <Link href="/recovery" className="text-zinc-400 hover:text-white transition-colors">
              Forgot password?
            </Link>
            <span className="text-[11px] text-zinc-500">Authorized Personnel Only</span>
          </div>
        </div>
      ) : (
        /* QUICK ROLE PRESET LOGIN */
        <div className="w-full max-w-md p-8 rounded-3xl bg-[#0e0e14] border border-[#20202c] shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#990000] to-[#550000] text-white font-black text-xl border border-rose-500/40 shadow-lg shadow-[#990000]/30 mb-2">
              A
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">ASET CRM Login</h1>
            <p className="text-xs text-zinc-400">
              Select persona to test with simulated role permissions.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
              Choose Persona
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleRoleSelect("EXECUTIVE", "manikandan@aset.edu.in")}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedRole === "EXECUTIVE"
                    ? "bg-[#990000]/20 border-[#990000] text-white"
                    : "bg-[#14141c] border-[#22222f] text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <User className="h-3 w-3 text-[#ff6666]" />
                  <span>Exec</span>
                </div>
                <p className="text-[10px] text-zinc-500 mt-0.5 truncate">Manikandan</p>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect("MANAGER", "director@aset.edu.in")}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedRole === "MANAGER"
                    ? "bg-[#990000]/20 border-[#990000] text-white"
                    : "bg-[#14141c] border-[#22222f] text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Shield className="h-3 w-3 text-[#ff6666]" />
                  <span>Manager</span>
                </div>
                <p className="text-[10px] text-zinc-500 mt-0.5 truncate">Director</p>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect("SUPER_ADMIN", "admin@aset.edu.in")}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedRole === "SUPER_ADMIN"
                    ? "bg-[#990000]/20 border-[#990000] text-white"
                    : "bg-[#14141c] border-[#22222f] text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Key className="h-3 w-3 text-purple-400" />
                  <span>Admin</span>
                </div>
                <p className="text-[10px] text-zinc-500 mt-0.5 truncate">Super Admin</p>
              </button>
            </div>
          </div>

          <form onSubmit={handleQuickDemoLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-400 mb-1.5 font-medium">Assigned Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="email"
                  readOnly
                  value={email}
                  className="w-full rounded-xl border border-[#22222f] bg-[#14141c]/60 py-2.5 pl-10 pr-4 text-zinc-300 focus:outline-none cursor-default"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#990000] hover:bg-[#b91c1c] py-3 font-bold text-white shadow-lg shadow-[#990000]/30 transition-all hover:scale-[1.01] disabled:opacity-50"
            >
              <span>{loading ? "Authenticating..." : `Login as ${selectedRole}`}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="flex items-center justify-between pt-2 border-t border-[#1c1c28] text-xs">
            <Link href="/recovery" className="text-zinc-400 hover:text-white transition-colors">
              Forgot password?
            </Link>
            <span className="text-[11px] text-zinc-500">No public signup</span>
          </div>
        </div>
      )}
    </div>
  );
}
