import { and, count, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "../db/client.js";
import { customers, users } from "../db/schema.js";
import { HttpError } from "../lib/httpError.js";

export type CustomerListFilters = {
  q?: string;
  status?: string;
  source?: string;
  assigneeId?: string;
  page?: number;
  pageSize?: number;
};

const baseSelect = {
  id: customers.id,
  name: customers.name,
  phone: customers.phone,
  email: customers.email,
  status: customers.status,
  source: customers.source,
  consentGiven: customers.consentGiven,
  gender: customers.gender,
  birthday: customers.birthday,
  region: customers.region,
  preferredChannel: customers.preferredChannel,
  preferredStore: customers.preferredStore,
  tags: customers.tags,
  totalSpent: customers.totalSpent,
  orderCount: customers.orderCount,
  assigneeId: customers.assigneeId,
  assigneeEmail: users.email,
  lastContactAt: customers.lastContactAt,
  createdAt: customers.createdAt,
  updatedAt: customers.updatedAt,
};

export async function listCustomers(filters: CustomerListFilters) {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(200, Math.max(1, filters.pageSize ?? 50));

  const wheres = [];
  if (filters.q) {
    const needle = `%${filters.q}%`;
    wheres.push(
      or(
        ilike(customers.name, needle),
        ilike(customers.email, needle),
        ilike(customers.phone, needle),
      )!,
    );
  }
  if (filters.status) wheres.push(eq(customers.status, filters.status));
  if (filters.source) wheres.push(eq(customers.source, filters.source));
  if (filters.assigneeId)
    wheres.push(eq(customers.assigneeId, filters.assigneeId));

  const whereClause = wheres.length > 0 ? and(...wheres) : undefined;

  const items = await db
    .select(baseSelect)
    .from(customers)
    .leftJoin(users, eq(customers.assigneeId, users.id))
    .where(whereClause)
    .orderBy(desc(customers.updatedAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  const totalRow = await db
    .select({ c: count() })
    .from(customers)
    .where(whereClause);

  return { items, total: totalRow[0]?.c ?? 0, page, pageSize };
}

export async function getCustomerById(id: string) {
  const rows = await db
    .select(baseSelect)
    .from(customers)
    .leftJoin(users, eq(customers.assigneeId, users.id))
    .where(eq(customers.id, id))
    .limit(1);
  if (!rows[0]) throw new HttpError(404, "Customer không tồn tại");
  return rows[0];
}

export type CustomerInput = {
  name: string;
  phone?: string | null;
  email?: string | null;
  status?: string;
  source?: string | null;
  consentGiven?: boolean;
  gender?: string | null;
  birthday?: string | null;
  region?: string | null;
  preferredChannel?: string | null;
  preferredStore?: string | null;
  tags?: string[];
  assigneeId?: string | null;
};

export async function createCustomer(input: CustomerInput) {
  const inserted = await db
    .insert(customers)
    .values({
      ...input,
      tags: input.tags ?? [],
    })
    .returning({ id: customers.id });
  return getCustomerById(inserted[0].id);
}

export async function updateCustomer(id: string, patch: Partial<CustomerInput>) {
  if (Object.keys(patch).length === 0) return getCustomerById(id);
  const result = await db
    .update(customers)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(customers.id, id))
    .returning({ id: customers.id });
  if (!result[0]) throw new HttpError(404, "Customer không tồn tại");
  return getCustomerById(id);
}

export async function deleteCustomer(id: string) {
  const result = await db
    .delete(customers)
    .where(eq(customers.id, id))
    .returning({ id: customers.id });
  if (!result[0]) throw new HttpError(404, "Customer không tồn tại");
}
