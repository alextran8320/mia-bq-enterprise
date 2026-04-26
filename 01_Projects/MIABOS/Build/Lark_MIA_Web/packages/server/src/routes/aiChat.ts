import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/requireAuth.js";
import {
  createSessionForUser,
  deleteSessionForUser,
  getMessagesForSession,
  listSessionsForUser,
  sendMessage,
} from "../services/aiChatService.js";

const router = Router();

const IdParamSchema = z.object({ id: z.string().uuid("Id phải là UUID") });
const SendBodySchema = z.object({
  message: z.string().trim().min(1, "Vui lòng nhập nội dung").max(4000),
});

router.use(requireAuth);

router.get("/sessions", async (req, res, next) => {
  try {
    const sessions = await listSessionsForUser(req.user!.id);
    res.json({ sessions });
  } catch (err) {
    next(err);
  }
});

router.post("/sessions", async (req, res, next) => {
  try {
    const session = await createSessionForUser(req.user!.id);
    res.status(201).json({ session });
  } catch (err) {
    next(err);
  }
});

router.get("/sessions/:id/messages", async (req, res, next) => {
  try {
    const { id } = IdParamSchema.parse(req.params);
    const messages = await getMessagesForSession(id, req.user!.id);
    res.json({ messages });
  } catch (err) {
    next(err);
  }
});

router.post("/sessions/:id/messages", async (req, res, next) => {
  try {
    const { id } = IdParamSchema.parse(req.params);
    const { message } = SendBodySchema.parse(req.body);
    const result = await sendMessage(id, req.user!.id, message);
    // We always persist what happened — even on upstream error — so the FE
    // can render the error bubble inline. Status 200 keeps optimistic UI logic
    // simple; clients distinguish via the `error` field in the payload.
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.delete("/sessions/:id", async (req, res, next) => {
  try {
    const { id } = IdParamSchema.parse(req.params);
    await deleteSessionForUser(id, req.user!.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
