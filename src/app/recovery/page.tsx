"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Key, Mail, CheckCircle2, ShieldAlert } from "lucide-react";

export default function RecoveryPage() {
  const [mode, setMode] = useState<"standard" | "key">("standard");
  const [email, setEmail] = useState("");
  const [recoveryKey, setRecoveryKey] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#07070a] px-4 py-12 text-zinc-100 selection:bg-[#990000] selection:text-white relative overflow-hidden">
      {/* Background Ambient Crimson Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#990000]/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-md p-8 rounded-3xl bg-[#0e0e14] border border-[#20202c] shadow-2xl space-y-6">
        {/* Back Link */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Login</span>
        </Link>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#990000] to-[#550000] text-white font-black text-xl border border-rose-500/40 shadow-lg shadow-[#990000]/30 mb-2">
            A
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Account Recovery</h1>
          <p className="text-xs text-zinc-400">
            Reset access to your authorized ASET Outreach CRM account.
          </p>
        </div>

        {/* Recovery Mode Selector */}
        <div className="flex items-center rounded-xl bg-[#14141c] p-1 border border-[#22222f] text-xs">
          <button
            type="button"
            onClick={() => {
              setMode("standard");
              setSubmitted(false);
            }}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
              mode === "standard" ? "bg-[#990000] text-white shadow-sm" : "text-zinc-400 hover:text-white"
            }`}
          >
            Email Reset
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("key");
              setSubmitted(false);
            }}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
              mode === "key" ? "bg-[#990000] text-white shadow-sm" : "text-zinc-400 hover:text-white"
            }`}
          >
            Recovery Key
          </button>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {mode === "standard" ? (
              <div>
                <label className="block font-bold text-zinc-300 mb-1">Official Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    required
                    type="email"
                    placeholder="manikandan@aset.edu.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-[#272736] bg-[#161622] py-2.5 pl-10 pr-3 text-white focus:border-[#990000] focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-zinc-300 mb-1">Official Email Address *</label>
                  <input
                    required
                    type="email"
                    placeholder="manikandan@aset.edu.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-[#272736] bg-[#161622] p-2.5 text-white focus:border-[#990000] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-300 mb-1">16-Character Recovery Key *</label>
                  <div className="relative">
                    <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input
                      required
                      type="text"
                      placeholder="XXXX-XXXX-XXXX-XXXX"
                      value={recoveryKey}
                      onChange={(e) => setRecoveryKey(e.target.value)}
                      className="w-full rounded-xl border border-[#272736] bg-[#161622] py-2.5 pl-10 pr-3 font-mono text-white focus:border-[#990000] focus:outline-none uppercase"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#990000] hover:bg-[#b91c1c] text-white font-bold text-xs shadow-lg shadow-[#990000]/30 transition-all disabled:opacity-50"
            >
              {loading ? "Verifying..." : mode === "standard" ? "Send Reset Link" : "Verify & Unlock"}
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <div className="h-12 w-12 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Recovery Instructions Sent</h2>
              <p className="text-xs text-zinc-400 mt-1">
                If an active account exists for <strong>{email}</strong>, verification details have been issued.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-block text-xs font-bold text-[#ff6666] hover:underline"
            >
              Return to Login →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
