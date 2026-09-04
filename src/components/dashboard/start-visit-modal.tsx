"use client";

import { useState, useEffect } from "react";
import {
  X,
  Check,
  School,
  ThumbsUp,
  Minus,
  ThumbsDown,
  UserX,
  Calendar,
  Clock,
  Phone,
  MessageSquare,
  Sparkles,
  ChevronDown
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRole } from "@/context/role-context";

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
    designation?: string;
    phone?: string;
    program?: string;
    owner?: string;
    lead_status?: string;
    orientation_status?: string;
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
  const { executiveName } = useRole();
  const [loading, setLoading] = useState(false);
  const [selectedSchoolId, setSelectedSchoolId] = useState("");
  
  // 1. Basic Information
  const [executive, setExecutive] = useState(executiveName || "Manikandan");
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split("T")[0]);
  const [visitTime, setVisitTime] = useState("10:30 AM");

  // 2. Who did you meet?
  const [personMet, setPersonMet] = useState("");
  const [designation, setDesignation] = useState("Principal");
  const [contactNumber, setContactNumber] = useState("");

  // 3. What happened?
  const [outcome, setOutcome] = useState("Positive");
  const [leadStatus, setLeadStatus] = useState("Warm");

  // 4. What happens next? (Structured Next Action)
  const [nextActionType, setNextActionType] = useState("Call");
  const [nextActionDate, setNextActionDate] = useState("");
  const [nextActionNote, setNextActionNote] = useState("");

  // 5. Structured Appointment Section
  const [hasAppointment, setHasAppointment] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("11:00 AM");
  const [appointmentPerson, setAppointmentPerson] = useState("Principal");
  const [appointmentPurpose, setAppointmentPurpose] = useState("Career Guidance discussion");

  // 6. Structured Orientation Section
  const [orientationStatus, setOrientationStatus] = useState("Not Discussed");
  const [orientationDate, setOrientationDate] = useState("");

  // 7. Structured Communication (WhatsApp & Call)
  const [whatsappRequired, setWhatsappRequired] = useState(false);
  const [whatsappStatus, setWhatsappStatus] = useState<"Pending" | "Sent">("Pending");
  const [whatsappDate, setWhatsappDate] = useState("");
  const [whatToShare, setWhatToShare] = useState("Commerce 360 brochure");
  const [callRequired, setCallRequired] = useState(false);
  const [callDate, setCallDate] = useState("");

  // 8. Details (Pure remarks)
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    if (preselectedSchool) {
      setSelectedSchoolId(preselectedSchool.id);
      if (preselectedSchool.contact_person) setPersonMet(preselectedSchool.contact_person);
      if (preselectedSchool.designation) setDesignation(preselectedSchool.designation);
      if (preselectedSchool.phone) setContactNumber(preselectedSchool.phone);
      if (preselectedSchool.lead_status) setLeadStatus(preselectedSchool.lead_status);
      if (preselectedSchool.owner) setExecutive(preselectedSchool.owner);
      if (preselectedSchool.orientation_status) setOrientationStatus(preselectedSchool.orientation_status);
    } else {
      setExecutive(executiveName || "Manikandan");
    }
  }, [preselectedSchool, executiveName]);

  // Sync Appointment / Orientation toggle when outcome changes
  const handleOutcomeChange = (newOutcome: string) => {
    setOutcome(newOutcome);
    if (newOutcome === "Appointment Fixed") {
      setHasAppointment(true);
      setLeadStatus("Hot");
      setNextActionType("Confirm Appointment");
    } else if (newOutcome === "Orientation Interested" || newOutcome === "Orientation Confirmed") {
      setOrientationStatus(newOutcome === "Orientation Confirmed" ? "Date Fixed" : "Interested");
      setLeadStatus("Hot");
      setNextActionType(newOutcome === "Orientation Confirmed" ? "Confirm Orientation" : "Schedule Orientation");
    } else if (newOutcome === "Positive") {
      setLeadStatus("Warm");
      setNextActionType("Call");
    } else if (newOutcome === "Not Met") {
      setNextActionType("Second Visit");
    } else if (newOutcome === "Negative") {
      setLeadStatus("Cold");
      setNextActionType("No Action");
    }
  };

  if (!isOpen) return null;

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

      // 1. Insert into visits table
      const { error: visitError } = await supabase.from("visits").insert({
        visit_code: visitCode,
        school_id: finalSchoolId,
        visit_date: visitDate,
        visit_type: "Outreach",
        person_met: personMet.trim(),
        designation: designation || "Staff",
        program: currentSchool?.name || "Career Guidance",
        outcome: outcome,
        lead_status_after_visit: leadStatus,
        next_action: nextActionType,
        next_action_date: nextActionDate || null,
        next_action_note: nextActionNote.trim() || null,
        appointment_date: hasAppointment ? appointmentDate || null : null,
        appointment_time: hasAppointment ? appointmentTime || null : null,
        appointment_person: hasAppointment ? appointmentPerson || null : null,
        appointment_purpose: hasAppointment ? appointmentPurpose || null : null,
        orientation_status: orientationStatus,
        orientation_date: orientationDate || null,
        remarks: remarks.trim() || `Field visit completed (${outcome})`,
        created_by: executive,
        executive: executive
      });

      if (visitError) throw visitError;

      // 2. Automatically update School Master current state (Golden Rule)
      const schoolUpdatePayload: any = {
        lead_status: leadStatus,
        next_action: nextActionType,
        next_action_date: nextActionDate || null,
        next_action_note: nextActionNote.trim() || null,
        orientation_status: orientationStatus,
        orientation_date: orientationDate || null,
        whatsapp_required: whatsappRequired,
        whatsapp_status: whatsappStatus,
        what_to_share: whatsappRequired ? whatToShare : null,
        call_required: callRequired,
        call_date: callRequired ? callDate || null : null,
        last_visit_date: visitDate,
        latest_remarks: remarks.trim() || undefined,
        owner: executive
      };

      await supabase.from("schools").update(schoolUpdatePayload).eq("id", finalSchoolId);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-zinc-200 dark:border-[#2e2e3d] bg-white dark:bg-[#111116] p-5 sm:p-6 text-zinc-900 dark:text-white shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-[#23232f] pb-4 mb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#990000] dark:text-[#ff6666] flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              MODULE 4: VISIT & FOLLOW-UP LOGGING
            </span>
            <h2 className="text-lg font-black text-zinc-900 dark:text-white mt-0.5">
              {currentSchool ? currentSchool.name : "Record Field Visit"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#1f1f28] hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Target School (if not preselected) */}
          {!preselectedSchool && (
            <div>
              <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">Target School *</label>
              <select
                required
                value={selectedSchoolId}
                onChange={(e) => setSelectedSchoolId(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 dark:border-[#272736] bg-zinc-50 dark:bg-[#181822] px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:border-[#990000] focus:outline-none"
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

          {/* Section 1: Basic Visit Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-[#161620] border border-zinc-200 dark:border-[#23232f]">
            <div>
              <label className="block font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Executive</label>
              <select
                value={executive}
                onChange={(e) => setExecutive(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 dark:border-[#2c2c3e] bg-white dark:bg-[#1e1e2c] px-2.5 py-1.5 text-zinc-900 dark:text-white font-medium"
              >
                <option value="Manikandan">Manikandan</option>
                <option value="Executive 2">Executive 2</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Visit Date *</label>
              <input
                type="date"
                required
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 dark:border-[#2c2c3e] bg-white dark:bg-[#1e1e2c] px-2.5 py-1.5 text-zinc-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Visit Time</label>
              <input
                type="text"
                value={visitTime}
                onChange={(e) => setVisitTime(e.target.value)}
                placeholder="e.g. 10:30 AM"
                className="w-full rounded-lg border border-zinc-300 dark:border-[#2c2c3e] bg-white dark:bg-[#1e1e2c] px-2.5 py-1.5 text-zinc-900 dark:text-white font-medium"
              />
            </div>
          </div>

          {/* Section 2: Who did you meet? */}
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-[#161620] border border-zinc-200 dark:border-[#23232f] space-y-2">
            <span className="font-bold text-[11px] uppercase tracking-wider text-zinc-500">Contact Details</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Person Met *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Smt. Sreela"
                  value={personMet}
                  onChange={(e) => setPersonMet(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 dark:border-[#2c2c3e] bg-white dark:bg-[#1e1e2c] px-2.5 py-1.5 text-zinc-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Designation</label>
                <input
                  type="text"
                  placeholder="Principal / Vice Principal / Admin"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 dark:border-[#2c2c3e] bg-white dark:bg-[#1e1e2c] px-2.5 py-1.5 text-zinc-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Contact Number</label>
                <input
                  type="text"
                  placeholder="Phone or Mobile"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 dark:border-[#2c2c3e] bg-white dark:bg-[#1e1e2c] px-2.5 py-1.5 text-zinc-900 dark:text-white font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 3: What happened? (Outcome & Lead Status) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-[#161620] border border-zinc-200 dark:border-[#23232f]">
            <div>
              <label className="block font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Outcome *</label>
              <select
                value={outcome}
                onChange={(e) => handleOutcomeChange(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 dark:border-[#2c2c3e] bg-white dark:bg-[#1e1e2c] px-2.5 py-2 text-zinc-900 dark:text-white font-bold"
              >
                <option value="Positive">Positive</option>
                <option value="Neutral">Neutral</option>
                <option value="Negative">Negative</option>
                <option value="Not Met">Not Met</option>
                <option value="Appointment Fixed">Appointment Fixed</option>
                <option value="Orientation Interested">Orientation Interested</option>
                <option value="Orientation Confirmed">Orientation Confirmed</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Lead Status *</label>
              <select
                value={leadStatus}
                onChange={(e) => setLeadStatus(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 dark:border-[#2c2c3e] bg-white dark:bg-[#1e1e2c] px-2.5 py-2 text-zinc-900 dark:text-white font-bold"
              >
                <option value="HOT">HOT</option>
                <option value="WARM">WARM</option>
                <option value="COLD">COLD</option>
              </select>
            </div>
          </div>

          {/* Section 4: What happens next? (Next Action, Date, Note) */}
          <div className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-[#201316] border border-rose-200 dark:border-[#42171e] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[11px] uppercase tracking-wider text-[#990000] dark:text-[#ff8080]">
                Structured Next Action
              </span>
              <span className="text-[10px] text-zinc-500">Affects Itinerary & Follow-ups</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Next Action Type *</label>
                <select
                  value={nextActionType}
                  onChange={(e) => setNextActionType(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 dark:border-[#381e24] bg-white dark:bg-[#1a1114] px-2.5 py-1.5 text-zinc-900 dark:text-white font-bold"
                >
                  <option value="No Action">No Action</option>
                  <option value="Call">Call</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Second Visit">Second Visit</option>
                  <option value="Meet Principal">Meet Principal</option>
                  <option value="Meet Admin">Meet Admin</option>
                  <option value="Send Information">Send Information</option>
                  <option value="Send Proposal">Send Proposal</option>
                  <option value="Confirm Appointment">Confirm Appointment</option>
                  <option value="Schedule Orientation">Schedule Orientation</option>
                  <option value="Confirm Orientation">Confirm Orientation</option>
                  <option value="Visit Head Branch">Visit Head Branch</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Next Action Date</label>
                <input
                  type="date"
                  value={nextActionDate}
                  onChange={(e) => setNextActionDate(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 dark:border-[#381e24] bg-white dark:bg-[#1a1114] px-2.5 py-1.5 text-zinc-900 dark:text-white font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Next Action Note</label>
              <input
                type="text"
                placeholder="e.g. Call Principal after management discussion"
                value={nextActionNote}
                onChange={(e) => setNextActionNote(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 dark:border-[#381e24] bg-white dark:bg-[#1a1114] px-2.5 py-1.5 text-zinc-900 dark:text-white"
              />
            </div>
          </div>

          {/* Section 5: Structured Appointment Section */}
          {(outcome === "Appointment Fixed" || hasAppointment) && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[11px] uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Appointment Details
                </span>
                <span className="text-[10px] text-amber-600 dark:text-amber-300">Appointment Fixed</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full rounded-lg border border-amber-500/30 bg-white dark:bg-[#1a1612] px-2 py-1.5 text-xs text-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Time</label>
                  <input
                    type="text"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    placeholder="11:00 AM"
                    className="w-full rounded-lg border border-amber-500/30 bg-white dark:bg-[#1a1612] px-2 py-1.5 text-xs text-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Person</label>
                  <input
                    type="text"
                    value={appointmentPerson}
                    onChange={(e) => setAppointmentPerson(e.target.value)}
                    placeholder="Principal"
                    className="w-full rounded-lg border border-amber-500/30 bg-white dark:bg-[#1a1612] px-2 py-1.5 text-xs text-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Purpose</label>
                  <input
                    type="text"
                    value={appointmentPurpose}
                    onChange={(e) => setAppointmentPurpose(e.target.value)}
                    placeholder="Guidance Talk"
                    className="w-full rounded-lg border border-amber-500/30 bg-white dark:bg-[#1a1612] px-2 py-1.5 text-xs text-zinc-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 6: Structured Orientation Section */}
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-[#161620] border border-zinc-200 dark:border-[#23232f] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[11px] uppercase tracking-wider text-zinc-500">
                Orientation Pipeline
              </span>
              <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">
                Status: {orientationStatus}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Orientation Status</label>
                <select
                  value={orientationStatus}
                  onChange={(e) => setOrientationStatus(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 dark:border-[#2c2c3e] bg-white dark:bg-[#1e1e2c] px-2.5 py-1.5 text-zinc-900 dark:text-white font-medium"
                >
                  <option value="Not Discussed">Not Discussed</option>
                  <option value="Discussed">Discussed</option>
                  <option value="Interested">Interested</option>
                  <option value="Permission Received">Permission Received</option>
                  <option value="Date Pending">Date Pending</option>
                  <option value="Date Fixed">Date Fixed</option>
                  <option value="Conducted">Conducted</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Orientation Date</label>
                <input
                  type="date"
                  value={orientationDate}
                  onChange={(e) => setOrientationDate(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 dark:border-[#2c2c3e] bg-white dark:bg-[#1e1e2c] px-2.5 py-1.5 text-zinc-900 dark:text-white font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 7: WhatsApp & Call Requirements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-[#161620] border border-zinc-200 dark:border-[#23232f]">
            {/* WhatsApp */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-bold text-zinc-800 dark:text-zinc-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={whatsappRequired}
                  onChange={(e) => setWhatsappRequired(e.target.checked)}
                  className="rounded text-[#990000] focus:ring-[#990000]"
                />
                <span>WhatsApp Required?</span>
              </label>

              {whatsappRequired && (
                <div className="space-y-1.5 pl-5 border-l-2 border-emerald-500/50">
                  <input
                    type="text"
                    placeholder="What to share (e.g. Commerce 360 brochure)"
                    value={whatToShare}
                    onChange={(e) => setWhatToShare(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 dark:border-[#2c2c3e] bg-white dark:bg-[#1e1e2c] px-2 py-1 text-zinc-900 dark:text-white"
                  />
                  <div className="flex items-center gap-2">
                    <select
                      value={whatsappStatus}
                      onChange={(e: any) => setWhatsappStatus(e.target.value)}
                      className="rounded border border-zinc-300 dark:border-[#2c2c3e] bg-white dark:bg-[#1e1e2c] px-1.5 py-0.5 text-[10px]"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Sent">Sent</option>
                    </select>
                    <input
                      type="date"
                      value={whatsappDate}
                      onChange={(e) => setWhatsappDate(e.target.value)}
                      className="rounded border border-zinc-300 dark:border-[#2c2c3e] bg-white dark:bg-[#1e1e2c] px-1.5 py-0.5 text-[10px]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Call */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-bold text-zinc-800 dark:text-zinc-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={callRequired}
                  onChange={(e) => setCallRequired(e.target.checked)}
                  className="rounded text-[#990000] focus:ring-[#990000]"
                />
                <span>Follow-up Call Required?</span>
              </label>

              {callRequired && (
                <div className="pl-5 border-l-2 border-sky-500/50">
                  <label className="block text-[10px] text-zinc-500 mb-0.5">Call Date</label>
                  <input
                    type="date"
                    value={callDate}
                    onChange={(e) => setCallDate(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 dark:border-[#2c2c3e] bg-white dark:bg-[#1e1e2c] px-2 py-1 text-zinc-900 dark:text-white"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Section 8: Field Remarks (Descriptive Situation, not Actionable) */}
          <div>
            <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              Field Remarks (Descriptive Situation)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Met admin. Information will be conveyed to management after board meeting."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 dark:border-[#272736] bg-zinc-50 dark:bg-[#181822] p-2.5 text-zinc-900 dark:text-zinc-100 focus:border-[#990000] focus:outline-none resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#990000] hover:bg-[#b91c1c] py-3 text-sm font-black text-white shadow-xl shadow-[#990000]/30 transition-all disabled:opacity-50"
            >
              <Check className="h-5 w-5" />
              <span>{loading ? "SAVING VISIT RECORD..." : "LOG VISIT & UPDATE MASTER"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
