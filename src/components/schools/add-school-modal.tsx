"use client";

import { useState } from "react";
import { X, Check, School, Plus, MapPin, Phone } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface AddSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddSchoolModal({ isOpen, onClose, onSuccess }: AddSchoolModalProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [board, setBoard] = useState("State Board");
  const [class12, setClass12] = useState("Yes");
  const [studentStrength, setStudentStrength] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [designation, setDesignation] = useState("Principal");
  const [phone, setPhone] = useState("");
  const [program, setProgram] = useState("Career Guidance");
  const [priority, setPriority] = useState("Medium");
  const [leadStatus, setLeadStatus] = useState("Cold");
  const [mapsLink, setMapsLink] = useState("");
  const [remarks, setRemarks] = useState("");

  const [possibleDuplicate, setPossibleDuplicate] = useState<any | null>(null);

  // Real-time duplicate school check
  const handleNameChange = async (val: string) => {
    setName(val);
    if (val.trim().length >= 4) {
      const { data } = await supabase
        .from("schools")
        .select("id, school_code, name, area")
        .ilike("name", `%${val.trim()}%`)
        .limit(1);
      if (data && data.length > 0) {
        setPossibleDuplicate(data[0]);
      } else {
        setPossibleDuplicate(null);
      }
    } else {
      setPossibleDuplicate(null);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !area.trim()) {
      alert("School name and area are required.");
      return;
    }

    setLoading(true);
    try {
      const { count } = await supabase.from("schools").select("*", { count: "exact", head: true });
      const schoolCode = `SCH-${String((count || 0) + 1).padStart(4, "0")}`;

      const strengthNum = parseInt(studentStrength, 10);

      const { error } = await supabase.from("schools").insert({
        school_code: schoolCode,
        name: name.trim(),
        area: area.trim(),
        address: address.trim() || null,
        board: board,
        class_12: class12,
        student_strength: isNaN(strengthNum) ? 0 : strengthNum,
        contact_person: contactPerson.trim() || null,
        designation: designation.trim() || null,
        phone: phone.trim() || null,
        program: program,
        priority: priority,
        lead_status: leadStatus,
        maps_url: mapsLink.trim() || null,
        latest_remarks: remarks.trim() || null,
        is_active: true
      });

      if (error) throw error;

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(`Error creating school: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-[#2e2e3d] bg-[#121217] p-6 text-white shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#23232f] pb-3.5 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#990000] text-white">
              <School className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Add Master School</h2>
              <p className="text-xs text-zinc-400">Creates permanent master institution entry</p>
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
            <label className="block font-medium text-zinc-300 mb-1">School Name *</label>
            <input
              required
              type="text"
              placeholder="e.g. Vels Global School"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full rounded-xl border border-[#272736] bg-[#181822] px-3 py-2 text-zinc-100 focus:border-[#990000] focus:outline-none"
            />
            {possibleDuplicate && (
              <div className="mt-2 flex items-center justify-between rounded-xl border border-amber-500/40 bg-amber-950/30 p-2.5 text-[11px] text-amber-200">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">⚠️ Warning:</span>
                  <span>Similar school exists: <strong>{possibleDuplicate.name}</strong> ({possibleDuplicate.area})</span>
                </div>
                <span className="font-mono text-[10px] text-amber-400 font-bold">
                  {possibleDuplicate.school_code}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-zinc-300 mb-1">Area / Locality *</label>
              <input
                required
                type="text"
                placeholder="e.g. Mogappair"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full rounded-xl border border-[#272736] bg-[#181822] px-3 py-2 text-zinc-100 focus:border-[#990000] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-zinc-300 mb-1">Board</label>
              <select
                value={board}
                onChange={(e) => setBoard(e.target.value)}
                className="w-full rounded-xl border border-[#272736] bg-[#181822] px-3 py-2 text-zinc-100 focus:border-[#990000] focus:outline-none"
              >
                <option value="CBSE">CBSE</option>
                <option value="State Board">State Board</option>
                <option value="Matriculation">Matriculation</option>
                <option value="ICSE">ICSE</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-zinc-300 mb-1">Full Address</label>
            <input
              type="text"
              placeholder="e.g. 120 Feet Road, Anna Nagar West Extn"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-xl border border-[#272736] bg-[#181822] px-3 py-2 text-zinc-100 focus:border-[#990000] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-zinc-300 mb-1">Contact Person</label>
              <input
                type="text"
                placeholder="Principal name"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
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
            <div>
              <label className="block font-medium text-zinc-300 mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="9840xxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-[#272736] bg-[#181822] px-3 py-2 text-zinc-100 focus:border-[#990000] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
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
              <label className="block font-medium text-zinc-300 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-xl border border-[#272736] bg-[#181822] px-3 py-2 text-zinc-100 focus:border-[#990000] focus:outline-none"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-zinc-300 mb-1">Lead Status</label>
              <select
                value={leadStatus}
                onChange={(e) => setLeadStatus(e.target.value)}
                className="w-full rounded-xl border border-[#272736] bg-[#181822] px-3 py-2 text-zinc-100 focus:border-[#990000] focus:outline-none"
              >
                <option value="Cold">Cold</option>
                <option value="Warm">Warm</option>
                <option value="Hot">Hot</option>
                <option value="CONDUCTED">CONDUCTED</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-zinc-300 mb-1">Initial Discussion Remarks</label>
            <textarea
              rows={2}
              placeholder="Any prior context, references, or key notes..."
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
              className="flex items-center gap-1.5 rounded-xl bg-[#990000] hover:bg-[#b91c1c] px-5 py-2 font-bold text-white shadow-lg shadow-[#990000]/30 disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              <span>{loading ? "Adding..." : "Add to Master Database"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
