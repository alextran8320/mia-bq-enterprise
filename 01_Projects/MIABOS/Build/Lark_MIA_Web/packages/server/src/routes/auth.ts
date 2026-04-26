import { Router } from "express";
import { z } from "zod";
import {
  loginWithPassword,
  loadAuthedUser,
  signToken,
} from "../services/authService.js";
import { exchangeCodeForProfile } from "../services/larkService.js";
import {
  autoProvisionFromLark,
  createBinding,
  findUserIdByLarkOpenId,
} from "../services/bindingService.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

const LoginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

router.post("/login", async (req, res, next) => {
  try {
    const body = LoginSchema.parse(req.body);
    const result = await loginWithPassword(body.email, body.password);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

// Stateless JWT — logout is a client-side concern (drop the token).
// Endpoint exists so FE can call it consistently and we can later add
// a token-revocation list if needed.
router.post("/logout", requireAuth, (_req, res) => {
  res.json({ ok: true });
});

// ─── Lark ──────────────────────────────────────────────────────────────

const LarkExchangeSchema = z.object({
  code: z.string().min(1, "Thiếu Lark authorization code"),
});

const LarkProfileSchema = z.object({
  openId: z.string().min(1),
  unionId: z.string().optional(),
  tenantKey: z.string().optional(),
  email: z.string().email().optional(),
  name: z.string().optional(),
  avatarUrl: z.string().url().optional(),
});

const BindSchema = z.object({
  larkProfile: LarkProfileSchema,
});

/**
 * POST /api/auth/lark/exchange
 *
 * Body: { code }
 *
 * Branches:
 *  - Open ID đã có binding         → { token, user }
 *  - Chưa có binding + auto-provision OK → { token, user }
 *  - Chưa có binding + auto-provision skip → { needsBinding: true, larkProfile }
 */
router.post("/lark/exchange", async (req, res, next) => {
  try {
    const { code } = LarkExchangeSchema.parse(req.body);
    const profile = await exchangeCodeForProfile(code);

    let userId = await findUserIdByLarkOpenId(profile.openId);
    if (!userId) {
      userId = await autoProvisionFromLark(profile);
    }

    if (!userId) {
      // Tell FE to collect internal credentials then call /bind.
      res.json({ needsBinding: true, larkProfile: profile });
      return;
    }

    const user = await loadAuthedUser(userId);
    const token = signToken(user.id);
    res.json({ token, user });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/bind  (auth required — caller authed via internal login)
 *
 * Body: { larkProfile }
 *
 * Used after a /lark/exchange returned needsBinding:true and the user
 * logged in with email/password. We attach their Lark identity now.
 */
router.post("/bind", requireAuth, async (req, res, next) => {
  try {
    const { larkProfile } = BindSchema.parse(req.body);
    const result = await createBinding(req.user!.id, larkProfile);
    // Re-issue token so FE can refresh in case any user metadata changed.
    const user = await loadAuthedUser(req.user!.id);
    const token = signToken(user.id);
    res.json({ token, user, linkedAt: result.linkedAt });
  } catch (err) {
    next(err);
  }
});

export default router;
