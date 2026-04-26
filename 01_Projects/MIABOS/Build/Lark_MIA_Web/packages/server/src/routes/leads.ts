import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/requireAuth.js";
import { requirePermission } from "../middleware/requirePermission.js";
import {
  createLead,
  deleteLead,
  getLeadById,
  listLeads,
  updateLead,
} from "../services/leadService.js";

const router = Router();

const ListSchema = z.object({
  q: z.string().optional(),
  status: z.string().optional(),
  source: z.string().optional(),
  assigneeId: z.string().uuid().optional(),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(200).optional(),
});

const IdParamSchema = z.object({ id: z.string().uuid("Id phải là UUID") });

const InputSchema = z.object({
  name: z.string().min(1, "Tên không được trống"),
  phone: z.string().nullish(),
  email: z.string().email().nullish(),
  source: z.string().nullish(),
  status: z.string().optional(),
  score: z.number().int().min(0).max(100).optional(),
  note: z.string().nullish(),
  assigneeId: z.string().uuid().nullish(),
});

const PatchSchema = InputSchema.partial().refine(
  (v) => Object.keys(v).length > 0,
  { message: "Phải cung cấp ít nhất 1 trường để cập nhật" },
);

router.use(requireAuth);

router.get("/", requirePermission("lead:read"), async (req, res, next) => {
  try {
    res.json(await listLeads(ListSchema.parse(req.query)));
  } catch (err) {
    next(err);
  }
});

router.get("/:id", requirePermission("lead:read"), async (req, res, next) => {
  try {
    const { id } = IdParamSchema.parse(req.params);
    res.json({ lead: await getLeadById(id) });
  } catch (err) {
    next(err);
  }
});

router.post("/", requirePermission("lead:write"), async (req, res, next) => {
  try {
    res.status(201).json({ lead: await createLead(InputSchema.parse(req.body)) });
  } catch (err) {
    next(err);
  }
});

router.patch(
  "/:id",
  requirePermission("lead:write"),
  async (req, res, next) => {
    try {
      const { id } = IdParamSchema.parse(req.params);
      res.json({ lead: await updateLead(id, PatchSchema.parse(req.body)) });
    } catch (err) {
      next(err);
    }
  },
);

router.delete(
  "/:id",
  requirePermission("lead:write"),
  async (req, res, next) => {
    try {
      const { id } = IdParamSchema.parse(req.params);
      await deleteLead(id);
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
