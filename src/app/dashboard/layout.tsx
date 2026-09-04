"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";
import { BottomNav } from "@/components/layout/bottom-nav";
import { LogVisitModal } from "@/components/dashboard/log-visit-modal";
import { supabase } from "@/lib/supabase";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schools, setSchools] = useState<any[]>([]);

  const fetchSchools = async () => {
    const { data } = await supabase
      .from("schools")
      .select("id, school_code, name")
      .order("school_code", { ascending: true });
    if (data) setSchools(data);
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#09090c]">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNav onLogVisitClick={() => setIsModalOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 pb-20 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav />

      <LogVisitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchSchools}
        schools={schools}
      />
    </div>
  );
}
