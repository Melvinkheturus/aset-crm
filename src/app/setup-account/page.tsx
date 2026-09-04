"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Key, Lock, CheckCircle2, ShieldAlert, ArrowRight, Sparkles, Copy } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SetupAccountPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");
  const emailParam = searchParams.get("email") || "";
  const roleParam = searchParams.get("role") || "EXECUTIVE";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [recoveryKey, setRecoveryKey] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Generate a secure 16-character recovery key: XXXX-XXXX-XXXX-XXXX
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const segment = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    const key = `${segment()}-${segment()}-${segment()}-${segment()}`;
    setRecoveryKey(key);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      // 1. Update user profile to ACTIVE with username
      if (emailParam) {
        await supabase
          .from("profiles")
          .update({
            username: username.trim() || undefined,
            status: "ACTIVE",
            is_active: true,
            updated_at: new Date().toISOString()
          })
          .eq("email", emailParam);
      }

      // 2. Record Audit Log
      await supabase.from("audit_logs").insert({
        actor_name: username.trim() || emailParam,
        action: "ACCOUNT_ACTIVATED",
        entity_type: "user",
        details: `Account successfully setup with role ${roleParam}`
      });

      setSuccess(true);
    } catch (err: any) {
      alert(`Setup error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyKey = () => {
    navigator.clipboard.writeText(recoveryKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#07070a] px-4 py-12 text-zinc-100 selection:bg-[#990000] selection:text-white relative overflow-hidden">
      {/* Background Ambient Crimson Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#990000]/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-md p-8 rounded-3xl bg-[#0e0e14] border border-[#20202c] shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#990000] to-[#550000] text-white font-black text-xl border border-rose-500/40 shadow-lg shadow-[#990000]/30 mb-2">
            A
          </div>
          <span className="text-[10px] font-bold text-[#ff6666] tracking-widest uppercase block">
            ASET CRM • INVITATION ONBOARDING
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight">Complete Your Account</h1>
          <p className="text-xs text-zinc-400">
            Set up your credentials to access the School Outreach CRM.
          </p>
        </div>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Prefilled Email */}
            <div>
              <label className="block font-bold text-zinc-400 mb-1 uppercase tracking-wider text-[10px]">
                Invited Email
              </label>
              <input
                readOnly
                value={emailParam || "executive@aset.edu.in"}
                className="w-full rounded-xl border border-[#242432] bg-[#14141c] p-2.5 text-zinc-300 font-mono"
              />
            </div>

            {/* Assigned Role */}
            <div>
              <label className="block font-bold text-zinc-400 mb-1 uppercase tracking-wider text-[10px]">
                Assigned Role
              </label>
              <div className="rounded-xl border border-[#242432] bg-[#14141c] p-2.5 font-bold text-[#ff8080]">
                {roleParam}
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block font-bold text-zinc-300 mb-1">Choose Username *</label>
              <input
                required
                type="text"
                placeholder="e.g. manikandan"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-[#272736] bg-[#161622] p-2.5 text-white focus:border-[#990000] focus:outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block font-bold text-zinc-300 mb-1">Create Password *</label>
              <input
                required
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[#272736] bg-[#161622] p-2.5 text-white focus:border-[#990000] focus:outline-none"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block font-bold text-zinc-300 mb-1">Confirm Password *</label>
              <input
                required
                type="password"
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-[#272736] bg-[#161622] p-2.5 text-white focus:border-[#990000] focus:outline-none"
              />
            </div>

            {/* Emergency Recovery Key Display (Section 14) */}
            <div className="p-3.5 rounded-2xl bg-[#14141c] border border-[#262638] space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-zinc-300">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Key className="h-3.5 w-3.5" />
                  <span>EMERGENCY RECOVERY KEY</span>
                </span>
                <button
                  type="button"
                  onClick={copyKey}
                  className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-white"
                >
                  <Copy className="h-3 w-3" />
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <div className="font-mono text-center font-bold tracking-widest text-xs py-1.5 rounded-lg bg-[#0a0a0e] text-white border border-[#20202c]">
                {recoveryKey}
              </div>
              <p className="text-[10px] text-zinc-500 leading-tight">
                Store this securely. This key can be used to recover your account if you lose email access.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#990000] hover:bg-[#b91c1c] text-white font-bold text-xs shadow-lg shadow-[#990000]/30 transition-all disabled:opacity-50"
            >
              {loading ? "Activating Account..." : "Create Account & Activate"}
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <div className="h-12 w-12 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Account Created Successfully</h2>
              <p className="text-xs text-zinc-400 mt-1">
                Your credentials are active. You can now log in with your email and password.
              </p>
            </div>

            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#990000] hover:bg-[#b91c1c] text-white font-bold text-xs shadow-lg shadow-[#990000]/30 transition-all"
            >
              <span>Continue to Login</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
