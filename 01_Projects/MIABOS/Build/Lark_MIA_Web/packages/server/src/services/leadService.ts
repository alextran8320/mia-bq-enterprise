import { and, count, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "../db/client.js";
import { leads, users } from "../db/schema.js";
import { HttpError } from "../lib/httpError.js";

export type LeadListFilters = {
  q?: string;
  status?: string;
  source?: string;
  assigneeId?: string;
  page?: number;
  pageSize?: number;
};

const baseSelect = {
  id: leads.id,
  name: leads.name,
  phone: leads.phone,
  email: leads.email,
  source: leads.source,
  status: leads.status,
  score: leads.score,
  note: leads.note,
  assigneeId: leads.assigneeId,
  assigneeEmail: users.email,
  convertedCustomerId: leads.convertedCustomerId,
  createdAt: leads.createdAt,
  updatedAt: leads.updatedAt,
};

export async function listLeads(filters: LeadListFilters) {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(200, Math.max(1, filters.pageSize ?? 50));

  const wheres = [];
  if (filters.q) {
    const needle = `%${filters.q}%`;
    wheres.push(
      or(
        ilike(leads.name, needle),
        ilike(leads.email, needle),
        ilike(leads.phone, needle),
      )!,
    );
  }
  if (filters.status) wheres.push(eq(leads.status, filters.status));
  if (filters.source) wheres.push(eq(leads.source, filters.source));
  if (filters.assigneeId) wheres.push(eq(leads.assigneeId, filters.assigneeId));

  const whereClause = wheres.length > 0 ? and(...wheres) : undefined;

  const items = await db
    .select(baseSelect)
    .from(leads)
    .leftJoin(users, eq(leads.assigneeId, users.id))
    .where(whereClause)
    .orderBy(desc(leads.updatedAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  const totalRow = await db
    .select({ c: count() })
    .from(leads)
    .where(whereClause);

  return { items, total: totalRow[0]?.c ?? 0, page, pageSize };
}

export async function getLeadById(id: string) {
  const rows = await db
    .select(baseSelect)
    .from(leads)
    .leftJoin(users, eq(leads.assigneeId, users.id))
    .where(eq(leads.id, id))
    .limit(1);
  if (!rows[0]) throw new HttpError(404, "Lead không tồn tại");
  return rows[0];
}

export type LeadInput = {
  name: string;
  phone?: string | null;
  email?: string | null;
  source?: string | null;
  status?: string;
  score?: number;
  note?: string | null;
  assigneeId?: string | null;
};

export async function createLead(input: LeadInput) {
  const inserted = await db
    .insert(leads)
    .values(input)
    .returning({ id: leads.id });
  return getLeadById(inserted[0].id);
}

export async function updateLead(id: string, patch: Partial<LeadInput>) {
  if (Object.keys(patch).length === 0) return getLeadById(id);
  const result = await db
    .update(leads)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(leads.id, id))
    .returning({ id: leads.id });
  if (!result[0]) throw new HttpError(404, "Lead không tồn tại");
  return getLeadById(id);
}

export async function deleteLead(id: string) {
  const result = await db
    .delete(leads)
    .where(eq(leads.id, id))
    .returning({ id: leads.id });
  if (!result[0]) throw new HttpError(404, "Lead không tồn tại");
}
