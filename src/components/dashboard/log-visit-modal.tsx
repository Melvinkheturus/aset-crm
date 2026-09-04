"use client";

import { useState } from "react";
import { X, Check, Calendar, User, School, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface LogVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  schools: Array<{ id: string; school_code: string; name: string }>;
}

export function LogVisitModal({ isOpen, onClose, onSuccess, schools }: LogVisitModalProps) {
  const [loading, setLoading] = useState(false);
  const [schoolId, setSchoolId] = useState("");
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split("T")[0]);
  const [visitType, setVisitType] = useState("Follow-up");
  const [personMet, setPersonMet] = useState("");
  const [designation, setDesignation] = useState("Principal");
  const [program, setProgram] = useState("Career Guidance");
  const [outcome, setOutcome] = useState("Follow-up Required");
  const [leadStatus, setLeadStatus] = useState("Warm");
  const [nextAction, setNextAction] = useState("Follow-up Call");
  const [nextDate, setNextDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [executive, setExecutive] = useState("Manikandan");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolId) {
      alert("Please select a school");
      return;
    }

    setLoading(true);
    try {
      // 1. Get next visit code
      const { count } = await supabase.from("visits").select("*", { count: "exact", head: true });
      const visitCode = `VIS-${String((count || 0) + 1).padStart(4, "0")}`;

      // 2. Insert into Supabase (Postgres trigger updates school automatically!)
      const { error } = await supabase.from("visits").insert({
        visit_code: visitCode,
        school_id: schoolId,
        visit_date: visitDate,
        visit_type: visitType,
        person_met: personMet || "Staff",
        designation: designation || "Staff",
        program: program,
        outcome: outcome,
        lead_status_after_visit: leadStatus,
        next_action: nextAction,
        next_action_date: nextDate || null,
        remarks: remarks || "Field visit conducted",
        created_by: executive
      });

      if (error) throw error;

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(`Error logging visit: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-[#2e2e3d] bg-[#121217] p-6 text-white shadow-2xl shadow-black/80 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#23232f] pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#990000] text-white">
              <School className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Record Field Visit</h2>
              <p className="text-xs text-zinc-400">Updates Visit Log & automatically synchronizes School Master</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-[#1f1f28] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* School Select */}
          <div>
            <label className="block font-medium text-zinc-300 mb-1">Target School *</label>
            <select
              required
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
              className="w-full rounded-xl border border-[#272736] bg-[#181822] px-3 py-2.5 text-zinc-100 focus:border-[#990000] focus:outline-none"
            >
              <option value="">-- Select from 201 Master Schools --</option>
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  [{s.school_code}] {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-zinc-300 mb-1">Visit Date</label>
              <input
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full rounded-xl border border-[#272736] bg-[#181822] px-3 py-2 text-zinc-100 focus:border-[#990000] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-zinc-300 mb-1">Visit Type</label>
              <select
                value={visitType}
                onChange={(e) => setVisitType(e.target.value)}
                className="w-full rounded-xl border border-[#272736] bg-[#181822] px-3 py-2 text-zinc-100 focus:border-[#990000] focus:outline-none"
              >
                <option value="Initial Outreach">Initial Outreach</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Principal Meeting">Principal Meeting</option>
                <option value="Appointment">Appointment</option>
                <option value="Orientation">Orientation</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-zinc-300 mb-1">Person Met</label>
              <input
                type="text"
                placeholder="e.g. Dr. K. Ramesh"
                value={personMet}
                onChange={(e) => setPersonMet(e.target.value)}
                className="w-full rounded-xl border border-[#272736] bg-[#181822] px-3 py-2 text-zinc-100 focus:border-[#990000] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-zinc-300 mb-1">Designation</label>
              <input
                type="text"
                placeholder="e.g. Principal / Vice Principal"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full rounded-xl border border-[#272736] bg-[#181822] px-3 py-2 text-zinc-100 focus:border-[#990000] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-zinc-300 mb-1">Program Pitched</label>
              <select
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className="w-full rounded-xl border border-[#272736] bg-[#181822] px-3 py-2 text-zinc-100 focus:border-[#990000] focus:outline-none"
              >
                <option value="Career Guidance">Career Guidance</option>
                <option value="Scholarship Exam">Scholarship Exam</option>
                <option value="Multiple Programs">Multiple Programs</option>
                <option value="Aviation">Aviation</option>
                <option value="Commerce">Commerce</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-zinc-300 mb-1">Outcome</label>
              <select
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                className="w-full rounded-xl border border-[#272736] bg-[#181822] px-3 py-2 text-zinc-100 focus:border-[#990000] focus:outline-none"
              >
                <option value="Follow-up Required">Follow-up Required</option>
                <option value="Interested">Interested</option>
                <option value="Program Confirmed">Program Confirmed</option>
                <option value="Program Discussion Ongoing">Discussion Ongoing</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Not Interested">Not Interested</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-zinc-300 mb-1">Lead Status After Visit</label>
              <select
                value={leadStatus}
                onChange={(e) => setLeadStatus(e.target.value)}
                className="w-full rounded-xl border border-[#272736] bg-[#181822] px-3 py-2 text-zinc-100 focus:border-[#990000] focus:outline-none"
              >
                <option value="Warm">Warm</option>
                <option value="Hot">Hot</option>
                <option value="Cold">Cold</option>
                <option value="CONDUCTED">CONDUCTED</option>
                <option value="Appointment">Appointment</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-zinc-300 mb-1">Next Follow-up Date</label>
              <input
                type="date"
                value={nextDate}
                onChange={(e) => setNextDate(e.target.value)}
                className="w-full rounded-xl border border-[#272736] bg-[#181822] px-3 py-2 text-zinc-100 focus:border-[#990000] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-zinc-300 mb-1">Next Action Required</label>
            <input
              type="text"
              placeholder="e.g. Call Principal to confirm slot"
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              className="w-full rounded-xl border border-[#272736] bg-[#181822] px-3 py-2 text-zinc-100 focus:border-[#990000] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-zinc-300 mb-1">Key Discussion Remarks</label>
            <textarea
              rows={2}
              placeholder="Summary of interaction, permissions required, or student batch timings..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full rounded-xl border border-[#272736] bg-[#181822] p-2.5 text-zinc-100 focus:border-[#990000] focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#23232f]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#272736] bg-[#181822] px-4 py-2 text-zinc-300 hover:bg-[#20202e]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 rounded-xl bg-[#990000] hover:bg-[#b91c1c] px-5 py-2 font-semibold text-white shadow-lg shadow-[#990000]/30 disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              <span>{loading ? "Recording..." : "Save Visit Entry"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
