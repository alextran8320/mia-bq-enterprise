import { Router } from "express";
import { env } from "../lib/env.js";

const router = Router();

// Public — FE đọc lúc init để biết Lark App ID + flags.
router.get("/", (_req, res) => {
  res.json({
    larkAppId: env.LARK_APP_ID,
    larkAutoProvision: env.LARK_AUTO_PROVISION,
  });
});

export default router;
