"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Role, Permission, hasPermission, can as checkCan } from "@/lib/permissions";

export type UserRole = Role;

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  toggleRole: () => void;
  executiveName: string;
  userEmail: string;
  status: "ACTIVE" | "INVITED" | "SUSPENDED" | "DISABLED";
  can: (permission: Permission) => boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const [role, setRoleState] = useState<UserRole>("EXECUTIVE");
  const [executiveName, setExecutiveName] = useState("Manikandan");
  const [userEmail, setUserEmail] = useState("manikandan@aset.edu.in");
  const [status, setStatus] = useState<"ACTIVE" | "INVITED" | "SUSPENDED" | "DISABLED">("ACTIVE");

  useEffect(() => {
    // 1. Sync from Clerk user session if loaded
    if (isLoaded && user) {
      const clerkRole = (user.publicMetadata?.role as string)?.toUpperCase();
      if (clerkRole === "SUPER_ADMIN" || clerkRole === "MANAGER" || clerkRole === "EXECUTIVE") {
        setRoleState(clerkRole as UserRole);
      }
      if (user.fullName) {
        setExecutiveName(user.fullName);
      }
      if (user.primaryEmailAddress?.emailAddress) {
        setUserEmail(user.primaryEmailAddress.emailAddress);
      }
      return;
    }

    // 2. Otherwise load saved role from local storage
    const saved = localStorage.getItem("aset_crm_role") as UserRole | null;
    if (saved && (saved === "SUPER_ADMIN" || saved === "MANAGER" || saved === "EXECUTIVE")) {
      setRoleState(saved);
      if (saved === "SUPER_ADMIN") setExecutiveName("Director Manikandan");
      else if (saved === "MANAGER") setExecutiveName("Manikandan (Manager)");
      else setExecutiveName("Manikandan");
    }
  }, [isLoaded, user]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem("aset_crm_role", newRole);
    if (newRole === "SUPER_ADMIN") setExecutiveName("Director Manikandan");
    else if (newRole === "MANAGER") setExecutiveName("Manikandan (Manager)");
    else setExecutiveName("Manikandan");
  };

  const toggleRole = () => {
    if (role === "EXECUTIVE") setRole("MANAGER");
    else if (role === "MANAGER") setRole("SUPER_ADMIN");
    else setRole("EXECUTIVE");
  };

  const can = (permission: Permission) => {
    return hasPermission(role, permission);
  };

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        toggleRole,
        executiveName,
        userEmail,
        status,
        can,
      }}
    >
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
