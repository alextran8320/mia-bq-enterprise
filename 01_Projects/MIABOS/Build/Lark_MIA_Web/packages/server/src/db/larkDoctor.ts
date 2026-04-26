// Lark integration doctor — validates env credentials by hitting Lark API.
// Usage: npx tsx src/db/larkDoctor.ts
import "dotenv/config";

const APP_ID = process.env.LARK_APP_ID ?? "";
const APP_SECRET = process.env.LARK_APP_SECRET ?? "";

const ENDPOINTS = [
  { name: "Lark intl (open.larksuite.com)", base: "https://open.larksuite.com" },
  { name: "Feishu CN (open.feishu.cn)", base: "https://open.feishu.cn" },
];

async function probe(base: string) {
  const url = `${base}/open-apis/auth/v3/app_access_token/internal`;
  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ app_id: APP_ID, app_secret: APP_SECRET }),
    });
    const json = (await resp.json()) as {
      code: number;
      msg: string;
      app_access_token?: string;
      expire?: number;
      tenant_access_token?: string;
    };
    return {
      ok: resp.ok && json.code === 0,
      httpStatus: resp.status,
      apiCode: json.code,
      apiMsg: json.msg,
      tokenPreview: json.app_access_token
        ? `${json.app_access_token.slice(0, 12)}…`
        : null,
      expire: json.expire,
    };
  } catch (err) {
    return {
      ok: false,
      httpStatus: 0,
      apiCode: -1,
      apiMsg: (err as Error).message,
      tokenPreview: null,
      expire: undefined,
    };
  }
}

async function main() {
  console.log("=".repeat(64));
  console.log("Lark credentials doctor");
  console.log("=".repeat(64));
  console.log("APP_ID:    ", APP_ID || "(empty)");
  console.log(
    "APP_SECRET:",
    APP_SECRET ? `${APP_SECRET.slice(0, 4)}…${APP_SECRET.slice(-4)}` : "(empty)",
  );
  console.log();

  if (!APP_ID || !APP_SECRET) {
    console.error("❌ LARK_APP_ID hoặc LARK_APP_SECRET trống. Kiểm tra .env.");
    process.exit(1);
  }

  for (const ep of ENDPOINTS) {
    const r = await probe(ep.base);
    const tag = r.ok ? "✅" : "❌";
    console.log(`${tag} ${ep.name}`);
    console.log(
      `   HTTP=${r.httpStatus}  code=${r.apiCode}  msg="${r.apiMsg}"`,
    );
    if (r.ok) {
      console.log(
        `   token=${r.tokenPreview}  expire=${r.expire}s  base=${ep.base}`,
      );
    }
    console.log();
  }

  console.log("Hint: nếu chỉ 1 endpoint OK, set LARK_API_BASE trong .env tới endpoint đó.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
