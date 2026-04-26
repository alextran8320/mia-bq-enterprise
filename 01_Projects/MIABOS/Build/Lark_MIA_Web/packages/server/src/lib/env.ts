import "dotenv/config";
import { z } from "zod";

const csv = (v: string | undefined) =>
  (v ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 chars"),
  JWT_EXPIRES_IN: z.string().default("7d"),

  CORS_ORIGINS: z.string().default("http://localhost:5180"),

  // Lark (intl): https://open.larksuite.com
  // Feishu (CN):  https://open.feishu.cn
  LARK_API_BASE: z.string().url().default("https://open.larksuite.com"),
  LARK_APP_ID: z.string().default(""),
  LARK_APP_SECRET: z.string().default(""),
  LARK_AUTO_PROVISION: z
    .enum(["true", "false"])
    .default("true")
    .transform((v) => v === "true"),

  ADMIN_EMAILS: z.string().default(""),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  // Fail fast on misconfig — don't try to continue with bad env.
  console.error("[env] Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const raw = parsed.data;

export const env = {
  ...raw,
  CORS_ORIGINS: csv(raw.CORS_ORIGINS),
  ADMIN_EMAILS: csv(raw.ADMIN_EMAILS).map((e) => e.toLowerCase()),
};

export type Env = typeof env;
