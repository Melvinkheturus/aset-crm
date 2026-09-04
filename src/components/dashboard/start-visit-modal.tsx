"use client";

import { useState, useEffect } from "react";
import { X, Check, School, ThumbsUp, Minus, ThumbsDown, UserX, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface StartVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  preselectedSchool?: {
    id: string;
    school_code: string;
    name: string;
    area?: string;
    contact_person?: string;
    phone?: string;
    program?: string;
  } | null;
  allSchools?: Array<{ id: string; school_code: string; name: string }>;
}

export function StartVisitModal({
  isOpen,
  onClose,
  onSuccess,
  preselectedSchool,
  allSchools = []
}: StartVisitModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedSchoolId, setSelectedSchoolId] = useState("");
  const [outcomeMood, setOutcomeMood] = useState<"positive" | "neutral" | "negative" | "not_met">("positive");
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split("T")[0]);
  const [personMet, setPersonMet] = useState("");
  const [designation, setDesignation] = useState("Principal");
  const [program, setProgram] = useState("Career Guidance");
  const [outcome, setOutcome] = useState("Interested");
  const [leadStatus, setLeadStatus] = useState("Warm");
  const [nextAction, setNextAction] = useState("Follow-up Call");
  const [nextDate, setNextDate] = useState("");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    if (preselectedSchool) {
      setSelectedSchoolId(preselectedSchool.id);
      if (preselectedSchool.contact_person) setPersonMet(preselectedSchool.contact_person);
      if (preselectedSchool.program) setProgram(preselectedSchool.program);
    }
  }, [preselectedSchool]);

  if (!isOpen) return null;

  // Handle Quick Mood Buttons
  const handleMoodSelect = (mood: "positive" | "neutral" | "negative" | "not_met") => {
    setOutcomeMood(mood);
    if (mood === "positive") {
      setOutcome("Interested");
      setLeadStatus("Hot");
      setNextAction("Schedule Orientation");
    } else if (mood === "neutral") {
      setOutcome("Follow-up Required");
      setLeadStatus("Warm");
      setNextAction("Follow-up Call");
    } else if (mood === "negative") {
      setOutcome("Not Interested");
      setLeadStatus("Cold");
      setNextAction("No Further Action");
    } else if (mood === "not_met") {
      setOutcome("Not Met");
      setLeadStatus("Cold");
      setNextAction("Visit Again");
    }
  };

  const currentSchool = preselectedSchool || allSchools.find((s) => s.id === selectedSchoolId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalSchoolId = preselectedSchool?.id || selectedSchoolId;
    if (!finalSchoolId) {
      alert("Please select a school.");
      return;
    }
    if (!personMet.trim()) {
      alert("Person Met is required.");
      return;
    }

    setLoading(true);
    try {
      const { count } = await supabase.from("visits").select("*", { count: "exact", head: true });
      const visitCode = `VIS-${String((count || 0) + 1).padStart(4, "0")}`;

      const { error } = await supabase.from("visits").insert({
        visit_code: visitCode,
        school_id: finalSchoolId,
        visit_date: visitDate,
        visit_type: "Outreach",
        person_met: personMet.trim(),
        designation: designation || "Staff",
        program: program,
        outcome: outcome,
        lead_status_after_visit: leadStatus,
        next_action: nextAction,
        next_action_date: nextDate || null,
        remarks: remarks.trim() || `Field visit completed (${outcome})`,
        created_by: "Manikandan"
      });

      if (error) throw error;

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(`Failed to save visit: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4">
      <div className="relative w-full max-w-lg rounded-t-3xl sm:rounded-2xl border border-[#2e2e3d] bg-[#121217] p-5 sm:p-6 text-white shadow-2xl shadow-black max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#23232f] pb-3.5 mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff6666] flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" />
              FAST FIELD LOGGING
            </span>
            <h2 className="text-base font-bold text-white mt-0.5">
              {currentSchool ? currentSchool.name : "Start School Visit"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-[#1f1f28] hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* If no school preselected, show dropdown */}
          {!preselectedSchool && (
            <div>
              <label className="block font-medium text-zinc-300 mb-1">Target School *</label>
              <select
                required
                value={selectedSchoolId}
                onChange={(e) => setSelectedSchoolId(e.target.value)}
                className="w-full rounded-xl border border-[#272736] bg-[#181822] px-3 py-2.5 text-zinc-100 focus:border-[#990000] focus:outline-none"
              >
                <option value="">-- Choose school --</option>
                {allSchools.map((s) => (
                  <option key={s.id} value={s.id}>
                    [{s.school_code}] {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Quick Outcome Selector: 4 Giant Buttons */}
          <div>
            <label className="block font-medium text-zinc-300 mb-2">How did the visit go? *</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleMoodSelect("positive")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border font-bold transition-all ${
                  outcomeMood === "positive"
                    ? "border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-md shadow-emerald-950"
                    : "border-[#272736] bg-[#161622] text-zinc-400 hover:text-white"
                }`}
              >
                <ThumbsUp className="h-5 w-5 mb-1 text-emerald-400" />
                <span>POSITIVE</span>
              </button>

              <button
                type="button"
                onClick={() => handleMoodSelect("neutral")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border font-bold transition-all ${
                  outcomeMood === "neutral"
                    ? "border-amber-500 bg-amber-500/20 text-amber-300 shadow-md shadow-amber-950"
                    : "border-[#272736] bg-[#161622] text-zinc-400 hover:text-white"
                }`}
              >
                <Minus className="h-5 w-5 mb-1 text-amber-400" />
                <span>NEUTRAL</span>
              </button>

              <button
                type="button"
                onClick={() => handleMoodSelect("negative")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border font-bold transition-all ${
                  outcomeMood === "negative"
                    ? "border-rose-500 bg-rose-500/20 text-rose-300 shadow-md shadow-rose-950"
                    : "border-[#272736] bg-[#161622] text-zinc-400 hover:text-white"
                }`}
              >
                <ThumbsDown className="h-5 w-5 mb-1 text-rose-400" />
                <span>NEGATIVE</span>
              </button>

              <button
                type="button"
                onClick={() => handleMoodSelect("not_met")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border font-bold transition-all ${
                  outcomeMood === "not_met"
                    ? "border-sky-500 bg-sky-500/20 text-sky-300 shadow-md shadow-sky-950"
                    : "border-[#272736] bg-[#161622] text-zinc-400 hover:text-white"
                }`}
              >
                <UserX className="h-5 w-5 mb-1 text-sky-400" />
                <span>NOT MET</span>
              </button>
            </div>
          </div>

          {/* Required Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-zinc-300 mb-1">Person Met *</label>
              <input
                required
                type="text"
                placeholder="Name of contact"
                value={personMet}
                onChange={(e) => setPersonMet(e.target.value)}
                className="w-full rounded-xl border border-[#272736] bg-[#181822] px-3 py-2 text-zinc-100 focus:border-[#990000] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-zinc-300 mb-1">Designation</label>
              <input
                type="text"
                placeholder="Principal / Admin"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full rounded-xl border border-[#272736] bg-[#181822] px-3 py-2 text-zinc-100 focus:border-[#990000] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-zinc-300 mb-1">Next Action *</label>
              <input
                required
                type="text"
                placeholder="e.g. Follow-up Call"
                value={nextAction}
                onChange={(e) => setNextAction(e.target.value)}
                className="w-full rounded-xl border border-[#272736] bg-[#181822] px-3 py-2 text-zinc-100 focus:border-[#990000] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-zinc-300 mb-1">Next Action Date</label>
              <input
                type="date"
                value={nextDate}
                onChange={(e) => setNextDate(e.target.value)}
                className="w-full rounded-xl border border-[#272736] bg-[#181822] px-3 py-2 text-zinc-100 focus:border-[#990000] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-zinc-300 mb-1">Field Remarks</label>
            <textarea
              rows={2}
              placeholder="What happened? (e.g. Principal agreed for next Tuesday slot)"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full rounded-xl border border-[#272736] bg-[#181822] p-2.5 text-zinc-100 focus:border-[#990000] focus:outline-none resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#990000] hover:bg-[#b91c1c] py-3 text-sm font-bold text-white shadow-xl shadow-[#990000]/30 transition-all disabled:opacity-50"
            >
              <Check className="h-5 w-5" />
              <span>{loading ? "Saving Visit..." : "SAVE VISIT"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
