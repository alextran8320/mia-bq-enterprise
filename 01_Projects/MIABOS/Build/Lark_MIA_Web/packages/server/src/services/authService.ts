import jwt, { type SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { roles, permissions, rolePermissions, users } from "../db/schema.js";
import { env } from "../lib/env.js";
import { HttpError } from "../lib/httpError.js";

export type AuthedUser = {
  id: string;
  email: string;
  fullName: string | null;
  role: string;
  permissions: string[];
  isActive: boolean;
};

type JwtPayload = { userId: string };

export function signToken(userId: string): string {
  return jwt.sign({ userId } satisfies JwtPayload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  });
}

export function verifyToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET, { clockTolerance: 5 });
    if (typeof decoded !== "object" || !decoded || !("userId" in decoded)) {
      throw new HttpError(401, "Invalid token");
    }
    return decoded as JwtPayload;
  } catch (err) {
    if (err instanceof HttpError) throw err;
    throw new HttpError(401, "Invalid or expired token");
  }
}

/**
 * Load fresh user + permissions from DB. Always go to DB on every authed request
 * so role changes / deactivations take effect immediately (no JWT cache).
 */
export async function loadAuthedUser(userId: string): Promise<AuthedUser> {
  const userRow = await db
    .select({
      id: users.id,
      email: users.email,
      fullName: users.fullName,
      isActive: users.isActive,
      role: roles.name,
      roleId: roles.id,
    })
    .from(users)
    .innerJoin(roles, eq(users.roleId, roles.id))
    .where(eq(users.id, userId))
    .limit(1);

  const user = userRow[0];
  if (!user) throw new HttpError(401, "User not found");
  if (!user.isActive) throw new HttpError(403, "Account is deactivated");

  const permRows = await db
    .select({ code: permissions.code })
    .from(rolePermissions)
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(eq(rolePermissions.roleId, user.roleId));

  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    isActive: user.isActive,
    permissions: permRows.map((p) => p.code),
  };
}

export async function loginWithPassword(
  email: string,
  password: string,
): Promise<{ token: string; user: AuthedUser }> {
  const normalized = email.trim().toLowerCase();
  const userRow = await db
    .select({ id: users.id, passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.email, normalized))
    .limit(1);

  const found = userRow[0];
  // Deliberately use the same generic error for unknown email AND wrong password
  // to avoid leaking which emails exist.
  if (!found) throw new HttpError(401, "Email hoặc mật khẩu không đúng");

  if (!found.passwordHash) {
    throw new HttpError(
      401,
      "Tài khoản này chỉ đăng nhập bằng Lark. Vui lòng dùng Lark Desktop.",
    );
  }

  const ok = await bcrypt.compare(password, found.passwordHash);
  if (!ok) throw new HttpError(401, "Email hoặc mật khẩu không đúng");

  const user = await loadAuthedUser(found.id);
  const token = signToken(user.id);
  return { token, user };
}
