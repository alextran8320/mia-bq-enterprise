// ─── window.tt / h5sdk types (minimal) ────────────────────────────────
// Lark / Feishu JSSDK uses WeChat-style options object with inline `success`/`fail`.
type LarkRequestAccessOpts = {
  appID: string;
  scopeList?: string[];
  state?: string;
  success?: (res: { code: string; state?: string }) => void;
  fail?: (err: unknown) => void;
  complete?: (res: unknown) => void;
};

declare global {
  interface Window {
    tt?: {
      requestAccess?: (opts: LarkRequestAccessOpts) => void;
    };
    h5sdk?: {
      ready: (cb: () => void) => void;
      error: (cb: (err: unknown) => void) => void;
    };
  }
}

const SDK_VERSION =
  (import.meta.env.VITE_LARK_SDK_VERSION as string | undefined) ?? "1.5.45";
const SDK_URL = `https://lf1-cdn-tos.bytegoofy.com/goofy/lark/op/h5-js-sdk-${SDK_VERSION}.js`;
const SDK_LOAD_TIMEOUT_MS = 8_000;
const REQUEST_CODE_TIMEOUT_MS = 30_000;

/**
 * Heuristic: is this page running inside a Lark / Feishu webview?
 *
 * Order matters — earlier checks are more reliable.
 */
export function isInLark(): boolean {
  if (typeof window === "undefined") return false;
  // 1. SDK already injected (most reliable).
  if (window.tt || window.h5sdk) return true;
  // 2. UA fingerprint (Lark Desktop, Lark Mobile, Feishu).
  const ua = navigator.userAgent;
  if (/Lark|Feishu/i.test(ua)) return true;
  // 3. Embedded in an iframe — Lark Web (larksuite.com) frames apps this way.
  try {
    if (window.self !== window.top) return true;
  } catch {
    // Cross-origin parent throws — assume Lark Web embed.
    return true;
  }
  return false;
}

let sdkPromise: Promise<void> | null = null;

/**
 * Inject the Lark JS SDK <script> exactly once.
 * Resolves when window.h5sdk fires `ready`. Rejects on timeout / SDK error.
 */
export function loadLarkSdk(): Promise<void> {
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise<void>((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(new Error("Lark SDK load timeout (8s) — fallback sang đăng nhập email"));
    }, SDK_LOAD_TIMEOUT_MS);

    const finish = (err?: unknown) => {
      window.clearTimeout(timer);
      if (err) {
        sdkPromise = null; // allow retry
        reject(err);
      } else {
        resolve();
      }
    };

    // Already loaded (e.g. by Lark webview itself)?
    if (window.h5sdk || window.tt) {
      finish();
      return;
    }

    const existing = document.querySelector(
      `script[data-lark-sdk]`,
    ) as HTMLScriptElement | null;
    const script = existing ?? document.createElement("script");
    if (!existing) {
      script.src = SDK_URL;
      script.async = true;
      script.dataset.larkSdk = "1";
    }
    script.addEventListener("load", () => {
      if (window.h5sdk?.ready) {
        window.h5sdk.ready(() => finish());
        window.h5sdk.error?.((err) => finish(err));
      } else if (window.tt) {
        // Older Lark Desktop exposes `tt` directly without h5sdk.ready.
        finish();
      } else {
        finish(new Error("Lark SDK loaded but window.h5sdk / tt missing"));
      }
    });
    script.addEventListener("error", () =>
      finish(new Error("Không tải được Lark SDK script")),
    );

    if (!existing) document.head.appendChild(script);
  });

  return sdkPromise;
}

/**
 * Ask Lark for an authorization code. Must be called after loadLarkSdk() resolved
 * AND inside Lark webview (otherwise Lark returns an error).
 *
 * Wraps the callback-style API in a Promise with a 30s safety timeout —
 * if neither success nor fail fires, we reject so the UI can show fallback.
 */
export function requestLarkCode(appId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!window.tt?.requestAccess) {
      reject(
        new Error("Lark SDK chưa sẵn sàng (window.tt.requestAccess không tồn tại)"),
      );
      return;
    }

    let settled = false;
    const settle = (fn: () => void) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      fn();
    };

    const timer = window.setTimeout(() => {
      settle(() =>
        reject(
          new Error(
            "Lark requestAccess không phản hồi sau 30s — kiểm tra App đã release version + scope đã approve trong Lark Console.",
          ),
        ),
      );
    }, REQUEST_CODE_TIMEOUT_MS);

    try {
      window.tt.requestAccess({
        appID: appId,
        scopeList: [],
        state: cryptoRandom(),
        success: (res) => {
          // eslint-disable-next-line no-console
          console.debug("[lark] requestAccess success", res);
          settle(() => resolve(res.code));
        },
        fail: (err) => {
          // eslint-disable-next-line no-console
          console.warn("[lark] requestAccess fail", err);
          settle(() =>
            reject(
              new Error(
                typeof err === "string"
                  ? err
                  : `Lark requestAccess thất bại: ${safeStringify(err)}`,
              ),
            ),
          );
        },
      });
    } catch (err) {
      settle(() => reject(err as Error));
    }
  });
}

function safeStringify(v: unknown) {
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

function cryptoRandom() {
  try {
    return crypto.randomUUID();
  } catch {
    return Math.random().toString(36).slice(2);
  }
}
