"use client";

import { useState, useEffect } from "react";
import { X, Check, School, Edit3, Trash2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface EditSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  school: any;
}

export function EditSchoolModal({ isOpen, onClose, onSuccess, school }: EditSchoolModalProps) {
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

  useEffect(() => {
    if (school) {
      setName(school.name || "");
      setArea(school.area || "");
      setAddress(school.address || "");
      setBoard(school.board || "State Board");
      setClass12(school.class_12 || "Yes");
      setStudentStrength(school.student_strength ? String(school.student_strength) : "");
      setContactPerson(school.contact_person || "");
      setDesignation(school.designation || "Principal");
      setPhone(school.phone || "");
      setProgram(school.program || "Career Guidance");
      setPriority(school.priority || "Medium");
      setLeadStatus(school.lead_status || "Cold");
      setMapsLink(school.maps_url || "");
      setRemarks(school.latest_remarks || "");
    }
  }, [school]);

  if (!isOpen || !school) return null;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !area.trim()) {
      alert("School name and area are required.");
      return;
    }

    setLoading(true);
    try {
      const strengthNum = parseInt(studentStrength, 10);
      const { error } = await supabase
        .from("schools")
        .update({
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
          updated_at: new Date().toISOString()
        })
        .eq("id", school.id);

      if (error) throw error;

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(`Error updating school: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (!confirm(`Are you sure you want to mark ${school.name} as Inactive? (Preserves visit history)`)) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("schools")
        .update({
          lead_status: "Inactive",
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq("id", school.id);

      if (error) throw error;

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(`Error deactivating school: ${err.message}`);
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
              <Edit3 className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Edit Master School</h2>
              <p className="text-xs text-zinc-400 font-mono">[{school.school_code}] {school.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-[#1f1f28] hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-zinc-300 mb-1">School Name *</label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-[#272736] bg-[#181822] px-3 py-2 text-zinc-100 focus:border-[#990000] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-zinc-300 mb-1">Area / Locality *</label>
              <input
                required
                type="text"
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
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full rounded-xl border border-[#272736] bg-[#181822] px-3 py-2 text-zinc-100 focus:border-[#990000] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-zinc-300 mb-1">Designation</label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full rounded-xl border border-[#272736] bg-[#181822] px-3 py-2 text-zinc-100 focus:border-[#990000] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-zinc-300 mb-1">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-[#272736] bg-[#181822] px-3 py-2 text-zinc-100 focus:border-[#990000] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-zinc-300 mb-1">Program</label>
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
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-zinc-300 mb-1">Latest Remarks</label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full rounded-xl border border-[#272736] bg-[#181822] p-2.5 text-zinc-100 focus:border-[#990000] focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#23232f]">
            <button
              type="button"
              onClick={handleDeactivate}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-950/20 px-3.5 py-2 text-rose-400 hover:bg-rose-900/30 text-xs font-semibold"
            >
              <Trash2 className="h-4 w-4" />
              <span>Mark Inactive</span>
            </button>

            <div className="flex items-center gap-2">
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
                <span>{loading ? "Updating..." : "Update Master"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
