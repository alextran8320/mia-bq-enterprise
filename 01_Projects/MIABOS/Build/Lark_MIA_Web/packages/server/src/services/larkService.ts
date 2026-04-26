import { env } from "../lib/env.js";
import { logger } from "../lib/logger.js";
import { HttpError } from "../lib/httpError.js";

export type LarkProfile = {
  openId: string;
  unionId?: string;
  tenantKey?: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
};

// ─── app_access_token cache ────────────────────────────────────────────
// Lark app_access_token expires in ~2h. Cache it in-memory and refresh
// 60s before expiry. Single-process cache is fine; if we ever scale to
// multiple BE instances each will mint its own — that's intentional and safe.
let appTokenCache: { token: string; expiresAt: number } | null = null;

async function getAppAccessToken(): Promise<string> {
  const now = Date.now();
  if (appTokenCache && appTokenCache.expiresAt > now + 60_000) {
    return appTokenCache.token;
  }

  if (!env.LARK_APP_ID || !env.LARK_APP_SECRET) {
    throw new HttpError(
      500,
      "Server chưa cấu hình LARK_APP_ID / LARK_APP_SECRET",
    );
  }

  const resp = await fetch(
    `${env.LARK_API_BASE}/open-apis/auth/v3/app_access_token/internal`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        app_id: env.LARK_APP_ID,
        app_secret: env.LARK_APP_SECRET,
      }),
    },
  );

  const json = (await resp.json()) as {
    code: number;
    msg: string;
    app_access_token?: string;
    expire?: number;
  };

  if (!resp.ok || json.code !== 0 || !json.app_access_token) {
    logger.error({ status: resp.status, code: json.code, msg: json.msg }, "[lark] app_access_token failed");
    throw new HttpError(502, "Không lấy được Lark app_access_token", {
      code: json.code,
      msg: json.msg,
    });
  }

  appTokenCache = {
    token: json.app_access_token,
    expiresAt: now + (json.expire ?? 7200) * 1000,
  };
  return appTokenCache.token;
}

// Exposed for tests / debugging.
export function _resetAppTokenCache() {
  appTokenCache = null;
}

// ─── exchange code → profile ───────────────────────────────────────────
type LarkUserAccessTokenResp = {
  code: number;
  msg: string;
  data?: {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    token_type: string;
  };
};

type LarkUserInfoResp = {
  code: number;
  msg: string;
  data?: {
    open_id: string;
    union_id?: string;
    user_id?: string;
    tenant_key?: string;
    email?: string;
    enterprise_email?: string;
    name?: string;
    en_name?: string;
    avatar_url?: string;
  };
};

export async function exchangeCodeForProfile(
  code: string,
): Promise<LarkProfile> {
  if (!code) throw new HttpError(400, "Thiếu Lark authorization code");

  const appToken = await getAppAccessToken();

  // Step 1: code → user_access_token
  const tokenResp = await fetch(
    `${env.LARK_API_BASE}/open-apis/authen/v1/access_token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${appToken}`,
      },
      body: JSON.stringify({ grant_type: "authorization_code", code }),
    },
  );
  const tokenJson = (await tokenResp.json()) as LarkUserAccessTokenResp;
  if (!tokenResp.ok || tokenJson.code !== 0 || !tokenJson.data) {
    logger.warn({ code: tokenJson.code, msg: tokenJson.msg }, "[lark] code exchange failed");
    throw new HttpError(401, "Lark code không hợp lệ hoặc đã hết hạn", {
      code: tokenJson.code,
      msg: tokenJson.msg,
    });
  }
  const userToken = tokenJson.data.access_token;

  // Step 2: user_access_token → user_info
  const infoResp = await fetch(
    `${env.LARK_API_BASE}/open-apis/authen/v1/user_info`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${userToken}` },
    },
  );
  const infoJson = (await infoResp.json()) as LarkUserInfoResp;
  if (!infoResp.ok || infoJson.code !== 0 || !infoJson.data) {
    logger.warn({ code: infoJson.code, msg: infoJson.msg }, "[lark] user_info failed");
    throw new HttpError(502, "Không đọc được Lark user info", {
      code: infoJson.code,
      msg: infoJson.msg,
    });
  }

  const d = infoJson.data;
  return {
    openId: d.open_id,
    unionId: d.union_id,
    tenantKey: d.tenant_key,
    email: (d.enterprise_email || d.email)?.toLowerCase() || undefined,
    name: d.name || d.en_name,
    avatarUrl: d.avatar_url,
  };
}
