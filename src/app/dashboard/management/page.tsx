"use client";

import { useState, useEffect } from "react";
import {
  UserCheck,
  Calendar,
  Clock,
  MapPin,
  Copy,
  Check,
  Printer,
  Phone,
  School,
  Sparkles,
  Share2
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ManagementViewPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [nextDate, setNextDate] = useState("2026-09-05");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlans() {
      const { data } = await supabase
        .from("planned_visits")
        .select("*, schools(school_code, name, area, phone, contact_person, designation)")
        .order("visit_date", { ascending: true })
        .order("visit_order", { ascending: true, nullsFirst: false });

      if (data && data.length > 0) {
        // Find next future date or first available date
        const targetDate = data[0].visit_date;
        setNextDate(targetDate);
        setPlans(data.filter((p) => p.visit_date === targetDate));
      }
      setLoading(false);
    }
    loadPlans();
  }, []);

  const totalVisits = plans.length;
  const appointments = plans.filter((p) => p.is_appointment || p.purpose?.toLowerCase().includes("principal")).length;
  const followups = Math.max(0, totalVisits - appointments);
  const targetArea = plans[0]?.schools?.area || "Mogappair / Anna Nagar";

  const handleCopyWhatsApp = () => {
    const lines = [
      `*ASET SCHOOL OUTREACH — FIELD VISIT PLAN*`,
      `📅 Date: ${nextDate}`,
      `👤 Executive: Manikandan`,
      `📍 Area: ${targetArea}`,
      `📊 Total Visits: ${totalVisits} | Appts: ${appointments} | Follow-ups: ${followups}`,
      ``,
      `*ITINERARY:*`,
      ...plans.map(
        (p, idx) =>
          `${String(p.visit_order || idx + 1).padStart(2, "0")}. [${p.planned_time || "09:30 AM"}] *${p.schools?.name}* (${p.schools?.area}) - ${p.purpose}`
      )
    ];
    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#23232f] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#ff6666] tracking-wider uppercase mb-1">
            <UserCheck className="h-4 w-4" />
            08_MANAGEMENT_VIEW
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Next Field Visit Itinerary
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Automatically calculates tomorrow's route order for management review
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyWhatsApp}
            className="flex items-center gap-2 rounded-xl bg-[#990000] hover:bg-[#b91c1c] px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-[#990000]/30 transition-all"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? "Copied Itinerary!" : "Copy for WhatsApp"}</span>
          </button>
        </div>
      </div>

      {plans.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#2d2d3d] bg-[#121217] p-12 text-center">
          <h2 className="text-base font-bold text-zinc-300">NO FIELD VISITS PLANNED</h2>
          <p className="text-xs text-zinc-500 mt-1">No upcoming itinerary has been created for the selected period.</p>
        </div>
      ) : (
        /* Printable / Management Card */
        <div className="rounded-2xl border border-[#2b2b3b] bg-[#121217] p-6 text-white shadow-xl">
          {/* Document Header */}
          <div className="border-b border-[#242432] pb-5 mb-6">
            <div className="text-center sm:text-left">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#ff6666]">
                ASET COLLEGE OF SCIENCE & TECHNOLOGY — FIELD OPERATIONS
              </span>
              <h2 className="text-xl font-black text-white mt-1">
                FIELD VISIT PLAN — {nextDate}
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-[#20202c] text-xs">
              <div>
                <span className="text-zinc-500">Executive:</span>
                <div className="font-bold text-white mt-0.5">Manikandan</div>
              </div>
              <div>
                <span className="text-zinc-500">Target Area:</span>
                <div className="font-bold text-white mt-0.5">{targetArea}</div>
              </div>
              <div>
                <span className="text-zinc-500">Total Visits:</span>
                <div className="font-bold text-[#ff8080] mt-0.5">{totalVisits} Schools</div>
              </div>
              <div>
                <span className="text-zinc-500">Appointments:</span>
                <div className="font-bold text-rose-400 mt-0.5">{appointments} Scheduled</div>
              </div>
            </div>
          </div>

          {/* Itinerary Table */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
              Sequential Route Order
            </h3>
            <div className="overflow-x-auto rounded-xl border border-[#242432]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#181824] text-zinc-400 font-semibold">
                  <tr>
                    <th className="py-3 px-3.5 text-center w-12">#</th>
                    <th className="py-3 px-3.5 w-24">Time</th>
                    <th className="py-3 px-3.5 min-w-[220px]">Partner School</th>
                    <th className="py-3 px-3.5">Area</th>
                    <th className="py-3 px-3.5">Visit Purpose</th>
                    <th className="py-3 px-3.5 text-center">Appt?</th>
                    <th className="py-3 px-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#20202d] text-zinc-300">
                  {plans.map((p, idx) => (
                    <tr key={p.id} className="hover:bg-[#161622] transition-colors">
                      <td className="py-3 px-3.5 text-center font-bold text-[#ff8080]">
                        {p.visit_order || idx + 1}
                      </td>
                      <td className="py-3 px-3.5 font-mono text-zinc-300 whitespace-nowrap">
                        {p.planned_time || `${String(9 + idx)}:30 AM`}
                      </td>
                      <td className="py-3 px-3.5 font-semibold text-white">
                        <div>{p.schools?.name}</div>
                        {p.schools?.contact_person && (
                          <div className="text-[10px] text-zinc-400 font-normal">
                            Attn: {p.schools.contact_person} ({p.schools.phone || "No phone"})
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3.5 text-zinc-400">{p.schools?.area}</td>
                      <td className="py-3 px-3.5 text-zinc-200">{p.purpose}</td>
                      <td className="py-3 px-3.5 text-center">
                        {p.is_appointment || p.purpose?.toLowerCase().includes("principal") ? (
                          <span className="rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 px-1.5 py-0.5 text-[10px] font-bold">
                            YES
                          </span>
                        ) : (
                          <span className="text-zinc-500 text-[10px]">No</span>
                        )}
                      </td>
                      <td className="py-3 px-3.5">
                        <span className="rounded-full bg-[#20202e] px-2 py-0.5 text-[10px] text-zinc-300 font-medium">
                          {p.status || "Planned"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
