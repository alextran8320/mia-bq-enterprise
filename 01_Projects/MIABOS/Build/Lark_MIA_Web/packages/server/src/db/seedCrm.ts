// Sample CRM seed — idempotent on email. Run with: npm run db:seed-crm
import { eq } from "drizzle-orm";
import { db, pool } from "./client.js";
import { customers, leads, users } from "./schema.js";
import { logger } from "../lib/logger.js";

const SAMPLE_CUSTOMERS: Array<
  Omit<typeof customers.$inferInsert, "id" | "createdAt" | "updatedAt">
> = [
  {
    name: "Nguyễn Văn An",
    phone: "0901234567",
    email: "an.nguyen@gmail.com",
    status: "Customer",
    source: "Haravan",
    consentGiven: true,
    gender: "Nam",
    birthday: "1990-05-15",
    region: "TP.HCM",
    preferredChannel: "Zalo",
    preferredStore: "BQ Tân Bình",
    tags: ["VIP", "Repeat"],
    totalSpent: 4_240_000,
    orderCount: 3,
  },
  {
    name: "Trần Thị Bích",
    phone: "0907654321",
    email: "bich.tran@gmail.com",
    status: "Qualified",
    source: "Facebook",
    consentGiven: true,
    gender: "Nữ",
    region: "Hà Nội",
    preferredChannel: "Facebook",
    tags: ["NewArrival"],
    totalSpent: 0,
    orderCount: 0,
  },
  {
    name: "Lê Hoàng Cường",
    phone: "0912345678",
    email: "cuong.le@gmail.com",
    status: "Customer",
    source: "OmiCall",
    consentGiven: true,
    gender: "Nam",
    region: "Đà Nẵng",
    preferredChannel: "SMS",
    tags: [],
    totalSpent: 1_290_000,
    orderCount: 1,
  },
  {
    name: "Phạm Thị Diệp",
    phone: "0987654321",
    email: "diep.pham@gmail.com",
    status: "Lead",
    source: "Website",
    consentGiven: false,
    region: "TP.HCM",
    tags: ["Cold"],
    totalSpent: 0,
    orderCount: 0,
  },
  {
    name: "Vũ Minh Đức",
    phone: "0945678910",
    email: "duc.vu@gmail.com",
    status: "Inactive",
    source: "Zalo",
    consentGiven: true,
    region: "TP.HCM",
    preferredStore: "BQ Quận 1",
    tags: ["Win-back"],
    totalSpent: 850_000,
    orderCount: 1,
  },
];

const SAMPLE_LEADS: Array<
  Omit<typeof leads.$inferInsert, "id" | "createdAt" | "updatedAt">
> = [
  {
    name: "Nguyễn Quốc Bảo",
    phone: "0911111111",
    email: "bao.nguyen@gmail.com",
    source: "Facebook Ads",
    status: "New",
    score: 35,
    note: "Quan tâm sneaker Velocity",
  },
  {
    name: "Phan Thị Hương",
    phone: "0922222222",
    email: "huong.phan@gmail.com",
    source: "Website",
    status: "Contacted",
    score: 60,
    note: "Đã gọi 2 lần, hẹn ghé store cuối tuần",
  },
  {
    name: "Tạ Văn Khoa",
    phone: "0933333333",
    email: "khoa.ta@gmail.com",
    source: "Zalo OA",
    status: "Qualified",
    score: 82,
    note: "Đặt cọc 500k cho heel màu nude",
  },
];

async function main() {
  // Pin sample customers/leads to staff@bq.vn so the FE has a realistic owner.
  const staff = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, "staff@bq.vn"))
    .limit(1);
  const assigneeId = staff[0]?.id ?? null;

  logger.info("[seed-crm] start");

  for (const c of SAMPLE_CUSTOMERS) {
    if (!c.email) continue;
    const existing = await db
      .select({ id: customers.id })
      .from(customers)
      .where(eq(customers.email, c.email))
      .limit(1);
    if (existing[0]) {
      logger.info(`[seed-crm]   customer ${c.email} exists — skip`);
      continue;
    }
    await db.insert(customers).values({ ...c, assigneeId });
    logger.info(`[seed-crm]   created customer ${c.email}`);
  }

  for (const l of SAMPLE_LEADS) {
    if (!l.email) continue;
    const existing = await db
      .select({ id: leads.id })
      .from(leads)
      .where(eq(leads.email, l.email))
      .limit(1);
    if (existing[0]) {
      logger.info(`[seed-crm]   lead ${l.email} exists — skip`);
      continue;
    }
    await db.insert(leads).values({ ...l, assigneeId });
    logger.info(`[seed-crm]   created lead ${l.email}`);
  }

  logger.info("[seed-crm] done");
  await pool.end();
}

main().catch(async (err) => {
  logger.error({ err }, "[seed-crm] failed");
  await pool.end().catch(() => {});
  process.exit(1);
});
