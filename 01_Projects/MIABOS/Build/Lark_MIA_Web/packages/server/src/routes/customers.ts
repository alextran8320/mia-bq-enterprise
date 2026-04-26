import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/requireAuth.js";
import { requirePermission } from "../middleware/requirePermission.js";
import {
  createCustomer,
  deleteCustomer,
  getCustomerById,
  listCustomers,
  updateCustomer,
} from "../services/customerService.js";

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
  status: z.string().optional(),
  source: z.string().nullish(),
  consentGiven: z.boolean().optional(),
  gender: z.string().nullish(),
  birthday: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "birthday phải là YYYY-MM-DD")
    .nullish(),
  region: z.string().nullish(),
  preferredChannel: z.string().nullish(),
  preferredStore: z.string().nullish(),
  tags: z.array(z.string()).optional(),
  assigneeId: z.string().uuid().nullish(),
});

const PatchSchema = InputSchema.partial().refine(
  (v) => Object.keys(v).length > 0,
  { message: "Phải cung cấp ít nhất 1 trường để cập nhật" },
);

router.use(requireAuth);

router.get("/", requirePermission("customer:read"), async (req, res, next) => {
  try {
    const filters = ListSchema.parse(req.query);
    res.json(await listCustomers(filters));
  } catch (err) {
    next(err);
  }
});

router.get(
  "/:id",
  requirePermission("customer:read"),
  async (req, res, next) => {
    try {
      const { id } = IdParamSchema.parse(req.params);
      res.json({ customer: await getCustomerById(id) });
    } catch (err) {
      next(err);
    }
  },
);

router.post("/", requirePermission("customer:write"), async (req, res, next) => {
  try {
    const body = InputSchema.parse(req.body);
    res.status(201).json({ customer: await createCustomer(body) });
  } catch (err) {
    next(err);
  }
});

router.patch(
  "/:id",
  requirePermission("customer:write"),
  async (req, res, next) => {
    try {
      const { id } = IdParamSchema.parse(req.params);
      const patch = PatchSchema.parse(req.body);
      res.json({ customer: await updateCustomer(id, patch) });
    } catch (err) {
      next(err);
    }
  },
);

router.delete(
  "/:id",
  requirePermission("customer:delete"),
  async (req, res, next) => {
    try {
      const { id } = IdParamSchema.parse(req.params);
      await deleteCustomer(id);
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
