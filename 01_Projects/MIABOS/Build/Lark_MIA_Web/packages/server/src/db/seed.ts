import bcrypt from "bcrypt";
import { eq, inArray } from "drizzle-orm";
import { db, pool } from "./client.js";
import { roles, permissions, rolePermissions, users } from "./schema.js";
import { logger } from "../lib/logger.js";

// ─── Source of truth ───────────────────────────────────────────────────
// Permission codes — keep grouped by domain. Add new codes here, rerun seed.
const PERMISSION_CATALOG: Array<{ code: string; label: string }> = [
  { code: "customer:read", label: "Xem khách hàng" },
  { code: "customer:write", label: "Tạo / sửa khách hàng" },
  { code: "customer:delete", label: "Xoá khách hàng" },

  { code: "lead:read", label: "Xem lead" },
  { code: "lead:write", label: "Tạo / sửa lead" },

  { code: "order:read", label: "Xem đơn hàng" },
  { code: "order:write", label: "Tạo / sửa đơn hàng" },

  { code: "product:read", label: "Xem sản phẩm" },
  { code: "product:write", label: "Tạo / sửa sản phẩm" },

  { code: "pricing:read", label: "Xem bảng giá" },
  { code: "pricing:write", label: "Tạo / sửa bảng giá" },

  { code: "promotion:read", label: "Xem khuyến mãi" },
  { code: "promotion:write", label: "Tạo / sửa khuyến mãi" },

  { code: "inbox:read", label: "Xem hội thoại" },
  { code: "inbox:write", label: "Trả lời hội thoại" },

  { code: "escalation:read", label: "Xem hàng đợi xử lý" },
  { code: "escalation:write", label: "Xử lý escalation" },

  { code: "integration:read", label: "Xem cấu hình tích hợp" },
  { code: "integration:write", label: "Sửa cấu hình tích hợp" },

  { code: "knowledge:read", label: "Xem knowledge base" },
  { code: "knowledge:write", label: "Sửa knowledge base" },

  { code: "analytics:read", label: "Xem báo cáo" },

  { code: "user:read", label: "Xem danh sách user" },
  { code: "user:write", label: "Tạo / sửa user" },

  { code: "role:read", label: "Xem role" },
  { code: "role:write", label: "Sửa role / phân quyền" },

  { code: "setting:read", label: "Xem cấu hình hệ thống" },
  { code: "setting:write", label: "Sửa cấu hình hệ thống" },
];

// Role-permission mapping. Reference: admin = all, manager = ops + read, staff = day-to-day.
const ROLE_DEFINITIONS: Array<{
  name: string;
  description: string;
  permissions: "*" | string[];
}> = [
  {
    name: "admin",
    description: "Toàn quyền hệ thống",
    permissions: "*",
  },
  {
    name: "manager",
    description: "Quản lý vận hành — read all + write trên ops",
    permissions: [
      "customer:read",
      "customer:write",
      "lead:read",
      "lead:write",
      "order:read",
      "order:write",
      "product:read",
      "pricing:read",
      "pricing:write",
      "promotion:read",
      "promotion:write",
      "inbox:read",
      "inbox:write",
      "escalation:read",
      "escalation:write",
      "integration:read",
      "knowledge:read",
      "knowledge:write",
      "analytics:read",
      "user:read",
      "role:read",
      "setting:read",
    ],
  },
  {
    name: "staff",
    description: "Nhân viên — chăm sóc khách + bán hàng",
    permissions: [
      "customer:read",
      "customer:write",
      "lead:read",
      "lead:write",
      "order:read",
      "order:write",
      "product:read",
      "pricing:read",
      "promotion:read",
      "inbox:read",
      "inbox:write",
      "escalation:read",
      "knowledge:read",
      "analytics:read",
    ],
  },
];

const DEMO_USERS: Array<{
  email: string;
  fullName: string;
  password: string;
  role: string;
}> = [
  {
    email: "admin@bq.vn",
    fullName: "Admin BQ",
    password: "admin123",
    role: "admin",
  },
  {
    email: "manager@bq.vn",
    fullName: "Manager BQ",
    password: "manager123",
    role: "manager",
  },
  {
    email: "staff@bq.vn",
    fullName: "Staff BQ",
    password: "staff123",
    role: "staff",
  },
];

async function main() {
  logger.info("[seed] start");

  // 1. Permissions — upsert by code
  logger.info("[seed] upserting permissions");
  for (const p of PERMISSION_CATALOG) {
    await db
      .insert(permissions)
      .values(p)
      .onConflictDoUpdate({
        target: permissions.code,
        set: { label: p.label },
      });
  }

  // 2. Roles — upsert by name
  logger.info("[seed] upserting roles");
  for (const r of ROLE_DEFINITIONS) {
    await db
      .insert(roles)
      .values({ name: r.name, description: r.description })
      .onConflictDoUpdate({
        target: roles.name,
        set: { description: r.description },
      });
  }

  // 3. Role ↔ Permission mapping — replace fully each run (idempotent)
  logger.info("[seed] mapping role_permissions");
  const allRoles = await db.select().from(roles);
  const allPerms = await db.select().from(permissions);
  const permByCode = new Map(allPerms.map((p) => [p.code, p.id]));

  for (const def of ROLE_DEFINITIONS) {
    const role = allRoles.find((r) => r.name === def.name);
    if (!role) continue;

    const codes =
      def.permissions === "*"
        ? PERMISSION_CATALOG.map((p) => p.code)
        : def.permissions;

    const rows = codes
      .map((code) => permByCode.get(code))
      .filter((id): id is string => Boolean(id))
      .map((permissionId) => ({ roleId: role.id, permissionId }));

    // Drop existing then re-insert — keeps mapping in sync with code source-of-truth.
    await db.delete(rolePermissions).where(eq(rolePermissions.roleId, role.id));
    if (rows.length > 0) {
      await db.insert(rolePermissions).values(rows);
    }
    logger.info(`[seed]   ${def.name}: ${rows.length} permissions`);
  }

  // 4. Demo users — upsert by email, only set password if user is new
  logger.info("[seed] upserting demo users");
  const refreshedRoles = await db.select().from(roles);
  const roleByName = new Map(refreshedRoles.map((r) => [r.name, r.id]));

  const existingEmails = new Set(
    (
      await db
        .select({ email: users.email })
        .from(users)
        .where(
          inArray(
            users.email,
            DEMO_USERS.map((u) => u.email),
          ),
        )
    ).map((r) => r.email),
  );

  for (const u of DEMO_USERS) {
    if (existingEmails.has(u.email)) {
      logger.info(`[seed]   user ${u.email} exists — skip`);
      continue;
    }
    const roleId = roleByName.get(u.role);
    if (!roleId) {
      logger.warn(`[seed]   role ${u.role} not found — skip ${u.email}`);
      continue;
    }
    const passwordHash = await bcrypt.hash(u.password, 10);
    await db.insert(users).values({
      email: u.email,
      fullName: u.fullName,
      passwordHash,
      roleId,
      isActive: true,
    });
    logger.info(`[seed]   created ${u.email} (${u.role}) pwd=${u.password}`);
  }

  logger.info("[seed] done");
  await pool.end();
}

main().catch(async (err) => {
  logger.error({ err }, "[seed] failed");
  await pool.end().catch(() => {});
  process.exit(1);
});
