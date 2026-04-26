import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/requireAuth.js";
import { requirePermission } from "../middleware/requirePermission.js";
import {
  getUserById,
  listUsers,
  patchUser,
} from "../services/userService.js";

const router = Router();

const ListQuerySchema = z.object({
  q: z.string().optional(),
  role: z.string().optional(),
  active: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(200).optional(),
});

const IdParamSchema = z.object({ id: z.string().uuid("Id phải là UUID") });

const PatchSchema = z
  .object({
    fullName: z.string().nullable().optional(),
    role: z.string().min(1).optional(),
    isActive: z.boolean().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, {
    message: "Phải cung cấp ít nhất 1 trường để cập nhật",
  });

router.use(requireAuth);

router.get("/", requirePermission("user:read"), async (req, res, next) => {
  try {
    const filters = ListQuerySchema.parse(req.query);
    const result = await listUsers(filters);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", requirePermission("user:read"), async (req, res, next) => {
  try {
    const { id } = IdParamSchema.parse(req.params);
    const user = await getUserById(id);
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

router.patch(
  "/:id",
  requirePermission("user:write"),
  async (req, res, next) => {
    try {
      const { id } = IdParamSchema.parse(req.params);
      const patch = PatchSchema.parse(req.body);
      const user = await patchUser(req.user!.id, id, patch);
      res.json({ user });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
