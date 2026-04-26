import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { roles, permissions, rolePermissions } from "../db/schema.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { requirePermission } from "../middleware/requirePermission.js";

const router = Router();

router.use(requireAuth);

/**
 * GET /api/roles
 *
 * Returns the full role catalogue with their permission codes.
 * FE uses this to render the role/permission matrix and to know which
 * codes exist when building the per-button gating UI.
 */
router.get("/", requirePermission("role:read"), async (_req, res, next) => {
  try {
    const allRoles = await db.select().from(roles).orderBy(roles.name);
    const allPerms = await db.select().from(permissions).orderBy(permissions.code);

    // Aggregate permission codes per role in one round-trip.
    const mapping = await db
      .select({
        roleId: rolePermissions.roleId,
        code: permissions.code,
      })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id));

    const codesByRole = new Map<string, string[]>();
    for (const row of mapping) {
      const list = codesByRole.get(row.roleId) ?? [];
      list.push(row.code);
      codesByRole.set(row.roleId, list);
    }

    res.json({
      roles: allRoles.map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        permissions: codesByRole.get(r.id) ?? [],
      })),
      permissions: allPerms,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
