import { env } from "../lib/env.js";
import { HttpError } from "../lib/httpError.js";
import { logger } from "../lib/logger.js";

export interface HaravanRunResult {
  text: string;
  responseMs: number;
  raw: unknown;
}

// Langflow nests the assistant text deep inside the response. The exact path
// shifts between Langflow versions, so we probe the common locations and fall
// back to a JSON dump (visible to devs in the chat) rather than throwing — that
// way the user always sees something and we can iterate the parser.
function extractMarkdown(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const root = payload as Record<string, unknown>;

  const candidates: Array<unknown> = [];

  const outputs = root.outputs as Array<Record<string, unknown>> | undefined;
  if (Array.isArray(outputs) && outputs[0]) {
    const inner = outputs[0].outputs as
      | Array<Record<string, unknown>>
      | undefined;
    if (Array.isArray(inner) && inner[0]) {
      const first = inner[0] as Record<string, unknown>;
      const results = first.results as Record<string, unknown> | undefined;
      const message = results?.message as Record<string, unknown> | undefined;
      candidates.push(message?.text);
      candidates.push(results?.text);

      const altOutputs = first.outputs as Record<string, unknown> | undefined;
      const altMsg = altOutputs?.message as
        | Record<string, unknown>
        | string
        | undefined;
      if (typeof altMsg === "string") candidates.push(altMsg);
      else if (altMsg && typeof altMsg === "object") {
        candidates.push((altMsg as Record<string, unknown>).message);
        candidates.push((altMsg as Record<string, unknown>).text);
      }

      const artifacts = first.artifacts as Record<string, unknown> | undefined;
      candidates.push(artifacts?.message);
    }
  }

  candidates.push(root.result);
  candidates.push(root.message);
  candidates.push(root.text);

  for (const c of candidates) {
    if (typeof c === "string" && c.trim().length > 0) return c;
  }
  return null;
}

export async function runHaravanFlow(
  message: string,
  sessionId: string,
): Promise<HaravanRunResult> {
  const url = `${env.HARAVAN_CHAT_BOT_BASE_URL}/run/${env.HARAVAN_CHAT_BOT_FLOW_ID}`;
  const start = Date.now();

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.HARAVAN_CHAT_BOT_API_KEY,
      },
      body: JSON.stringify({
        output_type: "chat",
        input_type: "chat",
        input_value: message,
        session_id: sessionId,
      }),
      signal: AbortSignal.timeout(60_000),
    });
  } catch (err) {
    const isTimeout = err instanceof Error && err.name === "TimeoutError";
    logger.error({ err, url }, "[haravan] fetch failed");
    throw new HttpError(
      isTimeout ? 504 : 502,
      isTimeout
        ? "Trợ lý AI mất quá lâu để phản hồi. Vui lòng thử lại."
        : "Không kết nối được tới Trợ lý AI. Vui lòng thử lại sau.",
    );
  }

  const responseMs = Date.now() - start;

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    logger.error(
      { status: res.status, body: body.slice(0, 500) },
      "[haravan] upstream error",
    );
    throw new HttpError(
      502,
      `Trợ lý AI trả về lỗi (HTTP ${res.status}). Vui lòng thử lại sau.`,
    );
  }

  const raw = (await res.json().catch(() => null)) as unknown;
  const text = extractMarkdown(raw);

  if (!text) {
    logger.warn({ raw }, "[haravan] could not extract markdown from response");
    throw new HttpError(
      502,
      "Trợ lý AI trả về dữ liệu không đọc được. Vui lòng thử lại.",
    );
  }

  return { text, responseMs, raw };
}
