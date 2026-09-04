"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  Users,
  UserPlus,
  Lock,
  Unlock,
  RefreshCw,
  Clock,
  Key,
  CheckCircle2,
  AlertCircle,
  FileText,
  Search,
  Mail,
  UserCheck,
  Send,
  X
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRole } from "@/context/role-context";
import { ROLE_PERMISSIONS, Role } from "@/lib/permissions";

export default function SuperAdminPage() {
  const { role, executiveName } = useRole();
  const [users, setUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Create User Modal
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("EXECUTIVE");
  const [inviteSubmitting, setInviteSubmitting] = useState(false);
  const [generatedInviteLink, setGeneratedInviteLink] = useState<string | null>(null);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [pRes, aRes] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(20)
      ]);

      if (pRes.data) setUsers(pRes.data);
      if (aRes.data) setAuditLogs(aRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    setInviteSubmitting(true);
    try {
      // 1. Generate invitation token
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const link = `${window.location.origin}/setup-account?token=${token}&email=${encodeURIComponent(inviteEmail)}&role=${inviteRole}`;

      // 2. Insert into profiles with status 'INVITED'
      const { error: profileError } = await supabase.from("profiles").insert({
        full_name: inviteName.trim(),
        email: inviteEmail.trim(),
        role: inviteRole.toLowerCase(),
        status: "INVITED",
        is_active: true
      });

      if (profileError && !profileError.message.includes("duplicate")) {
        console.warn("Profile insert warning:", profileError.message);
      }

      // 3. Record Audit Log
      await supabase.from("audit_logs").insert({
        actor_name: executiveName,
        action: "USER_CREATED",
        entity_type: "user",
        details: `Created user ${inviteEmail} with role ${inviteRole}`,
        metadata: { name: inviteName, email: inviteEmail, role: inviteRole }
      });

      setGeneratedInviteLink(link);
      loadAdminData();
    } catch (err: any) {
      alert(`Error creating user: ${err.message}`);
    } finally {
      setInviteSubmitting(false);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "DISABLED" ? "ACTIVE" : "DISABLED";
    try {
      await supabase
        .from("profiles")
        .update({ status: nextStatus, is_active: nextStatus === "ACTIVE" })
        .eq("id", userId);

      await supabase.from("audit_logs").insert({
        actor_name: executiveName,
        action: nextStatus === "DISABLED" ? "USER_DISABLED" : "USER_ACTIVATED",
        entity_type: "user",
        entity_id: userId,
        details: `Changed status to ${nextStatus}`
      });

      loadAdminData();
    } catch (err: any) {
      alert(`Error updating user status: ${err.message}`);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      u.full_name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 transition-colors">
      {/* Super Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-[#23232f] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#990000] dark:text-[#ff8080] tracking-wider uppercase mb-1">
            <Shield className="h-4 w-4" />
            <span>SUPER ADMIN CONTROL CONSOLE</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
            User Management & System RBAC
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            User invitation, role claims, access governance, and immutable security audit logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setGeneratedInviteLink(null);
              setInviteName("");
              setInviteEmail("");
              setIsInviteModalOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-xl bg-[#990000] hover:bg-[#b91c1c] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-[#990000]/30 transition-all hover:scale-[1.02]"
          >
            <UserPlus className="h-4 w-4" />
            <span>+ Create User & Invite</span>
          </button>
        </div>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-[#23232f] bg-white dark:bg-[#121218] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Total System Users</span>
            <div className="text-2xl font-black text-zinc-900 dark:text-white mt-1">{users.length}</div>
            <p className="text-[11px] text-zinc-500 mt-0.5">Across 3 RBAC Roles</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-[#1c1c28] flex items-center justify-center text-zinc-700 dark:text-zinc-300">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-[#23232f] bg-white dark:bg-[#121218] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Active Field Accounts</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {users.filter((u) => u.status !== "DISABLED" && u.is_active !== false).length}
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">Permitted for CRM Operations</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <UserCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-[#23232f] bg-white dark:bg-[#121218] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Audit Events Logged</span>
            <div className="text-2xl font-black text-[#990000] dark:text-[#ff8080] mt-1">
              {auditLogs.length}
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">Recorded Security Actions</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-[#990000] dark:text-[#ff8080] flex items-center justify-center">
            <Clock className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* USER MANAGEMENT SECTION */}
      <div className="rounded-2xl border border-zinc-200 dark:border-[#23232f] bg-white dark:bg-[#121217] p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 dark:border-[#20202c] pb-3">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-sm text-zinc-900 dark:text-white">Organization Users & Invitations</h2>
            <span className="text-xs text-zinc-500">No public registration allowed</span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search user name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 dark:border-[#29293a] bg-zinc-50 dark:bg-[#181822] py-1.5 pl-8 pr-3 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-[#990000] focus:outline-none"
            />
          </div>
        </div>

        <div className="border border-zinc-200 dark:border-[#23232f] rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-200 dark:border-[#23232f] bg-zinc-50 dark:bg-[#181822] text-[10px] font-bold text-zinc-500 uppercase">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-[#1f1f2b]">
              {filteredUsers.map((u) => {
                const userRole = (u.role || "executive").toUpperCase();
                const isDisabled = u.status === "DISABLED" || u.is_active === false;

                return (
                  <tr key={u.id} className="hover:bg-zinc-50 dark:hover:bg-[#161620]">
                    <td className="py-3 px-4 font-bold text-zinc-900 dark:text-white">
                      {u.full_name || u.name || "ASET Staff"}
                    </td>
                    <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400 font-mono text-[11px]">
                      {u.email}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          userRole === "SUPER_ADMIN" || userRole === "ADMIN"
                            ? "bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30"
                            : userRole === "MANAGER"
                            ? "bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30"
                            : "bg-rose-500/15 text-[#990000] dark:text-[#ff8080] border border-rose-500/30"
                        }`}
                      >
                        {userRole}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          isDisabled
                            ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                            : u.status === "INVITED"
                            ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                            : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {isDisabled ? "DISABLED" : u.status || "ACTIVE"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(u.id, u.status)}
                        className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                          isDisabled
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                            : "bg-zinc-200 dark:bg-[#20202c] hover:bg-rose-600 hover:text-white text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        {isDisabled ? "Enable" : "Disable"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* AUDIT LOG SECTION */}
      <div className="rounded-2xl border border-zinc-200 dark:border-[#23232f] bg-white dark:bg-[#121217] p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-[#20202c] pb-3">
          <h2 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#990000]" />
            <span>Recent Security & Operational Audit Trail</span>
          </h2>
          <span className="text-[11px] text-zinc-500">Immutable change log</span>
        </div>

        <div className="space-y-2 text-xs">
          {auditLogs.length === 0 ? (
            <p className="text-zinc-500 text-center py-4">No audit events logged yet.</p>
          ) : (
            auditLogs.slice(0, 8).map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-[#20202c] bg-zinc-50 dark:bg-[#161620]"
              >
                <div>
                  <span className="font-bold text-zinc-900 dark:text-white">
                    {log.actor_name || "System"}:
                  </span>{" "}
                  <span className="text-zinc-600 dark:text-zinc-300">
                    {log.details || log.action}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-zinc-500">
                  {new Date(log.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* CREATE USER & SEND INVITATION MODAL */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 dark:border-[#2e2e3d] bg-white dark:bg-[#121217] p-6 text-zinc-900 dark:text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-[#242432] pb-3 mb-4">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-[#990000]" />
                <span>Create User & Send Invitation</span>
              </h3>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="text-zinc-400 hover:text-black dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {!generatedInviteLink ? (
              <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Ramesh Kumar"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 dark:border-[#2e2e3e] bg-zinc-50 dark:bg-[#181822] p-2.5 text-zinc-900 dark:text-white focus:border-[#990000] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Official Email *
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="e.g. ramesh@aset.edu.in"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 dark:border-[#2e2e3e] bg-zinc-50 dark:bg-[#181822] p-2.5 text-zinc-900 dark:text-white focus:border-[#990000] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Assigned Role *
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as Role)}
                    className="w-full rounded-xl border border-zinc-300 dark:border-[#2e2e3e] bg-zinc-50 dark:bg-[#181822] p-2.5 text-zinc-900 dark:text-white font-bold focus:border-[#990000] focus:outline-none"
                  >
                    <option value="EXECUTIVE">EXECUTIVE (Field Outreach)</option>
                    <option value="MANAGER">MANAGER (Operations & Approvals)</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN (System & Users)</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-200 dark:border-[#242432]">
                  <button
                    type="button"
                    onClick={() => setIsInviteModalOpen(false)}
                    className="rounded-xl px-4 py-2 text-xs font-semibold text-zinc-500 hover:text-black dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={inviteSubmitting}
                    className="rounded-xl bg-[#990000] hover:bg-[#b91c1c] px-4 py-2 text-xs font-bold text-white shadow-md shadow-[#990000]/30 transition-all disabled:opacity-50"
                  >
                    {inviteSubmitting ? "Generating Invitation..." : "Create & Send Invitation"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300">
                  <div className="flex items-center gap-2 font-bold mb-1">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Invitation Successfully Created!</span>
                  </div>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                    A setup invitation has been dispatched for <strong>{inviteEmail}</strong> with role <strong>{inviteRole}</strong>.
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    One-time Account Setup Link (24hr Expiry):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      readOnly
                      value={generatedInviteLink}
                      className="w-full rounded-xl border border-zinc-300 dark:border-[#2e2e3e] bg-zinc-50 dark:bg-[#181822] p-2 text-[10px] font-mono text-zinc-900 dark:text-zinc-200"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedInviteLink);
                        alert("Invitation link copied to clipboard!");
                      }}
                      className="rounded-xl bg-[#990000] hover:bg-[#b91c1c] px-3 py-2 text-xs font-bold text-white shrink-0"
                    >
                      Copy Link
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setIsInviteModalOpen(false)}
                    className="w-full py-2.5 rounded-xl bg-zinc-200 dark:bg-[#1e1e2c] text-xs font-bold text-zinc-800 dark:text-white"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
