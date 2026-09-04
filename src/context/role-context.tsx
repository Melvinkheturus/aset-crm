"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "executive" | "manager";

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  toggleRole: () => void;
  executiveName: string;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>("executive");
  const [executiveName] = useState("Manikandan");

  useEffect(() => {
    const saved = localStorage.getItem("aset_crm_role") as UserRole | null;
    if (saved && (saved === "executive" || saved === "manager")) {
      setRoleState(saved);
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem("aset_crm_role", newRole);
  };

  const toggleRole = () => {
    const nextRole = role === "executive" ? "manager" : "executive";
    setRole(nextRole);
  };

  return (
    <RoleContext.Provider value={{ role, setRole, toggleRole, executiveName }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
