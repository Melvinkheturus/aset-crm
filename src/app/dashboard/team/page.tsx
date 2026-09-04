"use client";

import { useState } from "react";
import {
  Users,
  Award,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Briefcase
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  territory: string;
  totalVisits: number;
  hotLeads: number;
  warmLeads: number;
  conducted: number;
  activeStatus: "On Route" | "In Office" | "On Call";
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "EXEC-01",
    name: "Ajith Kumar",
    role: "Senior Field Outreach Officer",
    phone: "+91 98401 11223",
    email: "ajith.k@aset.edu.in",
    territory: "Tambaram / Chromepet",
    totalVisits: 53,
    hotLeads: 1,
    warmLeads: 33,
    conducted: 0,
    activeStatus: "On Route"
  },
  {
    id: "EXEC-02",
    name: "Manikandan",
    role: "Senior Field Executive",
    phone: "+91 98401 23456",
    email: "manikandan@aset.edu.in",
    territory: "Mogappair / Anna Nagar",
    totalVisits: 49,
    hotLeads: 3,
    warmLeads: 15,
    conducted: 0,
    activeStatus: "On Route"
  },
  {
    id: "EXEC-03",
    name: "Kingsten",
    role: "Institutional Relations Lead",
    phone: "+91 98401 33445",
    email: "kingsten@aset.edu.in",
    territory: "Central Chennai / Egmore",
    totalVisits: 48,
    hotLeads: 23,
    warmLeads: 14,
    conducted: 3,
    activeStatus: "On Route"
  },
  {
    id: "EXEC-04",
    name: "Pandurangan",
    role: "Field Outreach Executive",
    phone: "+91 98401 44556",
    email: "pandurangan@aset.edu.in",
    territory: "Avadi / Ambattur",
    totalVisits: 28,
    hotLeads: 0,
    warmLeads: 12,
    conducted: 4,
    activeStatus: "In Office"
  },
  {
    id: "EXEC-05",
    name: "Peter",
    role: "Field Outreach Executive",
    phone: "+91 98401 55667",
    email: "peter@aset.edu.in",
    territory: "Velachery / Guindy",
    totalVisits: 22,
    hotLeads: 0,
    warmLeads: 11,
    conducted: 1,
    activeStatus: "On Call"
  },
  {
    id: "EXEC-06",
    name: "Saranya",
    role: "Outreach Coordinator",
    phone: "+91 98401 66778",
    email: "saranya@aset.edu.in",
    territory: "Porur / Poonamallee",
    totalVisits: 11,
    hotLeads: 1,
    warmLeads: 5,
    conducted: 0,
    activeStatus: "In Office"
  }
];

export default function TeamPage() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#14141c] via-[#101017] to-[#0c0c10] border border-[#22222f]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Users className="h-6 w-6 text-[#ff6666]" />
              Outreach Team Management
            </h1>
            <span className="rounded-md bg-[#990000]/20 px-2 py-0.5 text-xs font-semibold text-[#ff6666] border border-[#990000]/40 uppercase tracking-wider">
              Management Console
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Monitor executive workload, assigned territories, live status, and institutional pipeline results.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-[#161622] border border-[#242436] text-xs text-zinc-300">
            <span className="text-zinc-500 mr-1">Active Field Force:</span>
            <span className="font-bold text-white">6 Executives</span>
          </div>
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TEAM_MEMBERS.map((member) => (
          <div
            key={member.id}
            className="p-5 rounded-2xl bg-[#0e0e14] border border-[#20202c] hover:border-[#990000]/50 transition-all flex flex-col justify-between space-y-4 shadow-lg shadow-black/40"
          >
            <div className="space-y-3">
              {/* Card Top Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#990000] to-[#550000] text-white font-bold text-sm border border-rose-400/30 shadow-md shadow-[#990000]/30">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{member.name}</h3>
                    <p className="text-[11px] text-zinc-400">{member.role}</p>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    member.activeStatus === "On Route"
                      ? "bg-emerald-950 border border-emerald-700 text-emerald-300"
                      : member.activeStatus === "On Call"
                      ? "bg-blue-950 border border-blue-700 text-blue-300"
                      : "bg-zinc-800 text-zinc-300"
                  }`}
                >
                  {member.activeStatus}
                </span>
              </div>

              {/* Territory */}
              <div className="flex items-center gap-1.5 text-xs text-zinc-300 bg-[#14141c] p-2.5 rounded-xl border border-[#22222f]">
                <MapPin className="h-3.5 w-3.5 text-[#ff6666] shrink-0" />
                <span className="font-semibold text-white">Territory:</span>
                <span className="text-zinc-300 truncate">{member.territory}</span>
              </div>

              {/* Activity Stats Matrix */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-[#14141c] border border-[#22222f]">
                  <span className="text-[10px] text-zinc-500 block font-medium">Visits</span>
                  <span className="font-black text-white">{member.totalVisits}</span>
                </div>
                <div className="p-2 rounded-lg bg-[#14141c] border border-[#22222f]">
                  <span className="text-[10px] text-zinc-500 block font-medium">Hot</span>
                  <span className="font-black text-rose-400">{member.hotLeads}</span>
                </div>
                <div className="p-2 rounded-lg bg-[#14141c] border border-[#22222f]">
                  <span className="text-[10px] text-zinc-500 block font-medium">Warm</span>
                  <span className="font-black text-amber-400">{member.warmLeads}</span>
                </div>
                <div className="p-2 rounded-lg bg-[#14141c] border border-[#22222f]">
                  <span className="text-[10px] text-zinc-500 block font-medium">Conducted</span>
                  <span className="font-black text-emerald-400">{member.conducted}</span>
                </div>
              </div>
            </div>

            {/* Contact Actions */}
            <div className="pt-2 border-t border-[#1e1e2a] flex items-center justify-between text-xs text-zinc-400">
              <span className="text-[11px] font-mono text-zinc-500">{member.id}</span>
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${member.phone}`}
                  className="p-1.5 rounded-lg bg-[#181824] hover:bg-[#222232] text-zinc-300 hover:text-white transition-colors"
                  title="Call Executive"
                >
                  <Phone className="h-3.5 w-3.5 text-emerald-400" />
                </a>
                <a
                  href={`mailto:${member.email}`}
                  className="p-1.5 rounded-lg bg-[#181824] hover:bg-[#222232] text-zinc-300 hover:text-white transition-colors"
                  title="Email Executive"
                >
                  <Mail className="h-3.5 w-3.5 text-blue-400" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
