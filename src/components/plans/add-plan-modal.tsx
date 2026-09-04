"use client";

import { useState } from "react";
import { X, Check, Calendar, Clock, School, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface AddPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  schools: Array<{ id: string; school_code: string; name: string; area?: string }>;
  defaultDate?: string;
}

export function AddPlanModal({
  isOpen,
  onClose,
  onSuccess,
  schools,
  defaultDate = "2026-09-05"
}: AddPlanModalProps) {
  const [loading, setLoading] = useState(false);
  const [schoolId, setSchoolId] = useState("");
  const [visitDate, setVisitDate] = useState(defaultDate);
  const [plannedTime, setPlannedTime] = useState("09:30 AM");
  const [purpose, setPurpose] = useState("Principal Meeting");
  const [isAppointment, setIsAppointment] = useState(false);
  const [priority, setPriority] = useState("Medium");
  const [notes, setNotes] = useState("");

  const [existingPlanWarning, setExistingPlanWarning] = useState<any | null>(null);

  const handleSchoolSelect = async (sId: string) => {
    setSchoolId(sId);
    if (sId && visitDate) {
      const { data } = await supabase
        .from("planned_visits")
        .select("id, visit_order, planned_time, purpose")
        .eq("school_id", sId)
        .eq("visit_date", visitDate)
        .limit(1);
      if (data && data.length > 0) {
        setExistingPlanWarning(data[0]);
      } else {
        setExistingPlanWarning(null);
      }
    } else {
      setExistingPlanWarning(null);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolId) {
      alert("Please select an existing school.");
      return;
    }

    setLoading(true);
    try {
      // Find current max order for this date
      const { data: existing } = await supabase
        .from("planned_visits")
        .select("visit_order")
        .eq("visit_date", visitDate)
        .order("visit_order", { ascending: false })
        .limit(1);

      const nextOrder = (existing?.[0]?.visit_order || 0) + 1;

      const { count } = await supabase.from("planned_visits").select("*", { count: "exact", head: true });
      const planCode = `PLN-${String((count || 0) + 1).padStart(4, "0")}`;

      const { error } = await supabase.from("planned_visits").insert({
        plan_code: planCode,
        school_id: schoolId,
        visit_date: visitDate,
        visit_order: nextOrder,
        planned_time: plannedTime,
        purpose: purpose,
        is_appointment: isAppointment,
        priority: priority,
        status: "Planned",
        notes: notes.trim() || "Scheduled itinerary stop"
      });

      if (error) throw error;

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(`Failed to add to plan: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-[#2e2e3d] bg-[#121217] p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#23232f] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#990000] text-white">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Add School to Itinerary</h2>
              <p className="text-xs text-zinc-400">Plans a visit without duplicating school record</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-[#1f1f28] hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-zinc-300 mb-1">Select Existing School *</label>
            <select
              required
              value={schoolId}
              onChange={(e) => handleSchoolSelect(e.target.value)}
              className="w-full rounded-xl border border-[#272736] bg-[#181822] px-3 py-2.5 text-zinc-100 focus:border-[#990000] focus:outline-none"
            >
              <option value="">-- Choose from 201 Master Schools --</option>
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  [{s.school_code}] {s.name} {s.area ? `(${s.area})` : ""}
                </option>
              ))}
            </select>
            {existingPlanWarning && (
              <div className="mt-2 rounded-xl border border-rose-500/40 bg-rose-950/30 p-2.5 text-[11px] text-rose-300">
                ⚠️ <strong>Notice:</strong> This school is already scheduled on {visitDate} (Stop #{existingPlanWarning.visit_order} at {existingPlanWarning.planned_time}).
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-zinc-300 mb-1">Planned Date</label>
              <input
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full rounded-xl border border-[#272736] bg-[#181822] px-3 py-2 text-zinc-100 focus:border-[#990000] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-zinc-300 mb-1">Approx. Time</label>
              <input
                type="text"
                value={plannedTime}
                onChange={(e) => setPlannedTime(e.target.value)}
                placeholder="09:30 AM"
                className="w-full rounded-xl border border-[#272736] bg-[#181822] px-3 py-2 text-zinc-100 focus:border-[#990000] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-zinc-300 mb-1">Purpose of Visit</label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full rounded-xl border border-[#272736] bg-[#181822] px-3 py-2 text-zinc-100 focus:border-[#990000] focus:outline-none"
            >
              <option value="Principal Meeting">Principal Meeting</option>
              <option value="Initial Outreach">Initial Outreach</option>
              <option value="Follow-up Call / Visit">Follow-up Call / Visit</option>
              <option value="Schedule Orientation">Schedule Orientation</option>
              <option value="Meet Management">Meet Management</option>
              <option value="Admin Meeting">Admin Meeting</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#181822] border border-[#272736]">
            <div>
              <div className="font-semibold text-white">Confirmed Appointment?</div>
              <div className="text-[10px] text-zinc-400">Mark as fixed slot on itinerary</div>
            </div>
            <input
              type="checkbox"
              checked={isAppointment}
              onChange={(e) => setIsAppointment(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-[#990000] focus:ring-[#990000]"
            />
          </div>

          <div>
            <label className="block font-medium text-zinc-300 mb-1">Route Planning Notes</label>
            <textarea
              rows={2}
              placeholder="e.g. Meet after morning assembly, gate pass from correspondent..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
              className="flex items-center gap-1.5 rounded-xl bg-[#990000] hover:bg-[#b91c1c] px-5 py-2 font-bold text-white shadow-lg shadow-[#990000]/30 disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              <span>{loading ? "Adding..." : "Add to Itinerary"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
