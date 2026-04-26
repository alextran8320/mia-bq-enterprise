// One-shot DB sanity check — counts + sample joined query + bindings.
// Usage: npx tsx src/db/verify.ts
import { db, pool } from "./client.js";
import {
  roles,
  permissions,
  rolePermissions,
  users,
  larkBindings,
} from "./schema.js";
import { sql, eq } from "drizzle-orm";

async function main() {
  const counts = {
    roles: (await db.select({ c: sql<number>`count(*)::int` }).from(roles))[0]
      .c,
    permissions: (
      await db.select({ c: sql<number>`count(*)::int` }).from(permissions)
    )[0].c,
    role_permissions: (
      await db.select({ c: sql<number>`count(*)::int` }).from(rolePermissions)
    )[0].c,
    users: (await db.select({ c: sql<number>`count(*)::int` }).from(users))[0]
      .c,
    lark_bindings: (
      await db.select({ c: sql<number>`count(*)::int` }).from(larkBindings)
    )[0].c,
  };
  console.log("counts:", counts);

  const sample = await db
    .select({
      email: users.email,
      role: roles.name,
      isActive: users.isActive,
      hasPassword: sql<boolean>`(${users.passwordHash} IS NOT NULL)`,
    })
    .from(users)
    .innerJoin(roles, eq(users.roleId, roles.id))
    .orderBy(users.email);
  console.log("users:", sample);

  const bindings = await db.select().from(larkBindings);
  console.log(
    "bindings:",
    bindings.map((b) => ({
      openId: b.larkOpenId,
      userId: b.userId.slice(0, 8),
      tenantKey: b.tenantKey,
      linkedAt: b.linkedAt,
    })),
  );

  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
