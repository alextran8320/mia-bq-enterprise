import { and, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "../db/client.js";
import { roles, users, larkBindings } from "../db/schema.js";
import { HttpError } from "../lib/httpError.js";

export type UserListFilters = {
  q?: string;
  role?: string;
  active?: boolean;
  page?: number;
  pageSize?: number;
};

export type UserSummary = {
  id: string;
  email: string;
  fullName: string | null;
  role: string;
  isActive: boolean;
  hasLarkBinding: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export async function listUsers(filters: UserListFilters): Promise<{
  items: UserSummary[];
  total: number;
  page: number;
  pageSize: number;
}> {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(200, Math.max(1, filters.pageSize ?? 50));

  const wheres = [];
  if (filters.q) {
    const needle = `%${filters.q}%`;
    wheres.push(or(ilike(users.email, needle), ilike(users.fullName, needle))!);
  }
  if (filters.role) wheres.push(eq(roles.name, filters.role));
  if (typeof filters.active === "boolean")
    wheres.push(eq(users.isActive, filters.active));

  const whereClause = wheres.length > 0 ? and(...wheres) : undefined;

  const items = await db
    .select({
      id: users.id,
      email: users.email,
      fullName: users.fullName,
      role: roles.name,
      isActive: users.isActive,
      hasLarkBinding: sql<boolean>`(${larkBindings.userId} IS NOT NULL)`,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .innerJoin(roles, eq(users.roleId, roles.id))
    .leftJoin(larkBindings, eq(larkBindings.userId, users.id))
    .where(whereClause)
    .orderBy(desc(users.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  const totalRow = await db
    .select({ c: count() })
    .from(users)
    .innerJoin(roles, eq(users.roleId, roles.id))
    .where(whereClause);

  return { items, total: totalRow[0]?.c ?? 0, page, pageSize };
}

export async function getUserById(id: string): Promise<UserSummary> {
  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      fullName: users.fullName,
      role: roles.name,
      isActive: users.isActive,
      hasLarkBinding: sql<boolean>`(${larkBindings.userId} IS NOT NULL)`,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .innerJoin(roles, eq(users.roleId, roles.id))
    .leftJoin(larkBindings, eq(larkBindings.userId, users.id))
    .where(eq(users.id, id))
    .limit(1);

  if (!rows[0]) throw new HttpError(404, "User không tồn tại");
  return rows[0];
}

type PatchUserInput = {
  fullName?: string | null;
  role?: string;
  isActive?: boolean;
};

/**
 * Mutate a user. The `actorId` is the authenticated caller — used to enforce:
 *   - Caller cannot change their own role (avoid self-promote).
 *   - Cannot deactivate the last active admin (lock-out prevention).
 */
export async function patchUser(
  actorId: string,
  targetId: string,
  patch: PatchUserInput,
): Promise<UserSummary> {
  if (Object.keys(patch).length === 0) {
    return getUserById(targetId);
  }

  const target = await db
    .select({
      id: users.id,
      email: users.email,
      isActive: users.isActive,
      roleId: users.roleId,
      roleName: roles.name,
    })
    .from(users)
    .innerJoin(roles, eq(users.roleId, roles.id))
    .where(eq(users.id, targetId))
    .limit(1);

  if (!target[0]) throw new HttpError(404, "User không tồn tại");

  const currentRoleName = target[0].roleName;
  const currentlyActive = target[0].isActive;

  // ─── Guardrail 1: cannot change your own role
  const changingRole =
    patch.role !== undefined && patch.role !== currentRoleName;
  if (changingRole && actorId === targetId) {
    throw new HttpError(
      400,
      "Bạn không thể tự thay đổi role của chính mình",
    );
  }

  // ─── Guardrail 2: cannot deactivate / demote the last admin
  const losingAdmin =
    currentRoleName === "admin" &&
    ((patch.role !== undefined && patch.role !== "admin") ||
      (patch.isActive === false && currentlyActive));

  if (losingAdmin) {
    const otherAdminsRow = await db
      .select({ c: count() })
      .from(users)
      .innerJoin(roles, eq(users.roleId, roles.id))
      .where(
        and(
          eq(roles.name, "admin"),
          eq(users.isActive, true),
          sql`${users.id} <> ${targetId}`,
        ),
      );

    const otherAdmins = otherAdminsRow[0]?.c ?? 0;
    if (otherAdmins === 0) {
      throw new HttpError(
        400,
        "Không thể demote/deactivate admin cuối cùng còn active",
      );
    }
  }

  // Resolve role.name → role.id when caller wants to change role.
  let newRoleId: string | undefined;
  if (patch.role !== undefined && patch.role !== currentRoleName) {
    const roleRow = await db
      .select({ id: roles.id })
      .from(roles)
      .where(eq(roles.name, patch.role))
      .limit(1);
    if (!roleRow[0]) throw new HttpError(400, `Role "${patch.role}" không tồn tại`);
    newRoleId = roleRow[0].id;
  }

  const updates: Partial<typeof users.$inferInsert> = {
    updatedAt: new Date(),
  };
  if (patch.fullName !== undefined) updates.fullName = patch.fullName;
  if (patch.isActive !== undefined) updates.isActive = patch.isActive;
  if (newRoleId) updates.roleId = newRoleId;

  await db.update(users).set(updates).where(eq(users.id, targetId));

  return getUserById(targetId);
}
