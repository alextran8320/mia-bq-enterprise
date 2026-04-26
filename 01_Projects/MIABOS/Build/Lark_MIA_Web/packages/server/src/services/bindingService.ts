import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { roles, users, larkBindings } from "../db/schema.js";
import { env } from "../lib/env.js";
import { HttpError } from "../lib/httpError.js";
import { logger } from "../lib/logger.js";
import type { LarkProfile } from "./larkService.js";

/**
 * Look up an existing user binding by Lark open_id.
 * Returns userId (null if no binding yet).
 */
export async function findUserIdByLarkOpenId(
  openId: string,
): Promise<string | null> {
  const rows = await db
    .select({ userId: larkBindings.userId })
    .from(larkBindings)
    .where(eq(larkBindings.larkOpenId, openId))
    .limit(1);
  return rows[0]?.userId ?? null;
}

/**
 * Auto-provision a user from a Lark profile when:
 *   - LARK_AUTO_PROVISION=true, AND
 *   - the profile has an email (we use it as the unique key for `users`).
 *
 * Returns the new userId, or null when auto-provision is skipped.
 *
 * Concurrency: relies on UNIQUE(email) + UNIQUE(lark_open_id). Two simultaneous
 * exchanges for the same Lark account will collide on the binding insert; the
 * loser should fall back to findUserIdByLarkOpenId.
 */
export async function autoProvisionFromLark(
  profile: LarkProfile,
): Promise<string | null> {
  if (!env.LARK_AUTO_PROVISION) return null;
  if (!profile.email) {
    logger.info(
      { openId: profile.openId },
      "[binding] skip auto-provision: profile has no email",
    );
    return null;
  }

  const email = profile.email.toLowerCase();
  const isAdmin = env.ADMIN_EMAILS.includes(email);
  const targetRoleName = isAdmin ? "admin" : "staff";

  const roleRow = await db
    .select({ id: roles.id })
    .from(roles)
    .where(eq(roles.name, targetRoleName))
    .limit(1);
  if (!roleRow[0]) {
    throw new HttpError(
      500,
      `Role "${targetRoleName}" không tồn tại — chạy db:seed trước`,
    );
  }

  // Check first by email to handle the case where the same internal user
  // already exists (e.g. created via UAT) but has not been bound to Lark yet.
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  let userId: string;
  if (existing[0]) {
    userId = existing[0].id;
  } else {
    const inserted = await db
      .insert(users)
      .values({
        email,
        fullName: profile.name ?? null,
        passwordHash: null, // Lark-only — block password login
        roleId: roleRow[0].id,
        isActive: true,
      })
      .returning({ id: users.id });
    userId = inserted[0].id;
    logger.info(
      { email, role: targetRoleName },
      "[binding] auto-provisioned new user",
    );
  }

  // Create the binding. If another request beat us, treat as success.
  await db
    .insert(larkBindings)
    .values({
      larkOpenId: profile.openId,
      larkUnionId: profile.unionId ?? null,
      userId,
      tenantKey: profile.tenantKey ?? null,
    })
    .onConflictDoNothing();

  return userId;
}

/**
 * Bind an existing internal user to a Lark identity.
 * Used by Case A' (manual bind after needsBinding response).
 */
export async function createBinding(
  userId: string,
  profile: LarkProfile,
): Promise<{ linkedAt: Date }> {
  // Reject if this Lark account is already bound to anyone.
  const existingByOpenId = await db
    .select({ userId: larkBindings.userId })
    .from(larkBindings)
    .where(eq(larkBindings.larkOpenId, profile.openId))
    .limit(1);
  if (existingByOpenId[0]) {
    if (existingByOpenId[0].userId === userId) {
      // Already bound to the requester — idempotent success.
      return { linkedAt: new Date() };
    }
    throw new HttpError(409, "Tài khoản Lark này đã liên kết với user khác");
  }

  // Reject if this internal user already has a Lark binding.
  const existingByUser = await db
    .select({ openId: larkBindings.larkOpenId })
    .from(larkBindings)
    .where(eq(larkBindings.userId, userId))
    .limit(1);
  if (existingByUser[0]) {
    throw new HttpError(409, "User này đã liên kết với một Lark account khác");
  }

  const inserted = await db
    .insert(larkBindings)
    .values({
      larkOpenId: profile.openId,
      larkUnionId: profile.unionId ?? null,
      userId,
      tenantKey: profile.tenantKey ?? null,
    })
    .returning({ linkedAt: larkBindings.linkedAt });

  return { linkedAt: inserted[0].linkedAt };
}
