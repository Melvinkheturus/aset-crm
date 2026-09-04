"use client";

import { useState, useEffect } from "react";
import {
  CalendarDays,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Sparkles,
  Users,
  Award,
  ExternalLink,
  Plus
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { StartVisitModal } from "@/components/dashboard/start-visit-modal";

export default function CalendarPage() {
  const [schools, setSchools] = useState<any[]>([]);
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState<any | null>(null);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);

  // Month state (September 2026)
  const currentMonth = "September 2026";

  useEffect(() => {
    async function loadCalendarEvents() {
      setLoading(true);
      const [sRes, vRes] = await Promise.all([
        supabase.from("schools").select("*"),
        supabase.from("visits").select("*, schools(name, area, school_code)")
      ]);

      if (sRes.data) setSchools(sRes.data);
      if (vRes.data) setVisits(vRes.data);
      setLoading(false);
    }

    loadCalendarEvents();
  }, []);

  // Events schedule: Aggregate structured appointments, orientations, and follow-ups
  const scheduledEvents = [
    {
      date: "05 Sep 2026",
      day: "05",
      type: "APPOINTMENT",
      title: "Principal Career Guidance Meeting",
      school: "DAV Senior Secondary School",
      area: "Mogappair",
      time: "10:30 AM",
      person: "Smt. Sreela (Vice Principal)",
      color: "amber"
    },
    {
      date: "06 Sep 2026",
      day: "06",
      type: "FOLLOW_UP",
      title: "Follow-up & Brochure Dispatch",
      school: "Spartan Matric Higher Secondary",
      area: "Mogappair",
      time: "11:15 AM",
      person: "Admin Incharge",
      color: "sky"
    },
    {
      date: "08 Sep 2026",
      day: "08",
      type: "ORIENTATION",
      title: "Orientation Session (Commerce 360)",
      school: "Velammal Vidyalaya",
      area: "Mogappair West",
      time: "09:45 AM",
      person: "Dr. Raman (Principal)",
      color: "purple"
    },
    {
      date: "12 Sep 2026",
      day: "12",
      type: "ORIENTATION",
      title: "ASET Career Guidance Orientation",
      school: "Anna Adarsh Higher Secondary",
      area: "Anna Nagar",
      time: "11:30 AM",
      person: "Mrs. Jayanthi",
      color: "purple"
    },
    {
      date: "15 Sep 2026",
      day: "15",
      type: "APPOINTMENT",
      title: "Management Discussion & Slot Confirmation",
      school: "Chinmaya Vidyalaya",
      area: "Anna Nagar",
      time: "02:00 PM",
      person: "Sri S. Venkatesh",
      color: "amber"
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-[#23232f] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#990000] dark:text-[#ff8080] tracking-wider uppercase mb-1">
            <CalendarDays className="h-4 w-4" />
            <span>INSTITUTIONAL COMMITMENTS</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
            Appointment & Orientation Calendar
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Confirmed principal appointments, scheduled orientations, and priority field deadlines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-[#23232f] bg-white dark:bg-[#121217] px-3.5 py-2 text-xs font-bold text-zinc-800 dark:text-zinc-200">
            <CalendarIcon className="h-4 w-4 text-[#990000]" />
            <span>{currentMonth}</span>
          </div>
        </div>
      </div>

      {/* Calendar & Agenda Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Interactive Agenda Timeline */}
        <div className="lg:col-span-8 rounded-2xl border border-zinc-200 dark:border-[#23232f] bg-white dark:bg-[#121217] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-[#20202c] pb-3">
            <h2 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#990000]" />
              <span>September 2026 Commitment Timeline</span>
            </h2>
            <span className="text-xs text-zinc-500">5 Scheduled Events</span>
          </div>

          <div className="space-y-3">
            {scheduledEvents.map((evt, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-zinc-200 dark:border-[#20202c] bg-zinc-50 dark:bg-[#15151e] hover:border-[#990000]/40 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-xl bg-zinc-200 dark:bg-[#20202e] flex flex-col items-center justify-center shrink-0 border border-zinc-300 dark:border-[#2e2e3e]">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">SEP</span>
                    <span className="text-base font-black text-zinc-900 dark:text-white leading-none">{evt.day}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded px-2 py-0.2 text-[10px] font-bold ${
                          evt.type === "ORIENTATION"
                            ? "bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30"
                            : evt.type === "APPOINTMENT"
                            ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30"
                            : "bg-sky-500/15 text-sky-700 dark:text-sky-400 border border-sky-500/30"
                        }`}
                      >
                        {evt.type}
                      </span>
                      <span className="text-xs text-zinc-500 font-mono">{evt.time}</span>
                    </div>

                    <h3 className="font-bold text-sm text-zinc-900 dark:text-white mt-1">
                      {evt.school}
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                      {evt.title} • Contact: <strong>{evt.person}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:self-center">
                  <button
                    onClick={() => {
                      const match = schools.find((s) => s.name?.includes(evt.school.slice(0, 5))) || {
                        name: evt.school,
                        area: evt.area,
                        school_code: "SCH-APPT"
                      };
                      setSelectedSchool(match);
                      setIsVisitModalOpen(true);
                    }}
                    className="rounded-lg bg-[#990000] hover:bg-[#b91c1c] px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-all"
                  >
                    Open School
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (4 cols): Summary & Month Overview */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-zinc-200 dark:border-[#23232f] bg-white dark:bg-[#121217] p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-[#20202c] pb-3">
              Commitments Breakdown
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-500/20">
                <div>
                  <span className="font-bold text-purple-700 dark:text-purple-300 block">Orientations Confirmed</span>
                  <span className="text-[11px] text-zinc-500">Career Guidance Presentations</span>
                </div>
                <span className="text-xl font-black text-purple-700 dark:text-purple-300">2</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-500/20">
                <div>
                  <span className="font-bold text-amber-700 dark:text-amber-400 block">Principal Appointments</span>
                  <span className="text-[11px] text-zinc-500">Scheduled In-person Meetings</span>
                </div>
                <span className="text-xl font-black text-amber-700 dark:text-amber-400">2</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-sky-50 dark:bg-sky-950/20 border border-sky-500/20">
                <div>
                  <span className="font-bold text-sky-700 dark:text-sky-400 block">Follow-up Deadlines</span>
                  <span className="text-[11px] text-zinc-500">Brochure / Permission Follow-up</span>
                </div>
                <span className="text-xl font-black text-sky-700 dark:text-sky-400">1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Start Visit Modal */}
      {selectedSchool && (
        <StartVisitModal
          isOpen={isVisitModalOpen}
          onClose={() => {
            setIsVisitModalOpen(false);
            setSelectedSchool(null);
          }}
          onSuccess={() => {
            setIsVisitModalOpen(false);
            setSelectedSchool(null);
          }}
          preselectedSchool={selectedSchool}
        />
      )}
    </div>
  );
}
