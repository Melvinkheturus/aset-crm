/**
 * ASET SCHOOL OUTREACH CRM — ROLE-BASED ACCESS CONTROL & AUTHORIZATION
 * 
 * 3 Roles:
 * - SUPER_ADMIN: Controls users and system access.
 * - MANAGER: Controls outreach operations, ownership reassignments, access requests, team visibility.
 * - EXECUTIVE: Performs field outreach, visits, follow-ups for assigned schools.
 */

export type Role =
  | "SUPER_ADMIN"
  | "MANAGER"
  | "EXECUTIVE"
  | "super_admin"
  | "manager"
  | "executive"
  | "admin";

export type Permission =
  | "schools:read"
  | "schools:create"
  | "schools:update"
  | "visits:create"
  | "visits:read"
  | "visits:update"
  | "plans:create"
  | "plans:update"
  | "reports:read"
  | "reports:export"
  | "analytics:read"
  | "team:read"
  | "ownership:manage"
  | "access_requests:manage"
  | "users:manage"
  | "system:manage";

/**
 * Permission Matrix as specified in Section 5
 */
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  EXECUTIVE: [
    "schools:read",
    "schools:create",
    "schools:update", // Gated by resource ownership
    "visits:create",
    "visits:read",
    "visits:update",
    "plans:create",
    "plans:update",
    "reports:read",
    "reports:export",
    "analytics:read",
  ],
  executive: [
    "schools:read",
    "schools:create",
    "schools:update",
    "visits:create",
    "visits:read",
    "visits:update",
    "plans:create",
    "plans:update",
    "reports:read",
    "reports:export",
    "analytics:read",
  ],
  MANAGER: [
    "schools:read",
    "schools:create",
    "schools:update",
    "visits:create",
    "visits:read",
    "visits:update",
    "plans:create",
    "plans:update",
    "reports:read",
    "reports:export",
    "analytics:read",
    "team:read",
    "ownership:manage",
    "access_requests:manage",
  ],
  manager: [
    "schools:read",
    "schools:create",
    "schools:update",
    "visits:create",
    "visits:read",
    "visits:update",
    "plans:create",
    "plans:update",
    "reports:read",
    "reports:export",
    "analytics:read",
    "team:read",
    "ownership:manage",
    "access_requests:manage",
  ],
  SUPER_ADMIN: [
    "schools:read",
    "schools:create",
    "schools:update",
    "visits:create",
    "visits:read",
    "visits:update",
    "plans:create",
    "plans:update",
    "reports:read",
    "reports:export",
    "analytics:read",
    "team:read",
    "ownership:manage",
    "access_requests:manage",
    "users:manage",
    "system:manage",
  ],
  super_admin: [
    "schools:read",
    "schools:create",
    "schools:update",
    "visits:create",
    "visits:read",
    "visits:update",
    "plans:create",
    "plans:update",
    "reports:read",
    "reports:export",
    "analytics:read",
    "team:read",
    "ownership:manage",
    "access_requests:manage",
    "users:manage",
    "system:manage",
  ],
};

/**
 * Check if a role possesses a generic permission
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

/**
 * High-level user authorization helper: can(user, permission)
 */
export function can(
  user: { role?: string | null } | null | undefined,
  permission: Permission
): boolean {
  if (!user || !user.role) return false;
  const normalizedRole = user.role.toUpperCase().replace(/\s+/g, "_") as Role;
  return hasPermission(normalizedRole, permission);
}

/**
 * Resource-Level Authorization (Section 6 & 7):
 * Role authorization answers: "Is this user allowed to perform this type of operation?"
 * Resource authorization answers: "Is this particular school theirs?"
 */
export function isSchoolOwner(
  user: { name?: string | null; id?: string | null } | null | undefined,
  school: { owner?: string | null; owner_id?: string | null } | null | undefined
): boolean {
  if (!user || !school) return false;
  
  const owner = (school.owner || "").toUpperCase();
  if (owner === "UNASSIGNED" || owner === "JOINT") {
    return true; // Any executive or manager can work on Joint or Unassigned schools
  }

  const userName = (user.name || "").toUpperCase();
  if (userName.includes("MANIKANDAN") && owner.includes("MANIKANDAN")) return true;
  if (userName.includes("EXECUTIVE 2") && owner.includes("EXECUTIVE 2")) return true;
  if (user.id && school.owner_id && user.id === school.owner_id) return true;

  return false;
}

/**
 * Comprehensive School Edit Authorization
 */
export function canEditSchool(
  user: { role: Role; name: string; id?: string },
  school: { owner?: string | null; owner_id?: string | null }
): { allowed: boolean; reason?: string; requiresAccessRequest?: boolean } {
  // 1. Role permission check
  if (!hasPermission(user.role, "schools:update")) {
    return { allowed: false, reason: "Your role cannot edit institutions." };
  }

  // 2. Managers & Super Admins override ownership
  if (user.role === "SUPER_ADMIN" || user.role === "MANAGER") {
    return { allowed: true };
  }

  // 3. Executive Resource-Level Ownership check
  if (isSchoolOwner(user, school)) {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: `This school is assigned to ${school.owner || "another executive"}. Request access to plan visits.`,
    requiresAccessRequest: true,
  };
}
