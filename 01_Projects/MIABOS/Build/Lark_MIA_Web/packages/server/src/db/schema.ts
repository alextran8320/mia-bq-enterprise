import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  primaryKey,
  integer,
  bigint,
  date,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ─── roles ─────────────────────────────────────────────────────────────
export const roles = pgTable("roles", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── permissions ───────────────────────────────────────────────────────
export const permissions = pgTable("permissions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(),
  label: text("label"),
});

// ─── role_permissions (junction) ───────────────────────────────────────
export const rolePermissions = pgTable(
  "role_permissions",
  {
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    permissionId: uuid("permission_id")
      .notNull()
      .references(() => permissions.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.roleId, t.permissionId] }),
  }),
);

// ─── users ─────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  // NULL means Lark-only account (no password login).
  passwordHash: text("password_hash"),
  roleId: uuid("role_id")
    .notNull()
    .references(() => roles.id),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── lark_bindings ─────────────────────────────────────────────────────
export const larkBindings = pgTable("lark_bindings", {
  larkOpenId: text("lark_open_id").primaryKey(),
  larkUnionId: text("lark_union_id"),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  tenantKey: text("tenant_key"),
  linkedAt: timestamp("linked_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── customers ─────────────────────────────────────────────────────────
// Source-of-truth values for `status`: Lead | Qualified | Customer | Inactive | Blocked
// Kept as plain text (no enum) so we can evolve the vocabulary without migration.
export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone"),
  email: text("email"),
  status: text("status").notNull().default("Lead"),
  source: text("source"),
  consentGiven: boolean("consent_given").notNull().default(false),
  gender: text("gender"),
  birthday: date("birthday"),
  region: text("region"),
  preferredChannel: text("preferred_channel"),
  preferredStore: text("preferred_store"),
  tags: jsonb("tags").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  totalSpent: bigint("total_spent", { mode: "number" }).notNull().default(0),
  orderCount: integer("order_count").notNull().default(0),
  assigneeId: uuid("assignee_id").references(() => users.id, {
    onDelete: "set null",
  }),
  lastContactAt: timestamp("last_contact_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── leads ─────────────────────────────────────────────────────────────
// `status`: New | Contacted | Qualified | Disqualified | Converted
export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone"),
  email: text("email"),
  source: text("source"),
  status: text("status").notNull().default("New"),
  score: integer("score").notNull().default(0),
  note: text("note"),
  assigneeId: uuid("assignee_id").references(() => users.id, {
    onDelete: "set null",
  }),
  // When the lead converts, link to the resulting customer for traceability.
  convertedCustomerId: uuid("converted_customer_id").references(
    () => customers.id,
    { onDelete: "set null" },
  ),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── ai_chat_sessions ──────────────────────────────────────────────────
// `id` is reused as the `session_id` we send to the Haravan flow API so the
// upstream bot keeps conversation context across messages.
export const aiChatSessions = pgTable(
  "ai_chat_sessions",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull().default("Cuộc trò chuyện mới"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    lastActiveAt: timestamp("last_active_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    byUserActive: index("ai_chat_sessions_user_active_idx").on(
      t.userId,
      t.lastActiveAt,
    ),
  }),
);

// ─── ai_chat_messages ──────────────────────────────────────────────────
// `role`: user | assistant | error. `content` is plain for user, markdown
// for assistant, error message for error.
export const aiChatMessages = pgTable(
  "ai_chat_messages",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => aiChatSessions.id, { onDelete: "cascade" }),
    role: text("role").notNull(),
    content: text("content").notNull(),
    meta: jsonb("meta").$type<Record<string, unknown> | null>(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    bySession: index("ai_chat_messages_session_idx").on(
      t.sessionId,
      t.createdAt,
    ),
  }),
);

// ─── exported types ────────────────────────────────────────────────────
export type Role = typeof roles.$inferSelect;
export type Permission = typeof permissions.$inferSelect;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type LarkBinding = typeof larkBindings.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type AiChatSession = typeof aiChatSessions.$inferSelect;
export type NewAiChatSession = typeof aiChatSessions.$inferInsert;
export type AiChatMessage = typeof aiChatMessages.$inferSelect;
export type NewAiChatMessage = typeof aiChatMessages.$inferInsert;
